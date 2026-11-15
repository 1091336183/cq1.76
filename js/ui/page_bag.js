/* ===== 背包面板 ===== */
(function () {
  G.PageBag = {
    open: function () {
      G.Panel.open('bag', '背包', this.html(), { width: 478, x: 548, y: 74 });
    },

    render: function () {
      if (G.Panel.isOpen('bag')) G.Panel.setHTML('bag', this.html());
    },

    html: function () {
      const p = G.S.player;
      const w = G.Bag.weight(p), wm = G.Equip.stats(p).weightMax;
      const pct = Math.min(100, w / wm * 100);
      let cells = '';
      for (let i = 0; i < p.bag.length; i++) {
        const c = p.bag[i];
        if (!c) {
          cells += '<div class="cell empty" data-drop="bag" data-idx="' + i + '"></div>';
        } else {
          cells += '<div class="cell q' + (c.quality || 0) + '" data-drag="bag" data-drop="bag" data-idx="' + i + '" data-tip="bag:' + i + '">' +
            G.UI.icon(c.id) +
            (c.qty > 1 ? '<span class="qty">' + c.qty + '</span>' : '') + '</div>';
        }
      }
      return '<div class="bag-head">' +
        '<span>金币 <b class="gold-val">' + G.U.fmt(p.gold) + '</b></span>' +
        '<span class="dim">负重 ' + w + ' / ' + wm + '</span>' +
        '<span style="margin-left:auto">' +
        '<button class="btn small" data-act="bag-sort">整理</button> ' +
        '<button class="btn small" data-act="bag-selljunk">一键卖白装</button></span>' +
        '</div>' +
        '<div class="bag-grid">' + cells + '</div>' +
        '<div class="bag-foot"><span>负重</span>' +
        '<div class="weight-bar' + (pct >= 100 ? ' over' : '') + '"><i style="width:' + pct + '%"></i></div>' +
        '<span class="gold-val">' + w + ' / ' + wm + '</span></div>' +
        '<div class="start-tip">双击装备穿戴 / 双击药水使用 ｜ 右键更多操作 ｜ 拖拽可移动或穿戴</div>';
    }
  };

  /* ===== 仓库面板（V0.2.02：10 页 × 8 列 × 10 行） ===== */
  G.PageStore = {
    page: 1,

    open: function () {
      this.page = 1;
      G.Panel.open('store', '仓库', this.html(), { width: 810, x: 107, y: 40 });
    },

    render: function () {
      if (G.Panel.isOpen('store')) G.Panel.setHTML('store', this.html());
    },

    html: function () {
      const p = G.S.player;
      const pg = this.page;
      G.Store.ensure(p);

      let bag = '';
      for (let i = 0; i < p.bag.length; i++) {
        const c = p.bag[i];
        if (!c) bag += '<div class="cell empty"></div>';
        else {
          bag += '<div class="cell q' + (c.quality || 0) + '" data-act="store-deposit" data-idx="' + i +
            '" data-tip="bag:' + i + '">' + G.UI.icon(c.id) +
            (c.qty > 1 ? '<span class="qty">' + c.qty + '</span>' : '') + '</div>';
        }
      }

      let grid = '';
      const pageCells = p.store[pg - 1];
      for (let i = 0; i < G.Store.PAGE_SIZE; i++) {
        const c = pageCells[i];
        if (!c) grid += '<div class="cell empty"></div>';
        else {
          grid += '<div class="cell q' + (c.quality || 0) + '" data-act="store-withdraw" data-page="' + pg +
            '" data-slot="' + i + '" data-tip="store:' + pg + ':' + i + '">' + G.UI.icon(c.id) +
            (c.qty > 1 ? '<span class="qty">' + c.qty + '</span>' : '') + '</div>';
        }
      }

      let pager = '';
      for (let i = 1; i <= G.Store.PAGES; i++) {
        pager += '<button class="btn small' + (i === pg ? ' cur' : '') + '" data-act="store-page" data-page="' + i + '">' +
          i + '</button>';
      }

      const w = G.Bag.weight(p), wm = G.Equip.stats(p).weightMax;
      return '<div class="store-wrap">' +
        '<div class="store-col"><h4>背包 · 点击存入</h4><div class="store-grid bag9">' + bag + '</div>' +
        '<div class="store-meta">金币 ' + G.U.fmt(p.gold) + ' ｜ 负重 ' + w + ' / ' + wm + '</div></div>' +
        '<div class="store-col"><h4>仓库 · 第 ' + pg + ' 页 · 点击取出</h4><div class="store-grid">' + grid + '</div>' +
        '<div class="store-pager">' + pager + '</div>' +
        '<div class="store-meta">本页 ' + G.Store.used(p, pg) + ' / ' + G.Store.PAGE_SIZE +
        ' ｜ 总计 ' + G.Store.used(p) + ' / ' + (G.Store.PAGES * G.Store.PAGE_SIZE) + '</div></div></div>' +
        '<div class="start-tip">仓库不占负重、不收费 ｜ 物品随存档保存，死亡不掉落</div>';
    }
  };
})();
