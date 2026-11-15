/* ===== 技能释放 / 升级（V0.2：技能等级 1-3） ===== */
(function () {
  const T = G.CFG.TILE;

  function nearestMonster(p, range) {
    let best = null, bd = 1e9;
    (G.S.monsters || []).forEach(function (m) {
      if (m.hp <= 0) return;
      const d = G.U.dist(p.px, p.py, m.x, m.y) / T;
      if (d <= range && d < bd) { bd = d; best = m; }
    });
    return best;
  }

  function lvOf(p, id) { return Math.max(1, Math.min(G.SKILL_LV_MAX || 3, p.skills[id] || 1)); }

  function eff(sk, lv) {
    const mul = 1 + 0.3 * (lv - 1);
    return {
      mul: mul,
      mp: Math.round(sk.mp + (lv - 1) * sk.mp * 0.3),
      cd: Math.round((sk.cd || 1) * (1 - 0.08 * (lv - 1)) * 10) / 10,
      coef: (sk.coef || 0) * mul
    };
  }

  G.Skills = {
    lv: function (p, id) { return lvOf(p, id); },

    checkLearn: function (p) {
      const ids = G.SKILL_BY_JOB[p.job] || [];
      ids.forEach(function (id) {
        const sk = G.skill(id);
        if (!sk) return;
        if (p.level >= sk.reqLevel && !p.skills[id]) {
          p.skills[id] = 1;
          G.UI.log('学会了新技能：' + sk.name + (sk.passive ? '（被动）' : ''), 'good');
          G.UI.toast('学会技能：' + sk.name, 'good');
          G.Audio.play('level');
          if (G.Panel.isOpen('skill')) G.PageSkill.render();
          G.UI.refreshSkillBar();
        }
      });
    },

    bookOf: function (p) {
      const ids = G.SKILL_BY_JOB[p.job] || [];
      return ids.map(function (id) { return { def: G.skill(id), learned: !!p.skills[id] }; });
    },

    cooldown: function (p, id) { return (p.skillCd && p.skillCd[id]) || 0; },

    // 升级所需：等级 / 金币 / 技能书
    upgradeInfo: function (p, id) {
      const sk = G.skill(id);
      const lv = lvOf(p, id);
      return {
        lv: lv,
        max: G.SKILL_LV_MAX || 3,
        needLevel: sk.reqLevel + lv * 5,
        gold: 300 * lv,
        books: 1
      };
    },

    upgrade: function (p, id) {
      const sk = G.skill(id);
      if (!sk) return false;
      if (!p.skills[id]) { G.UI.toast('尚未学会该技能', 'warn'); return false; }
      const info = this.upgradeInfo(p, id);
      if (info.lv >= info.max) { G.UI.toast('技能已达最高等级', 'warn'); return false; }
      if (p.level < info.needLevel) { G.UI.toast('需要角色等级 Lv.' + info.needLevel, 'warn'); return false; }
      let bookIdx = -1;
      for (let i = 0; i < p.bag.length; i++) {
        const c = p.bag[i];
        if (c && c.id === 'c_skillbook') { bookIdx = i; break; }
      }
      if (bookIdx < 0) { G.UI.toast('需要 1 本技能书', 'warn'); return false; }
      if (p.gold < info.gold) { G.UI.toast('金币不足（需要 ' + info.gold + '）', 'warn'); return false; }
      G.Bag.removeAt(p, bookIdx, 1);
      p.gold -= info.gold;
      p.skills[id] = info.lv + 1;
      G.Audio.play('level');
      G.UI.log('技能「' + sk.name + '」提升至 Lv.' + p.skills[id], 'good');
      G.UI.toast(sk.name + ' 升至 Lv.' + p.skills[id], 'good');
      if (G.Panel.isOpen('skill')) G.PageSkill.render();
      if (G.Panel.isOpen('bag')) G.PageBag.render();
      G.UI.refreshSkillBar();
      G.State.save(true);
      return true;
    },

    cast: function (p, id) {
      const sk = G.skill(id);
      if (!sk) return false;
      if (!p.skills[id]) { G.UI.toast('尚未学会该技能', 'warn'); return false; }
      if (sk.passive) { G.UI.toast('被动技能无需释放', 'warn'); return false; }
      const lv = lvOf(p, id);
      const e = eff(sk, lv);
      if (this.cooldown(p, id) > 0) { G.UI.toast('技能冷却中', 'warn'); return false; }
      if (p.mp < e.mp) { G.UI.toast('魔法值不足', 'warn'); return false; }

      const st = G.Equip.stats(p);

      /* ---------- 治疗 ---------- */
      if (sk.type === 'heal') {
        if (p.hp >= st.hpMax) { G.UI.toast('生命值已满', 'warn'); return false; }
        const heal = Math.round(((sk.base || 0) + (st.tao[0] + st.tao[1]) / 2 * e.coef) * (1 + 0.2 * (lv - 1)));
        p.hp = Math.min(st.hpMax, p.hp + heal);
        p.mp -= e.mp;
        p.skillCd[id] = e.cd;
        p.buffs = (p.buffs || []).filter(function (b) { return b.type !== 'poison' && b.type !== 'burn'; });
        G.Projectile.float(p.px, p.py - 40, '+' + heal, '#7cfc7c');
        G.Projectile.spawnAt(p.px, p.py - 20, { kind: 'heal', color: '#7cfc7c', life: 0.5 });
        G.Audio.play('cast');
        return true;
      }

      /* ---------- 护盾类 Buff ---------- */
      if (sk.type === 'buff') {
        p.buffs = (p.buffs || []).filter(function (b) { return b.type !== sk.buff; });
        p.buffs.push({ type: sk.buff, t: sk.dur, val: sk.val, dps: 0, tick: 0 });
        p.mp -= e.mp;
        p.skillCd[id] = e.cd;
        G.Projectile.float(p.px, p.py - 42, sk.name, '#7db8ff');
        G.Projectile.spawnAt(p.px, p.py - 20, { kind: 'heal', color: '#7db8ff', life: 0.5 });
        G.UI.log('获得「' + sk.name + '」效果 ' + sk.dur + ' 秒', 'sys');
        G.Audio.play('cast');
        return true;
      }

      /* ---------- 群体伤害 ---------- */
      if (sk.type === 'aoe') {
        const cx = p.target && p.target.hp > 0 ? p.target.x : p.px;
        const cy = p.target && p.target.hp > 0 ? p.target.y : p.py;
        let hitCount = 0;
        (G.S.monsters || []).forEach(function (m) {
          if (m.hp <= 0) return;
          if (G.U.dist(cx, cy, m.x, m.y) / T > sk.range) return;
          let res;
          if (p.job === 1) res = G.Dmg.calcPhysical(st.atk, m.def.def, st.acc, m.def.agi, st.dodgeP);
          else {
            const stat = p.job === 3 ? st.tao : st.mag;
            res = G.Dmg.calcMagic(stat, e.coef, m.def.mdef, st.acc, m.def.agi, st.dodgeP);
          }
          if (p.job === 1) res.dmg = Math.round(res.dmg * e.coef);
          G.Dmg.hitMonster(m, res, sk.fx === 'fire' ? '#ff9f43' : '#bfe0ff');
          if (p.job === 1 && !res.miss) G.Dmg.tryPara(m, st);
          hitCount++;
        });
        if (!hitCount) { G.UI.toast('范围内没有目标', 'warn'); return false; }
        p.mp -= e.mp;
        p.skillCd[id] = e.cd;
        p.atkAnim = 0.25;
        p.lastCombat = 0;
        G.Projectile.spawnAt(cx, cy - 10, { kind: 'heal', color: sk.fx === 'fire' ? '#ff9f43' : '#bfe0ff', life: 0.5 });
        G.Camera.shakeIt(2);
        G.Audio.play('cast');
        return true;
      }

      /* ---------- 单体技能 ---------- */
      let target = p.target;
      const range = sk.range || 1.6;
      if (!target || target.hp <= 0 ||
          G.U.dist(p.px, p.py, target.x, target.y) / T > range + 0.3) {
        target = nearestMonster(p, range);
      }
      if (!target) { G.UI.toast('范围内没有目标', 'warn'); return false; }

      let res;
      if (sk.type === 'projectile' || sk.type === 'instant') {
        const statRange = p.job === 3 ? st.tao : st.mag;
        res = G.Dmg.calcMagic(statRange, e.coef, target.def.mdef, st.acc, target.def.agi, st.dodgeP);
      } else {
        res = G.Dmg.calcPhysical(st.atk, target.def.def, st.acc, target.def.agi, st.dodgeP);
        res.dmg = Math.round(res.dmg * e.coef);
      }
      p.mp -= e.mp;
      p.skillCd[id] = e.cd;
      p.lastCombat = 0;
      p.atkAnim = 0.25;
      p.target = target;
      G.S.target = target;
      target.state = 'chase';
      G.Audio.play('cast');

      if (sk.type === 'instant') {
        G.Dmg.hitMonster(target, res, sk.fx === 'poison' ? '#8fd86a' : '#bfe0ff');
        G.Projectile.spawnAt(target.x, target.y - 20, {
          kind: sk.fx === 'poison' ? 'heal' : 'thunder',
          color: sk.fx === 'poison' ? '#8fd86a' : '#cfe4ff', life: 0.4
        });
        G.Camera.shakeIt(2);
      } else if (sk.type === 'projectile') {
        G.Projectile.spawn(p, target, {
          kind: sk.fx === 'fire' ? 'fire' : 'talisman',
          color: sk.fx === 'fire' ? '#ff9f43' : '#ffe066',
          speed: 440, dmg: res, tag: sk.name
        });
      } else {
        G.Dmg.hitMonster(target, res, '#ffe9b0');
        if (p.job === 1 && !res.miss) G.Dmg.tryPara(target, st);
        G.Audio.play('hit');
      }
      return true;
    }
  };
})();
