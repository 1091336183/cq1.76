/* ===== 战斗掉落 / 拾取 ===== */
(function () {
  const T = G.CFG.TILE;

  G.Loot = {
    onMonsterKill: function (m) {
      if (m.looted) return;
      m.looted = true;
      const p = G.S.player;
      p.stats.kills += 1;

      // 经验（V0.2.04：测试期倍率 G.CFG.EXP_RATE，正式版改回 1）
      const exp = Math.max(1, Math.round(m.def.exp * (G.CFG.EXP_RATE || 1)));
      G.Player.gainExp(p, exp);
      G.Projectile.float(m.x, m.y - 46, '+' + exp + ' 经验', '#c9a227');

      // 金币
      const gold = G.U.ri(m.def.gold[0], m.def.gold[1]);
      p.gold += gold;
      p.stats.goldEarned += gold;
      G.Projectile.float(m.x + 10, m.y - 34, '+' + gold + ' 金币', '#ffd75e');

      // 掉落
      this.dropItems(m);

      // 刷怪计时
      if (m.spawner) {
        m.spawner.alive = null;
        m.spawner.timer = m.def.respawn || 12;
      }
      if (G.S.target === m) { G.S.target = null; p.target = null; }
      p.attackMove = false;
      G.Audio.play('die');
      G.UI.log('击败 ' + m.def.name + '，获得经验 ' + exp + '、金币 ' + gold, 'sys');
      G.Quest.onKill(p, m.def.baseName);
      if (G.Gallery) G.Gallery.onKill(p, m.def.baseName);
    },

    dropItems: function (m) {
      const list = G.getDrops(m.def.dropKey || m.def.dropName);
      if (!list.length) return;
      list.forEach(function (d) {
        if (Math.random() >= 1 / d.n) return;
        const item = G.item(d.item);
        if (!item) return;
        const ang = Math.random() * Math.PI * 2;
        const r = G.U.rf(6, 26);
        G.S.ground.push({
          itemId: d.item,
          qty: d.qty || 1,
          x: m.x + Math.cos(ang) * r,
          y: m.y + Math.sin(ang) * r,
          born: G.S.time
        });
        if ((item.price || 0) >= 80) {
          G.UI.log('『' + m.def.name + '』掉落了 ' + item.name, 'loot');
        }
        if (G.Gallery) G.Gallery.onDrop(G.S.player, d.item);
      });
    },

    nearestGround: function (p, range) {
      let best = null, bd = 1e9;
      (G.S.ground || []).forEach(function (g) {
        const d = G.U.dist(p.px, p.py, g.x, g.y) / T;
        if (d <= range && d < bd) { bd = d; best = g; }
      });
      return best;
    },

    pickUp: function (g) {
      const p = G.S.player;
      if (!g) return false;
      const item = G.item(g.itemId);
      if (!item) return false;
      const idx = G.S.ground.indexOf(g);
      if (idx < 0) return false;
      if (!G.Bag.canCarry(p, g.itemId, g.qty)) {
        G.UI.toast('负重不足，无法拾取', 'warn');
        return false;
      }
      const added = G.Bag.add(p, g.itemId, g.qty);
      if (added <= 0) { G.UI.toast('背包已满', 'warn'); return false; }
      G.S.ground.splice(idx, 1);
      p.stats.itemsFound += added;
      G.Audio.play('pick');
      G.Projectile.float(g.x, g.y - 14, '+' + item.name, '#b8e0ff');
      G.UI.log('拾取 ' + item.name + (added > 1 ? ' ×' + added : ''), 'loot');
      if (G.Panel.isOpen('bag')) G.PageBag.render();
      G.Quest.sideTick(p);
      return true;
    }
  };
})();
