/* ============================================================
   HERO CANVAS — Agentic AI Light Dot Animation
   A glowing dot moves quickly, leaving a trail, and "builds"
   complex structures: app layouts, gamification systems,
   behavioral change diagrams, and themed icons.
   ============================================================ */
(function () {
  'use strict';

  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var cW, cH, dpr;

  function resize() {
    var hero = document.getElementById('hero');
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cW = hero.offsetWidth;
    cH = hero.offsetHeight;
    canvas.width = cW * dpr;
    canvas.height = cH * dpr;
    canvas.style.width = cW + 'px';
    canvas.style.height = cH + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  var C = [
    [124, 92, 255],
    [0, 212, 170],
    [255, 107, 157],
  ];

  // Rounded rect helper
  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y);
    c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }

  // ── Structure Drawers ───────────────────────────────────
  var structures = [

    // 0 — iPhone App Layout
    function (c, s) {
      var w = s * .55, h = s * .9;
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      rr(c, -w, -h, w * 2, h * 2, s * .08); c.stroke();
      // Notch
      rr(c, -s * .15, -h, s * .3, s * .06, s * .03); c.fill();
      // Status bar icons
      c.beginPath(); c.arc(-w * .6, -h + s * .1, s * .02, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(-w * .45, -h + s * .1, s * .02, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(-w * .3, -h + s * .1, s * .02, 0, Math.PI * 2); c.fill();
      // Header
      c.fillRect(-w * .85, -h + s * .16, w * 1.7, s * .01);
      // Content cards
      var cy = -h + s * .24;
      for (var i = 0; i < 3; i++) {
        rr(c, -w * .8, cy, w * 1.6, s * .2, s * .03); c.stroke();
        c.beginPath(); c.arc(-w * .55, cy + s * .1, s * .04, 0, Math.PI * 2); c.fill();
        c.fillRect(-w * .35, cy + s * .04, w * .9, s * .015);
        c.fillRect(-w * .35, cy + s * .08, w * .6, s * .015);
        c.fillRect(-w * .35, cy + s * .12, w * .45, s * .015);
        cy += s * .24;
      }
      // Tab bar
      c.fillRect(-w, h - s * .12, w * 2, s * .01);
      for (var t = 0; t < 4; t++) {
        c.beginPath(); c.arc(-w * .65 + t * w * .44, h - s * .06, s * .025, 0, Math.PI * 2); c.fill();
      }
    },

    // 1 — Leaderboard with Podium
    function (c, s) {
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      var bw = s * .28, gap = s * .06;
      var heights = [s * .4, s * .6, s * .28];
      var xs = [-bw - gap, 0, bw + gap];
      var baseY = s * .45;
      for (var i = 0; i < 3; i++) {
        rr(c, xs[i] - bw / 2, baseY - heights[i], bw, heights[i], s * .02); c.stroke();
        c.font = 'bold ' + (s * .1) + 'px sans-serif';
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText(i === 0 ? '2' : i === 1 ? '1' : '3', xs[i], baseY - heights[i] / 2);
      }
      // Crown on #1
      var cw = s * .12, ch = s * .08, crY = baseY - heights[1] - s * .04;
      c.beginPath(); c.moveTo(-cw, crY); c.lineTo(-cw, crY - ch * .4);
      c.lineTo(-cw * .5, crY); c.lineTo(0, crY - ch);
      c.lineTo(cw * .5, crY); c.lineTo(cw, crY - ch * .4);
      c.lineTo(cw, crY); c.closePath(); c.fill();
      // Avatars
      for (var j = 0; j < 3; j++) {
        var ay = baseY - heights[j] - s * .14;
        c.beginPath(); c.arc(xs[j], ay, s * .06, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.arc(xs[j], ay - s * .015, s * .025, 0, Math.PI * 2); c.fill();
      }
      c.beginPath(); c.moveTo(-s * .5, baseY); c.lineTo(s * .5, baseY); c.stroke();
    },

    // 2 — XP Progress System
    function (c, s) {
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      // Level badge hex
      var hx = -s * .35, hy = -s * .5, hr = s * .12;
      c.beginPath();
      for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 - Math.PI / 2; c[i ? 'lineTo' : 'moveTo'](hx + Math.cos(a) * hr, hy + Math.sin(a) * hr); }
      c.closePath(); c.stroke();
      c.font = 'bold ' + (s * .09) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('42', hx, hy);
      c.font = (s * .06) + 'px sans-serif'; c.fillText('LVL', hx, hy + hr + s * .06);
      // XP bar
      var bx = -s * .15, by = -s * .55, bw = s * .55, bh = s * .06;
      rr(c, bx, by, bw, bh, s * .03); c.stroke();
      rr(c, bx + 1, by + 1, bw * .72, bh - 2, s * .025); c.fill();
      c.font = (s * .04) + 'px sans-serif'; c.fillText('2,450 / 3,400 XP', bx + bw / 2, by + bh + s * .06);
      // Streak flame
      var fx = -s * .35, fy = -s * .12, fh = s * .12;
      c.beginPath(); c.moveTo(fx, fy - fh);
      c.bezierCurveTo(fx + fh * .5, fy - fh * .3, fx + fh * .4, fy + fh * .3, fx, fy + fh * .4);
      c.bezierCurveTo(fx - fh * .4, fy + fh * .3, fx - fh * .5, fy - fh * .3, fx, fy - fh); c.fill();
      c.font = 'bold ' + (s * .08) + 'px sans-serif'; c.fillText('7', fx, fy + s * .14);
      c.font = (s * .05) + 'px sans-serif'; c.fillText('day streak', fx, fy + s * .22);
      // Achievement stars
      var starY = s * .15;
      for (var j = 0; j < 4; j++) {
        var sx = -s * .3 + j * s * .2;
        c.beginPath();
        for (var k = 0; k < 5; k++) { var sa = k * 4 * Math.PI / 5 - Math.PI / 2, sr = s * .06; c[k ? 'lineTo' : 'moveTo'](sx + Math.cos(sa) * sr, starY + Math.sin(sa) * sr); }
        c.closePath(); j < 3 ? c.fill() : c.stroke();
      }
      c.font = (s * .05) + 'px sans-serif'; c.fillText('achievements', 0, starY + s * .14);
      // Divider + stats
      c.beginPath(); c.moveTo(-s * .45, s * .38); c.lineTo(s * .45, s * .38); c.stroke();
      c.font = 'bold ' + (s * .07) + 'px sans-serif';
      c.fillText('156', -s * .25, s * .52); c.fillText('24', s * .05, s * .52); c.fillText('8', s * .32, s * .52);
      c.font = (s * .04) + 'px sans-serif';
      c.fillText('points', -s * .25, s * .6); c.fillText('badges', s * .05, s * .6); c.fillText('quests', s * .32, s * .6);
    },

    // 3 — Habit Tracker Grid
    function (c, s) {
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round'; c.lineJoin = 'round';
      c.font = 'bold ' + (s * .08) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('Daily Habits', 0, -s * .7);
      var cellSz = s * .11, gapW = s * .02;
      var days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      var gridW = 7 * cellSz + 6 * gapW, startX = -gridW / 2;
      c.font = (s * .04) + 'px sans-serif';
      for (var d = 0; d < 7; d++) c.fillText(days[d], startX + d * (cellSz + gapW) + cellSz / 2, -s * .55);
      var pattern = [1,1,1,0,1,1,0, 1,0,1,1,1,0,1, 1,1,0,1,1,1,1, 1,1,1,1,0,0,0];
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 7; col++) {
          var cx = startX + col * (cellSz + gapW), cy = -s * .45 + row * (cellSz + gapW);
          rr(c, cx, cy, cellSz, cellSz, s * .015); c.stroke();
          if (pattern[row * 7 + col]) {
            c.beginPath(); c.moveTo(cx + cellSz * .2, cy + cellSz * .5);
            c.lineTo(cx + cellSz * .4, cy + cellSz * .7); c.lineTo(cx + cellSz * .8, cy + cellSz * .25); c.stroke();
          }
        }
      }
      // Completion ring
      var ringY = s * .35, ringR = s * .15;
      var origAlpha = c.globalAlpha;
      c.beginPath(); c.arc(0, ringY, ringR, 0, Math.PI * 2);
      c.globalAlpha = origAlpha * 0.3; c.stroke(); c.globalAlpha = origAlpha;
      c.lineWidth = 2.5;
      c.beginPath(); c.arc(0, ringY, ringR, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.54); c.stroke();
      c.lineWidth = 1.2;
      c.font = 'bold ' + (s * .09) + 'px sans-serif'; c.fillText('77%', 0, ringY);
      c.font = (s * .04) + 'px sans-serif'; c.fillText('this month', 0, ringY + s * .12);
    },

    // 4 — Behavioral Journey Map
    function (c, s) {
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      // Winding path
      var origAlpha = c.globalAlpha;
      c.beginPath(); c.moveTo(-s * .5, s * .6);
      c.bezierCurveTo(-s * .5, s * .2, -s * .2, s * .3, -s * .15, 0);
      c.bezierCurveTo(-s * .1, -s * .3, s * .2, -s * .2, s * .15, -s * .45);
      c.bezierCurveTo(s * .1, -s * .6, s * .4, -s * .7, s * .5, -s * .65);
      c.globalAlpha = origAlpha * 0.3; c.lineWidth = 3; c.stroke(); c.globalAlpha = origAlpha; c.lineWidth = 1.5;
      var pts = [[-s*.5,s*.6],[-s*.35,s*.35],[-s*.15,0],[s*.05,-s*.25],[s*.15,-s*.45],[s*.5,-s*.65]];
      var labels = ['Start','Aware','Intent','Action','Habit','Identity'];
      c.font = (s * .045) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      for (var i = 0; i < pts.length; i++) {
        c.beginPath(); c.arc(pts[i][0], pts[i][1], s * .04, 0, Math.PI * 2);
        i < 4 ? c.fill() : c.stroke();
        c.fillText(labels[i], pts[i][0], pts[i][1] - s * .08);
      }
      c.beginPath(); c.arc(pts[3][0], pts[3][1], s * .06, 0, Math.PI * 2);
      c.globalAlpha = origAlpha * 0.25; c.fill(); c.globalAlpha = origAlpha;
      // Flag at end
      c.beginPath(); c.moveTo(pts[5][0], pts[5][1] - s * .04); c.lineTo(pts[5][0], pts[5][1] - s * .18); c.stroke();
      c.beginPath(); c.moveTo(pts[5][0], pts[5][1] - s * .18);
      c.lineTo(pts[5][0] + s * .1, pts[5][1] - s * .14); c.lineTo(pts[5][0], pts[5][1] - s * .1); c.fill();
    },

    // 5 — App Dashboard with Chart
    function (c, s) {
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      rr(c, -s * .55, -s * .7, s * 1.1, s * 1.4, s * .04); c.stroke();
      c.fillRect(-s * .5, -s * .62, s * .25, s * .02);
      c.fillRect(-s * .5, -s * .57, s * .15, s * .02);
      for (var d = 0; d < 3; d++) { c.beginPath(); c.arc(s * .38 + d * s * .06, -s * .6, s * .015, 0, Math.PI * 2); c.fill(); }
      // Donut
      var dx = -s * .22, dy = -s * .2, dr = s * .15, origAlpha = c.globalAlpha;
      c.lineWidth = 4;
      c.beginPath(); c.arc(dx, dy, dr, 0, Math.PI * 2); c.globalAlpha = origAlpha * 0.2; c.stroke(); c.globalAlpha = origAlpha;
      c.beginPath(); c.arc(dx, dy, dr, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.4); c.stroke();
      c.lineWidth = 1.2;
      c.font = 'bold ' + (s * .08) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('70%', dx, dy);
      c.font = 'bold ' + (s * .07) + 'px sans-serif'; c.textAlign = 'left';
      c.fillText('1,240', s * .1, -s * .32);
      c.font = (s * .04) + 'px sans-serif'; c.fillText('active users', s * .1, -s * .24);
      c.font = 'bold ' + (s * .07) + 'px sans-serif'; c.fillText('+18%', s * .1, -s * .12);
      c.font = (s * .04) + 'px sans-serif'; c.fillText('engagement', s * .1, -s * .04);
      // Divider
      c.beginPath(); c.moveTo(-s * .5, s * .08); c.lineTo(s * .5, s * .08);
      c.globalAlpha = origAlpha * 0.3; c.stroke(); c.globalAlpha = origAlpha;
      // Bar chart
      c.textAlign = 'center';
      var bars = [.4,.65,.5,.85,.7,.55,.9], barW = s * .08, barGap = s * .04;
      var totalW = bars.length * barW + (bars.length - 1) * barGap, bsx = -totalW / 2;
      for (var i = 0; i < bars.length; i++) {
        var bh = s * .35 * bars[i];
        rr(c, bsx + i * (barW + barGap), s * .55 - bh, barW, bh, s * .01);
        i === 6 ? c.fill() : c.stroke();
      }
      c.font = (s * .035) + 'px sans-serif';
      ['M','T','W','T','F','S','S'].forEach(function(l,j) { c.fillText(l, bsx + j * (barW + barGap) + barW / 2, s * .62); });
    },

    // 6 — Reward / Loot Chest
    function (c, s) {
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      var origAlpha = c.globalAlpha;
      // Rays behind
      c.globalAlpha = origAlpha * 0.15;
      for (var r = 0; r < 8; r++) {
        var ra = r * Math.PI / 4;
        c.beginPath(); c.moveTo(Math.cos(ra) * s * .2, Math.sin(ra) * s * .2 - s * .15);
        c.lineTo(Math.cos(ra) * s * .6, Math.sin(ra) * s * .6 - s * .15); c.stroke();
      }
      c.globalAlpha = origAlpha;
      // Chest body
      rr(c, -s * .35, -s * .05, s * .7, s * .4, s * .03); c.stroke();
      // Lid
      c.beginPath(); c.moveTo(-s * .38, -s * .05);
      c.quadraticCurveTo(-s * .38, -s * .3, 0, -s * .35);
      c.quadraticCurveTo(s * .38, -s * .3, s * .38, -s * .05); c.stroke();
      // Lock
      rr(c, -s * .06, -s * .08, s * .12, s * .1, s * .02); c.fill();
      // Floating coins
      c.beginPath(); c.arc(-s * .25, -s * .55, s * .06, 0, Math.PI * 2); c.stroke();
      c.font = (s * .06) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('$', -s * .25, -s * .55);
      c.beginPath(); c.arc(s * .2, -s * .5, s * .05, 0, Math.PI * 2); c.stroke();
      c.fillText('$', s * .2, -s * .5);
      // Diamond
      c.beginPath(); c.moveTo(s * .05, -s * .68); c.lineTo(s * .1, -s * .62);
      c.lineTo(s * .05, -s * .56); c.lineTo(0, -s * .62); c.closePath(); c.fill();
      // Stars
      for (var st = 0; st < 3; st++) {
        var stx = -s * .15 + st * s * .15, sty = -s * .72;
        c.beginPath();
        for (var k = 0; k < 5; k++) { var sa = k * 4 * Math.PI / 5 - Math.PI / 2, sr = s * .03; c[k ? 'lineTo' : 'moveTo'](stx + Math.cos(sa) * sr, sty + Math.sin(sa) * sr); }
        c.closePath(); c.fill();
      }
      c.font = 'bold ' + (s * .07) + 'px sans-serif'; c.fillText('+500 XP', 0, s * .55);
    },

    // 7 — Notification Stack
    function (c, s) {
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      var cardH = s * .22, cardW = s * .8, origAlpha = c.globalAlpha;
      for (var i = 0; i < 4; i++) {
        var ny = -s * .65 + i * (cardH + s * .06);
        c.globalAlpha = origAlpha * (1 - i * 0.15);
        rr(c, -cardW / 2, ny, cardW, cardH, s * .03); c.stroke();
        c.beginPath(); c.arc(-cardW / 2 + s * .14, ny + cardH / 2, s * .06, 0, Math.PI * 2); c.fill();
        c.fillRect(-cardW / 2 + s * .24, ny + cardH * .3, cardW * .5, s * .02);
        c.fillRect(-cardW / 2 + s * .24, ny + cardH * .55, cardW * .3, s * .015);
        c.globalAlpha = origAlpha * (1 - i * 0.15) * 0.4;
        c.fillRect(cardW / 2 - s * .2, ny + cardH * .35, s * .12, s * .012);
      }
      c.globalAlpha = origAlpha;
    },

    // 8 — Reward Spinner Wheel
    function (c, s) {
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      var r = s * .5, origAlpha = c.globalAlpha;
      c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(0, 0, r * .92, 0, Math.PI * 2); c.stroke();
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI * 2 / 8 - Math.PI / 2;
        c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * r * .92, Math.sin(a) * r * .92);
        c.globalAlpha = origAlpha * 0.3; c.stroke(); c.globalAlpha = origAlpha;
        var midA = a + Math.PI / 8;
        c.beginPath(); c.arc(Math.cos(midA) * r * .6, Math.sin(midA) * r * .6, s * .04, 0, Math.PI * 2);
        i % 2 === 0 ? c.fill() : c.stroke();
      }
      c.beginPath(); c.arc(0, 0, s * .12, 0, Math.PI * 2); c.fill();
      // Pointer
      c.beginPath(); c.moveTo(0, -r - s * .08);
      c.lineTo(-s * .05, -r + s * .02); c.lineTo(s * .05, -r + s * .02); c.closePath(); c.fill();
      for (var d = 0; d < 16; d++) {
        var da = d * Math.PI * 2 / 16;
        c.beginPath(); c.arc(Math.cos(da) * r * .96, Math.sin(da) * r * .96, s * .015, 0, Math.PI * 2); c.fill();
      }
    },

    // 9 — AI Neural Network
    function (c, s) {
      c.lineWidth = 1; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      var layers = [[0,-s*.6],[-s*.3,-s*.25],[s*.3,-s*.25],[-s*.45,s*.15],
                    [0,s*.15],[s*.45,s*.15],[-s*.2,s*.55],[s*.2,s*.55]];
      var edges = [[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[5,7]];
      var origAlpha = c.globalAlpha;
      c.globalAlpha = origAlpha * 0.25;
      for (var e = 0; e < edges.length; e++) {
        var from = layers[edges[e][0]], to = layers[edges[e][1]];
        c.beginPath(); c.moveTo(from[0], from[1]); c.lineTo(to[0], to[1]); c.stroke();
      }
      c.globalAlpha = origAlpha;
      for (var n = 0; n < layers.length; n++) {
        c.beginPath(); c.arc(layers[n][0], layers[n][1], s * .06, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.arc(layers[n][0], layers[n][1], s * .025, 0, Math.PI * 2); c.fill();
      }
      c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(layers[2][0], layers[2][1]); c.lineTo(layers[4][0], layers[4][1]); c.stroke();
      c.font = (s * .05) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('AI Agent', 0, s * .78);
    },

    // 10 — Badges Board
    function (c, s) {
      c.lineWidth = 1.2; c.strokeStyle = c.fillStyle; c.lineCap = 'round';
      c.font = 'bold ' + (s * .07) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('Badges', 0, -s * .7);
      var bsz = s * .2, gap = s * .08, origAlpha = c.globalAlpha;
      var earned = [true, true, true, true, false, false];
      for (var row = 0; row < 2; row++) {
        for (var col = 0; col < 3; col++) {
          var idx = row * 3 + col;
          var bx = -bsz - gap + col * (bsz + gap), by = -s * .45 + row * (bsz + gap + s * .06);
          if (!earned[idx]) c.globalAlpha = origAlpha * 0.3;
          if (idx % 3 === 0) {
            c.beginPath(); c.arc(bx, by, bsz * .4, 0, Math.PI * 2); earned[idx] ? c.fill() : c.stroke();
          } else if (idx % 3 === 1) {
            c.beginPath();
            for (var h = 0; h < 6; h++) { var ha = h * Math.PI / 3 - Math.PI / 2; c[h ? 'lineTo' : 'moveTo'](bx + Math.cos(ha) * bsz * .4, by + Math.sin(ha) * bsz * .4); }
            c.closePath(); earned[idx] ? c.fill() : c.stroke();
          } else {
            c.beginPath();
            for (var k = 0; k < 5; k++) { var sa = k * 4 * Math.PI / 5 - Math.PI / 2; c[k ? 'lineTo' : 'moveTo'](bx + Math.cos(sa) * bsz * .35, by + Math.sin(sa) * bsz * .35); }
            c.closePath(); earned[idx] ? c.fill() : c.stroke();
          }
          c.globalAlpha = origAlpha;
        }
      }
      c.font = (s * .05) + 'px sans-serif'; c.fillText('4 / 6 earned', 0, s * .45);
      rr(c, -s * .35, s * .55, s * .7, s * .04, s * .02); c.stroke();
      rr(c, -s * .34, s * .555, s * .7 * .67, s * .03, s * .015); c.fill();
    },

    // 11 — Trophy (simple)
    function (c, s) {
      var w = s * .28, h = s * .38; c.beginPath();
      c.moveTo(-w, -h); c.quadraticCurveTo(-w * 1.3, 0, 0, h * .7);
      c.quadraticCurveTo(w * 1.3, 0, w, -h); c.closePath(); c.fill();
      c.fillRect(-w * .2, h * .55, w * .4, h * .25);
      c.fillRect(-w * .5, h * .75, w, h * .12);
    },

    // 12 — Gamepad (simple)
    function (c, s) {
      var w = s * .38, h = s * .22; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      rr(c, -w, -h, w * 2, h * 2, s * .1); c.stroke();
      c.fillRect(-w * .6, -h * .15, w * .3, h * .3);
      c.fillRect(-w * .53, -h * .4, w * .15, h * .8);
      c.beginPath(); c.arc(w * .45, -h * .1, s * .04, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(w * .6, h * .15, s * .04, 0, Math.PI * 2); c.fill();
    },

    // 13 — Heart (simple)
    function (c, s) {
      var r = s * .18; c.beginPath(); c.moveTo(0, r * .6);
      c.bezierCurveTo(-r * 2.5, -r * 1.2, -r * .8, -r * 3, 0, -r * 1.5);
      c.bezierCurveTo(r * .8, -r * 3, r * 2.5, -r * 1.2, 0, r * .6); c.fill();
    },

    // 14 — Lightning (simple)
    function (c, s) {
      var h = s * .45; c.beginPath();
      c.moveTo(h * .15, -h); c.lineTo(-h * .3, h * .05); c.lineTo(h * .05, h * .05);
      c.lineTo(-h * .15, h); c.lineTo(h * .3, -h * .05); c.lineTo(-h * .05, -h * .05);
      c.closePath(); c.fill();
    },

    // 15 — Crown (simple)
    function (c, s) {
      var w = s * .35, h = s * .25; c.beginPath();
      c.moveTo(-w, h); c.lineTo(-w, -h * .2); c.lineTo(-w * .5, h * .3); c.lineTo(0, -h);
      c.lineTo(w * .5, h * .3); c.lineTo(w, -h * .2); c.lineTo(w, h); c.closePath(); c.fill();
    },

    // 16 — Target (simple)
    function (c, s) {
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      [.4, .28, .16].forEach(function (f) { c.beginPath(); c.arc(0, 0, s * f, 0, Math.PI * 2); c.stroke(); });
      c.beginPath(); c.arc(0, 0, s * .06, 0, Math.PI * 2); c.fill();
    },

    // 17 — Brain (simple)
    function (c, s) {
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle; var r = s * .32;
      c.beginPath(); c.arc(-r * .3, -r * .1, r * .55, Math.PI * .3, Math.PI * 1.8); c.stroke();
      c.beginPath(); c.arc(r * .3, -r * .1, r * .55, Math.PI * 1.2, Math.PI * 2.7); c.stroke();
      c.beginPath(); c.moveTo(0, -r * .6); c.lineTo(0, r * .7); c.stroke();
    },

    // 18 — Star (simple)
    function (c, s) {
      var r = s * .4; c.beginPath();
      for (var i = 0; i < 5; i++) { var a = i * 4 * Math.PI / 5 - Math.PI / 2; c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
      c.closePath(); c.fill();
    },

    // 19 — Dice (simple)
    function (c, s) {
      var w = s * .34; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      c.strokeRect(-w, -w, w * 2, w * 2);
      [[-0.5,-0.5],[0.5,0.5],[0,0]].forEach(function (p) { c.beginPath(); c.arc(w * p[0], w * p[1], s * .05, 0, Math.PI * 2); c.fill(); });
    },
  ];

  // ── State ────────────────────────────────────────────────
  var trail = [];
  var maxTrail = 55;
  var built = [];
  var used = [];

  var dot = { x: cW * .2, y: cH * .3 };
  var seg = { sx: dot.x, sy: dot.y, tx: 0, ty: 0, c1x: 0, c1y: 0, c2x: 0, c2y: 0, t: 0, spd: .015 };
  var bld = { active: false, prog: 0, icon: 0 };

  function bez(t, a, b, c, d) { var u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; }

  function randTarget() {
    var margin = 50, cx = cW / 2, cy = cH / 2;
    var cHalf = Math.min(380, cW * .35);
    var x, y, tries = 0;
    do {
      x = margin + Math.random() * (cW - margin * 2);
      y = margin + Math.random() * (cH - margin * 2);
      tries++;
    } while (tries < 20 && Math.abs(x - cx) < cHalf && Math.abs(y - cy) < 160);
    return [x, y];
  }

  function pickTarget() {
    seg.sx = dot.x; seg.sy = dot.y;
    var p = randTarget();
    seg.tx = p[0]; seg.ty = p[1];
    var mx = (seg.sx + seg.tx) / 2, my = (seg.sy + seg.ty) / 2;
    var sp = Math.min(cW, cH) * .25;
    seg.c1x = mx + (Math.random() - .5) * sp;
    seg.c1y = my + (Math.random() - .5) * sp;
    seg.c2x = mx + (Math.random() - .5) * sp;
    seg.c2y = my + (Math.random() - .5) * sp;
    seg.t = 0;
    seg.spd = .012 + Math.random() * .012;
  }

  function pickIcon() {
    if (used.length >= structures.length) used = [];
    var idx;
    do { idx = Math.floor(Math.random() * structures.length); } while (used.indexOf(idx) !== -1);
    used.push(idx);
    return idx;
  }

  pickTarget();

  // ── Render Loop ──────────────────────────────────────────
  function frame() {
    ctx.clearRect(0, 0, cW, cH);

    if (!bld.active) {
      seg.t += seg.spd;
      if (seg.t >= 1) {
        seg.t = 1;
        dot.x = seg.tx; dot.y = seg.ty;
        bld.active = true; bld.prog = 0; bld.icon = pickIcon();
      } else {
        dot.x = bez(seg.t, seg.sx, seg.c1x, seg.c2x, seg.tx);
        dot.y = bez(seg.t, seg.sy, seg.c1y, seg.c2y, seg.ty);
      }
    }

    if (bld.active) {
      bld.prog += .04;
      if (bld.prog >= 1) {
        var col = C[Math.floor(Math.random() * C.length)];
        var isComplex = bld.icon < 11;
        var sz = isComplex ? (50 + Math.random() * 20) : (26 + Math.random() * 18);
        built.push({ x: dot.x, y: dot.y, icon: bld.icon, c: col, op: .55, sz: sz, born: performance.now(), life: 8000 + Math.random() * 10000 });
        bld.active = false;
        pickTarget();
      }
    }

    trail.push([dot.x, dot.y]);
    if (trail.length > maxTrail) trail.shift();

    if (trail.length > 2) {
      ctx.beginPath(); ctx.moveTo(trail[0][0], trail[0][1]);
      for (var j = 1; j < trail.length; j++) ctx.lineTo(trail[j][0], trail[j][1]);
      ctx.strokeStyle = 'rgba(0,212,170,.1)'; ctx.lineWidth = 2; ctx.stroke();
    }
    for (var i = 0; i < trail.length; i++) {
      var pr = i / trail.length;
      ctx.beginPath(); ctx.arc(trail[i][0], trail[i][1], 1 + pr * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,170,' + (pr * .45) + ')'; ctx.fill();
    }

    ctx.save();
    ctx.shadowColor = 'rgba(0,212,170,.7)'; ctx.shadowBlur = 25;
    ctx.beginPath(); ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00d4aa'; ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(dot.x, dot.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
    ctx.restore();

    if (bld.active) {
      var bp = bld.prog, bc = C[bld.icon % C.length];
      var isComplex = bld.icon < 11;
      var buildSz = isComplex ? 50 : 34;
      ctx.save(); ctx.translate(dot.x, dot.y);
      ctx.globalAlpha = bp * .7; ctx.scale(bp, bp);
      ctx.fillStyle = 'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',.6)';
      structures[bld.icon](ctx, buildSz, bp);
      ctx.restore();
      ctx.beginPath(); ctx.arc(dot.x, dot.y, 12 + bp * 22, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,212,170,' + (.25 * (1 - bp)) + ')'; ctx.lineWidth = 1; ctx.stroke();
    }

    var now = performance.now();
    for (var k = built.length - 1; k >= 0; k--) {
      var it = built[k], age = now - it.born;
      if (age > it.life) { built.splice(k, 1); continue; }
      var fi = Math.min(1, age / 600);
      var fo = age > it.life - 2500 ? (it.life - age) / 2500 : 1;
      var a = fi * fo * it.op;
      ctx.save(); ctx.translate(it.x, it.y); ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(' + it.c[0] + ',' + it.c[1] + ',' + it.c[2] + ',' + a + ')';
      structures[it.icon](ctx, it.sz, 1);
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }
  frame();
})();
