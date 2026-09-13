import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import { chromium } from "playwright";
import { startServer } from "./serve.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const exportDir = join(root, "export");
const framesDir = join(exportDir, "frames");
const args = new Map();

for (let index = 2; index < process.argv.length; index += 1) {
  const argument = process.argv[index];
  if (!argument.startsWith("--")) continue;
  const [key, inlineValue] = argument.slice(2).split("=");
  const nextValue = process.argv[index + 1];
  if (inlineValue !== undefined) args.set(key, inlineValue);
  else if (nextValue && !nextValue.startsWith("--")) {
    args.set(key, nextValue);
    index += 1;
  } else args.set(key, true);
}

const width = Number(args.get("width") || 1920);
const height = Number(args.get("height") || 1080);
const fps = Number(args.get("fps") || 60);
const requestedFormat = String(args.get("format") || "both").toLowerCase();
const formats = requestedFormat === "both" ? ["mp4", "webm"] : [requestedFormat];

if (!Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(fps) || width < 1 || height < 1 || fps < 1) {
  throw new Error("Width, height, and fps must be positive integers.");
}

if (formats.some((format) => !["mp4", "webm"].includes(format))) {
  throw new Error("Format must be mp4, webm, or both.");
}

if (!ffmpegPath) {
  throw new Error("The local ffmpeg binary could not be resolved for this platform.");
}

await rm(framesDir, { recursive: true, force: true });
await mkdir(framesDir, { recursive: true });

const server = await startServer(0);
const address = server.address();
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const launchOptions = existsSync(chromePath) ? { executablePath: chromePath } : {};
const browser = await chromium.launch({ ...launchOptions, headless: true });

try {
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    viewport: { width, height },
  });

  await page.goto(
    `http://127.0.0.1:${address.port}/?export=1&width=${width}&height=${height}`,
    { waitUntil: "networkidle" },
  );
  await page.waitForFunction(() => window.__PRETTIFY__?.ready === true);

  const duration = await page.evaluate(() => window.__PRETTIFY__.duration);
  const frameCount = Math.round(duration * fps);
  console.log(`Rendering ${frameCount} frames at ${width}×${height} and ${fps} fps…`);

  for (let frame = 0; frame < frameCount; frame += 1) {
    const time = frame / fps;
    await page.evaluate((timelineTime) => window.__PRETTIFY__.setTime(timelineTime), time);
    await page.screenshot({
      path: join(framesDir, `frame-${String(frame).padStart(5, "0")}.png`),
      clip: { x: 0, y: 0, width, height },
    });

    if (frame % fps === 0) console.log(`  ${frame}/${frameCount} frames`);
  }

  for (const format of formats) {
    const output = join(exportDir, `prettify-showcase.${format}`);
    const common = ["-y", "-framerate", String(fps), "-i", join(framesDir, "frame-%05d.png"), "-an"];
    const codec = format === "mp4"
      ? ["-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
      : ["-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-pix_fmt", "yuv420p"];

    await run(ffmpegPath, [...common, ...codec, output]);
    console.log(`Created ${output}`);
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

function run(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, commandArgs, { stdio: "inherit" });
    process.once("error", reject);
    process.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}
