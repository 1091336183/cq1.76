/* ===== 技能数据（V0.1：三职业各 2 个） ===== */
(function () {
  G.SKILLS = {
    sk_jiben: {
      id: 'sk_jiben', name: '基本剑术', job: 1, reqLevel: 7, passive: true,
      icon: '⚔', desc: '被动：准确 +3，剑法更易命中。'
    },
    sk_gongsha: {
      id: 'sk_gongsha', name: '攻杀剑术', job: 1, reqLevel: 19,
      mp: 6, cd: 3, coef: 1.6, range: 1.6, type: 'melee',
      icon: '⚡', desc: '对目标造成 160% 攻击伤害。'
    },
    sk_huoqiu: {
      id: 'sk_huoqiu', name: '火球术', job: 2, reqLevel: 7,
      mp: 8, cd: 2, coef: 1.3, range: 7, type: 'projectile', fx: 'fire',
      icon: '🔥', desc: '发射火球，造成 130% 魔法伤害。'
    },
    sk_leidian: {
      id: 'sk_leidian', name: '雷电术', job: 2, reqLevel: 15,
      mp: 16, cd: 4, coef: 1.9, range: 7, type: 'instant', fx: 'thunder',
      icon: '⚡', desc: '召唤雷电，瞬间造成 190% 魔法伤害。'
    },
    sk_zhiyu: {
      id: 'sk_zhiyu', name: '治愈术', job: 3, reqLevel: 7,
      mp: 10, cd: 5, coef: 1.2, base: 30, type: 'heal',
      icon: '✚', desc: '恢复自身生命，回复量 = 30 + 道术×1.2。'
    },
    sk_linghun: {
      id: 'sk_linghun', name: '灵魂火符', job: 3, reqLevel: 20,
      mp: 12, cd: 3, coef: 1.5, range: 7, type: 'projectile', fx: 'talisman',
      icon: '🧿', desc: '掷出火符，造成 150% 道术伤害。'
    }
  };

  G.SKILL_BY_JOB = {
    1: ['sk_jiben', 'sk_gongsha'],
    2: ['sk_huoqiu', 'sk_leidian'],
    3: ['sk_zhiyu', 'sk_linghun']
  };

  G.skill = function (id) { return G.SKILLS[id] || null; };
})();
