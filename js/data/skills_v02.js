/* ===== V0.2 技能树：三职业各 5 个技能，技能等级 1-3 ===== */
(function () {
  const add = {
    /* ---------- 战士 ---------- */
    sk_cisha: {
      id: 'sk_cisha', name: '刺杀剑术', job: 1, reqLevel: 26,
      mp: 10, cd: 4, coef: 2.0, range: 2.2, type: 'melee',
      icon: '🗡', desc: '一剑刺出，造成 200% 攻击伤害（射程 2 格）。'
    },
    sk_banyue: {
      id: 'sk_banyue', name: '半月弯刀', job: 1, reqLevel: 34,
      mp: 14, cd: 5, coef: 1.25, range: 2.3, type: 'aoe',
      icon: '🌙', desc: '横扫周身，对周围 2.3 格内所有敌人造成 125% 伤害。'
    },
    sk_yeman: {
      id: 'sk_yeman', name: '野蛮冲撞', job: 1, reqLevel: 42,
      mp: 16, cd: 8, coef: 1.8, range: 1.9, type: 'melee',
      icon: '💥', desc: '全力冲撞目标，造成 180% 攻击伤害。'
    },
    sk_liehuo: {
      id: 'sk_liehuo', name: '烈火剑法', job: 1, reqLevel: 50,
      mp: 20, cd: 8, coef: 2.2, range: 2.2, type: 'melee', fx: 'fire',
      icon: '🔥', desc: '凝聚烈火于剑身，造成 220% 攻击伤害。'
    },

    /* ---------- 法师 ---------- */
    sk_huoqiang: {
      id: 'sk_huoqiang', name: '火墙', job: 2, reqLevel: 26,
      mp: 20, cd: 8, coef: 1.2, range: 3.0, type: 'aoe', fx: 'fire',
      icon: '🔥', desc: '在身周燃起火墙，对 3 格内敌人造成 120% 魔法伤害。'
    },
    sk_mofadun: {
      id: 'sk_mofadun', name: '魔法盾', job: 2, reqLevel: 34,
      mp: 24, cd: 20, type: 'buff', buff: 'shield', val: 0.3, dur: 20,
      icon: '🛡', desc: '凝聚魔法护盾，20 秒内受到的伤害降低 30%。'
    },
    sk_bingpaoxiao: {
      id: 'sk_bingpaoxiao', name: '冰咆哮', job: 2, reqLevel: 42,
      mp: 28, cd: 9, coef: 1.9, range: 3.2, type: 'aoe',
      icon: '❄', desc: '寒冰炸裂，对 3.2 格内敌人造成 190% 魔法伤害。'
    },

    /* ---------- 道士 ---------- */
    sk_shidu: {
      id: 'sk_shidu', name: '施毒术', job: 3, reqLevel: 26,
      mp: 12, cd: 5, coef: 1.35, range: 6, type: 'instant', fx: 'poison',
      icon: '☠', desc: '以毒符重创目标，造成 135% 道术伤害。'
    },
    sk_youlingdun: {
      id: 'sk_youlingdun', name: '幽灵盾', job: 3, reqLevel: 34,
      mp: 22, cd: 20, type: 'buff', buff: 'ghost', val: 0.2, dur: 25,
      icon: '🛡', desc: '召唤幽灵护体，25 秒内受到的伤害降低 20%。'
    },
    sk_quntizhiyu: {
      id: 'sk_quntizhiyu', name: '群体治愈', job: 3, reqLevel: 42,
      mp: 26, cd: 10, type: 'heal', base: 60, coef: 1.8,
      icon: '✚', desc: '大幅恢复自身生命，回复量 = 60 + 道术×1.8。'
    }
  };

  Object.keys(add).forEach(function (id) { G.SKILLS[id] = add[id]; });

  G.SKILL_BY_JOB = {
    1: ['sk_jiben', 'sk_gongsha', 'sk_cisha', 'sk_banyue', 'sk_yeman', 'sk_liehuo'],
    2: ['sk_huoqiu', 'sk_leidian', 'sk_huoqiang', 'sk_mofadun', 'sk_bingpaoxiao'],
    3: ['sk_zhiyu', 'sk_linghun', 'sk_shidu', 'sk_youlingdun', 'sk_quntizhiyu']
  };

  G.SKILL_LV_MAX = 3;
})();
