// Builds 10 content poses of an original purple-imp mascot as transparent 1024x1024 PNGs,
// plus a preview sheet. Pure SVG drawn in code, rendered with Playwright/Chromium.
//   node build.mjs            -> out/01-selebrasi.png ... out/10-ngintip.png, out/preview.png
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const C = {
  body: '#5b3f9c', shade: '#3f2a78', light: '#7a5fc0', line: '#1a0f2e',
  horn: '#f7e2a3', hornShade: '#d9b45a', ridge: '#b88a2e',
  eye: '#ffd23f', tooth: '#ffd23f', mouth: '#1a0f2e', tongue: '#3fb8a8',
  claw: '#f7e2a3', gold: '#f0c24b',
};
const HEAD = { x: 512, y: 400, r: 200 };
const BODY = { x: 512, y: 625, rx: 168, ry: 165 };
const SH_L = [385, 565], SH_R = [639, 565];

// ---------- helpers ----------
const q = (p0, c, p1, t) => [
  (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
  (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1],
];
const cb = (p0, c1, c2, p1, t) => {
  const u = 1 - t;
  return [0, 1].map((k) => u ** 3 * p0[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t ** 3 * p1[k]);
};
const f = (n) => n.toFixed(1);

// ---------- parts ----------
function horn() {
  const base1 = [585, 232], c1 = [640, 150], c2 = [765, 175], tip = [742, 62];
  const c3 = [805, 165], c4 = [765, 285], base2 = [688, 310];
  let ridges = '';
  for (let i = 1; i <= 5; i++) {
    const t = i / 6.2;
    const a = cb(base1, c1, c2, tip, t), b = cb(base2, c4, c3, tip, t);
    ridges += `<path d="M${f(a[0])} ${f(a[1])} Q${f((a[0] + b[0]) / 2 + 12)} ${f((a[1] + b[1]) / 2 + 14)} ${f(b[0])} ${f(b[1])}" stroke="${C.ridge}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  }
  const d = `M${base1} C${c1} ${c2} ${tip} C${c3} ${c4} ${base2} Z`;
  const shade = `M${base2} C${c4} ${c3} ${tip} C${[780, 170]} ${[740, 260]} ${[655, 290]} Z`;
  return `<g><path d="${d}" fill="${C.horn}" stroke="${C.line}" stroke-width="12" stroke-linejoin="round"/>
    <path d="${shade}" fill="${C.hornShade}" opacity=".75"/>${ridges}
    <path d="${d}" fill="none" stroke="${C.line}" stroke-width="12" stroke-linejoin="round"/></g>`;
}
const horns = () => horn() + `<g transform="matrix(-1 0 0 1 1024 0)">${horn()}</g>`;

function eyes(type, look = [0, 0]) {
  const L = [440, 372], R = [584, 372];
  const y = C.eye;
  const open = ([x, yy], s = 1, pupil = 1) => `
    <ellipse cx="${x}" cy="${yy}" rx="${32 * s}" ry="${40 * s}" fill="${y}" stroke="${C.line}" stroke-width="9"/>
    <ellipse cx="${x + look[0] * 10 * s}" cy="${yy + look[1] * 12 * s}" rx="${11 * s * pupil}" ry="${21 * s * pupil}" fill="${C.line}"/>
    <circle cx="${x - 10 * s + look[0] * 6}" cy="${yy - 14 * s + look[1] * 6}" r="${7 * s}" fill="#fff"/>`;
  const happy = ([x, yy]) => `<path d="M${x - 42} ${yy + 14} Q${x} ${yy - 40} ${x + 42} ${yy + 14}" stroke="${y}" stroke-width="20" fill="none" stroke-linecap="round"/>`;
  const zig = ([x, yy], dir) => `<path d="M${x - 40 * dir} ${yy - 32} L${x + 30 * dir} ${yy} L${x - 40 * dir} ${yy + 32}" stroke="${y}" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  switch (type) {
    case 'open': return open(L) + open(R);
    case 'wide': return open(L, 1.25, 0.55) + open(R, 1.25, 0.55);
    case 'happy': return happy(L) + happy(R);
    case 'zig': return zig(L, 1) + zig(R, -1);
    case 'wink': return open(L) + happy(R);
    case 'sly': return open(L) + open(R) +
      `<path d="M400 338 L478 352 M546 352 L624 338" stroke="${C.line}" stroke-width="16" stroke-linecap="round"/>`;
  }
  return '';
}

function mouth({ w = 120, sag = 48, depth = 190, cy = 452, teeth = 7, tongue = true } = {}) {
  const Lp = [512 - w, cy], Rp = [512 + w, cy];
  const top = [512, cy + sag], bot = [512, cy + depth];
  const d = `M${Lp} Q${top} ${Rp} Q${bot} ${Lp} Z`;
  const id = 'm' + Math.round(w + depth);
  let t1 = '', t2 = '';
  for (let i = 0; i < teeth; i++) {
    const a = q(Lp, top, Rp, i / teeth), b = q(Lp, top, Rp, (i + 1) / teeth), m = q(Lp, top, Rp, (i + 0.5) / teeth);
    const len = depth * 0.2;
    t1 += `<path d="M${f(a[0])} ${f(a[1] - 4)} L${f(b[0])} ${f(b[1] - 4)} L${f(m[0])} ${f(m[1] + len)} Z"/>`;
  }
  const nb = Math.max(teeth - 2, 3);
  for (let i = 0; i < nb; i++) {
    const s = 0.12 + (0.76 * i) / nb, e = 0.12 + (0.76 * (i + 1)) / nb;
    const a = q(Rp, bot, Lp, s), b = q(Rp, bot, Lp, e), m = q(Rp, bot, Lp, (s + e) / 2);
    const len = depth * 0.17;
    t2 += `<path d="M${f(a[0])} ${f(a[1] + 6)} L${f(b[0])} ${f(b[1] + 6)} L${f(m[0])} ${f(m[1] - len)} Z"/>`;
  }
  return `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>
    <path d="${d}" fill="${C.mouth}"/>
    <g clip-path="url(#${id})">
      ${tongue ? `<ellipse cx="512" cy="${cy + depth * 0.62}" rx="${w * 0.55}" ry="${depth * 0.25}" fill="${C.tongue}"/>` : ''}
      <g fill="${C.tooth}" stroke="${C.line}" stroke-width="4" stroke-linejoin="round">${t1}${t2}</g>
    </g>
    <path d="${d}" fill="none" stroke="${C.line}" stroke-width="10" stroke-linejoin="round"/>`;
}
const MOUTH = {
  grin: () => mouth(),
  smile: () => mouth({ w: 92, sag: 34, depth: 120, cy: 462, teeth: 6, tongue: false }),
  o: () => mouth({ w: 46, sag: -40, depth: 110, cy: 470, teeth: 3 }),
  small: () => mouth({ w: 62, sag: 22, depth: 70, cy: 470, teeth: 4, tongue: false }),
};

function paw([x, y], { dir = -90, kind = 'paw' } = {}) {
  const r = dir * Math.PI / 180;
  const ux = Math.cos(r), uy = Math.sin(r);          // direction the paw points
  const px = -uy, py = ux;                             // perpendicular
  let claws = '';
  for (const k of [-1, 0, 1]) {
    const bx = x + ux * 40 + px * k * 24, by = y + uy * 40 + py * k * 24;
    const tx = bx + ux * 24 + px * k * 4, ty = by + uy * 24 + py * k * 4;
    claws += `<path d="M${f(bx - px * 10)} ${f(by - py * 10)} Q${f(bx + ux * 14 - px * 6)} ${f(by + uy * 14 - py * 6)} ${f(tx)} ${f(ty)} Q${f(bx + ux * 6 + px * 8)} ${f(by + uy * 6 + py * 8)} ${f(bx + px * 10)} ${f(by + py * 10)} Z"/>`;
  }
  let extra = '';
  if (kind === 'point') {
    const ex = x + ux * 78, ey = y + uy * 78;
    extra = `<line x1="${x}" y1="${y}" x2="${f(ex)}" y2="${f(ey)}" stroke="${C.line}" stroke-width="44" stroke-linecap="round"/>
             <line x1="${x}" y1="${y}" x2="${f(ex)}" y2="${f(ey)}" stroke="${C.body}" stroke-width="24" stroke-linecap="round"/>
             <path d="M${f(ex + px * 8)} ${f(ey + py * 8)} L${f(ex + ux * 26)} ${f(ey + uy * 26)} L${f(ex - px * 8)} ${f(ey - py * 8)} Z" fill="${C.claw}" stroke="${C.line}" stroke-width="4"/>`;
    claws = '';
  }
  if (kind === 'thumb') {
    extra = `<rect x="${x - 17}" y="${y - 92}" width="34" height="80" rx="17" fill="${C.body}" stroke="${C.line}" stroke-width="10"/>
             <path d="M${x - 9} ${y - 92} L${x} ${y - 116} L${x + 9} ${y - 92} Z" fill="${C.claw}" stroke="${C.line}" stroke-width="4"/>`;
    claws = '';
  }
  return `<g>${extra}
    <g fill="${C.claw}" stroke="${C.line}" stroke-width="6" stroke-linejoin="round">${claws}</g>
    <circle cx="${x}" cy="${y}" r="46" fill="${C.body}" stroke="${C.line}" stroke-width="11"/>
  </g>`;
}
function arm(sh, ctrl, end, opts) {
  const d = `M${sh} Q${ctrl} ${end}`;
  return `<path d="${d}" stroke="${C.line}" stroke-width="86" fill="none" stroke-linecap="round"/>
          <path d="${d}" stroke="${C.body}" stroke-width="62" fill="none" stroke-linecap="round"/>
          <path d="${d}" stroke="${C.light}" stroke-width="10" fill="none" stroke-linecap="round" opacity=".35" transform="translate(-10 -12)"/>
          ${paw(end, opts)}`;
}

function bodyParts() {
  const tail = `<path d="M600 735 C700 805 820 790 822 690 C823 655 838 640 850 625" stroke="${C.line}" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M852 572 C872 596 892 612 878 632 C868 645 856 640 852 630 C846 641 832 645 824 632 C812 612 834 596 852 572 Z" fill="${C.line}" stroke="${C.line}" stroke-width="6" stroke-linejoin="round" transform="rotate(25 852 615)"/>`;
  const wings = [1, -1].map((s) => `<g transform="${s < 0 ? 'matrix(-1 0 0 1 1024 0)' : ''}">
    <path d="M640 560 C720 470 820 470 880 500 C850 520 860 545 875 565 C835 560 820 585 830 610 C790 595 760 610 740 640 Z" fill="${C.shade}" stroke="${C.line}" stroke-width="11" stroke-linejoin="round"/>
    <path d="M660 570 L860 505 M700 600 L862 568 M720 625 L828 608" stroke="${C.line}" stroke-width="5" opacity=".5"/></g>`).join('');
  const legs = [450, 574].map((x) => `<ellipse cx="${x}" cy="${790}" rx="48" ry="34" fill="${C.body}" stroke="${C.line}" stroke-width="11"/>`).join('');
  const sil = `<circle cx="${HEAD.x}" cy="${HEAD.y}" r="${HEAD.r}"/><ellipse cx="${BODY.x}" cy="${BODY.y}" rx="${BODY.rx}" ry="${BODY.ry}"/>`;
  const core = `
    <defs><clipPath id="sil">${sil}</clipPath>
      <radialGradient id="gh" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="${C.light}"/><stop offset="0.55" stop-color="${C.body}"/><stop offset="1" stop-color="${C.shade}"/></radialGradient>
      <radialGradient id="gb" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="${C.body}"/><stop offset="1" stop-color="${C.shade}"/></radialGradient></defs>
    <g fill="${C.line}" stroke="${C.line}" stroke-width="24">${sil}</g>
    <ellipse cx="${BODY.x}" cy="${BODY.y}" rx="${BODY.rx}" ry="${BODY.ry}" fill="url(#gb)"/>
    <circle cx="${HEAD.x}" cy="${HEAD.y}" r="${HEAD.r}" fill="url(#gh)"/>
    <g clip-path="url(#sil)">
      <ellipse cx="505" cy="665" rx="92" ry="100" fill="${C.light}" opacity=".35"/>
      <ellipse cx="430" cy="290" rx="60" ry="34" fill="#fff" opacity=".18" transform="rotate(-25 430 290)"/>
      <path d="M520 205 L505 248 L530 262 L512 300" stroke="${C.gold}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M600 690 L585 720 L604 735" stroke="${C.gold}" stroke-width="6" fill="none" stroke-linecap="round"/>
    </g>`;
  return { tail, wings, legs, core };
}

// ---------- props ----------
const confetti = (seed = 1) => {
  let a = seed, out = '';
  const r = () => ((a = (a * 9301 + 49297) % 233280) / 233280);
  const cols = ['#ffd23f', '#3fb8a8', '#ff6b9a', '#7ad3ff', '#fff'];
  for (let i = 0; i < 26; i++) {
    const x = 60 + r() * 900, y = 40 + r() * 520;
    if (Math.hypot(x - 512, y - 420) < 260) continue;
    out += `<rect x="${f(x)}" y="${f(y)}" width="${f(14 + r() * 14)}" height="${f(26 + r() * 18)}" rx="4" fill="${cols[i % 5]}" stroke="${C.line}" stroke-width="4" transform="rotate(${f(r() * 180)} ${f(x)} ${f(y)})"/>`;
  }
  return out;
};
const spark = (x, y, s = 1, col = '#ffd23f') => `<path d="M${x} ${y - 30 * s} Q${x + 6 * s} ${y - 6 * s} ${x + 30 * s} ${y} Q${x + 6 * s} ${y + 6 * s} ${x} ${y + 30 * s} Q${x - 6 * s} ${y + 6 * s} ${x - 30 * s} ${y} Q${x - 6 * s} ${y - 6 * s} ${x} ${y - 30 * s} Z" fill="${col}" stroke="${C.line}" stroke-width="5"/>`;
const motion = (x, y, rot) => `<g transform="rotate(${rot} ${x} ${y})" stroke="${C.line}" stroke-width="9" fill="none" stroke-linecap="round">
  <path d="M${x - 70} ${y - 40} Q${x - 95} ${y} ${x - 70} ${y + 40}"/><path d="M${x - 100} ${y - 60} Q${x - 135} ${y} ${x - 100} ${y + 60}"/></g>`;
const sign = () => `<g><rect x="250" y="470" width="524" height="330" rx="26" fill="#fffaf0" stroke="${C.line}" stroke-width="14"/>
  <rect x="276" y="496" width="472" height="278" rx="14" fill="none" stroke="${C.horn}" stroke-width="8" stroke-dasharray="2 22" stroke-linecap="round"/></g>`;
const megaphone = () => `<g transform="rotate(-35 700 420)">
  <path d="M690 395 L860 330 L860 520 L690 455 Z" fill="#ff5d73" stroke="${C.line}" stroke-width="12" stroke-linejoin="round"/>
  <rect x="650" y="390" width="50" height="70" rx="10" fill="#ffd23f" stroke="${C.line}" stroke-width="10"/>
  <ellipse cx="860" cy="425" rx="22" ry="95" fill="#ff8a9a" stroke="${C.line}" stroke-width="12"/>
  <g stroke="${C.line}" stroke-width="10" stroke-linecap="round"><path d="M910 350 L960 320"/><path d="M920 425 L980 425"/><path d="M910 500 L960 530"/></g></g>`;
const gift = () => `<g transform="translate(0 40)"><rect x="372" y="560" width="280" height="230" rx="16" fill="#ff5d73" stroke="${C.line}" stroke-width="13"/>
  <rect x="352" y="520" width="320" height="70" rx="14" fill="#ff7a8c" stroke="${C.line}" stroke-width="13"/>
  <rect x="490" y="520" width="44" height="270" fill="#ffd23f" stroke="${C.line}" stroke-width="10"/>
  <path d="M512 520 C450 440 390 470 430 515 Z M512 520 C574 440 634 470 594 515 Z" fill="#ffd23f" stroke="${C.line}" stroke-width="10" stroke-linejoin="round"/></g>`;
const thought = () => `<g fill="#fff" stroke="${C.line}" stroke-width="10">
  <circle cx="300" cy="230" r="16"/><circle cx="255" cy="185" r="24"/>
  <ellipse cx="190" cy="105" rx="95" ry="72"/></g>
  <text x="190" y="140" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="104" fill="${C.body}">?</text>`;
const bang = () => `<g font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="150" fill="#ffd23f" stroke="${C.line}" stroke-width="10" paint-order="stroke">
  <text x="170" y="250" transform="rotate(-14 170 250)">!</text><text x="815" y="230" transform="rotate(12 815 230)">!</text></g>`;

// ---------- character ----------
function mascot(p) {
  const { tail, wings, legs, core } = bodyParts();
  const back = (p.backArms || []).map((a) => arm(...a)).join('');
  const front = (p.arms || []).map((a) => arm(...a)).join('');
  const face = eyes(p.eyes, p.look) + MOUTH[p.mouth]();
  const char = `<g transform="${p.transform || 'translate(0 60)'}">${p.noWings ? '' : wings}${tail}${legs}${back}${core}${horns()}${face}${p.midProp || ''}${front}${p.frontProp || ''}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${p.behind || ''}${p.clip ? `<defs><clipPath id="cut"><rect x="0" y="0" width="1024" height="${p.clip}"/></clipPath></defs><g clip-path="url(#cut)">${char}</g>` : char}${p.over || ''}</svg>`;
}

const hip = (side) => side < 0 ? [SH_L, [285, 650], [372, 712], { dir: 60 }] : [SH_R, [739, 650], [652, 712], { dir: 120 }];
const POSES = [
  { name: '01-selebrasi', eyes: 'zig', mouth: 'grin', behind: confetti(3),
    arms: [[SH_L, [290, 480], [255, 330], { dir: -115 }], [SH_R, [734, 480], [769, 330], { dir: -65 }]] },
  { name: '02-menunjuk', eyes: 'open', look: [0.8, -0.8], mouth: 'smile', over: spark(890, 120, 1.1) + spark(810, 60, 0.6),
    arms: [hip(-1), [SH_R, [740, 500], [790, 340], { dir: -55, kind: 'point' }]] },
  { name: '03-papan', eyes: 'happy', mouth: 'smile', midProp: sign(),
    arms: [[SH_L, [300, 520], [300, 500], { dir: -100 }], [SH_R, [724, 520], [724, 500], { dir: -80 }]] },
  { name: '04-halo', eyes: 'happy', mouth: 'grin', over: motion(800, 260, 20),
    arms: [hip(-1), [SH_R, [760, 500], [790, 330], { dir: -70 }]] },
  { name: '05-jempol', eyes: 'wink', mouth: 'smile', over: spark(860, 330, 0.8) + spark(800, 230, 0.5),
    arms: [hip(-1), [SH_R, [730, 600], [730, 480], { dir: -90, kind: 'thumb' }]] },
  { name: '06-umumkan', eyes: 'zig', mouth: 'o', frontProp: megaphone(),
    arms: [hip(-1), [SH_R, [690, 520], [665, 445], { dir: -60 }]] },
  { name: '07-mikir', eyes: 'sly', look: [-0.8, -0.9], mouth: 'small', over: thought(),
    arms: [hip(1), [SH_L, [400, 680], [520, 560], { dir: -30 }]] },
  { name: '08-kaget', eyes: 'wide', mouth: 'o', over: bang(),
    arms: [[SH_L, [270, 560], [320, 440], { dir: -80 }], [SH_R, [754, 560], [704, 440], { dir: -100 }]] },
  { name: '09-hadiah', eyes: 'happy', mouth: 'grin', midProp: gift(), over: spark(220, 520, 0.8) + spark(820, 500, 0.7) + spark(300, 200, 0.5),
    arms: [[SH_L, [320, 680], [372, 700], { dir: 0 }], [SH_R, [704, 680], [652, 700], { dir: 180 }]] },
  { name: '10-ngintip', eyes: 'open', look: [0, 0.2], mouth: 'smile', transform: 'translate(0 330)', clip: 880, noWings: true,
    over: paw([360, 880], { dir: -90 }) + paw([664, 880], { dir: -90 }) },
];

// ---------- render ----------
fs.mkdirSync('out', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
for (const p of POSES) {
  await page.setContent(`<html><body style="margin:0;background:transparent">${mascot(p)}</body></html>`);
  await page.locator('svg').screenshot({ path: `out/${p.name}.png`, omitBackground: true });
  console.log('wrote out/' + p.name + '.png');
}
const bgs = ['#ffe9b8', '#d7f3ee', '#ffe0ea', '#e4ddff', '#fff3c4', '#d8ecff', '#f1e6ff', '#ffe4cc', '#e2f7d9', '#ffd9e8'];
const cells = POSES.map((p, i) => `<div style="background:${bgs[i]};border-radius:24px;padding:8px;text-align:center;font:700 20px Arial">
  <img src="data:image/png;base64,${fs.readFileSync(`out/${p.name}.png`).toString('base64')}" style="width:100%;display:block"/>${p.name}</div>`).join('');
await page.setViewportSize({ width: 1600, height: 700 });
await page.setContent(`<html><body style="margin:0;background:#fff"><div id="g" style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;padding:16px;width:1568px">${cells}</div></body></html>`);
await page.locator('#g').screenshot({ path: 'out/preview.png' });
console.log('wrote out/preview.png');
await browser.close();
