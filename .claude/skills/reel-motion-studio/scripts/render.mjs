#!/usr/bin/env node
// Render komposisi HTML (kontrak: window.MOTION, window.renderAt(t), window.ready) menjadi MP4.
//
// Pakai:
//   node render.mjs <komposisi.html> <output.mp4> [--audio musik.mp3] [--preview] [--stills 0,1.5,6]
//
//   --preview  render setengah resolusi & 15 fps untuk cek cepat
//   --stills   hanya simpan PNG pada detik-detik tertentu (untuk review visual), tanpa MP4
//   --audio    gabungkan audio berlisensi; dipotong sepanjang video
//
// Butuh: playwright (global atau lokal) dan ffmpeg di PATH.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire(import.meta.url);
function loadPlaywright() {
  const tries = ["playwright", "/opt/node22/lib/node_modules/playwright", "/usr/local/lib/node_modules/playwright", "/usr/lib/node_modules/playwright"];
  for (const p of tries) { try { return require(p); } catch {} }
  console.error("playwright tidak ditemukan. Jalankan: npm i -g playwright");
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i >= 0 ? (args.splice(i, 1), true) : false; };
const opt = name => { const i = args.indexOf(name); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const preview = flag("--preview");
const audio = opt("--audio");
const stills = opt("--stills");
const [input, output] = args;
if (!input || (!output && !stills)) {
  console.error("Pakai: node render.mjs <komposisi.html> <output.mp4> [--audio file] [--preview] [--stills 0,1.5]");
  process.exit(1);
}

const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("file://" + path.resolve(input));
await page.waitForFunction(() => window.MOTION && window.renderAt && window.ready);
await page.evaluate(() => window.ready);
const M = await page.evaluate(() => window.MOTION);

const scale = preview ? 0.5 : 1;
const fps = preview ? Math.min(15, M.fps) : M.fps;
await page.setViewportSize({ width: M.width, height: M.height });
const shot = () => page.screenshot({ type: "png", clip: { x: 0, y: 0, width: M.width, height: M.height } });

if (stills) {
  const dir = output ? path.dirname(output) : path.dirname(path.resolve(input));
  for (const s of stills.split(",").map(Number)) {
    await page.evaluate(t => window.renderAt(t), s);
    const file = path.join(dir, `still_${s.toFixed(2)}s.png`);
    fs.writeFileSync(file, await shot());
    console.log("still:", file);
  }
  await browser.close();
  process.exit(0);
}

const frames = Math.round(M.duration * fps);
const ff = [
  "-y", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
  ...(audio ? ["-i", audio] : []),
  "-vf", `scale=${Math.round(M.width * scale / 2) * 2}:${Math.round(M.height * scale / 2) * 2}:flags=lanczos,format=yuv420p`,
  "-c:v", "libx264", "-preset", preview ? "veryfast" : "slow", "-crf", preview ? "26" : "16",
  "-movflags", "+faststart",
  ...(audio ? ["-c:a", "aac", "-b:a", "192k", "-shortest"] : []),
  output,
];
const enc = spawn("ffmpeg", ff, { stdio: ["pipe", "ignore", "inherit"] });
enc.stdin.on("error", () => {});

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  await page.evaluate(t => window.renderAt(t), f / fps);
  const buf = await shot();
  if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once("drain", r));
  if (f % fps === 0) process.stdout.write(`\rframe ${f}/${frames}`);
}
enc.stdin.end();
await new Promise((res, rej) => enc.on("close", c => (c === 0 ? res() : rej(new Error("ffmpeg exit " + c)))));
await browser.close();
console.log(`\nselesai: ${output} (${frames} frame, ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
