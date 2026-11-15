/* ===== V0.2 图鉴统计（怪物击杀 / 掉落完成度 / 里程碑） ===== */
(function () {
  const MILESTONES = [
    { id: 'mk_25', type: 'kill', need: 25, exp: 300, gold: 100, text: '击杀 25 只怪物' },
    { id: 'mk_100', type: 'kill', need: 100, exp: 1200, gold: 400, text: '击杀 100 只怪物' },
    { id: 'mk_250', type: 'kill', need: 250, exp: 3000, gold: 900, text: '击杀 250 只怪物' },
    { id: 'mk_500', type: 'kill', need: 500, exp: 6000, gold: 1800, text: '击杀 500 只怪物' },
    { id: 'md_5', type: 'drop', need: 5, exp: 400, gold: 150, text: '图鉴收录 5 件掉落' },
    { id: 'md_15', type: 'drop', need: 15, exp: 1500, gold: 500, text: '图鉴收录 15 件掉落' },
    { id: 'md_30', type: 'drop', need: 30, exp: 3500, gold: 1200, text: '图鉴收录 30 件掉落' },
    { id: 'md_50', type: 'drop', need: 50, exp: 7000, gold: 2500, text: '图鉴收录 50 件掉落' }
  ];

  const EQUIP_TYPES = { weapon: 1, armor: 1, helmet: 1, necklace: 1, bracelet: 1, ring: 1, boots: 1, shield: 1 };

  function ensure(p) {
    if (!p.gallery) p.gallery = { kill: {}, drop: {}, claim: {} };
    if (!p.gallery.kill) p.gallery.kill = {};
    if (!p.gallery.drop) p.gallery.drop = {};
    if (!p.gallery.claim) p.gallery.claim = {};
  }

  G.Gallery = {
    MILESTONES: MILESTONES,
    EQUIP_TYPES: EQUIP_TYPES,

    ensure: ensure,

    onKill: function (p, baseName) {
      ensure(p);
      p.gallery.kill[baseName] = (p.gallery.kill[baseName] || 0) + 1;
      this.check(p);
    },

    onDrop: function (p, itemId) {
      ensure(p);
      const it = G.item(itemId);
      if (!it) return;
      p.gallery.drop[itemId] = 1;
      this.check(p);
    },

    killTotal: function (p) {
      ensure(p);
      let n = 0;
      Object.keys(p.gallery.kill).forEach(function (k) { n += p.gallery.kill[k]; });
      return n;
    },

    dropTotal: function (p) {
      ensure(p);
      return Object.keys(p.gallery.drop).length;
    },

    check: function (p) {
      ensure(p);
      const kt = this.killTotal(p), dt = this.dropTotal(p);
      const self = this;
      MILESTONES.forEach(function (ms) {
        if (p.gallery.claim[ms.id]) return;
        const cur = ms.type === 'kill' ? kt : dt;
        if (cur < ms.need) return;
        p.gallery.claim[ms.id] = 1;
        if (ms.exp) G.Player.gainExp(p, ms.exp);
        if (ms.gold) { p.gold += ms.gold; p.stats.goldEarned += ms.gold; }
        G.UI.log('图鉴里程碑：' + ms.text + '（经验 +' + ms.exp + '，金币 +' + ms.gold + '）', 'gold');
        G.UI.toast('图鉴里程碑达成：' + ms.text, 'good');
      });
      if (G.Panel.isOpen('gallery')) G.PageGallery.render();
    },

    // 怪物图鉴：按基础名归并，取最低阶作为解锁条件
    monsterList: function (p) {
      ensure(p);
      const seen = {};
      const out = [];
      Object.keys(G.MON).forEach(function (id) {
        const m = G.MON[id];
        if (!m.baseName) return;
        if (!seen[m.baseName]) {
          seen[m.baseName] = true;
          out.push({
            name: m.baseName,
            tier: m.tier,
            boss: !!m.isBoss,
            kills: p.gallery.kill[m.baseName] || 0
          });
        } else {
          const o = out.filter(function (x) { return x.name === m.baseName; })[0];
          if (o) {
            o.tier = Math.min(o.tier, m.tier);
            o.boss = o.boss || !!m.isBoss;
            o.kills = Math.max(o.kills, p.gallery.kill[m.baseName] || 0);
          }
        }
      });
      out.sort(function (a, b) {
        if (a.tier !== b.tier) return a.tier - b.tier;
        return a.name.localeCompare(b.name, 'zh');
      });
      return out;
    },

    // 掉落完成度：仅统计装备类
    itemList: function (p) {
      ensure(p);
      const out = [];
      Object.keys(G.ITEMS).forEach(function (id) {
        const it = G.ITEMS[id];
        if (!EQUIP_TYPES[it.type]) return;
        out.push({ id: id, item: it, seen: !!p.gallery.drop[id] });
      });
      out.sort(function (a, b) {
        if (a.seen !== b.seen) return a.seen ? -1 : 1;
        return (b.item.reqLevel || 0) - (a.item.reqLevel || 0);
      });
      return out;
    },

    // 某怪物（按基础名，含全部变体/阶数）可掉落的装备与最优概率
    monsterDrops: function (baseName) {
      const best = {};
      Object.keys(G.MON).forEach(function (id) {
        const m = G.MON[id];
        if (m.baseName !== baseName) return;
        (G.getDrops(m.dropKey || m.dropName) || []).forEach(function (d) {
          const it = G.item(d.item);
          if (!it || !EQUIP_TYPES[it.type]) return;
          if (!best[it.id] || d.n < best[it.id].n) best[it.id] = { id: it.id, item: it, n: d.n };
        });
      });
      const out = Object.keys(best).map(function (k) { return best[k]; });
      out.sort(function (a, b) { return a.n - b.n; });
      return out;
    }
  };
})();
