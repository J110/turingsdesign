/* ============================================================
   TURINGS DESIGN — metaphor silhouette library
   Each figure: { bw, bh, f(ctx) fill layer, a(ctx) accent layer }
   Drawn white on an offscreen canvas; the play engine samples
   opaque pixels into particle targets (tone 0 = fill, 1 = accent).
   Keep every figure readable as a silhouette without text.
   ============================================================ */
(function () {
  'use strict';
  function rr(g, a, b, w, h, r) {
    g.beginPath(); g.moveTo(a + r, b);
    g.arcTo(a + w, b, a + w, b + h, r); g.arcTo(a + w, b + h, a, b + h, r);
    g.arcTo(a, b + h, a, b, r); g.arcTo(a, b, a + w, b, r); g.closePath();
  }
  function disc(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); }
  function ring(g, x, y, r, lw) { g.lineWidth = lw; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.stroke(); }
  function poly(g, pts) { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); g.fill(); }
  function W() { } // noop

  var F = {};

  /* ---- universal hero set --------------------------------- */
  F.figure = { bw: 160, bh: 200,
    f: function (g) { g.strokeStyle = '#fff'; g.lineCap = 'round'; g.lineJoin = 'round'; g.lineWidth = 23; g.beginPath(); g.moveTo(96, 54); g.lineTo(70, 116); g.stroke(); g.lineWidth = 15; g.beginPath(); g.moveTo(94, 58); g.lineTo(122, 42); g.lineTo(146, 26); g.stroke(); g.beginPath(); g.moveTo(94, 58); g.lineTo(76, 82); g.lineTo(58, 96); g.stroke(); g.beginPath(); g.moveTo(70, 114); g.lineTo(98, 132); g.lineTo(122, 120); g.stroke(); g.beginPath(); g.moveTo(70, 114); g.lineTo(52, 146); g.lineTo(34, 176); g.stroke(); g.fillStyle = '#fff'; disc(g, 104, 34, 17); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(40, 172); g.bezierCurveTo(20, 110, 70, 40, 144, 28); g.stroke(); g.fillStyle = '#fff';[[96, 56], [70, 114], [98, 132], [76, 82], [52, 146]].forEach(function (p) { disc(g, p[0], p[1], 4); }); } };

  F.gamepad = { bw: 240, bh: 150,
    f: function (g) { g.fillStyle = '#fff'; rr(g, 40, 52, 160, 56, 26); g.fill(); g.beginPath(); g.ellipse(64, 104, 30, 32, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(176, 104, 30, 32, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(84, 50, 26, 15, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(156, 50, 26, 15, 0, 0, 7); g.fill(); rr(g, 92, 58, 56, 42, 16); g.fill(); },
    a: function (g) { g.fillStyle = '#fff'; rr(g, 74, 66, 10, 26, 2); g.fill(); rr(g, 67, 73, 24, 10, 2); g.fill();[[170, 64], [170, 94], [156, 79], [184, 79]].forEach(function (p) { disc(g, p[0], p[1], 5); }); g.strokeStyle = '#fff'; ring(g, 104, 98, 9, 3); ring(g, 140, 98, 9, 3); disc(g, 112, 68, 3); disc(g, 132, 68, 3); } };

  F.die = { bw: 170, bh: 164,
    f: function (g) { g.fillStyle = '#fff'; var T0 = [85, 28], T1 = [133, 56], T2 = [85, 84], T3 = [37, 56], B1 = [133, 108], B2 = [85, 136], B3 = [37, 108]; poly(g, [T0, T1, T2, T3]); poly(g, [T3, T2, B2, B3]); poly(g, [T2, T1, B1, B2]); },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 2.6; var T0 = [85, 28], T1 = [133, 56], T2 = [85, 84], T3 = [37, 56], B2 = [85, 136]; g.beginPath(); g.moveTo(T0[0], T0[1]); g.lineTo(T2[0], T2[1]); g.lineTo(T1[0], T1[1]); g.moveTo(T2[0], T2[1]); g.lineTo(T3[0], T3[1]); g.moveTo(T2[0], T2[1]); g.lineTo(B2[0], B2[1]); g.stroke(); function pip(o, e1, e2, a, b) { disc(g, o[0] + a * e1[0] + b * e2[0], o[1] + a * e1[1] + b * e2[1], 4.3); } var e1 = [T1[0] - T0[0], T1[1] - T0[1]], e2 = [T3[0] - T0[0], T3[1] - T0[1]]; pip(T0, e1, e2, .36, .36); pip(T0, e1, e2, .64, .64); var lu = [T2[0] - T3[0], T2[1] - T3[1]], lv = [0, 52]; pip(T3, lu, lv, .26, .24); pip(T3, lu, lv, .5, .5); pip(T3, lu, lv, .74, .76); var ru = [T1[0] - T2[0], T1[1] - T2[1]], rv = [0, 52]; pip(T2, ru, rv, .3, .28); pip(T2, ru, rv, .7, .28); pip(T2, ru, rv, .3, .72); pip(T2, ru, rv, .7, .72); } };

  F.knight = { bw: 180, bh: 220,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(28, 206); g.lineTo(152, 206); g.lineTo(150, 192); g.lineTo(128, 184); g.bezierCurveTo(156, 156, 160, 120, 140, 94); g.bezierCurveTo(133, 82, 142, 70, 152, 58); g.lineTo(138, 52); g.lineTo(148, 28); g.lineTo(124, 40); g.bezierCurveTo(116, 28, 100, 24, 88, 30); g.bezierCurveTo(68, 38, 52, 48, 38, 60); g.bezierCurveTo(24, 70, 16, 82, 20, 92); g.lineTo(33, 93); g.bezierCurveTo(39, 99, 45, 97, 51, 92); g.lineTo(59, 97); g.bezierCurveTo(66, 110, 72, 120, 80, 130); g.bezierCurveTo(89, 143, 86, 159, 82, 172); g.lineTo(74, 182); g.lineTo(52, 190); g.lineTo(28, 192); g.closePath(); g.fill(); rr(g, 54, 176, 74, 9, 3); g.fill(); rr(g, 46, 186, 90, 8, 3); g.fill(); },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 2.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(120, 96); g.lineTo(132, 86); g.moveTo(128, 78); g.lineTo(140, 70); g.moveTo(132, 62); g.lineTo(144, 56); g.stroke(); disc(g, 58, 66, 3.2); g.beginPath(); g.moveTo(24, 86); g.lineTo(40, 84); g.stroke(); } };

  F.brain = { bw: 190, bh: 150,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(96, 74, 72, 52, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(150, 96, 26, 24, 0, 0, 7); g.fill(); rr(g, 86, 116, 20, 26, 8); g.fill(); g.beginPath(); g.ellipse(70, 40, 28, 21, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(120, 40, 28, 21, 0, 0, 7); g.fill(); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(96, 26); g.lineTo(96, 112); g.stroke(); var i, y, xx; for (i = 0; i < 3; i++) { var x0 = 58 + i * 26; g.beginPath(); for (y = 38; y <= 106; y += 4) { xx = x0 + Math.sin(y * .18 + i) * 7; y === 38 ? g.moveTo(xx, y) : g.lineTo(xx, y); } g.stroke(); } for (i = 0; i < 2; i++) { var x1 = 124 + i * 18; g.beginPath(); for (y = 44; y <= 100; y += 4) { xx = x1 + Math.sin(y * .2 + i) * 6; y === 44 ? g.moveTo(xx, y) : g.lineTo(xx, y); } g.stroke(); } } };

  F.heart = { bw: 180, bh: 158,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(90, 150); g.bezierCurveTo(18, 104, 22, 46, 64, 38); g.bezierCurveTo(80, 34, 90, 50, 90, 60); g.bezierCurveTo(90, 50, 100, 34, 116, 38); g.bezierCurveTo(158, 46, 162, 104, 90, 150); g.closePath(); g.fill(); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 4; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(28, 92); g.lineTo(64, 92); g.lineTo(74, 92); g.lineTo(82, 70); g.lineTo(92, 120); g.lineTo(103, 84); g.lineTo(112, 92); g.lineTo(152, 92); g.stroke(); } };

  /* ---- 01 · three ways to work ---------------------------- */
  F.layerstack = { bw: 200, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; rr(g, 58, 36, 84, 150, 14); g.fill(); },
    a: function (g) { g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.lineWidth = 2.4; rr(g, 96, 18, 78, 30, 8); g.stroke(); rr(g, 104, 30, 78, 30, 8); g.stroke(); rr(g, 112, 42, 78, 30, 8); g.fill(); g.fillStyle = '#0c0a24'; disc(g, 151, 57, 6); g.fillStyle = '#fff'; rr(g, 70, 60, 60, 8, 3); g.fill(); rr(g, 70, 78, 44, 8, 3); g.fill(); disc(g, 100, 150, 12); } };

  F.phonebuild = { bw: 200, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; rr(g, 60, 28, 36, 64, 9); g.fill(); rr(g, 104, 28, 36, 64, 9); g.fill(); rr(g, 60, 108, 36, 64, 9); g.fill(); rr(g, 104, 108, 36, 64, 9); g.fill(); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 3; ring(g, 100, 100, 22, 3); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(100, 100); for (var i = 0; i <= 5; i++) { var an = -1.57 + i / 5 * 4.0; g.lineTo(100 + Math.cos(an) * 22, 100 + Math.sin(an) * 22); } g.closePath(); g.globalAlpha = .5; g.fill(); g.globalAlpha = 1; } };

  F.bridge = { bw: 220, bh: 170,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(20, 120); g.lineTo(78, 100); g.lineTo(78, 140); g.lineTo(20, 158); g.closePath(); g.fill(); rr(g, 142, 44, 60, 92, 8); g.fill(); },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(84, 96); g.bezierCurveTo(110, 70, 124, 70, 138, 78); g.stroke(); poly(g, [[134, 70], [146, 76], [134, 84]]); g.lineWidth = 2.4; g.strokeStyle = '#0c0a24'; rr(g, 150, 56, 44, 64, 5); g.stroke(); } };

  /* ---- 02 · what makes us different ----------------------- */
  F.neural = { bw: 200, bh: 180,
    f: function (g) { g.fillStyle = '#fff'; var n = [[40, 40], [40, 140], [100, 70], [100, 150], [100, 30], [160, 60], [160, 120]]; n.forEach(function (p) { disc(g, p[0], p[1], 9); }); F._neural = n; },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 1.6; var n = F._neural || [[40, 40], [40, 140], [100, 70], [100, 150], [100, 30], [160, 60], [160, 120]]; var e = [[0, 2], [0, 4], [1, 2], [1, 3], [2, 5], [2, 6], [3, 6], [4, 5]]; e.forEach(function (q) { g.beginPath(); g.moveTo(n[q[0]][0], n[q[0]][1]); g.lineTo(n[q[1]][0], n[q[1]][1]); g.stroke(); }); g.fillStyle = '#0c0a24'; n.forEach(function (p) { disc(g, p[0], p[1], 3.4); }); } };

  F.loop = { bw: 200, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; var c = [100, 100], R = 66;[-1.57, 0, 1.57, 3.1416].forEach(function (an) { disc(g, c[0] + Math.cos(an) * R, c[1] + Math.sin(an) * R, 13); }); },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; var c = [100, 100], R = 66; for (var k = 0; k < 4; k++) { var a0 = -1.57 + k * 1.5708 + .42, a1 = -1.57 + (k + 1) * 1.5708 - .42; g.beginPath(); g.arc(c[0], c[1], R, a0, a1); g.stroke(); var ex = c[0] + Math.cos(a1) * R, ey = c[1] + Math.sin(a1) * R, ta = a1 + 1.57; g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex + Math.cos(ta - .5) * 9, ey + Math.sin(ta - .5) * 9); g.lineTo(ex + Math.cos(ta + .5) * 9, ey + Math.sin(ta + .5) * 9); g.closePath(); g.fill(); } } };

  F.eye = { bw: 220, bh: 140,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(20, 70); g.quadraticCurveTo(110, 8, 200, 70); g.quadraticCurveTo(110, 132, 20, 70); g.closePath(); g.fill(); g.fillStyle = '#0c0a24'; disc(g, 110, 70, 30); g.fillStyle = '#fff'; disc(g, 110, 70, 22); },
    a: function (g) { g.fillStyle = '#0c0a24'; disc(g, 110, 70, 12); g.fillStyle = '#fff'; disc(g, 118, 62, 4); } };

  /* ---- 03 · strategies ------------------------------------ */
  F.compass = { bw: 180, bh: 180,
    f: function (g) { g.strokeStyle = '#fff'; ring(g, 90, 90, 70, 6); },
    a: function (g) { g.fillStyle = '#fff'; poly(g, [[90, 30], [104, 90], [90, 80], [76, 90]]); poly(g, [[90, 150], [76, 90], [90, 100], [104, 90]]); g.fillStyle = '#0c0a24'; disc(g, 90, 90, 6); g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath();[0, 1.57, 3.14, 4.71].forEach(function (a) { g.moveTo(90 + Math.cos(a) * 62, 90 + Math.sin(a) * 62); g.lineTo(90 + Math.cos(a) * 70, 90 + Math.sin(a) * 70); }); g.stroke(); } };

  F.book = { bw: 220, bh: 160,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(110, 36); g.bezierCurveTo(80, 22, 40, 24, 22, 36); g.lineTo(22, 128); g.bezierCurveTo(40, 116, 80, 114, 110, 128); g.closePath(); g.fill(); g.beginPath(); g.moveTo(110, 36); g.bezierCurveTo(140, 22, 180, 24, 198, 36); g.lineTo(198, 128); g.bezierCurveTo(180, 116, 140, 114, 110, 128); g.closePath(); g.fill(); },
    a: function (g) { g.strokeStyle = '#0c0a24'; g.lineWidth = 2.4; g.lineCap = 'round'; for (var i = 0; i < 4; i++) { var y = 52 + i * 16; g.beginPath(); g.moveTo(36, y); g.lineTo(96, y - 4); g.moveTo(124, y - 4); g.lineTo(184, y); g.stroke(); } g.fillStyle = '#fff'; disc(g, 110, 40, 7); } };

  F.curve = { bw: 220, bh: 160,
    f: function (g) { g.fillStyle = '#fff'; g.globalAlpha = .42; g.beginPath(); g.moveTo(24, 140); g.bezierCurveTo(70, 130, 110, 96, 150, 64); g.bezierCurveTo(176, 42, 192, 28, 200, 22); g.lineTo(200, 140); g.closePath(); g.fill(); g.globalAlpha = 1; },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(24, 140); g.bezierCurveTo(70, 130, 110, 96, 150, 64); g.bezierCurveTo(176, 42, 192, 28, 200, 22); g.stroke(); g.fillStyle = '#fff'; disc(g, 200, 22, 6); g.lineWidth = 3; g.beginPath(); g.moveTo(176, 18); g.lineTo(176, 34); g.moveTo(168, 26); g.lineTo(184, 26); g.stroke(); } };

  F.wave = { bw: 220, bh: 160,
    f: function (g) { g.fillStyle = '#fff'; var hl = [20, 42, 64, 44, 26]; for (var i = 0; i < hl.length; i++) { var x = 18 + i * 15; rr(g, x, 80 - hl[i] / 2, 9, hl[i], 4); g.fill(); } var hr = [26, 46, 62, 40, 22]; for (var j = 0; j < hr.length; j++) { var rx = 128 + j * 15; rr(g, rx, 80 - hr[j] / 2, 9, hr[j], 4); g.fill(); } },
    a: function (g) { g.fillStyle = '#fff'; var cx = 110, cy = 80, R = 17, r = 7; g.beginPath(); for (var k = 0; k < 10; k++) { var a = k * Math.PI / 5 - Math.PI / 2, rad = k % 2 ? r : R; k ? g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad) : g.moveTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } g.closePath(); g.fill(); } };

  F.crescent = { bw: 180, bh: 180,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.arc(86, 90, 60, 0, 6.2832); g.arc(112, 78, 54, 0, 6.2832, true); g.fill(); },
    a: function (g) { g.fillStyle = '#fff'; [[136, 44, 4], [150, 74, 3], [128, 110, 3]].forEach(function (s) { var x = s[0], y = s[1], r = s[2]; g.beginPath(); g.moveTo(x, y - r * 2); g.lineTo(x + r, y); g.lineTo(x, y + r * 2); g.lineTo(x - r, y); g.closePath(); g.fill(); }); } };

  F.footprint = { bw: 180, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; function foot(cx, cy) { g.beginPath(); g.ellipse(cx, cy, 18, 30, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(cx + 2, cy - 36, 12, 14, 0, 0, 7); g.fill(); } foot(64, 130); foot(118, 80); },
    a: function (g) { g.fillStyle = '#fff';[[88, 150], [100, 120], [112, 92]].forEach(function (p, i) { g.globalAlpha = .4 + i * .2; disc(g, p[0], p[1], 4); }); g.globalAlpha = 1; } };

  /* ---- 04 · process --------------------------------------- */
  F.lever = { bw: 220, bh: 160,
    f: function (g) { g.fillStyle = '#fff'; g.save(); g.translate(110, 96); g.rotate(-.18); rr(g, -90, -7, 180, 14, 6); g.fill(); g.restore(); poly(g, [[100, 100], [120, 100], [110, 132]]); rr(g, 28, 50, 34, 30, 5); g.fill(); },
    a: function (g) { g.fillStyle = '#fff'; disc(g, 110, 96, 5); g.strokeStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(176, 50); g.lineTo(176, 30); g.moveTo(168, 38); g.lineTo(176, 30); g.lineTo(184, 38); g.stroke(); } };

  F.bolt = { bw: 150, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; poly(g, [[92, 16], [38, 110], [74, 110], [58, 184], [120, 80, ], [84, 80]]); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 2.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(112, 30); g.lineTo(126, 24); g.moveTo(116, 50); g.lineTo(132, 46); g.stroke(); } };

  F.target = { bw: 180, bh: 180,
    f: function (g) { g.strokeStyle = '#fff'; ring(g, 90, 90, 70, 6); ring(g, 90, 90, 46, 6); ring(g, 90, 90, 22, 6); },
    a: function (g) { g.fillStyle = '#fff'; disc(g, 90, 90, 7); g.strokeStyle = '#fff'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(150, 30); g.lineTo(96, 84); g.stroke(); poly(g, [[88, 78], [98, 88], [78, 92]]); } };

  /* ---- 05 · the lab --------------------------------------- */
  F.dvmoon = { bw: 220, bh: 190,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.arc(168, 56, 40, 0, 6.2832); g.arc(150, 46, 34, 0, 6.2832, true); g.fill(); poly(g, [[34, 150], [108, 136], [108, 178], [34, 168]]); poly(g, [[112, 136], [186, 150], [186, 168], [112, 178]]); },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 2.4; g.lineCap = 'round'; for (var i = 0; i < 3; i++) { var y = 146 + i * 9; g.beginPath(); g.moveTo(46, y); g.lineTo(98, y - 4); g.moveTo(122, y - 4); g.lineTo(174, y); g.stroke(); } g.lineWidth = 2.6; g.beginPath(); g.moveTo(110, 134); g.lineTo(110, 180); g.stroke(); var sx = 64, sy = 60, r = 5; g.beginPath(); g.moveTo(sx, sy - r * 2); g.lineTo(sx + r, sy); g.lineTo(sx, sy + r * 2); g.lineTo(sx - r, sy); g.closePath(); g.fill(); } };

  F.mic = { bw: 160, bh: 210,
    f: function (g) { g.fillStyle = '#fff'; rr(g, 58, 22, 44, 90, 22); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 6; g.beginPath(); g.arc(80, 96, 36, 0, 3.1416); g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(80, 132); g.lineTo(80, 168); g.stroke(); rr(g, 54, 168, 52, 10, 4); g.fill(); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.lineCap = 'round'; for (var i = 0; i < 3; i++) { var x = 116 + i * 12, h = 14 + i * 10; g.beginPath(); g.moveTo(x, 60 - h / 2); g.lineTo(x, 60 + h / 2); g.stroke(); } g.fillStyle = '#0c0a24'; for (var j = 0; j < 3; j++) { g.fillRect(66, 40 + j * 14, 28, 4); } } };

  F.bubbles = { bw: 220, bh: 180,
    f: function (g) { g.fillStyle = '#fff'; rr(g, 22, 26, 116, 72, 18); g.fill(); poly(g, [[48, 98], [48, 128], [80, 98]]); rr(g, 112, 92, 90, 56, 16); g.fill(); poly(g, [[172, 148], [172, 170], [148, 148]]); },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 3.4; g.lineCap = 'round'; var hs = [14, 26, 40, 22, 32, 16]; for (var i = 0; i < hs.length; i++) { var x = 42 + i * 16; g.beginPath(); g.moveTo(x, 62 - hs[i] / 2); g.lineTo(x, 62 + hs[i] / 2); g.stroke(); } for (var k = 0; k < 3; k++) disc(g, 134 + k * 18, 120, 4.5); } };

  F.suit = { bw: 200, bh: 210,
    f: function (g) { g.fillStyle = '#fff'; poly(g, [[38, 50], [100, 86], [70, 202], [30, 202]]); poly(g, [[162, 50], [100, 86], [130, 202], [170, 202]]); poly(g, [[80, 48], [120, 48], [100, 74]]); },
    a: function (g) { g.fillStyle = '#fff'; poly(g, [[100, 82], [110, 106], [100, 168], [90, 106]]); disc(g, 100, 122, 4.5); disc(g, 100, 146, 4.5); } };

  F.mat = { bw: 220, bh: 170,
    f: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 4; g.lineJoin = 'round'; g.beginPath(); g.moveTo(44, 52); g.lineTo(176, 52); g.lineTo(206, 150); g.lineTo(14, 150); g.closePath(); g.stroke(); g.fillStyle = '#fff'; function foot(cx, cy, s) { g.save(); g.translate(cx, cy); g.scale(s, s); g.beginPath(); g.ellipse(0, 0, 10, 17, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(1, -21, 6.5, 8, 0, 0, 7); g.fill(); g.restore(); } foot(84, 112, 1); foot(124, 96, .9); },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 3.2; g.lineCap = 'round'; g.beginPath(); g.moveTo(150, 98); g.lineTo(186, 82); g.stroke(); poly(g, [[178, 76], [192, 82], [180, 92]]); } };

  /* ---- 07 · recognition ----------------------------------- */
  F.shield = { bw: 160, bh: 190,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(80, 16); g.lineTo(142, 40); g.lineTo(142, 104); g.bezierCurveTo(142, 150, 110, 168, 80, 180); g.bezierCurveTo(50, 168, 18, 150, 18, 104); g.lineTo(18, 40); g.closePath(); g.fill(); },
    a: function (g) { g.strokeStyle = '#0c0a24'; g.fillStyle = '#0c0a24'; g.lineWidth = 4; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(52, 96); g.lineTo(74, 120); g.lineTo(116, 70); g.stroke(); } };

  F.nvidia = { bw: 200, bh: 150,
    f: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.moveTo(40, 75); g.bezierCurveTo(70, 30, 140, 30, 168, 75); g.bezierCurveTo(140, 120, 70, 120, 40, 75); g.closePath(); g.fill(); g.fillStyle = '#0c0a24'; g.beginPath(); g.arc(104, 75, 30, 0, 6.2832); g.fill(); },
    a: function (g) { g.fillStyle = '#fff'; g.beginPath(); g.arc(104, 75, 22, 0.6, 5.0); g.arc(104, 75, 10, 5.0, 0.6, true); g.fill(); } };

  /* ---- 09 · collaborate ----------------------------------- */
  F.handshake = { bw: 220, bh: 160,
    f: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(16, 40); g.bezierCurveTo(70, 60, 90, 80, 108, 80); g.stroke(); g.beginPath(); g.moveTo(204, 40); g.bezierCurveTo(150, 60, 130, 80, 112, 80); g.stroke(); g.beginPath(); g.moveTo(20, 130); g.bezierCurveTo(70, 110, 92, 92, 108, 88); g.stroke(); g.beginPath(); g.moveTo(200, 130); g.bezierCurveTo(150, 110, 128, 92, 112, 88); g.stroke(); },
    a: function (g) { g.fillStyle = '#fff'; disc(g, 110, 84, 16); g.fillStyle = '#0c0a24'; disc(g, 110, 84, 7); } };

  /* ---- design language · founder · qrackpot --------------- */
  F.merge = { bw: 200, bh: 180,
    f: function (g) { g.fillStyle = '#fff'; g.globalAlpha = .62;[[-26, -16], [26, -16], [0, 22]].forEach(function (o) { rr(g, 60 + o[0], 46 + o[1], 80, 80, 18); g.fill(); }); g.globalAlpha = 1; },
    a: function (g) { g.strokeStyle = '#fff'; ring(g, 100, 92, 22, 3); g.fillStyle = '#fff'; disc(g, 100, 92, 8); } };

  F.founder = { bw: 180, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; disc(g, 90, 62, 34); g.beginPath(); g.moveTo(28, 198); g.bezierCurveTo(32, 138, 58, 110, 90, 110); g.bezierCurveTo(122, 110, 148, 138, 152, 198); g.closePath(); g.fill(); },
    a: null };

  F.qrackpot = { bw: 200, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; rr(g, 78, 18, 44, 62, 22); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.arc(100, 82, 30, 0, 3.1416); g.stroke(); g.beginPath(); g.moveTo(100, 112); g.lineTo(100, 150); g.stroke(); rr(g, 74, 150, 52, 10, 4); g.fill(); disc(g, 44, 152, 17); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 2.6; g.lineCap = 'round'; for (var i = 0; i < 3; i++) { var y = 34 + i * 14; g.beginPath(); g.moveTo(85, y); g.lineTo(115, y); g.stroke(); } g.lineWidth = 2; g.beginPath(); g.arc(44, 152, 12, -0.9, 0.9); g.stroke(); g.lineWidth = 3; for (var k = 0; k < 3; k++) { g.beginPath(); g.arc(132, 46, 12 + k * 12, -0.7, 0.7); g.stroke(); } } };

  F.mentor = { bw: 200, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; disc(g, 104, 80, 30); g.beginPath(); g.moveTo(66, 150); g.bezierCurveTo(66, 120, 86, 106, 104, 106); g.bezierCurveTo(122, 106, 142, 120, 142, 150); g.closePath(); g.fill(); },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineCap = 'round'; g.lineWidth = 3; for (var i = 0; i < 3; i++) { var y = 66 + i * 18; g.beginPath(); g.moveTo(12, y); g.lineTo(40, y); g.stroke(); } g.lineWidth = 3.4; g.beginPath(); g.moveTo(150, 80); g.lineTo(184, 80); g.stroke(); poly(g, [[178, 72], [192, 80], [178, 88]]); } };

  F.aicore = { bw: 200, bh: 200,
    f: function (g) { g.fillStyle = '#fff'; disc(g, 100, 100, 18); disc(g, 168, 100, 7); disc(g, 32, 100, 6); disc(g, 130, 46, 6); disc(g, 70, 154, 6); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 2.6; g.beginPath(); g.ellipse(100, 100, 70, 28, 0, 0, 6.2832); g.stroke(); g.beginPath(); g.ellipse(100, 100, 70, 28, Math.PI / 3, 0, 6.2832); g.stroke(); g.beginPath(); g.ellipse(100, 100, 70, 28, -Math.PI / 3, 0, 6.2832); g.stroke(); } };

  F.reach = { bw: 210, bh: 210,
    f: function (g) { g.fillStyle = '#fff'; disc(g, 105, 105, 15); var R = 76; for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 - Math.PI / 2; disc(g, 105 + Math.cos(a) * R, 105 + Math.sin(a) * R, 9); } },
    a: function (g) { g.strokeStyle = '#fff'; g.fillStyle = '#fff'; g.lineWidth = 2.2; var R = 76; for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 - Math.PI / 2, sx = 105 + Math.cos(a) * 20, sy = 105 + Math.sin(a) * 20, ex = 105 + Math.cos(a) * (R - 13), ey = 105 + Math.sin(a) * (R - 13); g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.stroke(); g.beginPath(); g.moveTo(ex + Math.cos(a) * 7, ey + Math.sin(a) * 7); g.lineTo(ex + Math.cos(a - 1.9) * 6, ey + Math.sin(a - 1.9) * 6); g.lineTo(ex + Math.cos(a + 1.9) * 6, ey + Math.sin(a + 1.9) * 6); g.closePath(); g.fill(); } } };

  F.genesis = { bw: 200, bh: 180,
    f: function (g) { g.fillStyle = '#fff'; rr(g, 84, 86, 32, 10, 4); g.fill(); rr(g, 68, 74, 16, 34, 4); g.fill(); rr(g, 54, 80, 11, 22, 3); g.fill(); rr(g, 116, 74, 16, 34, 4); g.fill(); rr(g, 135, 80, 11, 22, 3); g.fill(); },
    a: function (g) { g.strokeStyle = '#fff'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.arc(100, 91, 54, -2.5, 0.7); g.stroke(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(100, 22); g.lineTo(112, 40); g.lineTo(100, 34); g.lineTo(88, 40); g.closePath(); g.fill(); } };

  window.TuringsFigures = F;

  /* ---- palettes (cool flow tints → warm coalesced) -------- */
  window.TuringsPalettes = {
    indigo: { tints: [[96, 106, 214], [126, 92, 212], [78, 132, 198], [150, 104, 186], [92, 124, 206], [110, 98, 216]], warmLo: [150, 150, 150], warmHi: [236, 206, 150], accent: [252, 205, 120] },
    dream:  { tints: [[120, 110, 230], [150, 120, 210], [90, 110, 220]], warmLo: [180, 150, 120], warmHi: [247, 227, 168], accent: [245, 200, 118] },
    field:  { tints: [[150, 140, 90], [170, 150, 100], [130, 150, 110]], warmLo: [200, 180, 120], warmHi: [240, 225, 170], accent: [216, 161, 74] },
    voice:  { tints: [[96, 140, 200], [110, 120, 210], [80, 150, 190]], warmLo: [150, 180, 200], warmHi: [200, 225, 245], accent: [90, 200, 230] },
    gold:   { tints: [[160, 130, 80], [180, 150, 90], [150, 120, 70]], warmLo: [210, 180, 120], warmHi: [245, 220, 150], accent: [230, 190, 110] },
    earth:  { tints: [[150, 120, 90], [130, 130, 100], [160, 130, 95]], warmLo: [195, 170, 130], warmHi: [235, 215, 175], accent: [200, 150, 90] },
    vital:  { tints: [[210, 110, 90], [180, 120, 110], [200, 130, 90]], warmLo: [230, 170, 140], warmHi: [250, 215, 175], accent: [255, 140, 90] },
    neon:   { tints: [[140, 107, 255], [22, 224, 176], [255, 138, 179], [140, 107, 255], [22, 224, 176], [255, 138, 179]], warmLo: [200, 200, 240], warmHi: [230, 235, 255], accent: [22, 224, 176] }
  };
})();
