/* ===== 技能面板（V0.2：等级 1-3 / 技能书升级） ===== */
(function () {
  G.PageSkill = {
    open: function () {
      G.Panel.open('skill', '技能', this.html(), { width: 520, x: 252, y: 70 });
    },

    render: function () {
      if (G.Panel.isOpen('skill')) G.Panel.setHTML('skill', this.html());
    },

    html: function () {
      const p = G.S.player;
      const job = G.JOBS[p.job];
      const book = G.Skills.bookOf(p);
      const books = G.Bag.countOf(p, 'c_skillbook');
      let list = '';
      let keyIdx = 0;
      book.forEach(function (s) {
        const d = s.def;
        if (!d.passive) keyIdx += 1;
        const k = keyIdx;
        const info = G.Skills.upgradeInfo(p, d.id);
        const meta = [];
        if (d.passive) meta.push('被动');
        else {
          meta.push('消耗 ' + d.mp + ' MP');
          meta.push('冷却 ' + d.cd + ' 秒');
          if (d.range) meta.push('射程 ' + d.range + ' 格');
        }
        if (s.learned) meta.push('当前 Lv.' + info.lv + '/' + info.max);

        let btn;
        if (!s.learned) {
          btn = '<button class="btn small" disabled>需 Lv.' + d.reqLevel + '</button>';
        } else if (info.lv >= info.max) {
          btn = '<button class="btn small" disabled>已满级</button>';
        } else {
          const canUp = p.level >= info.needLevel && p.gold >= info.gold && books >= info.books;
          btn = '<button class="btn small' + (canUp ? ' primary' : '') + '" data-act="skill-up" data-skill="' +
            d.id + '" title="需要 Lv.' + info.needLevel + ' / ' + info.gold + ' 金 / ' + info.books + ' 本技能书">' +
            '升级 ▲</button>';
        }
        const castBtn = (s.learned && !d.passive)
          ? '<button class="btn small' + (k <= 8 ? ' primary' : '') + '" data-act="cast" data-skill="' +
            d.id + '">释放' + (k <= 8 ? ' F' + k : '') + '</button>'
          : '';

        list += '<div class="skill-item' + (s.learned ? '' : ' locked') + '">' +
          '<div class="skill-ico">' + d.icon + '</div>' +
          '<div class="skill-info">' +
          '<div class="skill-nm">' + G.U.esc(d.name) +
          '<span class="tag">' + (s.learned ? ('Lv.' + info.lv + ' / ' + info.max) : '需 Lv.' + d.reqLevel) + '</span></div>' +
          '<div class="skill-desc">' + G.U.esc(d.desc) + '</div>' +
          '<div class="skill-meta">' + meta.join(' ｜ ') + '</div>' +
          (s.learned && info.lv < info.max
            ? '<div class="skill-meta" style="color:#c8a24a">升级：Lv.' + info.needLevel +
              ' ｜ ' + info.gold + ' 金 ｜ ' + info.books + ' 本技能书（持有 ' + books + '）</div>'
            : '') +
          '</div>' +
          '<div class="skill-btns">' + btn + castBtn + '</div></div>';
      });

      return '<div class="char-sub">' + job.name + ' 技能书 ｜ 达到等级自动学会 ｜ 技能等级上限 3 级</div>' +
        '<div class="skill-list">' + list + '</div>' +
        '<div class="start-tip">快捷键 F1-F8 对应上方技能顺序；升级消耗技能书（隐士处有售）。</div>';
    }
  };
})();
