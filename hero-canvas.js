/* ============================================================
   HERO CANVAS — Agentic AI Light Dot Animation
   A glowing dot moves haphazardly, leaving a trail, and "builds"
   themed icons (gamification, behavioral change, apps, etc.)
   that fade away over time.
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

  // Palette
  var C = [
    [124, 92, 255],   // purple
    [0, 212, 170],    // teal
    [255, 107, 157],  // pink
  ];

  // ── Icon Drawers ─────────────────────────────────────────
  // Each fn(ctx, size, progress) draws centered at (0,0).
  // ctx.fillStyle is pre-set by caller.
  var icons = [
    // 0 – progress ring
    function (c, s, p) {
      c.lineWidth = 2.5; c.strokeStyle = c.fillStyle;
      c.beginPath(); c.arc(0, 0, s * .38, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(0, 0, s * .38, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.6 * p);
      c.lineWidth = 3; c.stroke();
    },
    // 1 – star
    function (c, s) {
      var r = s * .4; c.beginPath();
      for (var i = 0; i < 5; i++) { var a = i * 4 * Math.PI / 5 - Math.PI / 2; c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
      c.closePath(); c.fill();
    },
    // 2 – lightning bolt
    function (c, s) {
      var h = s * .45; c.beginPath();
      c.moveTo(h * .15, -h); c.lineTo(-h * .3, h * .05); c.lineTo(h * .05, h * .05);
      c.lineTo(-h * .15, h); c.lineTo(h * .3, -h * .05); c.lineTo(-h * .05, -h * .05);
      c.closePath(); c.fill();
    },
    // 3 – heart
    function (c, s) {
      var r = s * .18; c.beginPath(); c.moveTo(0, r * .6);
      c.bezierCurveTo(-r * 2.5, -r * 1.2, -r * .8, -r * 3, 0, -r * 1.5);
      c.bezierCurveTo(r * .8, -r * 3, r * 2.5, -r * 1.2, 0, r * .6); c.fill();
    },
    // 4 – trophy
    function (c, s) {
      var w = s * .28, h = s * .38; c.beginPath();
      c.moveTo(-w, -h); c.quadraticCurveTo(-w * 1.3, 0, 0, h * .7);
      c.quadraticCurveTo(w * 1.3, 0, w, -h); c.closePath(); c.fill();
      c.fillRect(-w * .2, h * .55, w * .4, h * .25);
      c.fillRect(-w * .5, h * .75, w, h * .12);
    },
    // 5 – checkmark circle
    function (c, s) {
      var r = s * .35; c.lineWidth = 2.5; c.lineCap = 'round'; c.lineJoin = 'round';
      c.strokeStyle = c.fillStyle;
      c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.moveTo(-r * .4, 0); c.lineTo(-r * .1, r * .35); c.lineTo(r * .4, -r * .25); c.stroke();
    },
    // 6 – bar chart
    function (c, s) {
      var bw = s * .12, gap = s * .06, hs = [.3, .55, .4, .7, .9];
      var tw = hs.length * bw + (hs.length - 1) * gap, sx = -tw / 2;
      for (var i = 0; i < hs.length; i++) { var bh = s * .45 * hs[i]; c.fillRect(sx + i * (bw + gap), s * .35 - bh, bw, bh); }
    },
    // 7 – smartphone
    function (c, s) {
      var w = s * .28, h = s * .42; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      c.beginPath(); c.roundRect(-w, -h, w * 2, h * 2, s * .04); c.stroke();
      c.beginPath(); c.arc(0, h * .75, s * .04, 0, Math.PI * 2); c.fill();
    },
    // 8 – target
    function (c, s) {
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      [.4, .28, .16].forEach(function (f) { c.beginPath(); c.arc(0, 0, s * f, 0, Math.PI * 2); c.stroke(); });
      c.beginPath(); c.arc(0, 0, s * .06, 0, Math.PI * 2); c.fill();
    },
    // 9 – flame
    function (c, s) {
      var h = s * .45; c.beginPath(); c.moveTo(0, -h);
      c.bezierCurveTo(h * .6, -h * .3, h * .5, h * .4, 0, h * .6);
      c.bezierCurveTo(-h * .5, h * .4, -h * .6, -h * .3, 0, -h); c.fill();
    },
    // 10 – dice
    function (c, s) {
      var w = s * .34; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      c.strokeRect(-w, -w, w * 2, w * 2);
      [[-0.5, -0.5], [0.5, 0.5], [0, 0]].forEach(function (p) { c.beginPath(); c.arc(w * p[0], w * p[1], s * .05, 0, Math.PI * 2); c.fill(); });
    },
    // 11 – brain
    function (c, s) {
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle; var r = s * .32;
      c.beginPath(); c.arc(-r * .3, -r * .1, r * .55, Math.PI * .3, Math.PI * 1.8); c.stroke();
      c.beginPath(); c.arc(r * .3, -r * .1, r * .55, Math.PI * 1.2, Math.PI * 2.7); c.stroke();
      c.beginPath(); c.moveTo(0, -r * .6); c.lineTo(0, r * .7); c.stroke();
    },
    // 12 – medal
    function (c, s) {
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle; var r = s * .22;
      c.beginPath(); c.moveTo(-r * .7, -s * .4); c.lineTo(0, -r * .3); c.lineTo(r * .7, -s * .4); c.stroke();
      c.beginPath(); c.arc(0, r * .3, r, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(0, r * .3, r * .4, 0, Math.PI * 2); c.fill();
    },
    // 13 – puzzle piece
    function (c, s) {
      var u = s * .14; c.beginPath();
      c.moveTo(-u * 2, -u * 2); c.lineTo(-u * .5, -u * 2);
      c.arc(0, -u * 2, u * .5, Math.PI, 0, true);
      c.lineTo(u * 2, -u * 2); c.lineTo(u * 2, -u * .5);
      c.arc(u * 2, 0, u * .5, -Math.PI / 2, Math.PI / 2, true);
      c.lineTo(u * 2, u * 2); c.lineTo(-u * 2, u * 2); c.closePath();
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle; c.stroke();
    },
    // 14 – crown
    function (c, s) {
      var w = s * .35, h = s * .25; c.beginPath();
      c.moveTo(-w, h); c.lineTo(-w, -h * .2); c.lineTo(-w * .5, h * .3); c.lineTo(0, -h);
      c.lineTo(w * .5, h * .3); c.lineTo(w, -h * .2); c.lineTo(w, h); c.closePath(); c.fill();
    },
    // 15 – coins
    function (c, s) {
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle; var r = s * .2;
      c.beginPath(); c.arc(-r * .5, r * .3, r, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(r * .5, -r * .3, r, 0, Math.PI * 2); c.stroke();
      c.beginPath(); c.arc(r * .5, -r * .3, r * .35, 0, Math.PI * 2); c.fill();
    },
    // 16 – arrow up
    function (c, s) {
      c.lineWidth = 2; c.lineCap = 'round'; c.strokeStyle = c.fillStyle; var h = s * .38;
      c.beginPath(); c.moveTo(0, h); c.lineTo(0, -h);
      c.moveTo(-h * .5, -h * .5); c.lineTo(0, -h); c.lineTo(h * .5, -h * .5); c.stroke();
    },
    // 17 – shield
    function (c, s) {
      var w = s * .3, h = s * .4; c.beginPath(); c.moveTo(0, -h);
      c.quadraticCurveTo(w * 1.3, -h * .6, w, 0);
      c.quadraticCurveTo(w * .5, h * .8, 0, h);
      c.quadraticCurveTo(-w * .5, h * .8, -w, 0);
      c.quadraticCurveTo(-w * 1.3, -h * .6, 0, -h);
      c.lineWidth = 1.5; c.strokeStyle = c.fillStyle; c.stroke();
    },
    // 18 – open book
    function (c, s) {
      var w = s * .3, h = s * .35; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      c.beginPath(); c.moveTo(0, -h);
      c.quadraticCurveTo(-w * 1.2, -h * .7, -w, 0); c.lineTo(-w, h);
      c.quadraticCurveTo(-w * .3, h * .6, 0, h);
      c.quadraticCurveTo(w * .3, h * .6, w, h); c.lineTo(w, 0);
      c.quadraticCurveTo(w * 1.2, -h * .7, 0, -h); c.stroke();
      c.beginPath(); c.moveTo(0, -h); c.lineTo(0, h); c.stroke();
    },
    // 19 – XP hexagon
    function (c, s) {
      var r = s * .32; c.beginPath();
      for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 - Math.PI / 2; c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
      c.closePath(); c.lineWidth = 1.5; c.strokeStyle = c.fillStyle; c.stroke();
      c.font = 'bold ' + (s * .22) + 'px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('XP', 0, 1);
    },
    // 20 – bell
    function (c, s) {
      var w = s * .25, h = s * .35; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      c.beginPath(); c.moveTo(-w, h * .3);
      c.quadraticCurveTo(-w, -h, 0, -h); c.quadraticCurveTo(w, -h, w, h * .3);
      c.lineTo(-w, h * .3); c.stroke();
      c.beginPath(); c.arc(0, h * .5, s * .07, 0, Math.PI * 2); c.fill();
    },
    // 21 – hourglass
    function (c, s) {
      var w = s * .22, h = s * .38; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      c.beginPath(); c.moveTo(-w, -h); c.lineTo(w, -h); c.lineTo(0, 0);
      c.lineTo(w, h); c.lineTo(-w, h); c.lineTo(0, 0); c.closePath(); c.stroke();
    },
    // 22 – gamepad
    function (c, s) {
      var w = s * .38, h = s * .22; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      c.beginPath(); c.roundRect(-w, -h, w * 2, h * 2, s * .1); c.stroke();
      c.fillRect(-w * .6, -h * .15, w * .3, h * .3);
      c.fillRect(-w * .53, -h * .4, w * .15, h * .8);
      c.beginPath(); c.arc(w * .45, -h * .1, s * .04, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(w * .6, h * .15, s * .04, 0, Math.PI * 2); c.fill();
    },
    // 23 – sparkle
    function (c, s) {
      var r = s * .38; c.lineWidth = 1.5; c.strokeStyle = c.fillStyle;
      c.beginPath();
      for (var i = 0; i < 4; i++) {
        var a = i * Math.PI / 2;
        c.moveTo(0, 0); c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        var a2 = a + Math.PI / 4;
        c.moveTo(0, 0); c.lineTo(Math.cos(a2) * r * .4, Math.sin(a2) * r * .4);
      }
      c.stroke();
      c.beginPath(); c.arc(0, 0, s * .05, 0, Math.PI * 2); c.fill();
    },
  ];

  // ── State ────────────────────────────────────────────────
  var trail = [];
  var maxTrail = 55;
  var built = [];
  var used = [];

  var dot = { x: cW * .2, y: cH * .3 };
  var seg = { sx: dot.x, sy: dot.y, tx: 0, ty: 0, c1x: 0, c1y: 0, c2x: 0, c2y: 0, t: 0, spd: .007 };
  var bld = { active: false, prog: 0, icon: 0 };

  // ── Helpers ──────────────────────────────────────────────
  function bez(t, a, b, c, d) { var u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; }

  function randTarget() {
    // Keep dot in edges, away from center content
    var margin = 50;
    var cx = cW / 2, cy = cH / 2;
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
    seg.spd = .004 + Math.random() * .006;
  }

  function pickIcon() {
    if (used.length >= icons.length) used = [];
    var idx;
    do { idx = Math.floor(Math.random() * icons.length); } while (used.indexOf(idx) !== -1);
    used.push(idx);
    return idx;
  }

  pickTarget();

  // ── Render Loop ──────────────────────────────────────────
  function frame() {
    ctx.clearRect(0, 0, cW, cH);

    // Move dot
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

    // Build
    if (bld.active) {
      bld.prog += .03;
      if (bld.prog >= 1) {
        var col = C[Math.floor(Math.random() * C.length)];
        built.push({ x: dot.x, y: dot.y, icon: bld.icon, c: col, op: .6, sz: 26 + Math.random() * 18, born: performance.now(), life: 7000 + Math.random() * 9000 });
        bld.active = false;
        pickTarget();
      }
    }

    // Trail
    trail.push([dot.x, dot.y]);
    if (trail.length > maxTrail) trail.shift();

    // Draw trail line
    if (trail.length > 2) {
      ctx.beginPath(); ctx.moveTo(trail[0][0], trail[0][1]);
      for (var j = 1; j < trail.length; j++) ctx.lineTo(trail[j][0], trail[j][1]);
      ctx.strokeStyle = 'rgba(0,212,170,.1)'; ctx.lineWidth = 2; ctx.stroke();
    }
    // Trail dots
    for (var i = 0; i < trail.length; i++) {
      var pr = i / trail.length;
      ctx.beginPath(); ctx.arc(trail[i][0], trail[i][1], 1 + pr * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,170,' + (pr * .45) + ')'; ctx.fill();
    }

    // Main dot glow
    ctx.save();
    ctx.shadowColor = 'rgba(0,212,170,.7)'; ctx.shadowBlur = 25;
    ctx.beginPath(); ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00d4aa'; ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(dot.x, dot.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fill();
    ctx.restore();

    // Building animation
    if (bld.active) {
      var bp = bld.prog, bc = C[bld.icon % C.length];
      ctx.save(); ctx.translate(dot.x, dot.y);
      ctx.globalAlpha = bp * .7; ctx.scale(bp, bp);
      ctx.fillStyle = 'rgba(' + bc[0] + ',' + bc[1] + ',' + bc[2] + ',.6)';
      icons[bld.icon](ctx, 34, bp);
      ctx.restore();
      // pulse ring
      ctx.beginPath(); ctx.arc(dot.x, dot.y, 12 + bp * 22, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,212,170,' + (.25 * (1 - bp)) + ')'; ctx.lineWidth = 1; ctx.stroke();
    }

    // Built items
    var now = performance.now();
    for (var k = built.length - 1; k >= 0; k--) {
      var it = built[k], age = now - it.born;
      if (age > it.life) { built.splice(k, 1); continue; }
      var fi = Math.min(1, age / 600);
      var fo = age > it.life - 2500 ? (it.life - age) / 2500 : 1;
      var a = fi * fo * it.op;
      ctx.save(); ctx.translate(it.x, it.y); ctx.globalAlpha = a;
      ctx.fillStyle = 'rgba(' + it.c[0] + ',' + it.c[1] + ',' + it.c[2] + ',' + a + ')';
      icons[it.icon](ctx, it.sz, 1);
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }
  frame();
})();
