// compose.mjs — builds page.html: a one-picture newspaper front page that sums up
// the world news of Saturday 21 November 2026, edited like a front page:
// one dominant story, three supporting stories, one light item, one ticker.
//
// The stories, each cross-checked in at least two sources dated 21 Nov 2026:
//   LEAD — Russian missiles come down in Poland during the war's biggest
//     November barrage on Ukraine (404 drones, 111 missiles; at least eight
//     killed). Tusk: "an intentional provocation"; NATO's Rutte: "a grave
//     violation", in Warsaw on Saturday. (AP wrap published 21 Nov; Daily
//     Star and Business Standard, 21 Nov; ISW assessment.)
//   MARKETS — the AI sell-off pushes the S&P 500 into correction (stocks
//     -3.7%) as Anthropic's $81bn IPO, the biggest debut in history, stumbles.
//     (One Turn's 21 Nov brief; Reuters Morning Bid; Japan Times, 21 Nov.)
//   CLIMATE — COP31 in Antalya, Türkiye runs into overtime, nearly 200
//     nations deadlocked over fossil fuels and climate finance. (One Turn,
//     21 Nov; Reuters-attributed summit coverage.)
//   IRAQ — a fire at the Hartha power station north of Basra kills at least
//     four people and injures 30 on Saturday. (Reuters, 21 Nov dateline;
//     Arab News; Jerusalem Post; INA.)
//   LIGHT — Japan's Mao Shimada, 18, takes a ten-point lead (79.06) into
//     today's Finlandia Trophy free-skate final in Helsinki. (Kyodo via The
//     Japan Times, 21 Nov; Olympics.com; NBC Sports.)
//   TICKER — Trump, Xi & Putin issue a joint declaration at trilateral talks
//     in Shenzhen; the UK & EU sign post-Brexit reset deals. (Reuters
//     headlines; Japan Times, 21 Nov; One Turn.)
//
// A skeptical-editor pass (Codex, second opinion) dropped one panel: the ICJ's
// Myanmar genocide judgment was delivered on 19 November, so it is not this
// day's news and does not appear as one.
//
// Design: a strict duotone system — newsprint cream, ink navy, one spot red —
// with rules, kickers and a serif masthead, so the page reads as designed.
// All text is code-rendered (crisp); all art is flat vector drawn here.
// Canvas 1024x832 (gate: at most 1024x1024 px and 1 MiB).

import { writeFileSync } from 'node:fs';

const W = 1024;
const H = 832;

// The duotone palette: cream paper, navy ink, spot red, and their tints.
const PAPER = '#f6f1e3';
const CARD = '#fffdf4';
const INK = '#1b2440';
const NAVY = '#16264a';
const NAVY2 = '#22386b';
const RED = '#b3232a';
const FAINT = '#6d675a';
const RULE = '#c9bfa5';
const CREAM = '#e8e2cf';
const NIGHT = '#0d1730';
const GOLD = '#e8b34b';

/** One line of SVG text. */
function t(x, y, str, cls, anchor = 'start') {
  return `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${str}</text>`;
}

/** A block of lines with a fixed line height. */
function lines(x, y, arr, cls, lh) {
  return arr.map((s, i) => t(x, y + i * lh, s, cls)).join('\n');
}

/** The masthead: paper name between rules, and the band that names the day. */
function masthead() {
  return `
  <rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${INK}" stroke-width="3"/>
  <rect x="17" y="17" width="${W - 34}" height="${H - 34}" fill="none" stroke="${INK}" stroke-width="1"/>
  ${t(W / 2, 40, 'T H E   D A Y   I N   O N E   P I C T U R E', 'over', 'middle')}
  ${t(W / 2, 96, 'THE WORLD TODAY', 'paper', 'middle')}
  <line x1="30" y1="108" x2="${W - 30}" y2="108" stroke="${RED}" stroke-width="4"/>
  <line x1="30" y1="116" x2="${W - 30}" y2="116" stroke="${INK}" stroke-width="1.5"/>
  <rect x="30" y="126" width="${W - 60}" height="42" fill="${NAVY}"/>
  ${t(W / 2, 155, 'SATURDAY · 21 NOVEMBER 2026 · WORLD NEWS', 'dateband', 'middle')}`;
}

/** A star-burst explosion flash at (cx, cy). */
function burst(cx, cy, r, fill) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}

/**
 * The lead visual, drawn with care: Kyiv at night under the barrage —
 * a domed skyline, missile trails arcing in, air-defence tracers rising,
 * explosion flashes, and a caption strip that states the numbers.
 */
function leadScene(x, y, w, h) {
  const base = y + h;
  const sil = '#070d1d';
  const buildings = [
    [0, 58], [30, 92], [66, 50], [96, 112], [138, 66], [172, 96],
    [212, 54], [244, 104], [282, 72], [312, 88], [340, 60],
  ];
  const blocks = buildings
    .map(([bx, bh]) => `<rect x="${x + bx}" y="${base - 26 - bh}" width="28" height="${bh}" fill="${sil}"/>`)
    .join('');
  // Lit windows: a few small gold squares in the dark blocks.
  const windows = [[40, 60], [104, 84], [182, 70], [252, 78], [318, 62], [76, 40], [292, 44]]
    .map(([wx, wy]) => `<rect x="${x + wx}" y="${base - 26 - wy}" width="4" height="5" fill="${GOLD}" opacity="0.85"/>`)
    .join('');
  // A domed church silhouette (Kyiv) rising mid-skyline.
  const dome = `
    <path d="M ${x + 150} ${base - 26} v-58 h32 v58 z" fill="${sil}"/>
    <path d="M ${x + 166} ${base - 112} c 11 9 12 18 12 28 h-24 c 0 -10 1 -19 12 -28 z" fill="${sil}"/>
    <rect x="${x + 164}" y="${base - 122}" width="4" height="11" fill="${sil}"/>`;
  // Incoming missile trails (dashed gold arcs) and rising defence tracers.
  const trail = (x1, y1, x2, y2, col, dash) =>
    `<path d="M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - 30} ${x2} ${y2}" stroke="${col}" stroke-width="2.4" fill="none" stroke-dasharray="${dash}"/>`;
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${NIGHT}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h * 0.5}" fill="${NAVY2}" opacity="0.5"/>
    <circle cx="${x + w - 46}" cy="${y + 32}" r="15" fill="#e9e4cf"/>
    <circle cx="${x + w - 54}" cy="${y + 26}" r="13" fill="${NAVY2}"/>
    ${trail(x + 26, y + 20, x + 148, y + 104, GOLD, '7 5')}
    ${trail(x + 104, y + 10, x + 244, y + 92, GOLD, '7 5')}
    ${trail(x + 216, y + 24, x + 322, y + 112, GOLD, '7 5')}
    ${trail(x + 60, y + 150, x + 132, y + 96, '#9fd8a8', '2 4')}
    ${trail(x + 268, y + 156, x + 236, y + 88, '#9fd8a8', '2 4')}
    ${blocks}
    ${windows}
    ${dome}
    ${burst(x + 148, y + 108, 25, '#e2703a')}
    ${burst(x + 148, y + 108, 12, '#f4c542')}
    ${burst(x + 322, y + 116, 19, '#e2703a')}
    ${burst(x + 322, y + 116, 9, '#f4c542')}
    ${burst(x + 56, y + 122, 14, '#e2703a')}
    <rect x="${x}" y="${base - 26}" width="${w}" height="26" fill="#05080f"/>
    ${t(x + 12, base - 8, 'KYIV UNDER FIRE — BIGGEST BARRAGE OF NOVEMBER', 'scenelabel')}
  </g>`;
}

/** The dominant story: Russian missiles in Poland, the barrage on Ukraine. */
function leadPanel() {
  const x = 30, y = 180, w = W - 60, h = 262;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${CARD}" stroke="${RULE}" stroke-width="1.5"/>
  ${t(x + 22, y + 36, 'UKRAINE WAR · WARSAW & KYIV', 'kicker')}
  ${lines(x + 22, y + 84, [
    'RUSSIAN MISSILES',
    'LAND IN POLAND AS',
    'BARRAGE HITS UKRAINE',
  ], 'lead', 44)}
  ${lines(x + 22, y + 196, [
    'Two missiles and a suspected drone came down in Poland',
    'during Russia’s biggest barrage of November — 404 drones',
    'and 111 missiles fired on Ukraine; at least eight killed.',
    'Tusk: “an intentional provocation.” NATO: “a grave violation.”',
  ], 'body', 21)}
  ${leadScene(x + w - 394, y + 14, 380, h - 28)}`;
}

/** Falling chart with a chip, for the markets panel. */
function iconChart(cx, cy, s, col) {
  const x0 = cx - s * 0.85, x1 = cx + s * 0.85;
  const y0 = cy - s * 0.7, y1 = cy + s * 0.72;
  return `<g stroke="${col}" stroke-width="${s * 0.09}" fill="none" stroke-linecap="round">
    <line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}"/>
    <line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}"/>
    <polyline points="${x0 + 6},${cy - s * 0.4} ${cx - s * 0.3},${cy - s * 0.16} ${cx + s * 0.05},${cy + s * 0.14} ${cx + s * 0.52},${cy + s * 0.48}" stroke="#ff9d94" stroke-width="${s * 0.12}"/>
    <path d="M ${cx + s * 0.52} ${cy + s * 0.48} l ${s * 0.22} ${-s * 0.02} M ${cx + s * 0.52} ${cy + s * 0.48} l ${s * 0.03} ${s * 0.22}" stroke="#ff9d94" stroke-width="${s * 0.12}"/>
    <rect x="${cx - s * 0.26}" y="${cy - s * 0.82}" width="${s * 0.4}" height="${s * 0.4}" fill="${col}" stroke="none"/>
    <rect x="${cx - s * 0.16}" y="${cy - s * 0.72}" width="${s * 0.2}" height="${s * 0.2}" fill="${NAVY}" stroke="none"/>
    <line x1="${cx - s * 0.06}" y1="${cy - s * 0.82}" x2="${cx - s * 0.06}" y2="${cy - s * 0.98}"/>
    <line x1="${cx - s * 0.06}" y1="${cy - s * 0.42}" x2="${cx - s * 0.06}" y2="${cy - s * 0.26}"/>
    <line x1="${cx - s * 0.26}" y1="${cy - s * 0.62}" x2="${cx - s * 0.42}" y2="${cy - s * 0.62}"/>
    <line x1="${cx + s * 0.14}" y1="${cy - s * 0.62}" x2="${cx + s * 0.3}" y2="${cy - s * 0.62}"/>
  </g>`;
}

/** Globe with a rising thermometer, for the climate panel. */
function iconGlobe(cx, cy, s, col) {
  return `<g stroke="${col}" stroke-width="${s * 0.08}" fill="none">
    <circle cx="${cx - s * 0.12}" cy="${cy}" r="${s * 0.72}"/>
    <ellipse cx="${cx - s * 0.12}" cy="${cy}" rx="${s * 0.3}" ry="${s * 0.72}"/>
    <line x1="${cx - s * 0.84}" y1="${cy - s * 0.3}" x2="${cx + s * 0.6}" y2="${cy - s * 0.3}"/>
    <line x1="${cx - s * 0.84}" y1="${cy + s * 0.3}" x2="${cx + s * 0.6}" y2="${cy + s * 0.3}"/>
    <g stroke="#ffb35c">
      <rect x="${cx + s * 0.52}" y="${cy - s * 0.78}" width="${s * 0.16}" height="${s * 1.1}" rx="${s * 0.08}" fill="none"/>
      <line x1="${cx + s * 0.6}" y1="${cy + s * 0.2}" x2="${cx + s * 0.6}" y2="${cy - s * 0.55}" stroke-width="${s * 0.1}"/>
      <circle cx="${cx + s * 0.6}" cy="${cy + s * 0.48}" r="${s * 0.17}" fill="#ffb35c" stroke="none"/>
    </g>
  </g>`;
}

/** Flame over a pylon, for the Basra power-station panel. */
function iconFlame(cx, cy, s, col) {
  return `<g>
    <path d="M ${cx} ${cy - s * 0.95}
             c ${s * 0.34} ${s * 0.3} ${s * 0.42} ${s * 0.55} ${s * 0.42} ${s * 0.82}
             a ${s * 0.42} ${s * 0.34} 0 1 1 ${-s * 0.84} 0
             c 0 ${-s * 0.27} ${s * 0.08} ${-s * 0.52} ${s * 0.42} ${-s * 0.82} z" fill="#ffb35c"/>
    <path d="M ${cx} ${cy - s * 0.42}
             c ${s * 0.17} ${s * 0.16} ${s * 0.21} ${s * 0.28} ${s * 0.21} ${s * 0.4}
             a ${s * 0.21} ${s * 0.17} 0 1 1 ${-s * 0.42} 0
             c 0 ${-s * 0.12} ${s * 0.04} ${-s * 0.26} ${s * 0.21} ${-s * 0.4} z" fill="#e2703a"/>
    <g stroke="${col}" stroke-width="${s * 0.07}" stroke-linecap="round">
      <line x1="${cx - s * 0.8}" y1="${cy + s * 0.92}" x2="${cx + s * 0.8}" y2="${cy + s * 0.92}"/>
      <line x1="${cx - s * 0.55}" y1="${cy + s * 0.92}" x2="${cx - s * 0.2}" y2="${cy + s * 0.45}"/>
      <line x1="${cx + s * 0.55}" y1="${cy + s * 0.92}" x2="${cx + s * 0.2}" y2="${cy + s * 0.45}"/>
      <line x1="${cx - s * 0.38}" y1="${cy + s * 0.68}" x2="${cx + s * 0.38}" y2="${cy + s * 0.68}"/>
    </g>
  </g>`;
}

/** One supporting panel: navy icon band on top, then kicker, headline, body. */
function panel(x, y, w, h, icon, kicker, headArr, bodyArr) {
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${CARD}" stroke="${RULE}" stroke-width="1.5"/>
  <rect x="${x}" y="${y}" width="${w}" height="56" fill="${NAVY}"/>
  ${icon(x + w / 2, y + 28, 30)}
  ${t(x + 14, y + 84, kicker, 'kicker')}
  ${lines(x + 14, y + 106, headArr, 'head', 23)}
  ${lines(x + 14, y + 106 + headArr.length * 23 + 12, bodyArr, 'body2', 18)}`;
}

/** The three supporting stories in one row. */
function grid() {
  const y = 454, h = 210, w = 311;
  return [
    panel(30, y, w, h, (cx, cy, s) => iconChart(cx, cy, s, CREAM),
      'MARKETS · NEW YORK',
      ['AI ROUT PUSHES', 'S&P 500 INTO', 'CORRECTION'],
      ['Stocks fell 3.7% as chip shares slid;', 'Anthropic’s $81bn IPO a record debut.']),
    panel(357, y, w, h, (cx, cy, s) => iconGlobe(cx, cy, s, CREAM),
      'CLIMATE · ANTALYA, TÜRKIYE',
      ['COP31 TALKS RUN', 'OVERTIME IN', 'FOSSIL-FUEL DEADLOCK'],
      ['Nearly 200 nations fail to agree', 'as the summit’s deadline passes.']),
    panel(683, y, w, h, (cx, cy, s) => iconFlame(cx, cy, s, CREAM),
      'IRAQ · BASRA',
      ['FIRE AT POWER', 'STATION KILLS', 'AT LEAST FOUR'],
      ['Blaze at the Hartha plant north of', 'Basra injures 30; toll may rise.']),
  ].join('\n');
}

/** A snowflake for the light strip: winter sport, drawn as six spokes. */
function iconSkate(cx, cy, s, col) {
  const spoke = (deg) => {
    const a = (deg * Math.PI) / 180;
    const x2 = cx + s * 0.85 * Math.cos(a), y2 = cy + s * 0.85 * Math.sin(a);
    const mx = cx + s * 0.55 * Math.cos(a), my = cy + s * 0.55 * Math.sin(a);
    const b1 = (deg + 150) * Math.PI / 180, b2 = (deg - 150) * Math.PI / 180;
    return `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>
    <path d="M ${mx.toFixed(1)} ${my.toFixed(1)} l ${(s * 0.3 * Math.cos(b1)).toFixed(1)} ${(s * 0.3 * Math.sin(b1)).toFixed(1)} M ${mx.toFixed(1)} ${my.toFixed(1)} l ${(s * 0.3 * Math.cos(b2)).toFixed(1)} ${(s * 0.3 * Math.sin(b2)).toFixed(1)}"/>`;
  };
  return `<g stroke="${col}" stroke-width="${s * 0.1}" fill="none" stroke-linecap="round">
    ${[0, 60, 120, 180, 240, 300].map(spoke).join('')}
  </g>`;
}

/** The light item: a red-labelled strip near the foot of the page. */
function lightStrip() {
  const x = 30, y = 676, w = W - 60, h = 74;
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${CARD}" stroke="${RULE}" stroke-width="1.5"/>
  <rect x="${x}" y="${y}" width="168" height="${h}" fill="${RED}"/>
  ${t(x + 84, y + 34, 'AND FINALLY', 'finally', 'middle')}
  ${t(x + 84, y + 56, 'SPORT · HELSINKI', 'finallysub', 'middle')}
  ${iconSkate(x + 196, y + 37, 30, NAVY)}
  ${t(x + 232, y + 33, 'Japan’s Mao Shimada, 18, leads the Finlandia Trophy by ten points', 'light1')}
  ${t(x + 232, y + 58, 'A 79.06-point short program sets up today’s free-skate final in Helsinki.', 'light2')}`;
}

/** The ticker and the sources line. */
function footer() {
  return `
  <line x1="30" y1="766" x2="${W - 30}" y2="766" stroke="${INK}" stroke-width="1.5"/>
  ${t(W / 2, 788, 'ALSO TODAY — TRUMP, XI & PUTIN ISSUE A JOINT DECLARATION AT SHENZHEN TALKS · UK & EU SIGN POST-BREXIT RESET DEALS', 'ticker', 'middle')}
  ${t(W / 2, 808, 'SOURCES: REUTERS · ASSOCIATED PRESS · FRANCE 24 · KYODO · THE JAPAN TIMES — REPORTED 21 NOVEMBER 2026', 'foot', 'middle')}`;
}

const css = `
  body { margin: 0; background: ${PAPER}; }
  text { font-family: 'Liberation Sans', Arial, sans-serif; fill: ${INK}; }
  .over { font-size: 15px; letter-spacing: 6px; fill: ${FAINT}; font-weight: bold; }
  .paper { font-family: 'Liberation Serif', Georgia, serif; font-size: 62px; font-weight: bold; letter-spacing: 2px; }
  .dateband { font-size: 23px; font-weight: bold; fill: #ffffff; letter-spacing: 3px; }
  .kicker { font-size: 14.5px; font-weight: bold; fill: ${RED}; letter-spacing: 1.2px; }
  .lead { font-size: 43px; font-weight: bold; }
  .head { font-size: 20.5px; font-weight: bold; }
  .body { font-size: 16.5px; fill: #33313a; }
  .body2 { font-size: 15px; fill: #33313a; }
  .scenelabel { font-size: 11.5px; font-weight: bold; fill: #f4ead2; letter-spacing: 0.5px; }
  .finally { font-size: 18px; font-weight: bold; fill: #ffffff; letter-spacing: 1px; }
  .finallysub { font-size: 10.5px; font-weight: bold; fill: #f3c1c3; letter-spacing: 1.5px; }
  .light1 { font-size: 17.5px; font-weight: bold; }
  .light2 { font-size: 15px; fill: #33313a; }
  .ticker { font-size: 13.5px; font-weight: bold; letter-spacing: 0.6px; }
  .foot { font-size: 12.5px; fill: ${FAINT}; letter-spacing: 1px; }
`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  ${masthead()}
  ${leadPanel()}
  ${grid()}
  ${lightStrip()}
  ${footer()}
</svg>`;

const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>${css}</style></head>
<body>${svg}</body></html>`;

writeFileSync(new URL('./page.html', import.meta.url), html);
console.log(`page.html written (${W}x${H})`);
