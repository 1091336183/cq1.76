/* ===== 世界/地图实例 ===== */
(function () {
  const T = G.CFG.TILE;

  G.World = {
    load: function (mapId, tx, ty) {
      const def = G.mapDef(mapId);
      if (!def) return false;
      const terrain = G.Terrain.build(def);
      G.S.map = def;
      G.S.terrain = terrain;
      G.S.monsters = [];
      G.S.spawners = [];
      G.S.ground = [];
      G.S.projectiles = [];
      G.S.floats = [];
      G.S.target = null;
      G.S.pending = null;
      G.S.portalLock = 0.9;

      // 刷怪点
      (def.spawns || []).forEach(function (sp) {
        const md = G.monster(sp.m);
        if (!md) return;
        const tiles = terrain.spawnTiles(sp.area, sp.count);
        tiles.forEach(function (t) {
          G.S.spawners.push({ m: sp.m, x: t.x, y: t.y, timer: 0, alive: null });
        });
      });
      if (def.boss) {
        const bt = terrain.spawnTiles([def.boss.x - 3, def.boss.y - 3, 7, 7], 1)[0] || { x: def.boss.x, y: def.boss.y };
        G.S.spawners.push({ m: def.boss.m, x: bt.x, y: bt.y, timer: 0, alive: null, boss: true });
      }
      if (def.boss2) {
        const bt2 = terrain.spawnTiles([def.boss2.x - 3, def.boss2.y - 3, 7, 7], 1)[0] || { x: def.boss2.x, y: def.boss2.y };
        G.S.spawners.push({ m: def.boss2.m, x: bt2.x, y: bt2.y, timer: 0, alive: null, boss: true });
      }
      G.S.spawners.forEach(function (s) { G.World.spawnOne(s); });

      // NPC
      G.S.npcs = (def.npcs || []).map(function (n) {
        const d = G.npcDef(n.id);
        return d ? { id: d.id, name: d.name, color: d.color, kind: d.kind, shop: d.shop || null, x: n.x, y: n.y } : null;
      }).filter(Boolean);

      // 玩家
      const p = G.S.player;
      p.mapId = mapId;
      // 城市点亮（V0.2.02）：首次进入即点亮，供传送阵使用
      if (G.TOWN_BY_MAP && G.TOWN_BY_MAP[mapId]) {
        if (!p.towns) p.towns = {};
        p.towns[mapId] = true;
      }
      p.tx = tx; p.ty = ty;
      p.px = tx * T + T / 2;
      p.py = ty * T + T / 2;
      p.path = [];
      p.moving = false;
      p.dead = false;
      G.Camera.snap();
      G.UI.onMapChanged(def);
      return true;
    },

    spawnOne: function (s) {
      const def = G.monster(s.m);
      if (!def) return null;
      // 若玩家就在刷新点附近，稍后重试
      const p = G.S.player;
      if (p && G.U.dist(p.px / T, p.py / T, s.x, s.y) < 2.5) {
        s.timer = 2;
        return null;
      }
      const m = G.Mon.create(def, s.x, s.y, s);
      G.S.monsters.push(m);
      s.alive = m;
      s.timer = 0;
      return m;
    },

    tileOf: function (px, py) {
      return { x: Math.floor(px / T), y: Math.floor(py / T) };
    },

    isWalkTile: function (tx, ty) {
      const tr = G.S.terrain;
      return !!(tr && tr.isWalk(tx, ty));
    },

    canWalk: function (px, py, r) {
      r = r == null ? 9 : r;
      const tr = G.S.terrain;
      if (!tr) return false;
      const pts = [[px - r, py - r], [px + r, py - r], [px - r, py + r], [px + r, py + r]];
      for (let i = 0; i < pts.length; i++) {
        const tx = Math.floor(pts[i][0] / T), ty = Math.floor(pts[i][1] / T);
        if (!tr.isWalk(tx, ty)) return false;
      }
      return true;
    },

    nearestWalkable: function (tx, ty) {
      if (this.isWalkTile(tx, ty)) return { x: tx, y: ty };
      for (let r = 1; r <= 5; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (this.isWalkTile(tx + dx, ty + dy)) return { x: tx + dx, y: ty + dy };
          }
        }
      }
      return { x: 24, y: 18 };
    },

    portalAt: function (tx, ty) {
      const map = G.S.map;
      if (!map || !map.ports) return null;
      for (let i = 0; i < map.ports.length; i++) {
        const p = map.ports[i];
        if (p.x === tx && p.y === ty) return p;
      }
      return null;
    },

    update: function (dt) {
      const p = G.S.player;
      if (!p) return;
      if (G.S.portalLock > 0) G.S.portalLock -= dt;

      // 刷怪计时
      G.S.spawners.forEach(function (s) {
        if (s.alive && s.alive.hp > 0) return;
        if (s.alive && s.alive.hp <= 0) s.alive = null;
        if (s.timer > 0) {
          s.timer -= dt;
          if (s.timer <= 0) G.World.spawnOne(s);
        }
      });

      // 怪物
      for (let i = G.S.monsters.length - 1; i >= 0; i--) {
        const m = G.S.monsters[i];
        if (m.hp <= 0) {
          m.deadT = (m.deadT || 0) + dt;
          if (m.deadT > 0.6) G.S.monsters.splice(i, 1);
          continue;
        }
        G.Mon.update(m, dt);
      }

      // 传送门
      if (G.S.portalLock <= 0 && !p.dead) {
        const t = this.tileOf(p.px, p.py);
        const port = this.portalAt(t.x, t.y);
        if (port) {
          G.Game.enterMap(port.to, port.tx, port.ty, '进入 ' + (G.mapDef(port.to) || {}).name);
        }
      }
    }
  };
})();
