/* ===== 装备系统 ===== */
(function () {
  G.SLOTS = [
    { key: 'helmet', name: '头盔' },
    { key: 'necklace', name: '项链' },
    { key: 'weapon', name: '武器' },
    { key: 'armor', name: '衣服' },
    { key: 'shield', name: '盾牌' },
    { key: 'braceletL', name: '左手镯' },
    { key: 'braceletR', name: '右手镯' },
    { key: 'ringL', name: '左戒指' },
    { key: 'ringR', name: '右戒指' },
    { key: 'boots', name: '鞋子' }
  ];

  function emptyEquip() {
    return {
      helmet: null, necklace: null, weapon: null, armor: null, shield: null,
      braceletL: null, braceletR: null, ringL: null, ringR: null, boots: null
    };
  }

  function inst(itemId) {
    return { id: itemId, qty: 1, quality: 0 };
  }

  const SLOT_LABEL = {};
  G.SLOTS.forEach(function (s) { SLOT_LABEL[s.key] = s.name; });

  G.Equip = {
    emptyEquip: emptyEquip,
    inst: inst,
    slotLabel: function (key) { return SLOT_LABEL[key] || key; },

    canEquip: function (p, item) {
      if (!item) return { ok: false, msg: '物品不存在' };
      if (!G.isEquip(item)) return { ok: false, msg: '该物品不可装备' };
      if (p.level < item.reqLevel) return { ok: false, msg: '需要等级 Lv.' + item.reqLevel };
      if (item.reqJob && item.reqJob !== 0 && item.reqJob !== p.job) {
        return { ok: false, msg: '需要职业：' + (G.JOB_NAME[item.reqJob] || '?') };
      }
      return { ok: true, msg: '' };
    },

    // 找到该装备可用的装备栏 key
    slotFor: function (p, item, preferKey) {
      if (preferKey && p.equip.hasOwnProperty(preferKey)) return preferKey;
      if (item.slot === 'bracelet') {
        if (!p.equip.braceletL) return 'braceletL';
        if (!p.equip.braceletR) return 'braceletR';
        return 'braceletL';
      }
      if (item.slot === 'ring') {
        if (!p.equip.ringL) return 'ringL';
        if (!p.equip.ringR) return 'ringR';
        return 'ringL';
      }
      return item.slot;
    },

    // 从背包穿戴到装备栏（换下的装备回到该背包格）
    equip: function (p, bagIndex, slotKey) {
      const cell = p.bag[bagIndex];
      if (!cell) return false;
      const item = G.item(cell.id);
      if (!G.isEquip(item)) return false;
      const chk = this.canEquip(p, item);
      if (!chk.ok) { G.UI.toast(chk.msg, 'warn'); return false; }
      const key = this.slotFor(p, item, slotKey);
      if (!p.equip.hasOwnProperty(key)) return false;
      const old = p.equip[key];
      p.equip[key] = { id: cell.id, qty: 1, quality: cell.quality || 0 };
      p.bag[bagIndex] = old || null;
      G.Audio.play('ui');
      return true;
    },

    unequip: function (p, slotKey) {
      const eq = p.equip[slotKey];
      if (!eq) return false;
      const free = G.Bag.firstFree(p);
      if (free < 0) { G.UI.toast('背包已满', 'warn'); return false; }
      p.bag[free] = eq;
      p.equip[slotKey] = null;
      G.Audio.play('ui');
      return true;
    },

    stats: function (p) {
      const job = G.JOBS[p.job];
      const L = p.level;
      function r2(arr) { return [Math.round(arr[0]), Math.round(arr[1])]; }
      const st = {
        atk: r2(job.atk(L)),
        tao: r2(job.tao(L)),
        mag: r2(job.mag(L)),
        def: r2(job.def(L)),
        mdef: r2(job.mdef(L)),
        hpMax: Math.round(job.hp(L)),
        mpMax: Math.round(job.mp(L)),
        acc: 5 + Math.floor((L - 1) / 6),
        agi: 4 + Math.floor((L - 1) / 8),
        aspd: 0, mspd: 0, dodgeP: 0, dodgeM: 0, para: 0,
        weightMax: 60 + 6 * L
      };
      // 性别
      if (p.gender === 0) {
        st.hpMax += 10;
        st.weightMax += 20;
        st.def[0] += Math.floor(L / 10);
        st.def[1] += Math.floor(L / 10);
        st.weightMax += Math.floor(L / 10);
      } else {
        st.dodgeP += 1;
        st.dodgeM += 1;
        st.mpMax += 5 * Math.floor(L / 10);
      }
      // 加点
      const A = p.alloc || {};
      ['atk', 'tao', 'mag', 'def', 'mdef'].forEach(function (k) {
        if (A[k]) { st[k][0] += A[k][0] || 0; st[k][1] += A[k][1] || 0; }
      });
      // 装备
      Object.keys(p.equip || {}).forEach(function (slot) {
        const cell = p.equip[slot];
        if (!cell) return;
        const it = G.item(cell.id);
        if (!it) return;
        ['atk', 'tao', 'mag', 'def', 'mdef'].forEach(function (k) {
          if (it[k]) { st[k][0] += it[k][0]; st[k][1] += it[k][1]; }
        });
        st.hpMax += it.hp || 0;
        st.mpMax += it.mp || 0;
        st.acc += it.acc || 0;
        st.agi += it.agi || 0;
        st.aspd += it.aspd || 0;
        st.mspd += it.mspd || 0;
        st.para += it.para || 0;
      });
      // 被动技能
      if (p.job === 1 && p.skills && p.skills.sk_jiben) st.acc += 3;
      return st;
    },

    // 战力评分（用于人物面板 AP）
    power: function (p) {
      const st = this.stats(p);
      const main = p.job === 1 ? st.atk : (p.job === 2 ? st.mag : st.tao);
      const avgMain = (main[0] + main[1]) / 2;
      const avgDef = (st.def[0] + st.def[1]) / 2;
      const avgMdef = (st.mdef[0] + st.mdef[1]) / 2;
      return Math.round(avgMain * 6 + avgDef * 4 + avgMdef * 3 + st.hpMax * 0.6 + st.mpMax * 0.2);
    }
  };
})();
