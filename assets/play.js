/* ============================================================
   TURINGS DESIGN — PLAY-face fluid engine
   Drives every <canvas class="scene"> on the page:
   curl-flow → coalesce into a metaphor → disperse → reform.
   Each scene declares its figures + palette via data-attrs:
     data-figs="knight,brain"  data-palette="indigo"
     data-anchor="center|right" data-cyc="3000"
   One shared rAF; IntersectionObserver pauses off-screen scenes;
   prefers-reduced-motion renders a single coalesced frame.
   ============================================================ */
(function () {
  'use strict';
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var FIG = window.TuringsFigures, PAL = window.TuringsPalettes;

  function HS(a, b) { var n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); }
  function FD(t) { return t * t * (3 - 2 * t); }
  function VN(a, b) { var xi = Math.floor(a), yi = Math.floor(b), xf = a - xi, yf = b - yi, u = FD(xf), v = FD(yf); var p = HS(xi, yi), q = HS(xi + 1, yi), r = HS(xi, yi + 1), s = HS(xi + 1, yi + 1); return p + (q - p) * u + (r - p) * v + (p - q - r + s) * u * v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ss(e0, e1, v) { var t = Math.max(0, Math.min(1, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }

  function sample(fn, bw, bh, step) {
    var oc = document.createElement('canvas'); oc.width = bw; oc.height = bh;
    var ox = oc.getContext('2d'); if (fn) fn(ox);
    var d = ox.getImageData(0, 0, bw, bh).data, pts = [];
    for (var y = 0; y < bh; y += step) for (var x = 0; x < bw; x += step) if (d[(y * bw + x) * 4 + 3] > 128) pts.push([x, y]);
    return pts;
  }

  function buildTargets(key, W, H, anchor) {
    var fg = FIG[key]; if (!fg) return { p: [], ox: 0, oy: 0, sc: 1, key: key };
    var boxH = (anchor === 'right' ? H * 0.60 : H * 0.74), sc = Math.min(boxH / fg.bh, (W * 0.84) / fg.bw), bw2 = fg.bw * sc, bh2 = fg.bh * sc;
    var cx = anchor === 'right' ? W * 0.66 : W * 0.5, cy = anchor === 'right' ? H * 0.47 : H * 0.5;
    var ox = cx - bw2 / 2, oy = cy - bh2 / 2, T = [];
    sample(fg.f, fg.bw, fg.bh, 3).forEach(function (p) { T.push({ x: ox + p[0] * sc, y: oy + p[1] * sc, t: 0 }); });
    if (fg.a) sample(fg.a, fg.bw, fg.bh, 2).forEach(function (p) { T.push({ x: ox + p[0] * sc, y: oy + p[1] * sc, t: 1 }); });
    return { p: T, ox: ox, oy: oy, sc: sc, key: key };
  }

  /* Named flow strategies — each scene picks one (or a list) via
     data-flow, so the dispersal motion itself carries meaning. */
  var FLOWS = {
    swirl: function (px, py, TM, sd) { var a = VN(px * 0.006 + TM + sd, py * 0.006) * 6.2832; return [Math.cos(a), Math.sin(a)]; },
    turbulence: function (px, py, TM, sd) { var a = VN(px * 0.018 + TM * 1.7 + sd, py * 0.018) * 9.42; return [Math.cos(a), Math.sin(a)]; },
    current: function (px, py, TM, sd) { var dir = (Math.floor(sd) % 2 === 0) ? 1 : -1; return [dir * (0.9 + Math.sin(py * 0.026 + TM * 26 + sd) * 0.35), Math.sin(px * 0.02 + TM * 18) * 0.5]; },
    vortex: function (px, py, TM, sd, W, H) { var cx = W * 0.5 + Math.sin(TM * 8 + sd) * W * 0.14, cy = H * 0.5 + Math.cos(TM * 7 + sd) * H * 0.14, dx = px - cx, dy = py - cy, d = Math.sqrt(dx * dx + dy * dy) + 1; return [-dy / d - dx / d * 0.18, dx / d - dy / d * 0.18]; },
    diagonal: function (px, py, TM, sd) { var a = Math.PI * 0.25 + VN(px * 0.011 + TM + sd, py * 0.011) * Math.PI * 1.6; return [Math.cos(a), Math.sin(a)]; },
    eddies: function (px, py, TM, sd, W, H) { var d1x = px - W * 0.33, d1y = py - H * 0.5, d2x = px - W * 0.7, d2y = py - H * 0.5; return [(-d1y + d2y) * 0.012, (d1x - d2x) * 0.012]; },
    updraft: function (px, py, TM, sd) { return [Math.sin(px * 0.02 + TM * 14 + sd) * 0.5, -1 - Math.abs(Math.sin(py * 0.01)) * 0.3]; },
    settle: function (px, py, TM, sd) { return [Math.sin(py * 0.03 + TM * 10 + sd) * 0.6, 0.7 + Math.sin(px * 0.02) * 0.2]; },
    converge: function (px, py, TM, sd, W, H) { var dx = W * 0.5 - px, dy = H * 0.5 - py, d = Math.sqrt(dx * dx + dy * dy) + 1; return [dx / d + Math.cos(TM * 18 + sd) * 0.25, dy / d * 0.6 + Math.sin(TM * 18) * 0.25]; },
    orbit: function (px, py, TM, sd, W, H) { var dx = px - W * 0.5, dy = py - H * 0.5, d = Math.sqrt(dx * dx + dy * dy) + 1; return [-dy / d, dx / d]; },
    oscillate: function (px, py, TM, sd) { return [Math.cos(TM * 28 + py * 0.04 + sd), Math.sin(px * 0.05 + TM * 20) * 0.55]; },
    radiate: function (px, py, TM, sd, W, H) { var dx = px - W * 0.5, dy = py - H * 0.5, d = Math.sqrt(dx * dx + dy * dy) + 1; return [dx / d, dy / d]; },
    pulse: function (px, py, TM, sd, W, H) { var dx = px - W * 0.5, dy = py - H * 0.5, d = Math.sqrt(dx * dx + dy * dy) + 1, k = 0.35 + 0.65 * Math.max(0, Math.sin(TM * 110 + sd)); return [dx / d * k, dy / d * k]; }
  };
  var BASE = ['swirl', 'turbulence', 'current', 'vortex', 'diagonal', 'eddies'];
  function flowVec(name, px, py, TM, sd, W, H, counter) {
    if (name === 'cycle') name = BASE[counter % 6];
    var f = FLOWS[name] || FLOWS.swirl, v = f(px, py, TM, sd, W, H), m = Math.sqrt(v[0] * v[0] + v[1] * v[1]) || 1;
    return [v[0] / m * 0.30, v[1] / m * 0.30];
  }

  function Scene(canvas) {
    var self = this; self.canvas = canvas; self.ctx = canvas.getContext('2d');
    self.figs = (canvas.getAttribute('data-figs') || 'knight').split(',').map(function (s) { return s.trim(); });
    self.anchor = canvas.getAttribute('data-anchor') || 'center';
    self.pal = PAL[canvas.getAttribute('data-palette') || 'indigo'] || PAL.indigo;
    self.flows = (canvas.getAttribute('data-flow') || 'cycle').split(',').map(function (s) { return s.trim(); });
    self.CYC = parseInt(canvas.getAttribute('data-cyc') || '3000', 10);
    self.vis = false; self.cur = -1; self.counter = 0; self.curFig = 0; self._wasActive = false; self.gSize = 1; self.gIndex = 0; self.gT0 = performance.now(); self.SLOT = 2800; self.t0 = performance.now();
    self.resize();
  }
  Scene.prototype.resize = function () {
    var r = this.canvas.getBoundingClientRect(); this.W = r.width || 300; this.H = r.height || 200;
    this.canvas.width = Math.round(this.W * DPR); this.canvas.height = Math.round(this.H * DPR);
    this.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!this._sc) { this._sc = document.createElement('canvas'); this._sx = this._sc.getContext('2d'); }
    this._sc.width = this.canvas.width; this._sc.height = this.canvas.height;
    this.T = this.figs.map(function (k) { return buildTargets(k, this.W, this.H, this.anchor); }, this);
    this.cur = -1;
    var N = Math.max(1200, Math.min(6500, Math.round(this.W * this.H / 24)));
    if (!this.P || this.P.length !== N) {
      this.P = []; for (var i = 0; i < N; i++) this.P.push({ x: Math.random() * this.W, y: Math.random() * this.H, vx: (Math.random() - .5) * 3, vy: (Math.random() - .5) * 3, tx: this.W / 2, ty: this.H / 2, t: 0, z: 0.42 + Math.random() * 0.58 });
    }
    if (RM) this.staticFrame();
  };
  Scene.prototype.assign = function (fi) {
    var TT = this.T[fi]; if (!TT || !TT.p.length) return; this.curFig = fi; var T = TT.p, P = this.P, n = P.length, m = T.length, off = Math.floor(Math.random() * m);
    for (var i = 0; i < n; i++) { var t = m >= n ? T[(Math.floor(i * m / n) + off) % m] : T[(i + off) % m]; P[i].tx = t.x; P[i].ty = t.y; P[i].t = t.t; }
  };
  Scene.prototype.drawCrisp = function (w) {
    var cf = ss(0.40, 0.92, w); if (cf <= 0.02) return;
    var tf = this.T[this.curFig]; if (!tf || !tf.key) return; var fg = FIG[tf.key]; if (!fg) return;
    var sx = this._sx, x = this.ctx, W = this.W, H = this.H, ox = tf.ox, oy = tf.oy, scl = tf.sc;
    function pass(fn, col) {
      sx.setTransform(DPR, 0, 0, DPR, 0, 0); sx.clearRect(0, 0, W, H);
      sx.save(); sx.translate(ox, oy); sx.scale(scl, scl); sx.lineJoin = 'round'; sx.lineCap = 'round'; fn(sx); sx.restore();
      sx.globalCompositeOperation = 'source-in'; sx.fillStyle = col; sx.fillRect(0, 0, W, H); sx.globalCompositeOperation = 'source-over';
    }
    var T = this._tint, light = 'rgb(' + (lerp(T[0], 255, 0.5) | 0) + ',' + (lerp(T[1], 255, 0.5) | 0) + ',' + (lerp(T[2], 255, 0.5) | 0) + ')', acc = 'rgb(' + (Math.min(255, T[0] + 45) | 0) + ',' + (Math.min(255, T[1] + 45) | 0) + ',' + (Math.min(255, T[2] + 45) | 0) + ')', glow = 'rgba(' + T[0] + ',' + T[1] + ',' + T[2] + ',0.5)';
    pass(fg.f, light);
    x.save(); x.globalAlpha = cf * 0.5; x.shadowColor = glow; x.shadowBlur = 10; x.drawImage(this._sc, 0, 0, W, H); x.restore();
    if (fg.a) { pass(fg.a, acc); x.save(); x.globalAlpha = cf; x.shadowColor = glow; x.shadowBlur = 7; x.drawImage(this._sc, 0, 0, W, H); x.restore(); }
  };
  Scene.prototype.kick = function () { for (var i = 0; i < this.P.length; i++) { var a = Math.random() * 6.2832, s = 2.6 + Math.random() * 2.6; this.P[i].vx += Math.cos(a) * s; this.P[i].vy += Math.sin(a) * s; } };
  Scene.prototype.color = function (pt, w, bright) {
    bright = bright == null ? 1 : bright; var t = this._tint;
    if (pt.t === 1) { return 'rgba(' + (Math.min(255, t[0] + 70) | 0) + ',' + (Math.min(255, t[1] + 70) | 0) + ',' + (Math.min(255, t[2] + 70) | 0) + ',' + ((0.2 + 0.6 * w) * bright) + ')'; }
    var r = lerp(t[0] * 0.78, Math.min(255, t[0] + 55), w), g = lerp(t[1] * 0.78, Math.min(255, t[1] + 55), w), b = lerp(t[2] * 0.78, Math.min(255, t[2] + 55), w);
    return 'rgba(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ',' + (0.5 * bright) + ')';
  };
  Scene.prototype.wOf = function (p) { if (p < 0.28) return 0; if (p < 0.45) return ss(0.28, 0.45, p); if (p < 0.86) return 1; return 1 - ss(0.86, 1.0, p); };
  Scene.prototype.step = function (now) {
    var w, isActive = true;
    if (this.gSize > 1) {
      var slot = this.SLOT, rel = now - this.gT0, turn = Math.floor(rel / slot), active = ((turn % this.gSize) + this.gSize) % this.gSize;
      isActive = (active === this.gIndex);
      if (isActive && !this._wasActive) { this.counter++; this.assign(this.counter % this.figs.length); this.kick(); }
      this._wasActive = isActive;
      w = isActive ? this.wOf((rel % slot) / slot) : 0;
    } else {
      var el = now - this.t0, nf = this.figs.length, idx = Math.floor(el / this.CYC) % nf, p = (el % this.CYC) / this.CYC;
      if (idx !== this.cur) { this.cur = idx; this.counter++; this.assign(idx); this.kick(); }
      w = this.wOf(p);
    }
    var L = this.flows.length, ci = ((this.counter % L) + L) % L, nm = (this.gSize > 1 && !isActive) ? 'swirl' : this.flows[ci], sd = this.counter * 1.7;
    this._tint = this.pal.tints[((this.counter % this.pal.tints.length) + this.pal.tints.length) % this.pal.tints.length];
    var pdim = 1, bright = isActive ? 1 : 0.4, TM = now * 0.00004, x = this.ctx, W = this.W, H = this.H, P = this.P;
    x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(28,21,82,0.18)'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter';
    for (var i = 0; i < P.length; i++) {
      var pt = P[i], fa = flowVec(nm, pt.x, pt.y, TM, sd, W, H, this.counter);
      var fax = fa[0] + (Math.random() - .5) * 0.6, fay = fa[1] + (Math.random() - .5) * 0.6;
      var an2 = VN(pt.x * 0.01, pt.y * 0.01) * 6.2832;
      var sax = (pt.tx - pt.x) * 0.12 + Math.cos(an2) * 0.04, say = (pt.ty - pt.y) * 0.12 + Math.sin(an2) * 0.04;
      var ax = lerp(fax, sax, w), ay = lerp(fay, say, w), damp = 0.86 - 0.56 * w;
      pt.vx = pt.vx * damp + ax; pt.vy = pt.vy * damp + ay; pt.x += pt.vx; pt.y += pt.vy;
      if (pt.x < -6) pt.x += W + 12; else if (pt.x > W + 6) pt.x -= W + 12; if (pt.y < -6) pt.y += H + 12; else if (pt.y > H + 6) pt.y -= H + 12;
      x.fillStyle = this.color(pt, w, bright * pdim); x.beginPath(); x.arc(pt.x, pt.y, (pt.t === 1 ? 1.9 : 1.35) * pt.z, 0, 6.2832); x.fill();
    }
    x.globalCompositeOperation = 'source-over';
  };
  Scene.prototype.staticFrame = function () {
    var x = this.ctx, W = this.W, H = this.H; x.fillStyle = '#171150'; x.fillRect(0, 0, W, H);
    this._tint = this.pal.tints[0]; this.assign(0); x.globalCompositeOperation = 'lighter';
    for (var i = 0; i < this.P.length; i++) { var q = this.P[i]; x.fillStyle = this.color({ t: q.t, z: q.z }, 1, 0.3); x.beginPath(); x.arc(q.tx, q.ty, (q.t === 1 ? 1.7 : 1.25) * q.z, 0, 6.2832); x.fill(); }
    x.globalCompositeOperation = 'source-over'; this.drawCrisp(1);
  };

  function boot() {
    var nodes = document.querySelectorAll('canvas.scene'); if (!nodes.length) return;
    var scenes = []; nodes.forEach(function (cv) { try { scenes.push(new Scene(cv)); } catch (e) {} });
    var gmap = new Map();
    scenes.forEach(function (s) { var sec = (s.canvas.closest && s.canvas.closest('.layer-sec')) || s.canvas.parentElement; var a = gmap.get(sec); if (!a) { a = []; gmap.set(sec, a); } a.push(s); });
    gmap.forEach(function (a) { var t0 = performance.now(); a.forEach(function (s, i) { s.gSize = a.length; s.gIndex = i; s.gT0 = t0; s.SLOT = 2800; }); });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { scenes.forEach(function (s) { if (s.canvas === e.target) s.vis = e.isIntersecting; }); }); }, { threshold: 0.02 });
      scenes.forEach(function (s) { io.observe(s.canvas); });
    } else scenes.forEach(function (s) { s.vis = true; });
    var rT; window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { scenes.forEach(function (s) { s.resize(); }); }, 220); }, { passive: true });
    window.__turings = scenes;
    if (RM) { scenes.forEach(function (s) { s.staticFrame(); }); return; }
    function loop(now) { requestAnimationFrame(loop); for (var i = 0; i < scenes.length; i++) { var s = scenes[i]; if (s.vis) { try { s.step(now); } catch (e) {} } } }
    requestAnimationFrame(loop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
