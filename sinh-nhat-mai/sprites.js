/* ============ PIXEL SPRITE DATA — hand-drawn ============ */
/* Mỗi sprite: mảng chuỗi, mỗi ký tự = 1 pixel. '.' = trong suốt */
const SPRITES = {

  /* ---------- NHÂN VẬT (16x24) ---------- */
  player_idle: {
    map: { k:'#2b2233', s:'#f2c9a0', c:'#f0a0a8', o:'#1d1726', S:'#d98f6b',
           r:'#f95f6b', d:'#cf4756', j:'#3f5b8b', J:'#324a75', h:'#2b2233', w:'#ffffff' },
    rows: [
      "....kkkkkkkk....",
      "...kkkkkkkkkk...",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kksssssssskk..",
      "..kssssssssssk..",
      "..kssosssssosk..",
      "..kscsssssscsk..",
      "..ksssssSSsssk..",
      "...kssssssssk...",
      "....drrrrrrd....",
      "..rrrrrrrrrrrr..",
      "..rrrrrrrrrrrr..",
      ".srrrrrrrrrrrrs.",
      ".srrrrrrrrrrrrs.",
      ".srrrrrrrrrrrrs.",
      "..rrrrrrrrrrrr..",
      "...jjjjjjjjjj...",
      "...jjjjjjjjjj...",
      "...jjj....jjj...",
      "...jjj....jjj...",
      "...JJJ....JJJ...",
      "..hhhh....hhhh..",
      "..wwww....wwww.."
    ]
  },

  player_walk1: {
    map: { k:'#2b2233', s:'#f2c9a0', c:'#f0a0a8', o:'#1d1726', S:'#d98f6b',
           r:'#f95f6b', d:'#cf4756', j:'#3f5b8b', J:'#324a75', h:'#2b2233', w:'#ffffff' },
    rows: [
      "....kkkkkkkk....",
      "...kkkkkkkkkk...",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kksssssssskk..",
      "..kssssssssssk..",
      "..kssosssssosk..",
      "..kscsssssscsk..",
      "..ksssssSSsssk..",
      "...kssssssssk...",
      "....drrrrrrd....",
      "..rrrrrrrrrrrr..",
      "..rrrrrrrrrrrr..",
      ".srrrrrrrrrrrrs.",
      ".srrrrrrrrrrrrs.",
      ".srrrrrrrrrrrrs.",
      "..rrrrrrrrrrrr..",
      "...jjjjjjjjjj...",
      "...jjjjjjjjjj...",
      "..jjj.....jjj...",
      "..jjj.....jjj...",
      "..JJJ.....JJJ...",
      ".hhhh.....hhhh..",
      ".wwww.....wwww.."
    ]
  },

  player_walk2: {
    map: { k:'#2b2233', s:'#f2c9a0', c:'#f0a0a8', o:'#1d1726', S:'#d98f6b',
           r:'#f95f6b', d:'#cf4756', j:'#3f5b8b', J:'#324a75', h:'#2b2233', w:'#ffffff' },
    rows: [
      "....kkkkkkkk....",
      "...kkkkkkkkkk...",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kksssssssskk..",
      "..kssssssssssk..",
      "..kssosssssosk..",
      "..kscsssssscsk..",
      "..ksssssSSsssk..",
      "...kssssssssk...",
      "....drrrrrrd....",
      "..rrrrrrrrrrrr..",
      "..rrrrrrrrrrrr..",
      ".srrrrrrrrrrrrs.",
      ".srrrrrrrrrrrrs.",
      ".srrrrrrrrrrrrs.",
      "..rrrrrrrrrrrr..",
      "...jjjjjjjjjj...",
      "...jjjjjjjjjj...",
      "...jjj.....jjj..",
      "...jjj.....jjj..",
      "...JJJ.....JJJ..",
      "..hhhh.....hhhh.",
      "..wwww.....wwww."
    ]
  },

  player_jump: {
    map: { k:'#2b2233', s:'#f2c9a0', c:'#f0a0a8', o:'#1d1726', S:'#d98f6b',
           r:'#f95f6b', d:'#cf4756', j:'#3f5b8b', J:'#324a75', h:'#2b2233', w:'#ffffff' },
    rows: [
      "....kkkkkkkk....",
      "...kkkkkkkkkk...",
      "..kkkkkkkkkkkk..",
      "..kkkkkkkkkkkk..",
      "..kksssssssskk..",
      "..kssssssssssk..",
      "..kssosssssosk..",
      "..kscsssssscsk..",
      "..ksssssSSsssk..",
      "...kssssssssk...",
      "....drrrrrrd....",
      "..rrrrrrrrrrrr..",
      "s.rrrrrrrrrrrr.s",
      "ssrrrrrrrrrrrrss",
      ".srrrrrrrrrrrrs.",
      "..rrrrrrrrrrrr..",
      "..rrrrrrrrrrrr..",
      "...jjjjjjjjjj...",
      "..jjjjjjjjjjjj..",
      "..jjjj....jjjj..",
      "..JJJ......JJJ..",
      ".hhhh......hhhh.",
      ".wwww......wwww.",
      "................"
    ]
  },

  /* ---------- 8 MÓN QUÀ ---------- */
  balloon: {
    map: { p:'#ff6fa5', P:'#d94f88', w:'#ffffff', s:'#8f7ba8' },
    rows: [
      "...pppp...",
      "..pppppp..",
      ".ppwppppp.",
      ".pppppppP.",
      ".pppppppP.",
      ".pppppppP.",
      "..pppppP..",
      "...pppP...",
      "....sP....",
      "....s.....",
      "...s......",
      "....s.....",
      ".....s...."
    ]
  },

  heart: {
    map: { p:'#ff6f9d', P:'#d94f88', w:'#ffffff' },
    rows: [
      ".ppp...ppp.",
      "ppwpppppppp",
      "ppppppppppP",
      "ppppppppppP",
      "pppppppppP.",
      ".pppppppp..",
      "..pppppp...",
      "...pppp....",
      "....pp.....",
      ".....p....."
    ]
  },

  star: {
    map: { y:'#ffd76e', Y:'#e3a93c', w:'#fffbe8' },
    rows: [
      ".....y.....",
      "....yyy....",
      "....yyy....",
      "wyyyyyyyyyY",
      ".yyyyyyyyyY",
      "..yyyyyyyY.",
      "...yyyyyY..",
      "...yyyyyY..",
      "..yyy.yyy..",
      ".yy...yy...",
      ".y.....y..."
    ]
  },

  flower: {
    map: { f:'#ff9fbe', F:'#e05a8a', y:'#ffd76e', Y:'#e3a93c', g:'#4f9d4a', G:'#3c7d38' },
    rows: [
      "...ff.ff...",
      "..fFfffFf..",
      "..ffffff...",
      ".fffyYyfff.",
      "..ffffff...",
      "..fFfffFf..",
      "...ff.ff...",
      "....gg.....",
      "..g.gG.....",
      "...ggGg....",
      "....gGg....",
      "....gg.....",
      "....gg....."
    ]
  },

  cupcake: {
    map: { p:'#ff5f8a', w:'#fff6ec', W:'#f0dccb', n:'#c98a4b', N:'#a56d38' },
    rows: [
      ".....pp.....",
      "....pppp....",
      "..wwwwwwww..",
      ".wwwwwwwwww.",
      "wwwwwwwwwwww",
      "wWwwwwwwwwWw",
      ".wwwwwwwwww.",
      ".nnnnnnnnnn.",
      ".nNnNnNnNnN.",
      ".nnnnnnnnnn.",
      ".nNnNnNnNnN.",
      "..nNnNnNnN.."
    ]
  },

  gift: {
    map: { g:'#6cc551', G:'#4f9d3a', r:'#ff4f6e', R:'#d13a58' },
    rows: [
      "...r....r...",
      "..rrr..rrr..",
      "....rrrr....",
      "gggggggggggg",
      "ggggrrrrgggg",
      "ggggrrrrgggg",
      "ggggrrrrgggg",
      "ggggrrrrgggg",
      "GgggrrrrgggG",
      "GgggrrrrgggG",
      "GGGGrrrrGGGG"
    ]
  },

  note: {
    map: { n:'#9ad9f5', N:'#5fb3d9' },
    rows: [
      "..nnnnnnnn.",
      "..Nnnnnnnn.",
      "..nn....nn.",
      "..nn....nn.",
      "..nn....nn.",
      "..nn....nn.",
      "..nn....nn.",
      "nnnn...nnnn",
      "nnnn...nnnn",
      "Nnnn...nnnN",
      "nnn.....nnn",
      ".nn......N."
    ]
  },

  clover: {
    map: { g:'#6cc551', G:'#4f9d3a' },
    rows: [
      ".ggg...ggg.",
      "ggggg.ggggg",
      "ggggggggggg",
      "ggggggggggg",
      ".ggggGgggg.",
      "..gggGggg..",
      "...ggGgg...",
      "....gGg....",
      "....gGg....",
      ".....Gg....",
      ".....g....."
    ]
  },

  /* ---------- CÁNH GATE: CHIẾC BÁNH (24x18) ---------- */
  cake: {
    map: { y:'#ffd76e', Y:'#ff9d3c', r:'#ff4f6e', f:'#fff6ec', W:'#f0dccb',
           p:'#ff9fbe', c:'#d9a066', C:'#b97f4c', w:'#ffffff', g:'#6cc551' },
    rows: [
      "....y.......y.......y...",
      "....y.......y.......y...",
      "...rrr.....rrr.....rrr..",
      "..ffffffffffffffffffff..",
      "..ffffffffffffffffffff..",
      "..f.ff..fff..fff..ff.f..",
      "..ffffffffffffffffffff..",
      ".pppppppppppppppppppppp.",
      ".cccccccccccccccccccccc.",
      ".ccccccwwccccccwwcccccc.",
      ".ccccccwwccccccwwcccccc.",
      ".CCCCCCCCCCCCCCCCCCCCCC.",
      "..gggggggggggggggggggg..",
      "..wwwwwwwwwwwwwwwwwwww..",
      "...wwwwwwwwwwwwwwwwww...",
      "........................",
      "........................",
      "........................"
    ]
  },

  /* ---------- TRANG TRÍ ---------- */
  cloud: {
    map: { w:'#ffffff', s:'#dff2fb' },
    rows: [
      "......wwww......",
      "...wwwwwwwww....",
      "..wwwwwwwwwwww..",
      ".wwwwwwwwwwwwww.",
      "wwwwwwwwwwwwwwww",
      "wsswwwwwwwwsswww",
      ".ssssssssssssss."
    ]
  },

  tree: {
    map: { g:'#4f9d4a', G:'#3c7d38', t:'#8a5a3b', T:'#6e4529' },
    rows: [
      ".......gggg.........",
      ".....gggggggg.......",
      "....gggggggggg......",
      "...gggGgggggGgg.....",
      "..gggggggggggggg....",
      "..gGgggggggggggG....",
      ".gggggGgggggGgggg...",
      ".gggggggggggggggg...",
      ".gGggggggggggggGg...",
      "..gggggGggggGgggg...",
      "..ggggggggggggggg...",
      "...ggGgggggggGgg....",
      "....gggggggggg......",
      ".....gggggggg.......",
      ".......gggg.........",
      ".......tttt.........",
      ".......tttt.........",
      ".......tttt.........",
      ".......tttt.........",
      "......TtttT........."
    ]
  },

  bush: {
    map: { g:'#5ab356', G:'#3c7d38' },
    rows: [
      "....gggg.......",
      "..gggggggg.....",
      ".gggGgggggg....",
      "ggggggggggggg..",
      "gGgggggGgggGg.."
    ]
  },

  dflower: {
    map: { f:'#ffd76e', w:'#fff', g:'#4f9d4a' },
    rows: [
      ".f.f.",
      "ffwff",
      ".f.f.",
      "..g..",
      "..g.."
    ]
  },

  dflower2: {
    map: { f:'#ff8fb3', w:'#fff', g:'#4f9d4a' },
    rows: [
      ".f.f.",
      "ffwff",
      ".f.f.",
      "..g..",
      "..g.."
    ]
  },

  grass: {
    map: { g:'#67c455' },
    rows: [
      "g...g",
      "g.g.g",
      "gg.gg",
      "ggggg"
    ]
  },

  /* ---------- MŨI TÊN DẪN ĐƯỜNG ---------- */
  arrowR: {
    map: { k:'#2b2233', y:'#ffd76e' },
    rows: [
      ".kk.....",
      ".kyk....",
      ".kyyk...",
      ".kyyyk..",
      "kyyyyyk.",
      ".kyyyk..",
      ".kyyk...",
      ".kyk....",
      ".kk....."
    ]
  },

  arrowL: {
    map: { k:'#2b2233', y:'#ffd76e' },
    rows: [
      ".....kk.",
      "....kyk.",
      "...kyyk.",
      "..kyyyk.",
      "kyyyyyk.",
      "..kyyyk.",
      "...kyyk.",
      "....kyk.",
      ".....kk."
    ]
  }
};

/* Vẽ sprite ra canvas tại (x,y) — có hỗ trợ lật ngang */
function drawSprite(ctx, spr, x, y, flip) {
  const rows = spr.rows, map = spr.map;
  const w = rows[0].length;
  for (let ry = 0; ry < rows.length; ry++) {
    const row = rows[ry];
    for (let rx = 0; rx < row.length; rx++) {
      const ch = row[rx];
      if (ch === '.' || ch === ' ') continue;
      const color = map[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(x + (flip ? (w - 1 - rx) : rx), y + ry, 1, 1);
    }
  }
}

/* Vẽ sprite phóng to scale lần */
function drawSpriteScaled(ctx, spr, x, y, scale, flip) {
  const rows = spr.rows, map = spr.map;
  const w = rows[0].length;
  for (let ry = 0; ry < rows.length; ry++) {
    const row = rows[ry];
    for (let rx = 0; rx < row.length; rx++) {
      const ch = row[rx];
      if (ch === '.' || ch === ' ') continue;
      const color = map[ch];
      if (!color) continue;
      ctx.fillStyle = color;
      const dx = (flip ? (w - 1 - rx) : rx) * scale;
      ctx.fillRect(x + dx, y + ry * scale, scale, scale);
    }
  }
}
