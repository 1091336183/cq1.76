/* ===== 地图数据（V0.1：7 张，传送点与刷怪区） ===== */
(function () {
  const W = 48, H = 36;

  G.MAPS = {
    mp_haixicun: {
      id: 'mp_haixicun', name: '海曦村', tier: 1, terrain: 'village', safe: true,
      w: W, h: H, levelRange: [1, 8], desc: '海边的小渔村，冒险开始的地方。',
      ports: [
        { x: 24, y: 0, to: 'mp_haixibeicun', tx: 24, ty: 34, label: '↑ 海曦村北' },
        { x: 24, y: 35, to: 'mp_haixicunnan', tx: 24, ty: 1, label: '↓ 海曦村南' }
      ],
      npcs: [
        { id: 'npc_cunzhang', x: 20, y: 16 },
        { id: 'npc_zahuoshang', x: 28, y: 16 },
        { id: 'npc_yaoshang', x: 28, y: 20 },
        { id: 'npc_lingyunzi', x: 20, y: 21 },
        { id: 'npc_portal_haixi', x: 16, y: 16 },
        { id: 'npc_store_haixi', x: 16, y: 21 }
      ],
      spawns: [
        { m: 'm_ji_normal_t1', count: 5, area: [5, 6, 14, 24] },
        { m: 'm_ji_normal_t1', count: 2, area: [30, 24, 12, 8] }
      ]
    },

    mp_haixibeicun: {
      id: 'mp_haixibeicun', name: '海曦村北', tier: 2, terrain: 'grass', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '村北的草坡，甲壳虫与鹿群出没。',
      ports: [
        { x: 24, y: 35, to: 'mp_haixicun', tx: 24, ty: 1, label: '↓ 海曦村' },
        { x: 24, y: 0, to: 'mp_shulin', tx: 24, ty: 34, label: '↑ 树林深处' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_jiachong_normal_t2', count: 6, area: [4, 4, 16, 26] },
        { m: 'm_lu_normal_t2', count: 6, area: [28, 4, 16, 26] },
        { m: 'm_lu_poison_t2', count: 2, area: [28, 4, 16, 26] },
        { m: 'm_lu_phantom_t2', count: 2, area: [28, 4, 16, 26] },
        { m: 'm_lu_elite_t2', count: 2, area: [28, 4, 16, 26] }
      ]
    },

    mp_shulin: {
      id: 'mp_shulin', name: '树林深处', tier: 2, terrain: 'forest', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '密林深处，甲虫王盘踞于此。',
      ports: [
        { x: 24, y: 35, to: 'mp_haixibeicun', tx: 24, ty: 1, label: '↓ 海曦村北' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_jiantou_normal_t2', count: 6, area: [4, 4, 16, 13] },
        { m: 'm_jiantou_poison_t2', count: 2, area: [4, 4, 16, 13] },
        { m: 'm_jiantou_phantom_t2', count: 2, area: [4, 4, 16, 13] },
        { m: 'm_jiantou_elite_t2', count: 1, area: [4, 4, 16, 13] },
        { m: 'm_jiachong_normal_t2', count: 5, area: [28, 20, 16, 12] },
        { m: 'm_jiachong_poison_t2', count: 2, area: [28, 20, 16, 12] },
        { m: 'm_jiachong_phantom_t2', count: 1, area: [28, 20, 16, 12] },
        { m: 'm_lu_normal_t2', count: 4, area: [28, 4, 16, 12] },
        { m: 'm_lu_poison_t2', count: 1, area: [28, 4, 16, 12] }
      ],
      boss: { m: 'm_jiachongwang', x: 24, y: 5 }
    },

    mp_haixicunnan: {
      id: 'mp_haixicunnan', name: '海曦村南', tier: 1, terrain: 'grass', safe: false,
      w: W, h: H, levelRange: [1, 8], desc: '村南的缓坡，尖头甲虫在此繁衍。',
      ports: [
        { x: 24, y: 0, to: 'mp_haixicun', tx: 24, ty: 34, label: '↑ 海曦村' },
        { x: 47, y: 18, to: 'mp_yingxiongcunwai', tx: 1, ty: 18, label: '→ 英雄村外' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_jiantou_normal_t1', count: 6, area: [4, 4, 16, 26] },
        { m: 'm_jiantou_poison_t1', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_jiantou_phantom_t1', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_jiantou_elite_t1', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_jiachong_normal_t1', count: 4, area: [28, 4, 16, 26] },
        { m: 'm_daocaoren_normal_t1', count: 4, area: [10, 24, 26, 8] }
      ]
    },

    mp_yingxiongcunwai: {
      id: 'mp_yingxiongcunwai', name: '英雄村外', tier: 2, terrain: 'grass', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '通往英雄海岸与墓地的岔路口。',
      ports: [
        { x: 0, y: 18, to: 'mp_haixicunnan', tx: 46, ty: 18, label: '← 海曦村南' },
        { x: 47, y: 18, to: 'mp_yingxionghaian', tx: 1, ty: 18, label: '→ 英雄海岸' },
        { x: 24, y: 0, to: 'mp_mudi', tx: 24, ty: 34, label: '↑ 墓地' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_jiantou_normal_t2', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_jiantou_elite_t2', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_daocaoren_normal_t2', count: 4, area: [28, 4, 16, 26] },
        { m: 'm_daocaoren_phantom_t2', count: 2, area: [28, 4, 16, 26] }
      ]
    },

    mp_yingxionghaian: {
      id: 'mp_yingxionghaian', name: '英雄海岸', tier: 2, terrain: 'coast', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '海风凛冽的海岸，稻草人与飞蛾成群。',
      ports: [
        { x: 0, y: 18, to: 'mp_yingxiongcunwai', tx: 46, ty: 18, label: '← 英雄村外' },
        { x: 47, y: 18, to: 'mp_linhaizhennan', tx: 1, ty: 18, label: '→ 临海镇南（V0.2）' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_daocaoren_normal_t2', count: 3, area: [4, 20, 16, 10] },
        { m: 'm_daocaoren_phantom_t2', count: 2, area: [4, 20, 16, 10] },
        { m: 'm_daocaoren_flame_t2', count: 2, area: [4, 20, 16, 10] },
        { m: 'm_daocaoren_elite_t2', count: 1, area: [4, 20, 16, 10] },
        { m: 'm_feie_normal_t2', count: 3, area: [28, 6, 16, 22] },
        { m: 'm_feie_phantom_t2', count: 2, area: [28, 6, 16, 22] },
        { m: 'm_feie_flame_t2', count: 2, area: [28, 6, 16, 22] },
        { m: 'm_feie_elite_t2', count: 1, area: [28, 6, 16, 22] }
      ]
    },

    mp_mudi: {
      id: 'mp_mudi', name: '墓地', tier: 2, terrain: 'cemetery', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '阴森的墓地，墓地尸王在深处游荡。',
      ports: [
        { x: 24, y: 35, to: 'mp_yingxiongcunwai', tx: 24, ty: 1, label: '↓ 英雄村外' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_pashi_normal_t2', count: 4, area: [6, 10, 14, 18] },
        { m: 'm_dianshi_normal_t2', count: 3, area: [28, 10, 14, 18] },
        { m: 'm_xingshi_normal_t2', count: 3, area: [18, 24, 12, 8] }
      ],
      boss: { m: 'm_mudishiwang', x: 24, y: 5 }
    }
  };

  G.mapDef = function (id) { return G.MAPS[id] || null; };
})();
