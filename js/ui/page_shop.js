/* ===== 商店面板 ===== */
(function () {
  G.PageShop = {
    shopId: null,

    open: function (shopId) {
      this.shopId = shopId;
      const def = G.shopDef(shopId);
      G.Panel.open('shop', '商店 · ' + (def ? def.name : ''), this.html(), { width: 620, x: 200, y: 74 });
    },

    render: function () {
      if (G.Panel.isOpen('shop')) G.Panel.setHTML('shop', this.html());
    },

    html: function () {
      const p = G.S.player;
      const def = G.shopDef(this.shopId);
      if (!def) return '<div class="start-tip">商店不存在。</div>';

      let buy = '';
      def.items.forEach(function (id) {
        const it = G.item(id);
        if (!it) return;
        buy += '<div class="shop-row">' + G.UI.icon(id) +
          '<span class="nm">' + G.U.esc(it.name) + '</span>' +
          '<span class="pr">' + it.price + ' 金</span>' +
          '<button class="btn small" data-act="shop-buy" data-item="' + id + '">购买</button></div>';
      });
      if (!buy) buy = '<div class="start-tip">暂无货物</div>';

      let sell = '';
      p.bag.forEach(function (c, i) {
        if (!c) return;
        const it = G.item(c.id);
        if (!it) return;
        const price = G.Bag.sellPrice(it) * (c.qty || 1);
        sell += '<div class="shop-row" data-tip="bag:' + i + '">' + G.UI.icon(c.id) +
          '<span class="nm">' + G.U.esc(it.name) + (c.qty > 1 ? ' ×' + c.qty : '') + '</span>' +
          '<span class="pr">' + price + ' 金</span>' +
          '<button class="btn small" data-act="shop-sell" data-idx="' + i + '">出售</button></div>';
      });
      if (!sell) sell = '<div class="start-tip">背包里没有可出售的物品</div>';

      return '<div class="bag-head"><span>金币 <b class="gold-val">' + G.U.fmt(p.gold) + '</b></span>' +
        '<span class="dim">负重 ' + G.Bag.weight(p) + ' / ' + G.Equip.stats(p).weightMax + '</span></div>' +
        '<div class="shop-wrap">' +
        '<div class="shop-col"><h4>购买</h4><div class="shop-list">' + buy + '</div></div>' +
        '<div class="shop-col"><h4>出售（25% 折价）</h4><div class="shop-list">' + sell + '</div></div>' +
        '</div>';
    }
  };
})();
