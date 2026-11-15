/* ===== V0.2 图鉴面板（V0.2.01：怪物掉落 / 装备属性 / 里程碑） ===== */
(function () {
  function pct(n) {
    if (!n) return '—';
    const p = 100 / n;
    return p >= 100 ? '100%' : p.toFixed(2) + '%';
  }

  G.PageGallery = {
    tab: 'monster',
    selMon: '',
    selItem: '',

    render: function () {
      const p = G.S.player;
      G.Gallery.ensure(p);
      const mons = G.Gallery.monsterList(p);
      const items = G.Gallery.itemList(p);
      const seenMon = mons.filter(function (m) { return m.kills > 0; }).length;
      const seenItem = items.filter(function (i) { return i.seen; }).length;
      const kt = G.Gallery.killTotal(p);

      let html = '<div class="gal-head">';
      html += '<span>击杀总数 <b>' + kt + '</b></span>';
      html += '<span>怪物图鉴 <b>' + seenMon + '/' + mons.length + '</b></span>';
      html += '<span>掉落装备 <b>' + seenItem + '/' + items.length + '</b></span>';
      html += '</div>';

      html += '<div class="gal-tabs">';
      [['monster', '怪物图鉴'], ['drop', '掉落装备'], ['mile', '里程碑']].forEach(function (t) {
        html += '<button class="btn' + (this.tab === t[0] ? ' primary' : '') +
          '" data-act="gallery-tab" data-tab="' + t[0] + '">' + t[1] + '</button>';
      }, this);
      html += '</div>';

      if (this.tab === 'monster') {
        html += '<div class="gal-grid">';
        mons.forEach(function (m) {
          html += '<div class="gal-cell' + (m.kills ? '' : ' unknown') + (m.boss ? ' boss' : '') +
            (this.selMon === m.name ? ' sel' : '') +
            '" data-act="gallery-monster" data-name="' + G.U.esc(m.name) + '">' +
            '<div class="gn">' + G.U.esc(m.name) + '</div>' +
            '<div class="gt">' + m.tier + ' 阶' + (m.boss ? ' · BOSS' : '') + '</div>' +
            '<div class="gk">' + (m.kills ? ('击杀 ' + m.kills) : '未击杀') + '</div></div>';
        }, this);
        html += '</div>';
        html += this.monDetail();
      } else if (this.tab === 'drop') {
        html += '<div class="gal-grid">';
        items.forEach(function (r) {
          const q = (G.QUALITY[r.item.quality || 0] || G.QUALITY[0]).color;
          html += '<div class="gal-cell' + (r.seen ? '' : ' unknown') + (this.selItem === r.id ? ' sel' : '') +
            '" data-act="gallery-item" data-id="' + r.id + '">' +
            '<div class="gn" style="color:' + q + '">' + G.U.esc(r.item.name) + '</div>' +
            '<div class="gt">' + (r.item.reqLevel ? ('Lv.' + r.item.reqLevel) : '—') + '</div>' +
            '<div class="gk">' + (r.seen ? '已收录' : '未掉落') + '</div></div>';
        }, this);
        html += '</div>';
        html += this.itemDetail();
      } else {
        html += '<div class="skill-list">';
        G.Gallery.MILESTONES.forEach(function (ms) {
          const cur = ms.type === 'kill' ? G.Gallery.killTotal(p) : G.Gallery.dropTotal(p);
          const done = !!p.gallery.claim[ms.id];
          html += '<div class="skill-item' + (done ? ' locked' : '') + '">' +
            '<div class="skill-ico">' + (done ? '✔' : '☆') + '</div>' +
            '<div class="skill-info"><div class="skill-nm">' + G.U.esc(ms.text) +
            '<span class="tag">' + (done ? '已领取' : '进行中') + '</span></div>' +
            '<div class="skill-desc">奖励：经验 +' + ms.exp + '，金币 +' + ms.gold + '</div></div>' +
            '<div class="skill-meta">' + Math.min(cur, ms.need) + '/' + ms.need + '</div></div>';
        });
        html += '</div>';
      }

      G.Panel.open('gallery', '图鉴', html, { width: 640, x: 192, y: 120 });
    },

    /* 怪物掉落：选中怪物的全部装备掉落与概率 */
    monDetail: function () {
      if (!this.selMon) {
        return '<div class="gal-detail"><div class="gal-empty">点击上方怪物，查看其可掉落的装备与概率。</div></div>';
      }
      const list = G.Gallery.monsterDrops(this.selMon);
      let h = '<div class="gal-detail"><div class="gal-dtitle">' + G.U.esc(this.selMon) +
        ' · 可掉落装备 <span class="tag">' + list.length + ' 件</span></div>';
      if (!list.length) {
        h += '<div class="gal-empty">该怪物不掉落装备。</div>';
      } else {
        h += '<div class="gal-dl">';
        list.forEach(function (r) {
          const q = (G.QUALITY[r.item.quality || 0] || G.QUALITY[0]).color;
          h += '<div class="gal-row"><span class="gn" style="color:' + q + '">' +
            G.U.esc(r.item.name) + '</span><span class="gp">1/' + r.n +
            '（' + pct(r.n) + '）</span></div>';
        });
        h += '</div>';
      }
      h += '<div class="gal-note">概率为单次击杀掉落判定；同名不同阶/变体取最高爆率。</div></div>';
      return h;
    },

    /* 掉落装备：选中装备的基本属性 */
    itemDetail: function () {
      if (!this.selItem) {
        return '<div class="gal-detail"><div class="gal-empty">点击上方装备，查看其基本属性。</div></div>';
      }
      const it = G.item(this.selItem);
      if (!it) return '';
      let h = '<div class="gal-detail"><div class="gal-dtitle">装备属性</div><div class="gal-tip">';
      h += G.UI.itemTipHTML(this.selItem);
      h += '</div></div>';
      return h;
    }
  };
})();
