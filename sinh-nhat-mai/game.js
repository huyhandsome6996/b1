/* ================= SINH NHẬT MAI — tiny pixel game ================= */
(() => {
'use strict';

/* ---------- Hằng số ---------- */
const W = 480, H = 270, GROUND = 236, WORLD = 3200;
const CAKE_X = 2960;
const GRAV = 0.42, JUMP_V = -7.6, MOVE_A = 0.55, MOVE_MAX = 2.6;

/* VỤC SÂU — nhìn thấy rõ, nhảy qua là được. Rơi vào chỉ quay lại mép an toàn, không mất gì */
const PITS = [
  { x: 760,  w: 48 },
  { x: 1290, w: 56 },
  { x: 2440, w: 48 }
];
/* chân nhân vật đứng TRỌN VỌN trong vùng vực → mới rơi (đứng mép vẫn vững) */
function pitFull(x1, x2) { return PITS.some(pt => x1 >= pt.x && x2 <= pt.x + pt.w); }
/* bất kỳ điểm nào chạm vùng vực (dùng để ẩn trang trí/sạn đất) */
function pitHit(x1, x2)  { return PITS.some(pt => x1 < pt.x + pt.w && x2 > pt.x); }

const ITEMS_DEF = [
  { spr:'balloon', word:'CHÚC',   wish:'Niềm vui nở hoa mỗi ngày 🎈' },
  { spr:'heart',   word:'MỪNG',   wish:'Luôn được yêu thương ❤️' },
  { spr:'star',    word:'SINH',   wish:'May mắn luôn theo em ✨' },
  { spr:'flower',  word:'NHẬT',   wish:'Xinh đẹp rạng rỡ 🌸' },
  { spr:'cupcake', word:'ĐẶNG',   wish:'Đời ngọt như bánh 🧁' },
  { spr:'gift',    word:'HOÀNG',  wish:'Niềm vui bất ngờ mỗi ngày 🎁' },
  { spr:'note',    word:'PHƯƠNG', wish:'Bình an trong tâm hồn 🎵' },
  { spr:'clover',  word:'MAI',    wish:'Thành công rực rỡ 🍀' }
];
/* TẤT CẢ quà nằm NGAY TRÊN ĐƯỜNG đi — đi tới là ăn, không cần nhảy, không cần quay lại */
const ITEM_XS = [320, 560, 880, 1140, 1420, 1680, 1940, 2200];
const ITEM_YS = [212, 212, 212, 212, 212, 212, 212, 212];

/* ---------- DOM ---------- */
const $ = id => document.getElementById(id);
const cv = $('game'), ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;
const hudEl = $('hud'), wordEl = $('hud-word'), countEl = $('hud-count');
const toastEl = $('toast'), hintEl = $('hint'), muteBtn = $('mute-btn');
const touchEl = $('touch'), titleEl = $('title-screen'), startBtn = $('start-btn');
const finaleEl = $('finale'), confCv = $('confetti'), confCtx = confCv.getContext('2d');
const songEl = $('song');
songEl.volume = 0.85;

/* ---------- Trạng thái ---------- */
let state = 'title';          // title | play | finale
let player, items, particles, collected, cam, t, hintShown;
let keys = { left:false, right:false, jump:false };
let jumpLock = false;
let lastSafeX = 40;   /* vị trí đất an toàn gần nhất — nơi hồi sinh nếu rơi vực */
let toastTimer = null;
let cakeHintT = -999;
let muted = false;

/* ---------- ÂM THANH ---------- */
let actx = null, master = null, chipGain = null, chipTimer = null;

function initAudio() {
  if (actx) { actx.resume && actx.resume(); return; }
  try {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    master = actx.createGain(); master.gain.value = muted ? 0 : 1;
    master.connect(actx.destination);
    chipGain = actx.createGain(); chipGain.gain.value = 0.9;
    chipGain.connect(master);
  } catch (e) { actx = null; }
}

function blip(f0, f1, dur, type, vol, when) {
  if (!actx) return;
  const t0 = actx.currentTime + (when || 0);
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type || 'square';
  o.frequency.setValueAtTime(f0, t0);
  o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
  g.gain.setValueAtTime(vol || 0.12, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(master);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

const sfxJump = () => blip(240, 500, 0.14, 'square', 0.08);
const sfxCollect = () => { blip(660, 660, 0.07, 'square', 0.1); blip(990, 990, 0.12, 'square', 0.1, 0.07); blip(1320, 1320, 0.16, 'triangle', 0.08, 0.14); };
const sfxFanfare = () => { [523, 659, 784, 1047].forEach((f, i) => blip(f, f, 0.22, 'square', 0.11, i * 0.13)); };

/* Nhạc chiptune "Happy Birthday" lặp trong lúc chơi */
const MELODY = [
  [392,.75],[392,.25],[440,1],[392,1],[523.25,1],[493.88,2],
  [392,.75],[392,.25],[440,1],[392,1],[587.33,1],[523.25,2],
  [392,.75],[392,.25],[783.99,1],[659.25,1],[523.25,1],[493.88,1],[440,2],
  [698.46,.75],[698.46,.25],[659.25,1],[523.25,1],[587.33,1],[523.25,2]
];
const BEAT = 0.34;
function playChiptune() {
  if (!actx) return;
  chipGain.gain.setValueAtTime(0.9, actx.currentTime);
  let t0 = actx.currentTime + 0.15, total = 0;
  MELODY.forEach(([f, b]) => {
    const dur = b * BEAT;
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = 'square'; o.frequency.value = f;
    g.gain.setValueAtTime(0.045, t0);
    g.gain.setValueAtTime(0.045, t0 + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.95);
    o.connect(g); g.connect(chipGain);
    o.start(t0); o.stop(t0 + dur);
    /* hợp âm êm phía dưới */
    const o2 = actx.createOscillator(), g2 = actx.createGain();
    o2.type = 'triangle'; o2.frequency.value = f / 2;
    g2.gain.setValueAtTime(0.028, t0);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.95);
    o2.connect(g2); g2.connect(chipGain);
    o2.start(t0); o2.stop(t0 + dur);
    t0 += dur; total += dur;
  });
  chipTimer = setTimeout(playChiptune, (total + 1.6) * 1000);
}
function stopChiptune() {
  clearTimeout(chipTimer); chipTimer = null;
  if (actx && chipGain) chipGain.gain.setValueAtTime(0, actx.currentTime);
}

/* ---------- Khởi tạo game ---------- */
function resetGame() {
  player = { x: 40, y: GROUND - 24, vx: 0, vy: 0, dir: 1, onGround: true, animT: 0 };
  lastSafeX = 40;
  items = ITEMS_DEF.map((d, i) => ({
    ...d, sprObj: SPRITES[d.spr],
    x: ITEM_XS[i], y: ITEM_YS[i],
    w: SPRITES[d.spr].rows[0].length, h: SPRITES[d.spr].rows.length,
    got: false, bob: Math.random() * 6.28
  }));
  particles = [];
  collected = 0; cam = 0; t = 0; hintShown = false;
  wordEl.innerHTML = '';
  ITEMS_DEF.forEach(d => {
    const s = document.createElement('span');
    s.className = 'slot'; s.textContent = d.word;
    wordEl.appendChild(s);
  });
  countEl.textContent = '🎁 0/8';
  hintEl.classList.add('hidden');
  toastEl.classList.add('hidden');
}

function spawnBurst(x, y, colors, n) {
  for (let i = 0; i < (n || 14); i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 3.2,
      vy: -Math.random() * 2.6 - 0.4,
      g: 0.09, life: 34 + Math.random() * 22,
      c: colors[(Math.random() * colors.length) | 0],
      s: 1 + (Math.random() * 2 | 0)
    });
  }
}

function showToast(html) {
  clearTimeout(toastTimer);
  toastEl.innerHTML = html;
  toastEl.classList.remove('hidden');
  toastEl.style.animation = 'none'; void toastEl.offsetWidth;
  toastEl.style.animation = '';
  toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 2100);
}

function collectItem(it) {
  it.got = true; collected++;
  sfxCollect();
  spawnBurst(it.x + it.w / 2, it.y + it.h / 2, ['#ff6fa5', '#ffd76e', '#fff', '#9ad9f5', '#6cc551'], 18);
  showToast(`<b>${it.word}</b> — ${it.wish}`);
  countEl.textContent = `🎁 ${collected}/8`;
  const slot = wordEl.children[collected - 1];
  if (slot) slot.classList.add('got');
  if (collected === ITEMS_DEF.length) {
    hintShown = true;
    hintEl.classList.remove('hidden');
    sfxFanfare();
  }
}

/* ---------- Cập nhật ---------- */
function update() {
  t++;
  const p = player;
  if (keys.left)  { p.vx -= MOVE_A; p.dir = -1; }
  if (keys.right) { p.vx += MOVE_A; p.dir = 1; }
  if (!keys.left && !keys.right) p.vx *= 0.78;
  p.vx = Math.max(-MOVE_MAX, Math.min(MOVE_MAX, p.vx));

  if (keys.jump && p.onGround && !jumpLock) {
    p.vy = JUMP_V; p.onGround = false; jumpLock = true; sfxJump();
  }
  if (!keys.jump) jumpLock = false;

  p.vy += GRAV;
  p.x += p.vx; p.y += p.vy;
  p.x = Math.max(0, Math.min(WORLD - 16, p.x));

  /* đứng trên đất — trừ khi đang ở trọn trong vùng vực */
  if (p.y >= GROUND - 24 && !pitFull(p.x + 4, p.x + 10)) {
    const deep = p.y > GROUND - 12;   /* vừa bò ra từ lòng vực */
    p.y = GROUND - 24; p.vy = 0; p.onGround = true;
    lastSafeX = p.x;
    if (deep) spawnBurst(p.x + 8, GROUND - 8, ['#c9a377', '#8d5c31', '#ffffff'], 10);
  } else if (pitFull(p.x + 4, p.x + 10) && p.y > GROUND - 23) {
    p.onGround = false;
  }

  /* rơi xuống vực → hồi sinh ở mép đất an toàn, không mất gì cả */
  if (p.y > H + 40) {
    p.x = lastSafeX; p.y = GROUND - 30;
    p.vx = 0; p.vy = 0; p.onGround = false;
    spawnBurst(p.x + 8, GROUND - 12, ['#ffffff', '#ffd76e', '#9ad9f5'], 12);
    showToast('😅 Rơi trúng vực rồi! Không sao đâu — nhảy qua cái hố nhỏ là được 💪');
  }

  p.animT += Math.abs(p.vx) > 0.3 ? 1 : 0;

  /* nhặt quà — vùng hút rộng: chỉ cần đi NGANG QUA là ăn được, kể cả đang nhảy trên đầu quà.
     Đi thẳng từ đầu tới cuối chắc chắn đủ 8/8, không bao giờ phải quay lại */
  const pcx = p.x + 8, pbottom = p.y + 24;
  items.forEach(it => {
    if (it.got) return;
    const bobY = it.y + Math.sin(t * 0.05 + it.bob) * 3;
    if (Math.abs(pcx - (it.x + it.w / 2)) < it.w / 2 + 10 && pbottom > it.y - 52) {
      collectItem(it);
      return;
    }
    if (Math.random() < 0.02) {
      particles.push({ x: it.x + Math.random() * it.w, y: bobY + Math.random() * it.h,
        vx: 0, vy: -0.25, g: 0, life: 26, c: '#ffffffcc', s: 1 });
    }
  });

  /* đích: chiếc bánh — đủ 8 quà mới mở */
  if (p.x + 12 > CAKE_X - 6) {
    if (collected === ITEMS_DEF.length) {
      startFinale();
    } else if (t - cakeHintT > 300) {
      cakeHintT = t;
      const left = ITEMS_DEF.length - collected;
      showToast(`❗ Chiếc bánh chưa mở! Còn <b>${left}</b> món quà nằm ngay trên đường thôi — quay lại nhẹ nhàng là có nha 💛`);
    }
  }

  /* hạt tim sau lưng khi chạy */
  if (Math.abs(p.vx) > 1.8 && p.onGround && t % 14 === 0) {
    particles.push({ x: p.x + 6, y: p.y + 8, vx: (Math.random()-0.5)*0.4, vy: -0.5, g: 0.01, life: 30, c: '#ffb3cc', s: 2 });
  }

  particles = particles.filter(pt => {
    pt.x += pt.vx; pt.y += pt.vy; pt.vy += pt.g; pt.life--;
    return pt.life > 0;
  });

  cam += ((p.x - 200) - cam) * 0.14;
  cam = Math.max(0, Math.min(WORLD - W, cam));
}

/* ---------- Vẽ thế giới ---------- */
function drawSky() {
  ctx.fillStyle = '#7ec8f0'; ctx.fillRect(0, 0, W, 130);
  ctx.fillStyle = '#8fd2f7'; ctx.fillRect(0, 130, W, 50);
  ctx.fillStyle = '#a5ddfa'; ctx.fillRect(0, 180, W, GROUND - 180);
  /* mặt trời pixel */
  const sx = 402, sy = 24;
  ctx.fillStyle = '#fff3c2'; ctx.fillRect(sx - 2, sy - 2, 16, 16);
  ctx.fillStyle = '#ffd76e'; ctx.fillRect(sx, sy, 12, 12);
  ctx.fillStyle = '#ffe9a8'; ctx.fillRect(sx + 3, sy + 3, 4, 4);
}

const CLOUDS = [[80,26],[420,48],[760,20],[1140,42],[1500,30],[1880,52],[2240,24],[2620,46],[2980,30],[3340,50]];
function drawClouds() {
  CLOUDS.forEach(([cx, cy]) => {
    const sx = cx - cam * 0.35;
    const span = WORLD * 0.35 + W;
    const wrapped = ((sx % span) + span) % span - 60;
    if (wrapped > -70 && wrapped < W) drawSprite(ctx, SPRITES.cloud, wrapped | 0, cy, false);
  });
}

function drawHills(par, color, base, a1, f1, a2, f2, ph) {
  ctx.fillStyle = color;
  for (let sx = 0; sx < W; sx += 6) {
    const wx = sx + cam * par;
    const h = base + a1 * Math.sin(wx * f1 + ph) + a2 * Math.sin(wx * f2 + ph * 2);
    ctx.fillRect(sx, GROUND - h, 6, h);
  }
}

const TREES  = [140, 640, 1150, 1620, 2140, 2620, 2880];
const BUSHES = [300, 900, 1420, 1980, 2540, 2790];
const FLW    = [220, 470, 730, 1010, 1370, 1710, 2090, 2320, 2560, 2760, 3080];
const GRASSES= [180, 380, 560, 840, 1100, 1230, 1560, 1840, 2020, 2260, 2510, 2680, 2900, 3060];

function drawDecor() {
  const skip = x => pitHit(x - 2, x + 26); /* không vẽ trang trí đè lên lòng vực */
  TREES.forEach(x => { if (skip(x)) return; const sx = x - cam; if (sx > -25 && sx < W) drawSprite(ctx, SPRITES.tree, sx, GROUND - 20, false); });
  BUSHES.forEach(x => { if (skip(x)) return; const sx = x - cam; if (sx > -18 && sx < W) drawSprite(ctx, SPRITES.bush, sx, GROUND - 5, false); });
  FLW.forEach((x, i) => { if (skip(x)) return; const sx = x - cam; if (sx > -8 && sx < W) drawSprite(ctx, i % 2 ? SPRITES.dflower2 : SPRITES.dflower, sx, GROUND - 5, false); });
  GRASSES.forEach(x => { if (skip(x)) return; const sx = x - cam; if (sx > -6 && sx < W) drawSprite(ctx, SPRITES.grass, sx, GROUND - 4, false); });
}

/* Biển gỗ mũi tên vàng: đi thẳng + báo trước chỗ vực */
const SIGNS = [110, 700, 1230, 2380];
function drawSigns() {
  SIGNS.forEach(x => {
    if (pitHit(x - 2, x + 26)) return;
    const sx = (x - cam) | 0;
    if (sx < -30 || sx > W) return;
    ctx.fillStyle = '#6e4529'; ctx.fillRect(sx + 9, GROUND - 13, 4, 13);
    ctx.fillStyle = '#8a5a3b'; ctx.fillRect(sx, GROUND - 27, 22, 14);
    ctx.fillStyle = '#5b3a22';
    ctx.fillRect(sx, GROUND - 27, 22, 1);
    ctx.fillRect(sx, GROUND - 14, 22, 1);
    ctx.fillRect(sx, GROUND - 27, 1, 14);
    ctx.fillRect(sx + 21, GROUND - 27, 1, 14);
    drawSprite(ctx, SPRITES.arrowR, sx + 7, GROUND - 24, false);
  });
}

/* Đất được vẽ theo từng đoạn, chừa lại các khoảng vực */
const G_SEGS = (() => {
  let segs = [[0, WORLD]];
  PITS.forEach(p => {
    const next = [];
    segs.forEach(([a, b]) => {
      if (p.x + p.w <= a || p.x >= b) { next.push([a, b]); return; }
      if (p.x > a) next.push([a, p.x]);
      if (p.x + p.w < b) next.push([p.x + p.w, b]);
    });
    segs = next;
  });
  return segs;
})();

function drawPost(px) {  /* cọc cảnh báo sọc vàng-đen đặt hai mép vực */
  ctx.fillStyle = '#ffd76e'; ctx.fillRect(px, GROUND - 9, 4, 9);
  ctx.fillStyle = '#2b2233';
  ctx.fillRect(px, GROUND - 9, 4, 2);
  ctx.fillRect(px, GROUND - 5, 4, 2);
}

function drawGround() {
  G_SEGS.forEach(([a, b]) => {
    const sx = a - cam, sw = b - a;
    if (sx + sw < 0 || sx > W) return;
    ctx.fillStyle = '#67c455'; ctx.fillRect(sx, GROUND, sw, 4);
    ctx.fillStyle = '#8adf79'; ctx.fillRect(sx, GROUND, sw, 2);
    ctx.fillStyle = '#a4713f'; ctx.fillRect(sx, GROUND + 4, sw, H - GROUND - 4);
  });
  ctx.fillStyle = '#8d5c31';
  for (let i = 0; i < 42; i++) {
    const wx = (i * 97 + 13) % WORLD;
    if (pitHit(wx, wx + 3)) continue;
    const sx = wx - cam;
    if (sx > -3 && sx < W) ctx.fillRect(sx, GROUND + 10 + ((i * 29) % 26), 3, 2);
  }
  /* LÒNG VỰC — tối dần xuống sâu, nhìn phát biết là phải nhảy */
  PITS.forEach(pt => {
    const sx = pt.x - cam;
    if (sx > W || sx + pt.w < 0) return;
    ctx.fillStyle = '#2a1810'; ctx.fillRect(sx, GROUND, pt.w, 10);
    ctx.fillStyle = '#1a0e0a'; ctx.fillRect(sx, GROUND + 10, pt.w, 14);
    ctx.fillStyle = '#0b0507'; ctx.fillRect(sx, GROUND + 24, pt.w, H - GROUND - 24);
    ctx.fillStyle = '#4a2e1c'; ctx.fillRect(sx, GROUND, 2, 34);
    ctx.fillStyle = '#3a2317'; ctx.fillRect(sx + pt.w - 2, GROUND, 2, 34);
    ctx.fillStyle = '#67c455'; ctx.fillRect(sx - 1, GROUND, 1, 5);
    ctx.fillStyle = '#67c455'; ctx.fillRect(sx + pt.w, GROUND, 1, 4);
    drawPost(sx - 7); drawPost(sx + pt.w + 3);
  });
}

function drawCake() {
  const spr = SPRITES.cake;
  const rows = spr.rows.length - 3; /* bỏ 3 hàng trống cuối */
  const sx = CAKE_X - cam;
  if (sx < -30 || sx > W) return;
  if (collected === ITEMS_DEF.length) {
    const a = 0.22 + 0.13 * Math.sin(t * 0.1);
    ctx.fillStyle = `rgba(255,215,110,${a.toFixed(3)})`;
    ctx.fillRect(sx - 10, GROUND - rows - 8, 44, rows + 8);
    ctx.fillStyle = `rgba(255,255,255,${(a * 0.7).toFixed(3)})`;
    ctx.fillRect(sx - 4, GROUND - rows - 3, 32, rows + 3);
  }
  for (let ry = 0; ry < rows; ry++) {
    const row = spr.rows[ry];
    for (let rx = 0; rx < row.length; rx++) {
      const ch = row[rx]; if (ch === '.') continue;
      ctx.fillStyle = spr.map[ch];
      ctx.fillRect(sx + rx, GROUND - rows + ry, 1, 1);
    }
  }
}

function drawItems() {
  items.forEach(it => {
    if (it.got) return;
    const sx = it.x - cam;
    if (sx < -16 || sx > W) return;
    const bobY = it.y + Math.sin(t * 0.05 + it.bob) * 3;
    drawSprite(ctx, it.sprObj, sx | 0, bobY | 0, false);
  });
}

/* Vòng sáng + mũi tên vàng dẫn tới món quà chưa nhặt gần nhất */
function drawGuides() {
  const remaining = items.filter(it => !it.got);
  if (!remaining.length || state !== 'play') return;
  let nearest = remaining[0], best = Infinity;
  remaining.forEach(it => {
    const d = Math.abs(it.x + it.w / 2 - (player.x + 6));
    if (d < best) { best = d; nearest = it; }
  });
  remaining.forEach(it => {
    const sx = it.x - cam;
    if (sx < -24 || sx > W + 24) return;
    const sy = it.y + Math.sin(t * 0.05 + it.bob) * 3;
    const isNear = it === nearest;
    const a = (isNear ? 0.20 : 0.09) + 0.07 * Math.sin(t * 0.12);
    const pad = isNear ? 5 : 3;
    ctx.fillStyle = isNear
      ? `rgba(255,215,110,${a.toFixed(3)})`
      : `rgba(255,255,255,${(a * 0.8).toFixed(3)})`;
    ctx.fillRect(sx - pad, sy - pad, it.w + pad * 2, it.h + pad * 2);
  });
  /* quà ngoài màn hình → mũi tên ở mép chỉ hướng */
  const nsx = nearest.x - cam;
  const ay = (150 + Math.sin(t * 0.1) * 5) | 0;
  if (nsx < -12) drawSprite(ctx, SPRITES.arrowL, 8, ay, false);
  else if (nsx > W + 12) drawSprite(ctx, SPRITES.arrowR, W - 16, ay, false);
}

function drawPlayer() {
  const p = player;
  let spr;
  if (!p.onGround) spr = SPRITES.player_jump;
  else if (Math.abs(p.vx) > 0.3) spr = (p.animT >> 3) % 2 ? SPRITES.player_walk1 : SPRITES.player_walk2;
  else spr = SPRITES.player_idle;
  /* bóng đổ — chỉ vẽ khi đứng trên đất, không vẽ trên lòng vực */
  if (!pitFull(p.x + 4, p.x + 10)) {
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.fillRect((p.x + 1 - cam) | 0, GROUND - 1, 13, 2);
  }
  drawSprite(ctx, spr, (p.x - cam) | 0, p.y | 0, p.dir === -1);
}

function drawParticles() {
  particles.forEach(pt => {
    ctx.fillStyle = pt.c;
    ctx.fillRect((pt.x - cam) | 0, pt.y | 0, pt.s, pt.s);
  });
}

function render() {
  drawSky();
  drawClouds();
  drawHills(0.55, '#a8dba0', 30, 14, 0.012, 8, 0.03, 0);
  drawHills(0.75, '#7fc86e', 18, 10, 0.016, 6, 0.042, 1.4);
  drawGround();
  drawDecor();
  drawSigns();
  drawCake();
  drawItems();
  drawGuides();
  drawPlayer();
  drawParticles();
}

/* ---------- Vòng lặp ---------- */
function loop() {
  if (state === 'play') { update(); render(); }
  else if (state === 'finale' || state === 'title') { /* overlay phủ */ }
  requestAnimationFrame(loop);
}

/* ---------- MÀN KẾT ---------- */
const CONF_COLORS = ['#ff6fa5', '#ffd76e', '#ffffff', '#9ad9f5', '#6cc551', '#f95f6b', '#c9a3ff'];
let confParts = [], confRun = false;

function sizeConfetti() {
  const r = finaleEl.getBoundingClientRect();
  confCv.width = Math.max(2, r.width / 3 | 0);
  confCv.height = Math.max(2, r.height / 3 | 0);
}
window.addEventListener('resize', () => { if (confRun) sizeConfetti(); });

function confettiStep() {
  if (!confRun) return;
  const cw = confCv.width, chh = confCv.height;
  if (confParts.length < 160 && Math.random() < 0.5) {
    confParts.push({
      x: Math.random() * cw, y: -4,
      vx: (Math.random() - 0.5) * 0.7, vy: 0.6 + Math.random() * 0.9,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.2,
      w: 2 + (Math.random() * 3 | 0), h: 2 + (Math.random() * 2 | 0),
      c: CONF_COLORS[(Math.random() * CONF_COLORS.length) | 0],
      sway: Math.random() * 6.28
    });
  }
  confCtx.clearRect(0, 0, cw, chh);
  confParts = confParts.filter(p => p.y < chh + 6);
  confParts.forEach(p => {
    p.sway += 0.05; p.x += p.vx + Math.sin(p.sway) * 0.4; p.y += p.vy; p.rot += p.vr;
    confCtx.save();
    confCtx.translate(p.x, p.y); confCtx.rotate(p.rot);
    confCtx.fillStyle = p.c;
    confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confCtx.restore();
  });
  requestAnimationFrame(confettiStep);
}

function typeLine(el, text, speed, done) {
  el.classList.remove('hidden');
  let i = 0;
  const tick = () => {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, speed);
    else { el.classList.add('done'); done && done(); }
  };
  tick();
}

function startFinale() {
  if (state === 'finale') return;
  state = 'finale';
  stopChiptune();
  sfxFanfare();
  hudEl.classList.add('hidden');
  touchEl.classList.add('hidden');
  hintEl.classList.add('hidden');
  toastEl.classList.add('hidden');

  finaleEl.classList.remove('hidden');
  finaleEl.style.opacity = '0';
  finaleEl.style.transition = 'opacity .8s';
  requestAnimationFrame(() => { finaleEl.style.opacity = '1'; });
  sizeConfetti();
  confRun = true; confParts = [];
  requestAnimationFrame(confettiStep);

  /* ảnh hiện ra */
  setTimeout(() => $('polaroid').classList.remove('hidden'), 700);
  /* gõ dòng 1 */
  setTimeout(() => typeLine($('fin-line1'), 'CHÚC MỪNG SINH NHẬT', 95), 1500);
  /* dòng 2 bật lên */
  setTimeout(() => $('fin-line2').classList.remove('hidden'), 4400);
  /* lời chúc */
  setTimeout(() => $('fin-line3').classList.remove('hidden'), 5100);
  /* nút */
  setTimeout(() => {
    $('fin-btns').classList.remove('hidden');
    $('fin-credit').classList.remove('hidden');
  }, 5800);

  /* bài hát chính thức */
  try {
    songEl.currentTime = 0;
    songEl.muted = muted;
    const pr = songEl.play();
    if (pr && pr.catch) pr.catch(() => {});
  } catch (e) {}
}

function replay() {
  confRun = false; confParts = [];
  confCtx.clearRect(0, 0, confCv.width, confCv.height);
  try { songEl.pause(); songEl.currentTime = 0; } catch (e) {}
  ['polaroid', 'fin-line1', 'fin-line2', 'fin-line3', 'fin-btns', 'fin-credit']
    .forEach(id => $(id).classList.add('hidden'));
  $('fin-line1').textContent = ''; $('fin-line1').classList.remove('done');
  finaleEl.classList.add('hidden');
  finaleEl.style.opacity = '';
  resetGame();
  state = 'play';
  hudEl.classList.remove('hidden');
  if (isTouch) touchEl.classList.remove('hidden');
  playChiptune();
}

/* ---------- Âm thanh: nút mute ---------- */
function applyMute() {
  muteBtn.textContent = muted ? '🔇' : '🔊';
  if (master) master.gain.value = muted ? 0 : 1;
  songEl.muted = muted;
}
muteBtn.addEventListener('click', () => { muted = !muted; applyMute(); });

$('song-btn').addEventListener('click', function () {
  muted = false; applyMute();
  try { songEl.currentTime = 0; songEl.play(); } catch (e) {}
  this.textContent = '🔊 Bài hát';
});
$('replay-btn').addEventListener('click', replay);

/* ---------- INPUT ---------- */
const GAME_KEYS = ['ArrowLeft','ArrowRight','ArrowUp','Space','KeyA','KeyD','KeyW'];
document.addEventListener('keydown', e => {
  if (GAME_KEYS.includes(e.code)) e.preventDefault();
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
  if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keys.jump = true;
});
document.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keys.jump = false;
});

const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) ||
  (window.matchMedia && (matchMedia('(pointer: coarse)').matches || matchMedia('(max-width: 820px)').matches));

/* dự phòng chắc chắn cho điện thoại: BẤT KỲ lần chạm nào khi đang chơi cũng hiện nút
   (không dùng once:true — listener cũ bị lần chạm mở game "ăn mất" làm nút không bao giờ hiện) */
['touchstart', 'pointerdown'].forEach(ev => {
  document.addEventListener(ev, e => {
    if (state === 'play' && touchEl.classList.contains('hidden')) {
      if (ev === 'touchstart' || e.pointerType === 'touch') touchEl.classList.remove('hidden');
    }
  }, { passive: true });
});

/* nút toàn màn hình (nếu trình duyệt hỗ trợ) */
const fsBtn = $('fs-btn');
if (document.documentElement.requestFullscreen) {
  fsBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });
}

/* gợi ý xoay ngang trên điện thoại dọc */
const rotateHint = $('rotate-hint');
let rotateHintTimer = null;
function maybeShowRotateHint() {
  if (window.innerHeight > window.innerWidth && window.innerWidth < 820) {
    rotateHint.classList.remove('hidden');
    clearTimeout(rotateHintTimer);
    rotateHintTimer = setTimeout(() => rotateHint.classList.add('hidden'), 4500);
  }
}
window.addEventListener('orientationchange', () => setTimeout(maybeShowRotateHint, 300));

function bindTouch(id, prop) {
  const b = $(id);
  const on = e => { e.preventDefault(); keys[prop] = true; };
  const off = e => { e.preventDefault(); keys[prop] = false; };
  b.addEventListener('pointerdown', on);
  b.addEventListener('pointerup', off);
  b.addEventListener('pointerleave', off);
  b.addEventListener('pointercancel', off);
  /* fallback cho trình duyệt cũ không có Pointer Events (iOS cũ) */
  b.addEventListener('touchstart', on, { passive: false });
  b.addEventListener('touchend', off, { passive: false });
  b.addEventListener('touchcancel', off, { passive: false });
}
bindTouch('btn-left', 'left');
bindTouch('btn-right', 'right');
bindTouch('btn-jump', 'jump');

/* ---------- START ---------- */
const urlSkip = new URLSearchParams(location.search).get('skip') === '1';

startBtn.addEventListener('click', () => {
  initAudio();
  if (actx && actx.state === 'suspended') actx.resume();
  titleEl.style.transition = 'opacity .5s';
  titleEl.style.opacity = '0';
  setTimeout(() => titleEl.classList.add('hidden'), 480);

  /* nút fullscreen + gợi ý xoay ngang */
  if (document.documentElement.requestFullscreen) fsBtn.classList.remove('hidden');
  maybeShowRotateHint();

  if (urlSkip) {           /* chế độ xem thử màn kết */
    resetGame();
    ITEMS_DEF.forEach((d, i) => { items[i].got = true; });
    collected = ITEMS_DEF.length;
    player.x = CAKE_X - 80;
    state = 'play';
    hudEl.classList.remove('hidden');
    startFinale();
    return;
  }

  resetGame();
  state = 'play';
  hudEl.classList.remove('hidden');
  muteBtn.classList.remove('hidden');
  if (isTouch) touchEl.classList.remove('hidden');
  playChiptune();
});

/* ---------- chạy ---------- */
resetGame();
render();
loop();

/* đề phòng: chạm/click bất kỳ cũng mở khóa âm thanh trên iOS */
document.addEventListener('pointerdown', () => {
  if (actx && actx.state === 'suspended') actx.resume();
}, { passive: true });

/* hook debug (tiện kiểm tra tự động, vô hại khi chơi) */
window.__mai = {
  get state() { return state; },
  get player() { return player; },
  get items() { return items; },
  get collected() { return collected; },
  keys
};

/* tải trước ảnh để màn kết mượt */
const preImg = new Image();
preImg.src = 'assets/mai.png';
})();
