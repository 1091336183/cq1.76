/* ===== 摄像机（V0.1.01：可视区扣除底部 HUD，支持缩放） ===== */
(function () {
  function zoom() {
    const s = G.S.settings || {};
    const v = (s.zoom == null) ? G.CFG.ZOOM_DEFAULT : s.zoom;
    return G.U.clamp(v, G.CFG.ZOOM_MIN, G.CFG.ZOOM_MAX);
  }

  G.Camera = {
    shake: 0,

    zoom: zoom,

    // 可视区换算到世界坐标（底部 56px 被操作条遮挡，不计入）
    viewW: function () { return G.CFG.VIEW_W / zoom(); },
    viewH: function () { return (G.CFG.VIEW_H - G.CFG.VIEW_HUD) / zoom(); },

    maxX: function () {
      const map = G.S.map;
      return map ? Math.max(0, map.w * G.CFG.TILE - this.viewW()) : 0;
    },
    maxY: function () {
      const map = G.S.map;
      return map ? Math.max(0, map.h * G.CFG.TILE - this.viewH()) : 0;
    },

    clampTo: function (x, y) {
      return {
        x: G.U.clamp(x, 0, this.maxX()),
        y: G.U.clamp(y, 0, this.maxY())
      };
    },

    snap: function () {
      const p = G.S.player;
      if (!p) return;
      const c = this.clampTo(p.px - this.viewW() / 2, p.py - this.viewH() / 2);
      G.S.cam.x = c.x;
      G.S.cam.y = c.y;
    },

    update: function (dt) {
      const p = G.S.player;
      if (!p) return;
      const tx = G.U.clamp(p.px - this.viewW() / 2, 0, this.maxX());
      const ty = G.U.clamp(p.py - this.viewH() / 2, 0, this.maxY());
      const k = Math.min(1, dt * 7);
      G.S.cam.x += (tx - G.S.cam.x) * k;
      G.S.cam.y += (ty - G.S.cam.y) * k;
      if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * 26);
    },

    setZoom: function (v) {
      if (!G.S.settings) return;
      const nv = Math.round(G.U.clamp(v, G.CFG.ZOOM_MIN, G.CFG.ZOOM_MAX) * 100) / 100;
      if (Math.abs(nv - zoom()) < 0.001) return;
      G.S.settings.zoom = nv;
      this.snap();
      if (G.UI && G.UI.renderMinimap) G.UI.renderMinimap();
    },

    zoomBy: function (d) { this.setZoom(zoom() + d); },

    toScreen: function (wx, wy) {
      const k = zoom();
      return { x: (wx - G.S.cam.x) * k, y: (wy - G.S.cam.y) * k };
    },

    toWorld: function (sx, sy) {
      const k = zoom();
      return { x: sx / k + G.S.cam.x, y: sy / k + G.S.cam.y };
    },

    shakeIt: function (v) { this.shake = Math.max(this.shake, v || 4); }
  };
})();
