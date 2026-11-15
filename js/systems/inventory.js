/* ===== 背包系统 ===== */
(function () {
  G.Bag = {
    firstFree: function (p) {
      for (let i = 0; i < p.bag.length; i++) if (!p.bag[i]) return i;
      return -1;
    },

    countOf: function (p, itemId) {
      let n = 0;
      p.bag.forEach(function (c) { if (c && c.id === itemId) n += c.qty; });
      return n;
    },

    weight: function (p) {
      let w = 0;
      p.bag.forEach(function (c) {
        if (!c) return;
        const it = G.item(c.id);
        if (it) w += (it.weight || 0) * (c.qty || 1);
      });
      Object.keys(p.equip || {}).forEach(function (k) {
        const c = p.equip[k];
        if (!c) return;
        const it = G.item(c.id);
        if (it) w += it.weight || 0;
      });
      return Math.round(w * 10) / 10;
    },

    weightMax: function (p) { return G.Equip.stats(p).weightMax; },

    canCarry: function (p, itemId, qty) {
      const it = G.item(itemId);
      if (!it) return false;
      return this.weight(p) + it.weight * qty <= this.weightMax(p);
    },

    // 返回实际加入数量
    add: function (p, itemId, qty) {
      qty = qty || 1;
      const it = G.item(itemId);
      if (!it) return 0;
      let left = qty;
      if (it.stack > 1) {
        for (let i = 0; i < p.bag.length && left > 0; i++) {
          const c = p.bag[i];
          if (c && c.id === itemId && c.qty < it.stack) {
            const put = Math.min(it.stack - c.qty, left);
            c.qty += put; left -= put;
          }
        }
      }
      while (left > 0) {
        const free = this.firstFree(p);
        if (free < 0) break;
        const put = it.stack > 1 ? Math.min(it.stack, left) : 1;
        p.bag[free] = { id: itemId, qty: put, quality: 0 };
        left -= put;
      }
      return qty - left;
    },

    removeAt: function (p, idx, qty) {
      const c = p.bag[idx];
      if (!c) return false;
      qty = qty || 1;
      if (c.qty > qty) { c.qty -= qty; }
      else { p.bag[idx] = null; }
      return true;
    },

    use: function (p, idx) {
      const c = p.bag[idx];
      if (!c) return false;
      const it = G.item(c.id);
      if (!it || !it.use) { G.UI.toast('该物品不能使用', 'warn'); return false; }
      const st = G.Equip.stats(p);
      if (it.use.hp) {
        if (p.hp >= st.hpMax) { G.UI.toast('生命值已满', 'warn'); return false; }
        const before = p.hp;
        p.hp = Math.min(st.hpMax, p.hp + it.use.hp);
        G.Projectile.float(p.px, p.py - 30, '+' + Math.round(p.hp - before), '#7cfc7c');
      }
      if (it.use.mp) {
        if (p.mp >= st.mpMax) { G.UI.toast('魔法值已满', 'warn'); return false; }
        const before = p.mp;
        p.mp = Math.min(st.mpMax, p.mp + it.use.mp);
        G.Projectile.float(p.px, p.py - 30, '+' + Math.round(p.mp - before), '#7db8ff');
      }
      if (it.use.town) {
        if (G.S.map && G.S.map.id === G.CFG.START_MAP) {
          G.UI.toast('你已经在海曦村了', 'warn');
          return false;
        }
        this.removeAt(p, idx, 1);
        G.Audio.play('ui');
        G.Game.enterMap(G.CFG.START_MAP, G.CFG.START_TX, G.CFG.START_TY, '使用回城卷回到海曦村');
        return true;
      }
      if (it.use.townTo) {
        if (G.S.map && G.S.map.id === it.use.townTo) {
          G.UI.toast('你已经在目标城镇了', 'warn');
          return false;
        }
        const md = G.mapDef(it.use.townTo);
        this.removeAt(p, idx, 1);
        G.Audio.play('ui');
        G.Game.enterMap(it.use.townTo, 24, 20, '使用传送符前往' + ((md && md.name) || '城镇'));
        return true;
      }
      this.removeAt(p, idx, 1);
      G.Audio.play('pick');
      return true;
    },

    sellPrice: function (item) {
      return Math.max(1, Math.floor((item.price || 0) * 0.25));
    },

    sell: function (p, idx) {
      const c = p.bag[idx];
      if (!c) return false;
      const it = G.item(c.id);
      if (!it) return false;
      const gain = this.sellPrice(it) * c.qty;
      p.gold += gain;
      p.stats.goldEarned += gain;
      p.bag[idx] = null;
      G.Audio.play('coin');
      G.UI.toast('出售 ' + it.name + '，获得 ' + gain + ' 金币', 'good');
      return true;
    }
  };

  /* ===== 仓库（V0.2.02：10 页 × 8 列 × 10 行） ===== */
  G.Store = {
    PAGES: 10,
    COLS: 8,
    ROWS: 10,
    PAGE_SIZE: 80,

    empty: function () {
      const a = [];
      for (let i = 0; i < this.PAGES; i++) a.push(new Array(this.PAGE_SIZE).fill(null));
      return a;
    },

    // 兼容旧档：补齐页数与格子
    normalize: function (store) {
      const out = Array.isArray(store) ? store : [];
      for (let pg = 0; pg < this.PAGES; pg++) {
        if (!Array.isArray(out[pg])) out[pg] = [];
        const page = out[pg];
        while (page.length < this.PAGE_SIZE) page.push(null);
        if (page.length > this.PAGE_SIZE) page.length = this.PAGE_SIZE;
      }
      out.length = this.PAGES;
      return out;
    },

    ensure: function (p) {
      p.store = this.normalize(p.store);
      return p.store;
    },

    cell: function (p, page, slot) {
      const st = this.ensure(p);
      const pg = st[(page || 1) - 1];
      if (!pg) return null;
      return pg[slot] || null;
    },

    used: function (p, page) {
      const st = this.ensure(p);
      if (page) {
        const pg = st[page - 1] || [];
        return pg.filter(Boolean).length;
      }
      let n = 0;
      st.forEach(function (pg) { n += pg.filter(Boolean).length; });
      return n;
    },

    // 背包格 → 仓库（当前页优先，堆叠自动合并）
    deposit: function (p, bagIdx, page) {
      const c = p.bag[bagIdx];
      if (!c) return false;
      const st = this.ensure(p);
      const it = G.item(c.id);
      const stack = (it && it.stack) || 1;
      let left = c.qty || 1;

      if (stack > 1) {
        for (let pg = 0; pg < this.PAGES && left > 0; pg++) {
          for (let i = 0; i < this.PAGE_SIZE && left > 0; i++) {
            const s = st[pg][i];
            if (s && s.id === c.id && s.qty < stack) {
              const put = Math.min(stack - s.qty, left);
              s.qty += put;
              left -= put;
            }
          }
        }
      }

      const cur = Math.max(1, Math.min(this.PAGES, page || 1)) - 1;
      const order = [cur];
      for (let pg = 0; pg < this.PAGES; pg++) if (pg !== cur) order.push(pg);
      for (let oi = 0; oi < order.length && left > 0; oi++) {
        const pg = order[oi];
        for (let i = 0; i < this.PAGE_SIZE && left > 0; i++) {
          if (st[pg][i]) continue;
          const put = Math.min(stack, left);
          st[pg][i] = { id: c.id, qty: put, quality: c.quality || 0 };
          left -= put;
        }
      }

      if (left === (c.qty || 1)) {
        G.UI.toast('仓库已满', 'warn');
        return false;
      }
      if (left <= 0) p.bag[bagIdx] = null;
      else c.qty = left;
      G.Audio.play('ui');
      return true;
    },

    // 仓库格 → 背包
    withdraw: function (p, page, slot) {
      const c = this.cell(p, page, slot);
      if (!c) return false;
      const qty = c.qty || 1;
      const added = G.Bag.add(p, c.id, qty);
      if (!added) {
        G.UI.toast('背包已满', 'warn');
        return false;
      }
      if (added >= qty) p.store[(page || 1) - 1][slot] = null;
      else c.qty = qty - added;
      G.Audio.play('ui');
      return true;
    }
  };
})();
