// mg.js — deterministic motion-graphics runtime.
// Every visual is a pure function of time t. A paused GSAP timeline is seeked to t,
// then per-frame callbacks (three.js render, grain, counters) run. That makes the
// renderer frame-accurate: no requestAnimationFrame, Date.now or Math.random in scenes.
//
//   import { MG, gsap } from './runtime/mg.js';
//   MG.config({ width: 1080, height: 1920, fps: 30, duration: 12 });
//   MG.tl.from('#title', { opacity: 0, y: 80, duration: 1 }, 0.5);
//   MG.onFrame((t) => renderer.render(scene, camera));
//   MG.waitFor(loadSomething());
//   MG.start();
//
// URL params in a normal browser (preview mode): ?t=3.2 freezes at 3.2s, ?guides=1 shows
// platform safe zones, otherwise it plays in a loop with a scrubber bar.

import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase.js';
gsap.registerPlugin(CustomEase);

// Cinematic eases: slow-in/slow-out that feels like a camera operator, not a UI.
CustomEase.create('cine', 'M0,0 C0.6,0 0.15,1 1,1');           // smooth in-out, long settle
CustomEase.create('cineOut', 'M0,0 C0.16,1 0.3,1 1,1');         // fast start, long glide
CustomEase.create('punch', 'M0,0 C0.2,1.4 0.4,1 1,1');           // overshoot pop for type
CustomEase.create('snap', 'M0,0 C0.9,0 0.1,1 1,1');              // hard whip transitions

const params = new URLSearchParams(location.search);
const RENDER = params.has('render');

const frameFns = [];
const pending = [];
let cfg = { width: 1080, height: 1920, fps: 30, duration: 10, background: '#000' };

export const MG = {
  gsap,
  RENDER,
  tl: gsap.timeline({ paused: true, defaults: { ease: 'cine' } }),

  config(c) {
    cfg = { ...cfg, ...c };
    const root = document.documentElement;
    root.style.setProperty('--W', cfg.width + 'px');
    root.style.setProperty('--H', cfg.height + 'px');
    document.body.style.background = cfg.background;
    window.MG_CONFIG = cfg;
    return cfg;
  },
  get cfg() { return cfg; },

  /** Run fn(t, frameIndex) after every seek. Use for WebGL renders and procedural effects. */
  onFrame(fn) { frameFns.push(fn); },

  /** Hold the "ready" flag until this promise (asset load) resolves. */
  waitFor(p) { pending.push(p); return p; },

  /** Seek everything to time t (seconds). */
  async seek(t) {
    t = Math.max(0, Math.min(t, cfg.duration));
    MG.tl.seek(t, false);
    const f = Math.round(t * cfg.fps);
    for (const fn of frameFns) await fn(t, f);
  },

  async start() {
    window.MG_CONFIG = cfg;
    await document.fonts.ready;
    await Promise.all(pending);
    // Make sure the timeline covers the full duration even if tweens end earlier.
    if (MG.tl.duration() < cfg.duration) MG.tl.set({}, {}, cfg.duration);
    window.MG_SEEK = (t) => MG.seek(t);
    await MG.seek(0);
    window.MG_READY = true;
    if (!RENDER) preview();
  },

  // ---------- helpers ----------

  /** Seeded pseudo-random generator (mulberry32). Use instead of Math.random. */
  rand(seed = 1) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  /** Split an element's text into spans. by: 'chars' | 'words'. Returns the spans.
   *  Words are kept together so lines never break mid-word. */
  split(el, by = 'chars') {
    if (typeof el === 'string') el = document.querySelector(el);
    const text = el.textContent;
    el.textContent = '';
    el.setAttribute('aria-label', text);
    const out = [];
    text.split(/(\s+)/).forEach((word) => {
      if (/^\s+$/.test(word)) { el.appendChild(document.createTextNode(' ')); return; }
      if (!word) return;
      const w = document.createElement('span');
      w.className = 'mg-word';
      w.style.display = 'inline-block';
      w.style.whiteSpace = 'nowrap';
      if (by === 'words') { w.textContent = word; out.push(w); }
      else {
        for (const ch of word) {
          const c = document.createElement('span');
          c.className = 'mg-char';
          c.style.display = 'inline-block';
          c.textContent = ch;
          w.appendChild(c); out.push(c);
        }
      }
      el.appendChild(w);
    });
    return out;
  },

  /** Wrap each child in an overflow mask so it can slide up from behind a line. */
  mask(els) {
    return [...els].map((e) => {
      const m = document.createElement('span');
      m.style.display = 'inline-block';
      m.style.overflow = 'hidden';
      m.style.verticalAlign = 'bottom';
      m.style.paddingBottom = '0.06em';
      e.parentNode.insertBefore(m, e);
      m.appendChild(e);
      return m;
    });
  },

  /** Animated number: tweens el's text from `from` to `to` on the main timeline. */
  countUp(el, { from = 0, to, at = 0, duration = 1.6, decimals = 0, prefix = '', suffix = '', ease = 'cineOut', locale = 'en-US' }) {
    if (typeof el === 'string') el = document.querySelector(el);
    const o = { v: from };
    const fmt = (v) => prefix + v.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    el.textContent = fmt(from);
    MG.tl.to(o, { v: to, duration, ease, onUpdate: () => (el.textContent = fmt(o.v)) }, at);
    // Ensure the value is correct even when seeking backwards past the start.
    MG.onFrame((t) => { if (t < at) el.textContent = fmt(from); });
    return o;
  },

  /** Film grain on a canvas, re-seeded every frame (deterministic). */
  grain(canvas, { amount = 0.08, size = 2, fps = 24 } = {}) {
    if (typeof canvas === 'string') canvas = document.querySelector(canvas);
    const w = Math.ceil(cfg.width / size), h = Math.ceil(cfg.height / size);
    canvas.width = w; canvas.height = h;
    canvas.style.imageRendering = 'pixelated';
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(w, h);
    MG.onFrame((t) => {
      const r = MG.rand(Math.floor(t * fps) + 7);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (r() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255 * amount;
      }
      ctx.putImageData(img, 0, 0);
    });
  },
};

export { gsap };

// ---------- preview mode (normal browser) ----------
function preview() {
  const style = document.createElement('style');
  style.textContent = `
    html,body{margin:0;background:#111;overflow:hidden}
    #mg-root{transform-origin:0 0;position:absolute}
    #mg-bar{position:fixed;left:0;right:0;bottom:0;height:34px;background:#000c;display:flex;align-items:center;gap:10px;padding:0 12px;font:12px system-ui;color:#ddd;z-index:99}
    #mg-bar input{flex:1}
    .mg-guide{position:absolute;left:0;right:0;background:repeating-linear-gradient(45deg,#ff004433 0 12px,#ff004422 12px 24px);z-index:98;pointer-events:none;font:600 22px system-ui;color:#fff;display:flex;align-items:center;justify-content:center}`;
  document.head.appendChild(style);
  const root = document.getElementById('mg-root');
  const fit = () => {
    const s = Math.min(innerWidth / cfg.width, (innerHeight - 34) / cfg.height);
    root.style.transform = `scale(${s})`;
    root.style.left = (innerWidth - cfg.width * s) / 2 + 'px';
    root.style.top = (innerHeight - 34 - cfg.height * s) / 2 + 'px';
  };
  addEventListener('resize', fit); fit();
  if (params.has('guides') && cfg.height > cfg.width) {
    for (const [top, h, label] of [[0, 0.15, 'platform UI'], [0.8, 0.2, 'caption + buttons']]) {
      const g = document.createElement('div');
      g.className = 'mg-guide'; g.textContent = label;
      g.style.top = top * cfg.height + 'px'; g.style.height = h * cfg.height + 'px';
      root.appendChild(g);
    }
  }
  const bar = document.createElement('div');
  bar.id = 'mg-bar';
  bar.innerHTML = `<button id="mg-play">❚❚</button><input id="mg-scrub" type="range" min="0" max="${cfg.duration}" step="${1 / cfg.fps}" value="0"><span id="mg-time">0.00s</span>`;
  document.body.appendChild(bar);
  const scrub = bar.querySelector('#mg-scrub'), time = bar.querySelector('#mg-time'), btn = bar.querySelector('#mg-play');
  let playing = !params.has('t'), t = params.has('t') ? parseFloat(params.get('t')) : 0, last = performance.now();
  btn.onclick = () => { playing = !playing; btn.textContent = playing ? '❚❚' : '▶'; last = performance.now(); };
  scrub.oninput = () => { t = parseFloat(scrub.value); MG.seek(t); time.textContent = t.toFixed(2) + 's'; };
  btn.textContent = playing ? '❚❚' : '▶';
  MG.seek(t);
  const loop = async (now) => {
    if (playing) {
      t = (t + (now - last) / 1000) % cfg.duration;
      await MG.seek(t);
      scrub.value = t; time.textContent = t.toFixed(2) + 's';
    }
    last = now;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
