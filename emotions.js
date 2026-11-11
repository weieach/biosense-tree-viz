// Emotion tree: the ink-brush Sakura painting, reshaped and recoloured for each emotion.
//
// Every emotion is one entry in EMOTIONS: its colours, the settings that shape the tree, its blossoms
// and its motion. setEmotion(id) is the single entry point. The on-screen buttons and keys 1–6 call it,
// and it is exposed on window so the wearable's physical buttons can call it later.
(() => {
"use strict";

// ---------- emotions ----------

const EMOTIONS = {
  joyful: {
    key: 1, label: "Joyful", color: "#F2C14E", on: "#2b2108",
    paper: "#f7f0dc", ink: "#3a2a14", muted: "#8f7f5c",
    petals: ["#F2C14E", "#FF8A3D", "#FF6F61", "#A8D672"],
    // a wide, rounded crown bursting upward, dense with short twigs and blossoms
    shape: {
      trunkLen: [210, 260], trunkW: 48, fan: [-1.35, -0.9, -0.45, 0, 0.45, 0.9, 1.35], fanKeep: 0.9,
      limbLen: [300, 400], lift: 0.006, droop: [0, 0, 0.001, 0.002], kink: 0.6,
      gap: [[30, 55], [16, 32]], branchP: 0.8, branchLen: [130, 240], twigLen: [40, 90],
    },
    blossom: { shape: "sakura", size: [11, 18], density: 0.8, count: [1, 1, 2], petals: 200, washA: 0.13 },
    fx: "rise",
  },
  calm: {
    key: 2, label: "Calm", color: "#9DBFA8", on: "#12251d",
    paper: "#eaf1ee", ink: "#1f2d2a", muted: "#71857d",
    petals: ["#9DBFA8", "#A7D3D0", "#B8D8E8"],
    // tall and balanced, gentle curves, sparse branching
    shape: {
      trunkLen: [330, 380], lean: 0.03, trunkKink: 0.15, fan: [-0.75, -0.25, 0.25, 0.75], fanKeep: 1, fanJit: 0.05,
      limbLen: [380, 460], lowLimbs: 1, kink: 0.3, wobble: 0.025, droop: [0, 0.0004, 0.0018, 0.004],
      gap: [[60, 100], [34, 60]], branchP: 0.6, twigLen: [60, 130],
    },
    blossom: { shape: "round", size: [8, 13], density: 0.55, petals: 70, washA: 0.12 },
    fx: "breathe",
  },
  loved: {
    key: 3, label: "Loved", color: "#E86A92", on: "#2e0f1a",
    paper: "#f7ebe9", ink: "#3a1420", muted: "#94707a",
    petals: ["#E86A92", "#F7B2C4", "#F9D5C2", "#9E2A4F"],
    // limbs curl inward and are kept inside the outline of a heart
    shape: {
      trunkLen: [250, 300], fan: [-1.05, -0.6, 0.6, 1.05], fanKeep: 1, fanJit: 0.08,
      limbLen: [400, 460], lowLimbs: 0, curl: 0.008, curlKeep: 0.5, kink: 0.35, wobble: 0.03,
      droop: [0, 0, 0.001, 0.004], gap: [[30, 56], [16, 34]], heart: 280,
    },
    blossom: { shape: "heart", size: [9, 15], density: 1.0, washA: 0.14 },
    fx: "hearts",   // small hearts float up from the open blossoms
  },
  anxious: {
    key: 4, label: "Anxious", color: "#C9D648", on: "#23242c",
    paper: "#ebebdf", ink: "#23242c", muted: "#7f7f74",
    petals: ["#C9D648", "#B8A04A", "#6E6A86"],
    // thin and jittery: many fine twigs at tight, restless angles, lopsided
    shape: {
      trunkLen: [260, 320], trunkW: 34, lean: 0.2, trunkKink: 0.9, flare: 0.3,
      fan: [-1.3, -0.95, -0.6, -0.3, 0.05, 0.45], mirror: true, fanJit: 0.3, limbLen: [320, 440], limbW: [0.4, 0.6],
      kink: 1.5, kinkGap: [10, 28], wobble: 0.16, droop: [0, 0.0003, 0.002, 0.005], lift: 0.003,
      gap: [[18, 36], [9, 18]], branchP: 0.7, branchLen: [110, 220], branchAng: [0.5, 1.3],
      twigLen: [25, 70], twigAng: [0.5, 1.4], twigW: [0.8, 2],
    },
    blossom: { shape: "sakura", size: [5, 9], density: 1.3, count: [1, 1, 2], budP: 0.45, tipBud: 0.8, petals: 90 },
    fx: null, gusts: true,   // still, then sudden gusts that bend it and tear buds loose
  },
  sad: {
    key: 5, label: "Sad", color: "#5B7DA8", on: "#ffffff",
    paper: "#e1e6ec", ink: "#1f2a3d", muted: "#6f7d8f",
    petals: ["#5B7DA8", "#3A4A6B", "#8FA3B8", "#C4D0DC"], rain: "#8FA3B8",
    // a weeping willow: limbs arc over and long fronds hang straight down
    shape: {
      trunkLen: [280, 330], lean: 0.18, fan: [-0.9, -0.45, 0, 0.45, 0.9],
      limbLen: [260, 360], lowLimbs: 0.4, kink: 0.4, wobble: 0.03, droop: [0, 0.003, 0.012, 0.03],
      gap: [[30, 55], [14, 30]], branchP: 0.7, branchLen: [200, 340], branchAng: [0.3, 0.7],
      twigLen: [140, 300], twigW: [1, 2.2], twigTaper: 0.75,
    },
    blossom: { shape: "leaf", size: [8, 13], density: 0.9, budP: 0, tipBud: 0, stamens: false, petals: 110, washA: 0.12 },
    fx: "rain", shed: true,  // leaves come loose one at a time and pile up on the ground
  },
  angry: {
    key: 6, label: "Angry", color: "#C62828", on: "#ffffff",
    paper: "#efe2dc", ink: "#2B1D1D", muted: "#8c6f6a", glow: "rgba(230,81,0,0.3)",
    petals: ["#C62828", "#E65100", "#FF3D00"],
    // jagged and angular: a heavy trunk, zig-zag limbs, thorns instead of twigs
    shape: {
      trunkLen: [250, 300], trunkW: 64, trunkKink: 0.8, fan: [-0.8, -0.35, 0.05, 0.4, 0.85],
      limbLen: [300, 420], lift: 0.004, kink: 2.4, kinkGap: [8, 20], wobble: 0.02, droop: [0, 0, 0.001, 0.002],
      gap: [[26, 50], [10, 22]], branchP: 0.6, branchAng: [0.5, 1.1], branchLen: [120, 220],
      twigLen: [14, 40], twigW: [1.5, 3], twigTaper: 0.95,
    },
    blossom: { shape: "spark", size: [8, 14], density: 0.35, count: [0, 0, 1], tipCount: [0, 0, 0, 1], budP: 0.1, petals: 50 },
    fx: "embers",
  },
};

// Sakura's own settings; each emotion overrides some of them.
const BASE_SHAPE = {
  trunkLen: [270, 330], trunkW: 52, lean: 0.12, trunkKink: 0.35, flare: 0.55,
  fan: [-0.95, -0.4, 0.1, 0.55, 1.0], fanKeep: 0.8, fanJit: 0.15, mirror: false,
  limbLen: [380, 520], limbW: [0.5, 0.7], lowLimbs: 0.7,
  droop: [0, 0.0005, 0.0032, 0.01],
  kink: 1, kinkGap: [30, 80], wobble: 0.05,
  lift: 0,        // steady pull toward straight up
  curl: 0,        // steady turn back toward the centre line, per sample
  curlKeep: 0,    // how much of a parent's curl its children keep
  heart: 0,       // if set, the crown is kept inside a heart this many units across each lobe
  gap: [[40, 75], [22, 44]], branchP: 0.75,
  branchLen: [150, 290], branchAng: [0.35, 0.9],
  twigLen: [45, 120], twigAng: [0.4, 0.95], twigW: [1.3, 3.8], twigTaper: 0.6,
};
const BASE_BLOSSOM = {
  shape: "sakura", size: [10, 17], density: 1, count: [1, 1, 1, 2, 2, 2], tipCount: [1, 1, 2],
  budP: 0.06, tipBud: 0.6, stamens: true, petals: 160, washA: 0.17,
};

const ORDER = Object.keys(EMOTIONS).sort((a, b) => EMOTIONS[a].key - EMOTIONS[b].key);

// ---------- helpers ----------

const LH = 1000;
let LW = 1600, K = 1, GROUND = 900;   // K scales the tree so it fits narrow screens
const TAU = Math.PI * 2;
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (a, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = arr => arr[(Math.random() * arr.length) | 0];
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, k) => Math.round(v + (b[k] - v) * t));
const turnTo = (target, a) => Math.atan2(Math.sin(target - a), Math.cos(target - a));

const vnoise = (() => {
  const P = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) P[i] = Math.random();
  const h = (x, y) => P[(((x * 73856093) ^ (y * 19349663)) >>> 0) & 1023];
  const s = t => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), u = s(x - xi), v = s(y - yi);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
})();

// the heart outline the crown is kept inside (Loved only): centre and size, or null
let MASK = null;
function inHeart(x, y, slack = 0) {
  const u = (x - MASK.cx) / (MASK.R * (1 + slack)), v = -(y - MASK.cy) / (MASK.R * (1 + slack));
  return (u * u + v * v - 1) ** 3 - u * u * v ** 3 <= 0;
}

// the active emotion
let current = null, E, SH, BL, PAPER_RGB, INK_RGB, INK, PETALS;
function use(id) {
  E = EMOTIONS[id];
  SH = { ...BASE_SHAPE, ...E.shape };
  BL = { ...BASE_BLOSSOM, ...E.blossom };
  PAPER_RGB = hex(E.paper);
  INK_RGB = hex(E.ink);
  INK = INK_RGB.join(",");
  PETALS = E.petals.map(hex);
}

// ---------- canvases ----------

const stage = document.getElementById("stage");
const paperCv = document.getElementById("paper");
const inkCv = document.getElementById("ink");
const fxCv = document.getElementById("fx");
const pctx = paperCv.getContext("2d");
const ctx = inkCv.getContext("2d", { willReadFrequently: true });
const fctx = fxCv.getContext("2d");
let S = 1;  // device pixels per logical unit

function layout() {
  const dpr = window.devicePixelRatio || 1;
  const w = stage.clientWidth, h = stage.clientHeight;
  LW = (LH * w) / h;
  K = clamp(LW / 1500, 0.6, 1);
  GROUND = LH * 0.9;
  S = (h * dpr) / LH;
  for (const cv of [paperCv, inkCv, fxCv]) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
  for (const c of [pctx, ctx, fctx]) c.setTransform(S, 0, 0, S, 0, 0);
}

function paintPaper() {
  pctx.fillStyle = E.paper;
  pctx.fillRect(0, 0, LW, LH);
  const g = pctx.createRadialGradient(LW / 2, LH * 0.45, LH * 0.2, LW / 2, LH * 0.5, Math.max(LW, LH) * 0.8);
  g.addColorStop(0, "rgba(255,255,255,0.2)");
  g.addColorStop(1, `rgba(${mix(PAPER_RGB, INK_RGB, 0.5)},0.1)`);
  pctx.fillStyle = g;
  pctx.fillRect(0, 0, LW, LH);
  const fibre = mix(PAPER_RGB, INK_RGB, 0.45).join(",");
  pctx.lineWidth = 0.35;
  for (let i = 0, n = (LW * LH) / 260; i < n; i++) {
    const x = rand(LW), y = rand(LH), a = rand(TAU), l = rand(3, 14);
    pctx.strokeStyle = `rgba(${fibre},${rand(0.03, 0.08)})`;
    pctx.beginPath(); pctx.moveTo(x, y);
    pctx.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
    pctx.stroke();
  }
  const img = pctx.getImageData(0, 0, paperCv.width, paperCv.height), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 7;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  pctx.putImageData(img, 0, 0);
}

// ---------- strokes ----------
// Every branch, root and ground mark is one brush stroke, as in Sakura. The emotion's shape settings
// change how the brush turns: droop (gravity), lift (reaching up), curl (heart lobes), kinks and wobble.

const DL = 3.2;
const SPEED = 2;

function makeStroke({ x, y, a, w0, len, depth, tone, start,
                      droop = SH.droop[depth] ?? 0, taper = 0.6, tail = true, flare = 0, kink = SH.kink, dry,
                      hold = null, curl = 0, lift = depth >= 1 && depth <= 3 ? SH.lift : 0 }) {
  const pts = [];
  const wrap = () => { while (a < -Math.PI / 2) a += TAU; while (a >= 1.5 * Math.PI) a -= TAU; };
  wrap();
  const seed = rand(1000), wobble = depth === 4 ? 0.05 : SH.wobble;
  let kinkIn = rand(...SH.kinkGap), knot = 0;
  const n = Math.max(4, Math.round(len / DL));
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let w = w0 * (1 - taper * t ** 1.1);
    w *= 0.75 + 0.25 * Math.min(1, i / 4) + (i < 3 ? 0.18 : 0);
    if (flare) w *= 1 + flare * Math.max(0, 1 - i / 14) ** 2;
    w *= 1 + 0.22 * Math.max(0, 1 - knot / 4);
    if (tail && t > 0.86) w *= Math.max(0.12, 1 - (t - 0.86) / 0.14) ** 0.8;
    pts.push({ x, y, w });
    a += (Math.PI / 2 - a) * droop * DL * (0.4 + t) + (vnoise(seed, i * 0.06) - 0.5) * wobble;
    a += curl;
    if (lift) a += turnTo(-Math.PI / 2, a) * lift;
    if (hold) a += turnTo(hold[0], a) * hold[1];
    if (x < 30) a += Math.sin(a) > 0 ? -0.03 : 0.03; else if (x > LW - 30) a += Math.sin(a) > 0 ? 0.03 : -0.03;
    knot++;
    if ((kinkIn -= DL) <= 0) {
      a += rand(-0.38, 0.38) * kink;
      kinkIn = rand(...SH.kinkGap); knot = 0;
    }
    if (MASK && depth >= 1 && depth <= 3 && !inHeart(x + Math.cos(a) * DL * 6, y + Math.sin(a) * DL * 6)) {
      if (depth === 3) break;                                   // twigs stop at the outline,
      a += turnTo(Math.atan2(MASK.cy - y, MASK.cx - x), a) * 0.2;   // limbs turn back inside it
    }
    wrap();
    x += Math.cos(a) * DL; y += Math.sin(a) * DL;
    if (y > LH - 6 || y < 6 || x < 4 || x > LW - 4) break;
    if (depth >= 1 && depth <= 3 && y > GROUND - 10) break;   // hanging fronds stop above the ground
  }
  const B = clamp(Math.round(w0 * 0.9), 4, 40);
  const bristles = Array.from({ length: B }, (_, j) => ({
    u: -1 + (2 * (j + 0.5)) / B + rand(-0.3, 0.3) / B,
    ink: rand(0.78, 1.02),
    seed: rand(1000),
  }));
  for (let i = 0; i < pts.length; i++) {
    const p = pts[Math.max(0, i - 1)], q = pts[Math.min(pts.length - 1, i + 1)];
    const dx = q.x - p.x, dy = q.y - p.y, m = Math.hypot(dx, dy) || 1;
    pts[i].nx = -dy / m; pts[i].ny = dx / m;
  }
  return { pts, bristles, depth, tone, start, curl, dry: dry ?? (depth <= 1 ? 0.42 : rand(0.25, 0.65)), drawn: 0, sites: [] };
}

function buildScene() {
  const strokes = [];
  const add = opts => { const s = makeStroke(opts); if (s.pts.length < 2) return s; strokes.push(s); grow(s); return s; };
  const at = (s, i) => {
    const j = Math.min(i + 1, s.pts.length - 1), k = j === i ? i - 1 : i;
    return { p: s.pts[i], a: Math.atan2(s.pts[j].y - s.pts[k].y, s.pts[j].x - s.pts[k].x) };
  };
  // children along limbs and branches
  const grow = s => {
    if (s.depth < 1 || s.depth >= 3) return;
    const n = s.pts.length, gap = SH.gap[s.depth - 1];
    let i = Math.round((rand(...gap) * K) / DL) + 4;
    let side = Math.random() < 0.5 ? 1 : -1;
    while (i < n - 4) {
      const { p, a } = at(s, i);
      const start = s.start + i / SPEED + rand(2, 10);
      const curl = s.curl * SH.curlKeep;
      side = -side;
      if (s.depth === 1 && Math.random() < SH.branchP) {
        add({ x: p.x, y: p.y, a: a + side * rand(...SH.branchAng), w0: p.w * rand(0.45, 0.65),
              len: rand(...SH.branchLen) * K, depth: 2, tone: rand(0.82, 0.96), start, curl });
      } else {
        const light = Math.random() < 0.2;
        add({ x: p.x, y: p.y, a: a + side * rand(...SH.twigAng), w0: clamp(p.w * rand(0.45, 0.6), SH.twigW[0], SH.twigW[1]),
              len: rand(...SH.twigLen) * K, depth: 3, tone: light ? rand(0.35, 0.5) : rand(0.62, 0.92), start,
              taper: SH.twigTaper, curl });
      }
      i += Math.round((rand(...gap) * K) / DL);
    }
  };

  // ground: a few pale, dry horizontal strokes
  for (let k = 0; k < 6; k++) {
    add({ x: rand(-40, LW * 0.45), y: GROUND + rand(-4, 30), a: rand(-0.025, 0.025), w0: rand(5, 13),
          len: rand(0.3, 0.75) * LW, depth: 4, tone: rand(0.16, 0.34), start: rand(0, 40),
          droop: 0, kink: 0.08, taper: 0.4, dry: rand(0.55, 0.95), hold: [0, 0.04] });
  }

  // trunk, with a flared base and a few surface roots
  const tx = LW / 2 + rand(-40, 40) * K;
  const tall = 1 + (1 - K) * 1.6;
  const lean = rand(-SH.lean, SH.lean);
  const trunk = add({ x: tx, y: GROUND + 8, a: -Math.PI / 2 + lean, w0: SH.trunkW * K, len: rand(...SH.trunkLen) * K * tall,
                      depth: 0, tone: 0.97, start: 20, taper: 0.4, tail: false, flare: SH.flare, kink: SH.trunkKink,
                      hold: [-Math.PI / 2 + lean, 0.02] });
  MASK = null;
  if (SH.heart) {
    // the heart's point sits a little below the fork, so the limbs start inside it
    const top = trunk.pts[trunk.pts.length - 1], R = SH.heart * K;
    MASK = { cx: top.x, cy: top.y - 0.5 * R, R };
  }
  for (const side of [-1, 1, pick([-1, 1])]) {
    add({ x: tx + side * rand(8, 16) * K, y: GROUND + 2, a: Math.PI / 2 - side * rand(1.15, 1.4), w0: rand(10, 16) * K,
          len: rand(30, 70) * K, depth: 4, tone: 0.9, start: 20, droop: 0, taper: 0.85, kink: 0.4 });
  }

  // main limbs fan out from the top of the trunk, plus some lower ones
  const n = trunk.pts.length;
  let fan = SH.fan.filter(() => Math.random() < SH.fanKeep);
  if (fan.length < 3) fan = SH.fan.slice();
  const flip = SH.mirror && Math.random() < 0.5 ? -1 : 1;
  for (const off0 of fan) {
    const off = off0 * flip;
    const i = Math.round((n - 1) * rand(0.84, 0.98));
    const { p } = at(trunk, i);
    add({ x: p.x, y: p.y, a: -Math.PI / 2 + off + rand(-SH.fanJit, SH.fanJit), w0: p.w * rand(...SH.limbW),
          len: rand(...SH.limbLen) * K, depth: 1, tone: rand(0.9, 0.97), start: trunk.start + i / SPEED,
          curl: -Math.sign(off) * SH.curl });
  }
  for (const side of [-1, 1]) {
    if (Math.random() >= SH.lowLimbs) continue;
    const i = Math.round((n - 1) * rand(0.5, 0.72));
    const { p } = at(trunk, i);
    add({ x: p.x, y: p.y, a: -Math.PI / 2 + side * rand(1.0, 1.3), w0: p.w * rand(0.4, 0.55),
          len: rand(SH.limbLen[0] * 0.75, SH.limbLen[1] * 0.8) * K, depth: 1, tone: 0.93, start: trunk.start + i / SPEED,
          curl: -side * SH.curl });
  }

  // blossom sites: clouds along branches and twigs, and at limb tips
  const step = (lo, hi) => Math.max(2, Math.round((rand(lo, hi) * K) / DL / BL.density));
  for (const s of strokes) {
    const n = s.pts.length;
    if (s.depth === 1) s.sites.push(n - 1);
    if (s.depth === 2) for (let i = Math.round(n * 0.3); i < n; i += step(45, 90)) s.sites.push(i);
    if (s.depth === 3) {
      for (let i = Math.round(n * 0.2); i < n - 2; i += step(20, 40)) s.sites.push(i);
      s.sites.push(n - 1);
    }
  }
  return { strokes, tx };
}

// ---------- brush ----------

const inkTone = d => `rgb(${PAPER_RGB.map((p, k) => Math.round(p + (INK_RGB[k] - p) * d)).join(",")})`;

function paintChunk(s, i0, i1) {
  const pts = s.pts, n = pts.length;
  const mid = pts[(i0 + i1) >> 1];
  const t = ((i0 + i1) / 2) / (n - 1);
  const lw = Math.max(0.35, (mid.w / s.bristles.length) * 2.1);
  const from = Math.max(0, i0 - 2);
  ctx.save();
  ctx.globalCompositeOperation = "darken";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const b of s.bristles) {
    const ink = b.ink - s.dry * t ** 1.3 * (0.5 + Math.abs(b.u));
    const grain = vnoise(mid.x * 0.33 + b.seed, mid.y * 0.33);
    const d = clamp((ink - 0.22 + (grain - 0.5) * 0.55) * 2.3, 0, 1) * s.tone;
    if (d < 0.04) continue;
    ctx.strokeStyle = inkTone(d);
    ctx.lineWidth = lw;
    ctx.beginPath();
    for (let i = from; i <= i1; i++) {
      const p = pts[i];
      const splay = (vnoise(b.seed, i * 0.08) - 0.5) * 0.25;
      const o = (b.u * 0.92 + splay) * p.w * 0.5;
      const x = p.x + p.nx * o, y = p.y + p.ny * o;
      i === from ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

// ---------- blossoms ----------
// As in Sakura, each blossom takes on the ink under its stalk, and its wash is laid in thin layers
// that spread outward. Its colour is one of the emotion's palette, and its outline its shape.

function inkAt(img, x, y, r = 3) {
  const P = PAPER_RGB[0] + PAPER_RGB[1] + PAPER_RGB[2], I = INK_RGB[0] + INK_RGB[1] + INK_RGB[2];
  let sum = 0, cnt = 0;
  for (let oy = -r; oy <= r; oy++)
    for (let ox = -r; ox <= r; ox++) {
      const px = Math.round((x + ox) * S), py = Math.round((y + oy) * S);
      if (px < 0 || py < 0 || px >= img.width || py >= img.height) continue;
      const k = (py * img.width + px) * 4, d = img.data;
      sum += (d[k + 3] / 255) * clamp((P - d[k] - d[k + 1] - d[k + 2]) / (P - I), 0, 1); cnt++;
    }
  return cnt ? sum / cnt : 0;
}

const N_OUT = 60;
const OUTLINES = {
  // five notched petals
  sakura() {
    const pts = [], seed = rand(100), petals = Array.from({ length: 5 }, () => rand(0.82, 1.08));
    for (let i = 0; i < N_OUT; i++) {
      const th = (i / N_OUT) * TAU;
      const k = (th * 5) / TAU, pi = Math.floor(k), phi = k - pi;
      const lobe = Math.sin(Math.PI * phi) ** 0.5;
      const notch = rand(0.08, 0.22) * Math.exp(-(((phi - 0.5) / 0.07) ** 2));
      const wobble = 0.85 + 0.3 * vnoise(seed + Math.cos(th) * 1.6, Math.sin(th) * 1.6);
      const r = (0.38 + 0.62 * lobe - notch) * petals[pi % 5] * wobble;
      pts.push([Math.cos(th) * r, Math.sin(th) * r]);
    }
    return pts;
  },
  // a soft round daub
  round() {
    const pts = [], seed = rand(100);
    for (let i = 0; i < N_OUT; i++) {
      const th = (i / N_OUT) * TAU, r = 0.8 + 0.3 * vnoise(seed + Math.cos(th) * 1.2, Math.sin(th) * 1.2);
      pts.push([Math.cos(th) * r, Math.sin(th) * r]);
    }
    return pts;
  },
  // a heart, point down
  heart() {
    const pts = [], seed = rand(100);
    for (let i = 0; i < N_OUT; i++) {
      const th = (i / N_OUT) * TAU;
      const w = 0.92 + 0.16 * vnoise(seed + Math.cos(th), Math.sin(th));
      const x = 16 * Math.sin(th) ** 3;
      const y = -(13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th)) - 3;
      pts.push([(x / 16) * w, (y / 16) * w]);
    }
    return pts;
  },
  // a slender willow leaf, pointed at both ends, lying along x
  leaf() {
    const pts = [], seed = rand(100), fat = rand(0.22, 0.32);
    for (let i = 0; i < N_OUT; i++) {
      const th = (i / N_OUT) * TAU, c = Math.cos(th);
      const w = 0.9 + 0.2 * vnoise(seed + c, Math.sin(th));
      pts.push([c * w, fat * Math.sin(th) * Math.sqrt(1 - Math.abs(c)) * 1.6 * w]);
    }
    return pts;
  },
  // a jagged spark of uneven spikes
  spark() {
    const pts = [], spikes = (rand(6, 10)) | 0, len = Array.from({ length: spikes }, () => rand(0.65, 1.15));
    for (let i = 0; i < N_OUT; i++) {
      const th = (i / N_OUT) * TAU, k = (th * spikes) / TAU, si = Math.floor(k), phi = k - si;
      const r = 0.3 + (len[si % spikes] - 0.3) * Math.max(0, 1 - Math.abs(phi - 0.5) * 2) ** 2.2;
      pts.push([Math.cos(th) * r, Math.sin(th) * r]);
    }
    return pts;
  },
};

// how each shape sits: its rotation, squash and offset from the twig
const PLACE = {
  sakura: () => ({ rot: rand(TAU), squash: rand(0.55, 1) }),
  round: () => ({ rot: rand(TAU), squash: rand(0.75, 1) }),
  heart: () => ({ rot: rand(-0.35, 0.35), squash: rand(0.85, 1) }),
  leaf: () => ({ rot: Math.PI / 2 + rand(-0.35, 0.35), squash: rand(0.9, 1.1), hang: true }),
  spark: () => ({ rot: rand(TAU), squash: rand(0.7, 1) }),
};

function makeFlowers(strokes, img, tEnd) {
  const flowers = [];
  for (const s of strokes)
    for (const i of s.sites) {
      const p = s.pts[i];
      const local = inkAt(img, p.x, p.y);
      const tip = i === s.pts.length - 1 && s.depth === 3;
      const count = tip ? pick(BL.tipCount) : pick(BL.count);
      const when = (s.start + i / SPEED) / tEnd;
      for (let k = 0; k < count; k++) {
        const bud = tip && k === 0 ? Math.random() < BL.tipBud : Math.random() < BL.budP;
        const R = (bud ? rand(4, 6) : rand(...BL.size)) * K;
        const pl = PLACE[BL.shape]();
        const cx = p.x + (pl.hang ? rand(-8, 8) : rand(-20, 20)) * K;
        const cy = pl.hang ? p.y + R * rand(0.7, 1.1) : p.y + rand(-12, 20) * K;
        if (cy > GROUND - 6 || cy < 6 || cx < 6 || cx > LW - 6) continue;
        if (MASK && !inHeart(cx, cy, 0.04)) continue;
        const ink = clamp((0.35 + 0.9 * local) * rand(0.7, 1.3), 0.3, 1.2);
        const m = clamp(0.2 + 0.25 * ink, 0, 0.5);
        const body = pick(PETALS);
        flowers.push({
          ax: p.x, ay: p.y, x: cx, y: cy, R, bud, ink, ...pl,
          body: body.join(","),
          blush: mix(body, INK_RGB, 0.15).join(","),
          rim: mix(body, INK_RGB, m + 0.15).join(","),
          outline: OUTLINES[BL.shape](),
          start: Math.round(when * 150 + rand(0, 30)),
          t: 0,
        });
      }
    }
  return flowers;
}

const STALK = 7, BLOOM = 38;

function tf(f, px, py, scale) {
  const c = Math.cos(f.rot), s = Math.sin(f.rot);
  const x = px * scale, y = py * scale * f.squash;
  return [f.x + x * c - y * s, f.y + x * s + y * c];
}

function paintFlower(f) {
  const t = f.t++;
  if (t <= STALK) {
    const u0 = Math.max(0, t - 1) / STALK, u1 = t / STALK;
    const mx = (f.ax + f.x) / 2 + (f.x - f.ax) * 0.15, my = (f.ay + f.y) / 2 - 2;
    const at = u => {
      const v = 1 - u;
      return [v * v * f.ax + 2 * v * u * mx + u * u * f.x, v * v * f.ay + 2 * v * u * my + u * u * f.y];
    };
    ctx.strokeStyle = `rgba(${INK},${0.7 * Math.min(1, f.ink)})`;
    ctx.lineWidth = f.bud ? 0.7 : 0.85;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(...at(u0)); ctx.lineTo(...at(u1)); ctx.stroke();
    return false;
  }
  const g = t - STALK;
  if (f.bud) {
    if (g < 14) {
      const sc = (g + 1) / 14;
      ctx.fillStyle = `rgba(${f.blush},0.22)`;
      ctx.beginPath();
      ctx.ellipse(f.x + rand(-0.3, 0.3), f.y + f.R * 0.3 * sc, f.R * 0.6 * sc, f.R * sc, rand(-0.2, 0.2), 0, TAU);
      ctx.fill();
      return false;
    }
    ctx.strokeStyle = `rgba(${f.rim},0.5)`;
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.ellipse(f.x, f.y + f.R * 0.3, f.R * 0.6, f.R, 0, 0, TAU); ctx.stroke();
    ctx.fillStyle = `rgba(${INK},0.8)`;
    ctx.beginPath(); ctx.ellipse(f.x, f.y - f.R * 0.45, f.R * 0.32, f.R * 0.38, 0, 0, TAU); ctx.fill();
    return true;
  }
  if (g < BLOOM) {
    const p = (g + 1) / BLOOM, sc = f.R * (1 - (1 - p) ** 3);
    const ox = rand(-0.05, 0.05) * f.R, oy = rand(-0.05, 0.05) * f.R;
    ctx.beginPath();
    f.outline.forEach(([px, py], i) => {
      const j = rand(0.93, 1.06);
      const [x, y] = tf(f, px * j, py * j, sc);
      i ? ctx.lineTo(x + ox, y + oy) : ctx.moveTo(x + ox, y + oy);
    });
    ctx.closePath();
    ctx.fillStyle = `rgba(${f.body},${BL.washA})`;
    ctx.fill();
    if (p < 0.5) { ctx.fillStyle = `rgba(${f.blush},0.06)`; ctx.fill(); }
    ctx.fillStyle = `rgba(${INK},${0.012 * f.ink * (1.5 - p)})`;
    ctx.fill();
    return false;
  }
  // drying: pigment gathers unevenly at the wet edge, then a few stamens are flicked in
  ctx.lineCap = "round";
  const o = f.outline, per = o.length / 5;
  for (let pass = 0; pass < 3; pass++) {
    ctx.strokeStyle = `rgba(${f.rim},${rand(0.1, 0.22)})`;
    ctx.lineWidth = rand(0.5, 1.3) * K;
    for (let k = 0; k < 5; k++) {
      if (Math.random() < 0.35) continue;
      const a = Math.round(rand(per * 0.3)), b = Math.round(per - rand(per * 0.3));
      const sc = f.R * rand(0.95, 1.02);
      ctx.beginPath();
      for (let i = a; i <= b; i++) {
        const [px, py] = o[(Math.round(k * per) + i) % o.length];
        const [x, y] = tf(f, px, py, sc);
        i === a ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
  if (BL.stamens) {
    const dots = (rand(2, 6)) | 0;
    for (let k = 0; k < dots; k++) {
      const a = rand(TAU), r = f.R * rand(0.1, 0.38);
      const x = f.x + Math.cos(a) * r, y = f.y + Math.sin(a) * r * f.squash;
      ctx.fillStyle = `rgba(${INK},${rand(0.5, 0.85)})`;
      ctx.beginPath(); ctx.ellipse(x, y, rand(0.5, 1.1) * K, rand(0.4, 0.8) * K, rand(TAU), 0, TAU); ctx.fill();
    }
  }
  return true;
}

// ---------- fallen petals ----------

function makePetals(tx, flowers) {
  const xs = flowers.map(f => f.x);
  const spread = xs.length ? (Math.max(...xs) - Math.min(...xs)) / 2 : 300;
  const petals = [];
  for (let k = 0; k < BL.petals; k++) {
    const air = k < BL.petals * 0.16;
    const x = tx + gauss() * spread * (air ? 1.1 : 0.8);
    const y = air ? rand(GROUND - 260 * K, GROUND - 20) : GROUND + rand(-6, 34) + Math.abs(gauss()) * 10;
    if (x < 6 || x > LW - 6) continue;
    const c = pick(PETALS);
    petals.push({ x, y, s: rand(2.4, 4.4) * K, rot: rand(TAU), squash: air ? rand(0.3, 0.9) : rand(0.35, 0.6),
                  body: mix(c, PAPER_RGB, 0.25).join(","), rim: mix(c, INK_RGB, 0.3).join(",") });
  }
  return petals.sort(() => Math.random() - 0.5);
}

function petalPath(c, s) {
  c.beginPath();
  c.moveTo(-s, 0);
  c.bezierCurveTo(-s * 0.6, -s * 1.1, s * 0.7, -s * 1.0, s, -s * 0.25);
  c.lineTo(s * 0.72, 0);
  c.lineTo(s, s * 0.25);
  c.bezierCurveTo(s * 0.7, s * 1.0, -s * 0.6, s * 1.1, -s, 0);
}

function paintPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.scale(1, p.squash);
  petalPath(ctx, p.s);
  ctx.fillStyle = `rgba(${p.body},0.9)`;
  ctx.fill();
  ctx.strokeStyle = `rgba(${p.rim},0.35)`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.restore();
}

// ---------- ongoing motion ----------
// Every particle lives on the fx canvas, above the painting, and has a type:
//   petal — Joyful's petals drifting up off the crown     rain — Sad's light slanting rain
//   ember — Angry's sparks floating up                     leaf — a willow leaf come loose, falling
//   bud   — an Anxious bud torn off by a gust               heart — Loved's hearts rising from open blossoms
// Anxious's gusts bend the whole painting with a spring; breathe is a CSS animation
// switched on by the stage's fx-* class.

let parts = [], bloomed = [], blooming = [], landed = 0;
let gust = null, shedNext = 0, heartNext = 0;

function spawn(tx, now) {
  const kind = E.fx;
  if (kind === "rise" && Math.random() < 0.45) {
    const c = pick(PETALS);
    parts.push({ type: "petal", x: tx + gauss() * 380 * K, y: GROUND - rand(150, 600) * K, vx: rand(-0.3, 0.3), vy: -rand(0.4, 1.1),
                 rot: rand(TAU), vr: rand(-0.04, 0.04), s: rand(2.6, 4.6) * K, life: 0, max: rand(160, 320), col: c.join(",") });
  } else if (kind === "rain") {
    for (let k = 0; k < 3; k++)
      parts.push({ type: "rain", x: rand(-40, LW + 40), y: rand(-40, 0), vx: -1.4, vy: rand(9, 13), len: rand(12, 24),
                   life: 0, a: rand(0.18, 0.4), stop: GROUND + rand(-10, 40) });
  } else if (kind === "embers" && Math.random() < 0.6) {
    const c = pick(PETALS);
    parts.push({ type: "ember", x: tx + gauss() * 360 * K, y: GROUND - rand(0, 520) * K, vx: rand(-0.3, 0.3), vy: -rand(0.5, 1.6),
                 r: rand(0.9, 2.2) * K, ph: rand(TAU), life: 0, max: rand(90, 200), col: c.join(",") });
  } else if (kind === "hearts" && blooming.length && now > heartNext) {
    heartNext = now + rand(180, 520);           // two or three a second, whatever the frame rate
    for (let k = 0; k < 8; k++) {
      const f = pick(blooming);
      if (f.bud || f.t < STALK + BLOOM) continue;   // only blossoms that have opened
      // timed in seconds, not frames, so they clear the crown on any display
      parts.push({ type: "heart", x0: f.x, y0: f.y, t0: now, speed: rand(45, 80) * K, ph: rand(TAU), sway: rand(10, 22) * K,
                   s: rand(6, 11) * K, dur: rand(6, 9), col: f.body, rim: f.rim });
      break;
    }
  }
  if (E.shed && bloomed.length && now > shedNext) {
    shedLeaf();
    if (Math.random() < 0.25) shedLeaf();   // now and then two let go together
    shedNext = now + rand(350, 1300);
  }
}

// ---- Sad: leaves come loose one at a time, drift down and pile up on the ground ----

function shapePath(c, f, x, y, rot, squash, scale = 1) {
  const cs = Math.cos(rot), sn = Math.sin(rot);
  c.beginPath();
  f.outline.forEach(([px, py], i) => {
    const X = px * f.R * scale, Y = py * f.R * scale * squash;
    i ? c.lineTo(x + X * cs - Y * sn, y + X * sn + Y * cs) : c.moveTo(x + X * cs - Y * sn, y + X * sn + Y * cs);
  });
  c.closePath();
}

function shedLeaf() {
  // prefer leaves high enough to fall a little way
  let f = null;
  for (let k = 0; k < 6 && !f; k++) {
    const i = (Math.random() * bloomed.length) | 0;
    if (bloomed[i].y < GROUND - 60 * K || k === 5) f = bloomed.splice(i, 1)[0];
  }
  if (!f) return;
  // lift most of the painted leaf off the branch, so the tree visibly thins
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  shapePath(ctx, f, f.x, f.y, f.rot, f.squash, 1.08);
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.fill();
  ctx.restore();
  parts.push({ type: "leaf", f, x0: f.x, x: f.x, y: f.y, rot0: f.rot, rot: f.rot, vy: rand(0.55, 1.0) * K,
               ph: rand(TAU), w: rand(0.03, 0.05), amp: rand(10, 26) * K, drift: rand(-0.35, -0.05),
               life: 0, floor: GROUND + rand(-6, 30) + Math.abs(gauss()) * 8 });
}

// a heart drawn point-down, about 2s wide
function heartPath(c, s) {
  c.beginPath();
  c.moveTo(0, s * 0.9);
  c.bezierCurveTo(-s * 0.2, s * 0.6, -s * 1.1, s * 0.1, -s * 1.0, -s * 0.35);
  c.bezierCurveTo(-s * 0.9, -s * 1.0, -s * 0.15, -s * 1.0, 0, -s * 0.45);
  c.bezierCurveTo(s * 0.15, -s * 1.0, s * 0.9, -s * 1.0, s * 1.0, -s * 0.35);
  c.bezierCurveTo(s * 1.1, s * 0.1, s * 0.2, s * 0.6, 0, s * 0.9);
  c.closePath();
}

function drawLeaf(c, p, squash, alpha) {
  shapePath(c, p.f, p.x, p.y, p.rot, squash);
  c.fillStyle = `rgba(${p.f.body},${0.7 * alpha})`;
  c.fill();
  c.strokeStyle = `rgba(${p.f.rim},${0.45 * alpha})`;
  c.lineWidth = 0.6 * K;
  c.stroke();
}

// ---- Anxious: still, then a sudden gust bends the tree and it snaps back, wobbling ----

function blowBuds(dir, n) {
  for (let k = 0; k < n && bloomed.length; k++) {
    const f = pick(bloomed);
    parts.push({ type: "bud", x: f.x, y: f.y, vx: dir * rand(3, 7) * K, vy: rand(-1.2, 0.6), r: rand(1.4, 3) * K,
                 rot: rand(TAU), vr: rand(-0.2, 0.2), life: 0, max: rand(70, 130), col: f.body });
  }
}

function updateGust(now) {
  const g = gust;
  const dt = Math.min(0.05, (now - g.last) / 1000);
  g.last = now;
  if (now > g.next) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    g.target = dir * rand(1.3, 3.0);                 // degrees of lean at the crown
    g.until = now + rand(160, 550);                  // a short, sharp push
    // usually a long uneasy pause, sometimes a second gust right on the heels of the first
    g.next = now + (Math.random() < 0.3 ? rand(500, 900) : rand(1800, 5200));
    blowBuds(dir, (rand(4, 12)) | 0);
  }
  if (now > g.until) g.target = 0;
  // an under-damped spring: it overshoots and wobbles a few times before settling
  g.v += (95 * (g.target - g.b) - 6.5 * g.v) * dt;
  g.b += g.v * dt;
  inkCv.style.transform = Math.abs(g.b) < 0.003 && !g.target ? "" : `skewX(${(-g.b).toFixed(3)}deg)`;
}

function drawParts(now) {
  fctx.clearRect(0, 0, LW, LH);
  const rain = hex(E.rain || E.color).join(",");
  parts = parts.filter(p => {
    p.life++;
    if (p.type === "rain") {
      p.x += p.vx; p.y += p.vy;
      if (p.y > p.stop) return false;
      fctx.strokeStyle = `rgba(${rain},${p.a})`;
      fctx.lineWidth = 0.8;
      fctx.beginPath(); fctx.moveTo(p.x, p.y); fctx.lineTo(p.x - p.vx * p.len / p.vy, p.y - p.len); fctx.stroke();
      return true;
    }
    if (p.type === "heart") {
      // rises slowly, swaying, swelling a little as it leaves the blossom
      const age = (now - p.t0) / 1000;
      if (age > p.dur) return false;
      const fade = Math.min(1, age / 0.5) * Math.min(1, (p.dur - age) / 1.8);
      const x = p.x0 + Math.sin(age * 1.6 + p.ph) * p.sway * Math.min(1, age), y = p.y0 - p.speed * age;
      if (y < -20) return false;
      const sc = p.s * (0.5 + 0.5 * Math.min(1, age / 0.8));
      fctx.save();
      fctx.translate(x, y); fctx.rotate(Math.sin(age * 1.6 + p.ph) * 0.22);
      heartPath(fctx, sc);
      fctx.fillStyle = `rgba(${p.col},${0.85 * fade})`;
      fctx.fill();
      fctx.strokeStyle = `rgba(${p.rim},${0.55 * fade})`;
      fctx.lineWidth = 0.6 * K;
      fctx.stroke();
      fctx.restore();
      return true;
    }
    if (p.type === "leaf") {
      // a pendulum drift down; it turns from hanging to lying flat as it falls
      p.ph += p.w;
      p.x0 += p.drift;
      p.x = p.x0 + Math.sin(p.ph) * p.amp * Math.min(1, p.life / 40);
      p.y += p.vy * (0.75 + 0.35 * Math.cos(p.ph * 2) ** 2);
      const flat = Math.min(1, p.life / 70);
      p.rot = p.rot0 + (Math.cos(p.ph) * 0.6 - p.rot0) * flat;
      const squash = p.f.squash * (1 - 0.35 * flat * Math.abs(Math.sin(p.ph)));
      if (p.y >= p.floor) {
        // it lands: pressed into the painting, so the pile builds up on the ground
        if (landed++ < 900) { p.rot = rand(-0.5, 0.5); drawLeaf(ctx, p, p.f.squash * rand(0.45, 0.7), 0.95); }
        return false;
      }
      drawLeaf(fctx, p, squash, Math.min(1, p.life / 8));
      return true;
    }
    p.x += p.vx; p.y += p.vy;
    if (p.life > p.max || p.y < -10 || p.x < -20 || p.x > LW + 20) return false;
    const fade = Math.min(1, p.life / 20) * Math.min(1, (p.max - p.life) / 40);
    if (p.type === "petal") {
      p.vx += Math.sin(p.life * 0.04 + p.rot) * 0.01;
      p.rot += p.vr;
      fctx.save();
      fctx.translate(p.x, p.y); fctx.rotate(p.rot); fctx.scale(1, 0.6 + 0.4 * Math.sin(p.life * 0.08));
      petalPath(fctx, p.s);
      fctx.fillStyle = `rgba(${p.col},${0.85 * fade})`;
      fctx.fill();
      fctx.restore();
    } else if (p.type === "bud") {
      p.vx *= 0.965; p.vy += 0.06; p.rot += p.vr;
      fctx.fillStyle = `rgba(${p.col},${0.9 * Math.min(1, (p.max - p.life) / 30)})`;
      fctx.beginPath(); fctx.ellipse(p.x, p.y, p.r, p.r * 0.6, p.rot, 0, TAU); fctx.fill();
    } else {
      p.vx += Math.sin(p.life * 0.09 + p.ph) * 0.03;
      const fl = 0.55 + 0.45 * Math.sin(p.life * 0.35 + p.ph);
      fctx.fillStyle = `rgba(${p.col},${0.25 * fade * fl})`;
      fctx.beginPath(); fctx.arc(p.x, p.y, p.r * 3, 0, TAU); fctx.fill();
      fctx.fillStyle = `rgba(${p.col},${0.95 * fade * fl})`;
      fctx.beginPath(); fctx.arc(p.x, p.y, p.r, 0, TAU); fctx.fill();
    }
    return true;
  });
}

// ---------- timeline ----------
// branches → blossoms → fallen petals, with the emotion's motion running alongside

let run = 0;
const status = document.getElementById("status");

function paint() {
  const id = ++run;
  if (!stage.clientWidth || !stage.clientHeight) return;
  layout();
  paintPaper();
  ctx.clearRect(0, 0, LW, LH);
  fctx.clearRect(0, 0, LW, LH);
  parts = []; bloomed = []; blooming = []; landed = 0;
  inkCv.style.transform = "";
  const t0 = performance.now();
  gust = E.gusts ? { b: 0, v: 0, target: 0, until: 0, next: t0 + rand(2000, 3500), last: t0 } : null;
  shedNext = 0;
  for (const k of ORDER) if (EMOTIONS[k].fx) stage.classList.remove("fx-" + EMOTIONS[k].fx);
  if (E.fx) stage.classList.add("fx-" + E.fx);
  const { strokes, tx } = buildScene();
  const tEnd = Math.max(...strokes.map(s => s.start + s.pts.length / SPEED));
  let frame = 0, flowers = null, allFlowers = null, petals = null, flowerFrame = 0, painting = true;
  status.textContent = `${E.label} · ${strokes.length} brush strokes`;
  const motion = !REDUCE && (["rise", "rain", "embers", "hearts"].includes(E.fx) || E.gusts || E.shed);

  (function tick() {
    if (id !== run) return;
    if (painting) {
      if (!flowers) {
        let active = 0;
        for (const s of strokes) {
          if (frame < s.start || s.drawn >= s.pts.length) continue;
          active++;
          const i1 = Math.min(s.pts.length - 1, s.drawn + SPEED);
          paintChunk(s, s.drawn, i1);
          s.drawn = i1 + 1;
        }
        frame++;
        if (!active && frame > tEnd) {
          const img = ctx.getImageData(0, 0, inkCv.width, inkCv.height);
          flowers = allFlowers = blooming = makeFlowers(strokes, img, tEnd);
          status.textContent = `${E.label} · ${strokes.length} brush strokes · ${flowers.length} blossoms`;
        }
      } else if (flowers.length) {
        flowers = flowers.filter(f => flowerFrame < f.start || !paintFlower(f));
        flowerFrame++;
      } else if ((petals ||= makePetals(tx, allFlowers)).length) {
        for (const p of petals.splice(0, 6)) paintPetal(p);
      } else {
        painting = false;
        bloomed = allFlowers.filter(f => !f.bud);   // once in full bloom, leaves can fall and buds can blow away
        shedNext = performance.now() + rand(300, 900);
      }
    }
    if (motion) {
      const now = performance.now();
      spawn(tx, now);
      if (gust) updateGust(now);
      drawParts(now);
    }
    if (painting || motion) requestAnimationFrame(tick);
  })();
}

// ---------- buttons, keys and the public hook ----------

const root = document.documentElement;
const bar = document.getElementById("moods");
const buttons = {};
for (const id of ORDER) {
  const e = EMOTIONS[id];
  const b = document.createElement("button");
  b.type = "button";
  b.className = "mood";
  b.dataset.emotion = id;
  b.setAttribute("aria-pressed", "false");
  b.setAttribute("aria-keyshortcuts", String(e.key));
  b.style.setProperty("--c", e.color);
  b.style.setProperty("--on", e.on);
  b.innerHTML = `<span class="num" aria-hidden="true">${e.key}</span>${e.label}`;
  b.addEventListener("click", () => setEmotion(id));
  bar.appendChild(b);
  buttons[id] = b;
}

let fadeTimer = 0;
function setEmotion(id) {
  if (!EMOTIONS[id]) return;
  const first = current === null;
  current = id;
  use(id);
  for (const k of ORDER) buttons[k].setAttribute("aria-pressed", String(k === id));
  root.style.setProperty("--paper", E.paper);
  root.style.setProperty("--ink", E.ink);
  root.style.setProperty("--muted", E.muted);
  root.style.setProperty("--glow", E.glow || "transparent");
  try { history.replaceState(null, "", "#" + id); } catch (_) {}
  clearTimeout(fadeTimer);
  if (first || REDUCE) { stage.classList.remove("fading"); paint(); return; }
  run++;                                // stop the current painting where it is
  stage.classList.add("fading");
  fadeTimer = setTimeout(() => { paint(); stage.classList.remove("fading"); }, 360);
}

addEventListener("keydown", e => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.("input, textarea, select")) return;
  const id = ORDER.find(k => String(EMOTIONS[k].key) === e.key);
  if (id) setEmotion(id);
});

document.getElementById("again").onclick = paint;
inkCv.onclick = paint;
let lastW = innerWidth, lastH = innerHeight;
addEventListener("resize", () => {
  if (Math.abs(innerWidth - lastW) + Math.abs(innerHeight - lastH) < 60) return;
  lastW = innerWidth; lastH = innerHeight;
  paint();
});

// For the wearable: window.setEmotion("calm") or window.setEmotion(2).
window.setEmotion = v => setEmotion(typeof v === "number" ? ORDER[v - 1] : v);
window.EMOTIONS = EMOTIONS;

setEmotion(EMOTIONS[location.hash.slice(1)] ? location.hash.slice(1) : "joyful");
})();
