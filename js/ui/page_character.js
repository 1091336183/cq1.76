/* ===== 人物面板 ===== */
(function () {
  G.PageCharacter = {
    open: function () {
      G.Panel.open('character', '人物', this.html(), { width: 540, x: 90, y: 74 });
    },

    render: function () {
      if (G.Panel.isOpen('character')) G.Panel.setHTML('character', this.html());
    },

    html: function () {
      const p = G.S.player;
      const st = G.Equip.stats(p);
      const job = G.JOBS[p.job];

      let equipHtml = '';
      G.SLOTS.forEach(function (s) {
        const cell = p.equip[s.key];
        if (cell) {
          equipHtml += '<div class="equip-box">' +
            '<div class="cell q' + (cell.quality || 0) + '" data-act="unequip" data-slot="' + s.key + '" data-drop="equip" data-tip="equip:' + s.key + '">' +
            G.UI.icon(cell.id) + '</div>' +
            '<div class="eq-label">' + s.name + '</div></div>';
        } else {
          equipHtml += '<div class="equip-box">' +
            '<div class="cell empty" data-drop="equip" data-slot="' + s.key + '"></div>' +
            '<div class="eq-label">' + s.name + '</div></div>';
        }
      });

      function row(label, val, stat) {
        let add = '';
        if (stat && p.points > 0) {
          add = '<span class="add" data-act="addpoint" data-stat="' + stat + '">+</span>';
        }
        return '<div class="stat-row"><span>' + label + '</span>' +
          '<span><span class="v">' + val + '</span>' + add + '</span></div>';
      }
      function rr(r) { return r[0] + '-' + r[1]; }

      const mainLabel = p.job === 1 ? '攻击' : (p.job === 2 ? '魔法' : '道术');

      let mainHtml = '';
      mainHtml += row('攻击', rr(st.atk), 'atk');
      mainHtml += row('魔法', rr(st.mag), 'mag');
      mainHtml += row('道术', rr(st.tao), 'tao');
      mainHtml += row('防御', rr(st.def), 'def');
      mainHtml += row('魔防', rr(st.mdef), 'mdef');
      mainHtml += row('生命上限', st.hpMax);
      mainHtml += row('魔法上限', st.mpMax);
      mainHtml += row('准确 / 敏捷', st.acc + ' / ' + st.agi);
      if (p.job === 2) mainHtml += row('攻击距离', '3.2 格');
      if (p.gender === 1) mainHtml += row('女性闪避', '+' + st.dodgeP + ' / +' + st.dodgeM);

      const w = G.Bag.weight(p), wm = st.weightMax;

      return '<div class="char-wrap">' +
        '<div class="equip-side"><div class="equip-grid">' + equipHtml + '</div></div>' +
        '<div class="char-main">' +
        '<div class="char-name">' + G.U.esc(p.name) + '</div>' +
        '<div class="char-sub">Lv.' + p.level + ' ' + job.name + ' · ' + (p.gender === 0 ? '男' : '女') +
        ' ｜ 可分配点 <span class="gold">' + p.points + '</span></div>' +
        mainHtml +
        '<div class="char-foot">' +
        '<div class="box"><b>' + G.Equip.power(p) + '</b><span>战力</span></div>' +
        '<div class="box"><b>' + G.U.fmt(w) + '/' + wm + '</b><span>负重</span></div>' +
        '<div class="box"><b>' + G.U.fmt(p.gold) + '</b><span>金币</span></div>' +
        '</div>' +
        '<div class="char-sub" style="margin-top:8px">主属性：' + mainLabel + ' ｜ 每级获得 2 点属性点</div>' +
        '</div></div>';
    }
  };
})();
