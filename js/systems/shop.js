/* ===== 商店系统 ===== */
(function () {
  G.Shop = {
    buy: function (p, itemId, qty) {
      qty = qty || 1;
      const it = G.item(itemId);
      if (!it) return false;
      const cost = it.price * qty;
      if (p.gold < cost) { G.UI.toast('金币不足，需要 ' + cost + ' 金币', 'warn'); return false; }
      if (!G.Bag.canCarry(p, itemId, qty)) { G.UI.toast('负重不足，无法携带', 'warn'); return false; }
      const added = G.Bag.add(p, itemId, qty);
      if (added <= 0) { G.UI.toast('背包已满', 'warn'); return false; }
      p.gold -= it.price * added;
      G.Audio.play('coin');
      G.UI.toast('购买 ' + it.name + ' ×' + added, 'good');
      if (G.Panel.isOpen('shop')) G.PageShop.render();
      if (G.Panel.isOpen('bag')) G.PageBag.render();
      return true;
    },

    sell: function (p, idx) {
      const ok = G.Bag.sell(p, idx);
      if (ok) {
        if (G.Panel.isOpen('shop')) G.PageShop.render();
        if (G.Panel.isOpen('bag')) G.PageBag.render();
      }
      return ok;
    }
  };
})();
