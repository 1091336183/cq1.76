/* ===== 伤害计算 ===== */
(function () {
  function hitChance(acc, agi, dodge) {
    return G.U.clamp(0.80 + (acc - agi) * 0.01 - (dodge || 0) * 0.01, 0.5, 0.97);
  }

  G.Dmg = {
    hitChance: hitChance,

    calcPhysical: function (atkRange, defRange, acc, agi, dodge) {
      if (Math.random() > hitChance(acc, agi, dodge)) return { miss: true, dmg: 0, crit: false };
      let dmg = G.U.rollMinMax(atkRange) - G.U.rollMinMax(defRange);
      dmg = Math.max(1, dmg) * G.U.rf(0.9, 1.1);
      let crit = false;
      if (Math.random() < G.CFG.CRIT_BASE) { crit = true; dmg *= 1.5; }
      return { miss: false, dmg: Math.max(1, Math.round(dmg)), crit: crit };
    },

    calcMagic: function (magRange, coef, mdef, acc, agi, dodge) {
      if (Math.random() > hitChance(acc, agi, dodge)) return { miss: true, dmg: 0, crit: false };
      let dmg = G.U.rollMinMax(magRange) * coef - Math.random() * (mdef || 0);
      dmg = Math.max(1, dmg) * G.U.rf(0.92, 1.08);
      let crit = false;
      if (Math.random() < G.CFG.CRIT_BASE) { crit = true; dmg *= 1.5; }
      return { miss: false, dmg: Math.max(1, Math.round(dmg)), crit: crit };
    },

    hitMonster: function (m, res, color) {
      if (!m || m.hp <= 0) return;
      m.state = 'chase';
      if (res.miss) {
        G.Projectile.float(m.x, m.y - 30, '闪避', '#9fd8ff');
        return;
      }
      m.hp -= res.dmg;
      m.flash = 0.16;
      const txt = (res.crit ? '暴击 ' : '') + res.dmg;
      G.Projectile.float(m.x + G.U.rf(-6, 6), m.y - 30, txt, res.crit ? '#ff9f43' : (color || '#fff'));
      if (m.hp <= 0) {
        m.hp = 0;
        G.Loot.onMonsterKill(m);
      }
    },

    // 麻痹判定：近战命中后按 st.para（%）概率定身 3 秒
    tryPara: function (m, st) {
      if (!m || m.hp <= 0 || !st || !st.para) return false;
      if (Math.random() * 100 >= st.para) return false;
      m.stun = 3;
      G.Projectile.float(m.x, m.y - 44, '麻痹', '#9fd8ff');
      return true;
    }
  };
})();
