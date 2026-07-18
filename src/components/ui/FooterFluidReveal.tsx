'use client';

import { useEffect, useRef, type RefObject } from 'react';
import Image from 'next/image';
import { cn } from '@/src/utils/cn';

type FooterFluidRevealProps = {
  src: string;
  className?: string;
  reducedMotion?: boolean;
  /** Element that receives pointer input (defaults to the image container). */
  interactionRef?: RefObject<HTMLElement | null>;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
};

type RGB = { r: number; g: number; b: number };

type Pointer = {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: RGB;
};

/**
 * Footer background: grayscale photo with SplashCursor-style fluid that reveals
 * the real image color along the pointer trail (no rainbow dye).
 */
export function FooterFluidReveal({
  src,
  className,
  reducedMotion = false,
  interactionRef,
  DENSITY_DISSIPATION = 1.5,
  VELOCITY_DISSIPATION = 1.5,
  CURL = 4,
  SPLAT_RADIUS = 0.48,
  SPLAT_FORCE = 7000,
}: FooterFluidRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const canvasEl = canvasRef.current;
    const container = containerRef.current;
    const interactionTarget = interactionRef?.current ?? container;
    if (!canvasEl || !container || !interactionTarget) return;

    // Stable non-null binding for nested sim closures
    const canvas: HTMLCanvasElement = canvasEl;

    let isActive = true;
    let imageTexture: WebGLTexture | null = null;
    let imageWidth = 1;
    let imageHeight = 1;
    let imageReady = false;

    function createPointer(): Pointer {
      return {
        id: -1,
        texcoordX: 0,
        texcoordY: 0,
        prevTexcoordX: 0,
        prevTexcoordY: 0,
        deltaX: 0,
        deltaY: 0,
        down: false,
        moved: false,
        color: { r: 1.25, g: 1.25, b: 1.25 },
      };
    }

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING: false,
    };

    const pointers: Pointer[] = [createPointer()];

    const glContext = getWebGLContext(canvas);
    if (!glContext) return;
    const { gl, ext } = glContext;

    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 256;
    }

    function getWebGLContext(target: HTMLCanvasElement) {
      const params: WebGLContextAttributes = {
        // Opaque canvas so the reveal always composites over the fallback image
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: true,
      };
      let gl = target.getContext('webgl2', params) as WebGL2RenderingContext | null;
      const isWebGL2 = !!gl;
      if (!gl) {
        gl = (target.getContext('webgl', params) ||
          target.getContext('experimental-webgl', params)) as WebGL2RenderingContext | null;
      }
      if (!gl) return null;

      let halfFloat: OES_texture_half_float | null = null;
      let supportLinearFiltering: unknown = null;
      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float');
        supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
      }
      gl.clearColor(0, 0, 0, 1);

      const halfFloatTexType = isWebGL2
        ? (gl as WebGL2RenderingContext).HALF_FLOAT
        : halfFloat && (halfFloat as OES_texture_half_float).HALF_FLOAT_OES;

      let formatRGBA;
      let formatRG;
      let formatR;

      if (isWebGL2) {
        const g2 = gl as WebGL2RenderingContext;
        formatRGBA = getSupportedFormat(g2, g2.RGBA16F, g2.RGBA, halfFloatTexType!);
        formatRG = getSupportedFormat(g2, g2.RG16F, g2.RG, halfFloatTexType!);
        formatR = getSupportedFormat(g2, g2.R16F, g2.RED, halfFloatTexType!);
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType!);
        formatRG = formatRGBA;
        formatR = formatRGBA;
      }

      return {
        gl,
        ext: {
          formatRGBA,
          formatRG,
          formatR,
          halfFloatTexType,
          supportLinearFiltering: !!supportLinearFiltering,
        },
      };
    }

    function getSupportedFormat(
      glCtx: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ) {
      if (!supportRenderTextureFormat(glCtx, internalFormat, format, type)) {
        const g2 = glCtx as WebGL2RenderingContext;
        if (internalFormat === g2.R16F) {
          return getSupportedFormat(glCtx, g2.RG16F, g2.RG, type);
        }
        if (internalFormat === g2.RG16F) {
          return getSupportedFormat(glCtx, g2.RGBA16F, g2.RGBA, type);
        }
        return null;
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(
      glCtx: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ) {
      const texture = glCtx.createTexture();
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, glCtx.NEAREST);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = glCtx.createFramebuffer();
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, fbo);
      glCtx.framebufferTexture2D(
        glCtx.FRAMEBUFFER,
        glCtx.COLOR_ATTACHMENT0,
        glCtx.TEXTURE_2D,
        texture,
        0
      );
      const status = glCtx.checkFramebufferStatus(glCtx.FRAMEBUFFER);
      return status === glCtx.FRAMEBUFFER_COMPLETE;
    }

    class Material {
      vertexShader: WebGLShader;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram> = {};
      activeProgram: WebGLProgram | null = null;
      uniforms: Record<string, WebGLUniformLocation | null> = {};

      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
        this.vertexShader = vertexShader;
        this.fragmentShaderSource = fragmentShaderSource;
      }

      setKeywords(keywords: string[]) {
        let hash = 0;
        for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
        let program = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }

      bind() {
        gl.useProgram(this.activeProgram);
      }
    }

    class Program {
      uniforms: Record<string, WebGLUniformLocation | null> = {};
      program: WebGLProgram;

      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = createProgram(vertexShader, fragmentShader);
        this.uniforms = getUniforms(this.program);
      }

      bind() {
        gl.useProgram(this.program);
      }
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.bindAttribLocation(program, 0, 'aPosition');
      gl.linkProgram(program);
      return program;
    }

    function getUniforms(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const info = gl.getActiveUniform(program, i);
        if (!info) continue;
        uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      return uniforms;
    }

    function compileShader(type: number, source: string, keywords?: string[] | null) {
      const withKeywords = addKeywords(source, keywords);
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, withKeywords);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('[FooterFluidReveal] shader compile failed', gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function addKeywords(source: string, keywords?: string[] | null) {
      if (!keywords?.length) return source;
      return keywords.map((k) => `#define ${k}\n`).join('') + source;
    }

    const baseVertexShader = compileShader(
      gl.VERTEX_SHADER,
      `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `
    );

    const copyShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `
    );

    const clearShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `
    );

    // Reveal real photo color where fluid density is present (mask, not rainbow dye)
    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform sampler2D uImage;
      uniform vec2 uImageSize;
      uniform vec2 uCanvasSize;

      vec2 coverUV(vec2 uv) {
        float canvasAspect = uCanvasSize.x / max(uCanvasSize.y, 1.0);
        float imageAspect = uImageSize.x / max(uImageSize.y, 1.0);
        vec2 scale = vec2(1.0);
        if (canvasAspect > imageAspect) {
          // Canvas wider than image — crop top/bottom
          scale.y = imageAspect / canvasAspect;
        } else {
          // Canvas taller than image — crop sides
          scale.x = canvasAspect / imageAspect;
        }
        return (uv - 0.5) * scale + 0.5;
      }

      void main () {
          vec2 imgUv = coverUV(vUv);
          vec3 photo = texture2D(uImage, imgUv).rgb;
          float gray = dot(photo, vec3(0.299, 0.587, 0.114));
          vec3 grayscale = vec3(gray);

          vec3 dye = texture2D(uTexture, vUv).rgb;
          float density = max(dye.r, max(dye.g, dye.b));
          float reveal = smoothstep(0.005, 0.18, density);
          // Boost saturation slightly in revealed areas so color reads through the footer overlay
          vec3 boosted = photo * 1.12;
          vec3 color = mix(grayscale, boosted, clamp(reveal, 0.0, 1.0));
          gl_FragColor = vec4(color, 1.0);
      }
    `;

    const splatShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `
    );

    const advectionShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `,
      ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']
    );

    const divergenceShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `
    );

    const curlShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `
    );

    const vorticityShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    const pressureShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `
    );

    const gradientSubtractShader = compileShader(
      gl.FRAGMENT_SHADER,
      `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `
    );

    type FBO = {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    };

    type DoubleFBO = {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap: () => void;
    };

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      return (target: FBO | null, clear = false) => {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }
        if (clear) {
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);
    displayMaterial.setKeywords([]);

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION);
      const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType!;
      const rgba = ext.formatRGBA!;
      const rg = ext.formatRG!;
      const r = ext.formatR!;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);

      if (!dye) {
        dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      } else {
        dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      }

      if (!velocity) {
        velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      } else {
        velocity = resizeDoubleFBO(
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      }

      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    function resizeFBO(
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      const newFBO = createFBO(w, h, internalFormat, format, type, param);
      copyProgram.bind();
      gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO);
      return newFBO;
    }

    function resizeDoubleFBO(
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
      if (target.width === w && target.height === h) return target;
      target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param);
      target.write = createFBO(w, h, internalFormat, format, type, param);
      target.width = w;
      target.height = h;
      target.texelSizeX = 1 / w;
      target.texelSizeY = 1 / h;
      return target;
    }

    function loadImageTexture() {
      const img = new window.Image();
      img.decoding = 'async';

      const upload = () => {
        if (!isActive || !img.naturalWidth) return;
        imageWidth = img.naturalWidth;
        imageHeight = img.naturalHeight;
        if (imageTexture) gl.deleteTexture(imageTexture);
        imageTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, imageTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        imageReady = true;
      };

      img.onload = upload;
      img.onerror = () => {
        // Keep the Next/Image grayscale fallback visible underneath
        imageReady = false;
      };
      img.src = src;
      // Cached images may already be complete before onload is assigned
      if (img.complete) upload();
    }

    initFramebuffers();
    loadImageTexture();

    let lastUpdateTime = Date.now();

    function updateFrame() {
      if (!isActive) return;
      const dt = calcDeltaTime();
      if (resizeCanvas()) initFramebuffers();
      applyInputs();
      step(dt);
      render();
      animationFrameId.current = requestAnimationFrame(updateFrame);
    }

    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666);
      lastUpdateTime = now;
      return dt;
    }

    function resizeCanvas() {
      const width = scaleByPixelRatio(canvas.clientWidth);
      const height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    function applyInputs() {
      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false;
          splatPointer(p);
        }
      });
    }

    function step(dt: number) {
      gl.disable(gl.BLEND);

      curlProgram.bind();
      gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curl);

      vorticityProgram.bind();
      gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      divergenceProgram.bind();
      gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      clearProgram.bind();
      gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      pressureProgram.bind();
      gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gradientSubtractProgram.bind();
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      advectionProgram.bind();
      gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      if (!ext.supportLinearFiltering) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
      }
      const velocityId = velocity.read.attach(0);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      if (!ext.supportLinearFiltering) {
        gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
      }
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl.disable(gl.BLEND);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

      if (!imageReady || !imageTexture) {
        gl.clearColor(0.08, 0.08, 0.08, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }

      displayMaterial.bind();
      gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.uniform1i(displayMaterial.uniforms.uImage, 1);
      gl.uniform2f(displayMaterial.uniforms.uImageSize, imageWidth, imageHeight);
      gl.uniform2f(displayMaterial.uniforms.uCanvasSize, canvas.width, canvas.height);
      blit(null);
    }

    function splatPointer(pointer: Pointer) {
      const dx = pointer.deltaX * config.SPLAT_FORCE;
      const dy = pointer.deltaY * config.SPLAT_FORCE;
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: RGB) {
      splatProgram.bind();
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      // Neutral density only — used as a reveal mask, not as visible dye color
      gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    function correctRadius(radius: number) {
      let aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) radius *= aspectRatio;
      return radius;
    }

    function getLocalPos(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: scaleByPixelRatio(clientX - rect.left),
        y: scaleByPixelRatio(clientY - rect.top),
      };
    }

    function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
      pointer.prevTexcoordX = pointer.texcoordX;
      pointer.prevTexcoordY = pointer.texcoordY;
      pointer.texcoordX = posX / canvas.width;
      pointer.texcoordY = 1 - posY / canvas.height;
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    }

    function correctDeltaX(delta: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio < 1) delta *= aspectRatio;
      return delta;
    }

    function correctDeltaY(delta: number) {
      const aspectRatio = canvas.width / canvas.height;
      if (aspectRatio > 1) delta /= aspectRatio;
      return delta;
    }

    function getResolution(resolution: number) {
      let aspectRatio = gl.drawingBufferWidth / Math.max(gl.drawingBufferHeight, 1);
      if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspectRatio);
      if (gl.drawingBufferWidth > gl.drawingBufferHeight) return { width: max, height: min };
      return { width: min, height: max };
    }

    function scaleByPixelRatio(input: number) {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      return Math.floor(input * pixelRatio);
    }

    function hashCode(s: string) {
      if (s.length === 0) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    let hasPointer = false;

    function handlePointerMove(e: PointerEvent) {
      const pointer = pointers[0];
      const { x: posX, y: posY } = getLocalPos(e.clientX, e.clientY);
      if (!hasPointer) {
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        hasPointer = true;
        // Soft reveal under the cursor on enter
        splat(pointer.texcoordX, pointer.texcoordY, 0, 0, { r: 1.25, g: 1.25, b: 1.25 });
        return;
      }
      updatePointerMoveData(pointer, posX, posY);
    }

    function handlePointerLeave() {
      hasPointer = false;
      pointers[0].moved = false;
    }

    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch) return;
      const pointer = pointers[0];
      const { x: posX, y: posY } = getLocalPos(touch.clientX, touch.clientY);
      if (!hasPointer) {
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        hasPointer = true;
        return;
      }
      updatePointerMoveData(pointer, posX, posY);
    }

    interactionTarget.addEventListener('pointermove', handlePointerMove);
    interactionTarget.addEventListener('pointerleave', handlePointerLeave);
    interactionTarget.addEventListener('touchmove', handleTouchMove, { passive: true });
    interactionTarget.addEventListener('touchend', handlePointerLeave);

    updateFrame();

    return () => {
      isActive = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      interactionTarget.removeEventListener('pointermove', handlePointerMove);
      interactionTarget.removeEventListener('pointerleave', handlePointerLeave);
      interactionTarget.removeEventListener('touchmove', handleTouchMove);
      interactionTarget.removeEventListener('touchend', handlePointerLeave);
      if (imageTexture) gl.deleteTexture(imageTexture);
    };
  }, [
    src,
    reducedMotion,
    interactionRef,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
  ]);

  if (reducedMotion) {
    return (
      <div ref={containerRef} className={cn('absolute inset-0', className)}>
        <Image
          src={src}
          alt=""
          fill
          className="object-cover grayscale"
          sizes="100vw"
          priority={false}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn('absolute inset-0', className)}>
      {/* Fallback while WebGL boots / if context fails */}
      <Image
        src={src}
        alt=""
        fill
        className="object-cover grayscale"
        sizes="100vw"
        priority={false}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] h-full w-full pointer-events-none"
        aria-hidden
      />
    </div>
  );
}
