/* ===== 怪物数据（V0.1：26 种，按阶 1/2） ===== */
(function () {
  const BASE_STAT = {
    1: { level: 4, def: [0, 2], mdef: 1, acc: 7, agi: 4 },
    2: { level: 13, def: [2, 6], mdef: 3, acc: 9, agi: 6 }
  };
  const VAR_STAT = {
    1: {
      normal:  { hp: 60,  atk: [6, 12],  exp: 30,  gold: [10, 25], spd: 1.05 },
      poison:  { hp: 72,  atk: [7, 14],  exp: 40,  gold: [10, 30], spd: 1.05 },
      phantom: { hp: 69,  atk: [7, 13],  exp: 40,  gold: [15, 30], spd: 1.26 },
      elite:   { hp: 81,  atk: [7, 14],  exp: 40,  gold: [15, 30], spd: 1.05 }
    },
    2: {
      normal:  { hp: 140, atk: [12, 22], exp: 80,  gold: [20, 45], spd: 1.10 },
      poison:  { hp: 168, atk: [14, 25], exp: 100, gold: [25, 55], spd: 1.10 },
      phantom: { hp: 161, atk: [13, 24], exp: 110, gold: [25, 60], spd: 1.32 },
      elite:   { hp: 189, atk: [14, 26], exp: 120, gold: [25, 60], spd: 1.10 }
    }
  };
  const VSUFFIX = { normal: '', poison: '-剧毒', phantom: '-幻影', elite: '-精英', flame: '-烈焰' };

  const BASES = [
    { key: 'jiachong', name: '甲壳虫', shape: 'beetle', color: '#6f5a34', ai: 'poison',
      tiers: [1, 2], variants: ['normal', 'poison', 'phantom', 'elite'] },
    { key: 'lu', name: '鹿', shape: 'deer', color: '#a9743f', ai: 'melee',
      tiers: [2], variants: ['normal', 'poison', 'phantom', 'elite'] },
    { key: 'jiantou', name: '尖头甲虫', shape: 'beetle', color: '#8a7136', ai: 'poison',
      tiers: [1, 2], variants: ['normal', 'poison', 'phantom', 'elite'] },
    { key: 'daocaoren', name: '稻草人', shape: 'scarecrow', color: '#c2a24a', ai: 'melee',
      tiers: [1, 2], variants: ['normal', 'flame', 'phantom', 'elite'] },
    { key: 'feie', name: '飞蛾', shape: 'moth', color: '#b7a6d6', ai: 'melee',
      tiers: [2], variants: ['normal', 'flame', 'phantom', 'elite'] },
    { key: 'ji', name: '鸡-变异', shape: 'chicken', color: '#e8dcc0', ai: 'melee',
      tiers: [1], variants: ['normal'] },
    { key: 'pashi', name: '墓地爬尸', shape: 'zombie', color: '#5f7a5a', ai: 'melee',
      tiers: [2], variants: ['normal'] },
    { key: 'dianshi', name: '墓地电尸', shape: 'zombie', color: '#6a8fa5', ai: 'melee',
      tiers: [2], variants: ['normal'] },
    { key: 'xingshi', name: '墓地行尸', shape: 'zombie', color: '#7a6a5a', ai: 'melee',
      tiers: [2], variants: ['normal'] }
  ];

  const MON = {};

  BASES.forEach(function (b) {
    b.tiers.forEach(function (tier) {
      b.variants.forEach(function (v) {
        // 烈焰变体与剧毒共用数值槽
        const slot = (v === 'flame') ? 'poison' : v;
        const s = VAR_STAT[tier][slot];
        const bs = BASE_STAT[tier];
        const id = 'm_' + b.key + '_' + v + '_t' + tier;
        const disp = b.name + VSUFFIX[v];
        MON[id] = {
          id: id,
          name: disp,
          baseName: b.name,
          variant: v,
          tier: tier,
          level: bs.level,
          hp: s.hp,
          atk: s.atk.slice(),
          def: bs.def.slice(),
          mdef: bs.mdef,
          acc: bs.acc,
          agi: bs.agi,
          speed: s.spd,
          exp: s.exp,
          gold: s.gold.slice(),
          ai: b.ai,
          isBoss: false,
          shape: b.shape,
          color: b.color,
          dropName: disp,
          respawn: 12
        };
      });
    });
  });

  // BOSS
  function boss(id, name, shape, color, dropName) {
    MON[id] = {
      id: id, name: name, baseName: name, variant: 'boss', tier: 2, level: 15,
      hp: 490, atk: [17, 31], def: [2, 8], mdef: 3, acc: 14, agi: 6, speed: 1.1,
      exp: 400, gold: [120, 270], ai: 'melee', isBoss: true,
      shape: shape, color: color, dropName: dropName, respawn: 30
    };
  }
  boss('m_jiachongwang', '甲虫王', 'boss_beetle', '#a3562c', '甲虫王');
  boss('m_mudishiwang', '墓地尸王', 'boss_zombie', '#8a4a4a', '墓地尸王');

  G.MON = MON;
  G.monster = function (id) { return MON[id] || null; };
})();
