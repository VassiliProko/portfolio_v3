# Prettify Minerva animation playground

A self-contained, looping GSAP composition based on the eight-frame Figma storyboard. It renders on a fixed 1920 × 1080 stage and scales responsively in the development UI.

## Storyboard interpretation

- **Persistent elements:** one browser shell and content viewport, the pink/red background field, and one Prettify lockup.
- **Original Minerva:** the browser enters as an oversized crop, then pulls back to show the full interface.
- **Transformation:** the browser moves down to make room for the icon; a directional light/color wipe reveals the redesigned capture inside the existing viewport.
- **Redesigned tour:** the same browser pans to Quick Links, then reframes to the polished main view.
- **Loop:** the browser retracts and the icon/title reassemble into the exact opening lockup.

## Timeline

- `0.00–1.04` — identity
- `1.04–2.02` — original Minerva reveal
- `2.02–3.62` — overview and lower reframe
- `3.62–5.05` — Prettify transformation
- `5.05–6.12` — Quick Links detail
- `6.12–7.30` — polished Minerva view
- `7.30–9.00` — resolution and seamless reset

The master timeline is available as `window.prettifyTimeline`. Export helpers are exposed as `window.__PRETTIFY__`.

## Develop

```bash
cd playground/prettify-animation
npm install
npm run dev
```

Open `http://127.0.0.1:4173`. The control panel supports play/pause, restart, scrubbing, timing readout, and scene jumps. With reduced motion enabled, autoplay is disabled and the playground opens on the polished static view.

## Export

The export script drives the GSAP timeline deterministically: frame `n` always renders timeline time `n / fps`. It captures a PNG sequence with Playwright, then encodes it with ffmpeg.

```bash
npm run export
```

This creates both:

- `export/prettify-showcase.mp4` — H.264, CRF 18, `yuv420p`, no audio
- `export/prettify-showcase.webm` — VP9, no audio

Useful variants:

```bash
npm run export:mp4
npm run export:webm
node export.js --fps 30 --width 1280 --height 720 --format mp4
```

The encoder is installed locally through `ffmpeg-static`; no system-level ffmpeg install is required.
