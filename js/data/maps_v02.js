/* ===== V0.2 三镇地图（20 张，累计 27 张） =====
   连通关系：海曦村 → 英雄海岸 → 临海镇南 → 临海镇 → 临海镇北
             临海镇北 ⇄ 华月城南 ⇄ 华月城北 → 密林 / 饿狼领
   数据来源：数据文档《V0.2 三镇 地图怪物掉落装备表》第一节 */
(function () {
  const W = 48, H = 36;

  const M = {
    /* ---------- 临海镇 ---------- */
    mp_linhaizhennan: {
      id: 'mp_linhaizhennan', name: '临海镇南', tier: 2, terrain: 'grass', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '临海镇外的南坡，稻草人与飞蛾成群。',
      ports: [
        { x: 0, y: 18, to: 'mp_yingxionghaian', tx: 46, ty: 18, label: '← 英雄海岸' },
        { x: 24, y: 0, to: 'mp_linhaizhen', tx: 24, ty: 34, label: '↑ 临海镇' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_daocaoren_normal_t2', count: 5, area: [4, 4, 16, 26] },
        { m: 'm_daocaoren_phantom_t2', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_daocaoren_elite_t2', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_feie_normal_t2', count: 4, area: [28, 4, 16, 26] },
        { m: 'm_feie_phantom_t2', count: 2, area: [28, 4, 16, 26] },
        { m: 'm_feie_flame_t2', count: 1, area: [28, 4, 16, 26] },
        { m: 'm_feie_elite_t2', count: 1, area: [28, 4, 16, 26] }
      ]
    },

    mp_linhaizhen: {
      id: 'mp_linhaizhen', name: '临海镇', tier: 2, terrain: 'town', safe: true,
      w: W, h: H, levelRange: [8, 18], desc: '沿海的集镇，裁缝与药商在此营生。',
      ports: [
        { x: 24, y: 35, to: 'mp_linhaizhennan', tx: 24, ty: 1, label: '↓ 临海镇南' },
        { x: 24, y: 0, to: 'mp_linhaizhenbei', tx: 24, ty: 34, label: '↑ 临海镇北' }
      ],
      npcs: [
        { id: 'npc_linhai_zhang', x: 20, y: 16 },
        { id: 'npc_caifeng', x: 28, y: 16 },
        { id: 'npc_linhai_yao', x: 28, y: 20 },
        { id: 'npc_mafu_linhai', x: 24, y: 9 },
        { id: 'npc_portal_linhai', x: 16, y: 16 },
        { id: 'npc_store_linhai', x: 16, y: 20 }
      ],
      spawns: [
        { m: 'm_zhu_normal_t2', count: 3, area: [6, 24, 12, 8] }
      ]
    },

    mp_linhaizhenbei: {
      id: 'mp_linhaizhenbei', name: '临海镇北', tier: 2, terrain: 'grass', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '镇北的沼泽边缘，独眼蛙潜伏在草丛里。',
      ports: [
        { x: 24, y: 35, to: 'mp_linhaizhen', tx: 24, ty: 1, label: '↓ 临海镇' },
        { x: 24, y: 0, to: 'mp_zhaolindong', tx: 24, ty: 34, label: '↑ 沼林东' },
        { x: 47, y: 18, to: 'mp_huayuechengnan', tx: 1, ty: 18, label: '→ 华月城南' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_duyanwa_normal_t2', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_duyanwa_phantom_t2', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_zhu_normal_t2', count: 3, area: [28, 4, 16, 26] }
      ]
    },

    /* ---------- 沼林 / 蛙洞 ---------- */
    mp_zhaolindong: {
      id: 'mp_zhaolindong', name: '沼林东', tier: 2, terrain: 'swamp', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '湿热的沼泽林地，蚊子与飞蛾最多。',
      ports: [
        { x: 24, y: 35, to: 'mp_linhaizhenbei', tx: 24, ty: 1, label: '↓ 临海镇北' },
        { x: 0, y: 18, to: 'mp_zhaolin', tx: 46, ty: 18, label: '← 沼林' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_duyanhongwa_normal_t2', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_feie_normal_t2', count: 3, area: [4, 4, 16, 26] },
        { m: 'm_bitichong_phantom_t2', count: 2, area: [28, 4, 16, 26] },
        { m: 'm_bitichong_elite_t2', count: 2, area: [28, 4, 16, 26] }
      ]
    },

    mp_zhaolin: {
      id: 'mp_zhaolin', name: '沼林', tier: 2, terrain: 'swamp', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '沼泽腹地，蛙鸣声此起彼伏。',
      ports: [
        { x: 47, y: 18, to: 'mp_zhaolindong', tx: 1, ty: 18, label: '→ 沼林东' },
        { x: 0, y: 18, to: 'mp_zhaolinxi', tx: 46, ty: 18, label: '← 沼林西' },
        { x: 24, y: 0, to: 'mp_wadong1', tx: 24, ty: 34, label: '↑ 蛙洞一层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_duyanwa_normal_t2', count: 5, area: [4, 4, 16, 26] },
        { m: 'm_duyanwa_phantom_t2', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_duyanwa_jumo_t2', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_duyanwa_elite_t2', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_duyanhongwa_normal_t2', count: 4, area: [28, 4, 16, 26] },
        { m: 'm_duyanhongwa_flame_t2', count: 2, area: [28, 4, 16, 26] },
        { m: 'm_bitichong_normal_t2', count: 3, area: [28, 4, 16, 26] }
      ]
    },

    mp_zhaolinxi: {
      id: 'mp_zhaolinxi', name: '沼林西', tier: 2, terrain: 'swamp', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '沼林西侧的泥洼地，野猪洞入口就在北面。',
      ports: [
        { x: 47, y: 18, to: 'mp_zhaolin', tx: 1, ty: 18, label: '→ 沼林' },
        { x: 24, y: 0, to: 'mp_yezhudong1', tx: 24, ty: 34, label: '↑ 野猪洞一层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_duyanhongwa_normal_t2', count: 5, area: [4, 4, 16, 26] },
        { m: 'm_duyanhongwa_phantom_t2', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_bitichong_normal_t2', count: 4, area: [28, 4, 16, 26] },
        { m: 'm_bitichong_elite_t2', count: 1, area: [28, 4, 16, 26] }
      ]
    },

    mp_wadong1: {
      id: 'mp_wadong1', name: '蛙洞一层', tier: 2, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '潮湿的蛙洞，洞壁渗着水珠。',
      ports: [
        { x: 24, y: 35, to: 'mp_zhaolin', tx: 24, ty: 1, label: '↓ 沼林' },
        { x: 24, y: 0, to: 'mp_wadong2', tx: 24, ty: 34, label: '↑ 蛙洞二层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_duyanwa_normal_t2', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_duyanhongwa_normal_t2', count: 5, area: [28, 4, 16, 26] },
        { m: 'm_duyanhongwa_phantom_t2', count: 2, area: [28, 4, 16, 26] },
        { m: 'm_duyanhongwa_elite_t2', count: 1, area: [28, 4, 16, 26] }
      ]
    },

    mp_wadong2: {
      id: 'mp_wadong2', name: '蛙洞二层', tier: 3, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [18, 28], desc: '蛙洞深处，红刺蛙与绿蛙盘踞。',
      ports: [
        { x: 24, y: 35, to: 'mp_wadong1', tx: 24, ty: 1, label: '↓ 蛙洞一层' },
        { x: 24, y: 0, to: 'mp_wachao', tx: 24, ty: 34, label: '↑ 蛙巢' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_hongciwa_normal_t3', count: 5, area: [4, 4, 16, 26] },
        { m: 'm_hongciwa_phantom_t3', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_hongciwa_flame_t3', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_hongciwa_elite_t3', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_lvwa_normal_t3', count: 4, area: [28, 4, 16, 26] }
      ]
    },

    mp_wachao: {
      id: 'mp_wachao', name: '蛙巢', tier: 3, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [18, 28], desc: '蛙统领的巢穴，腥臭的黏液铺满地面。',
      ports: [
        { x: 24, y: 35, to: 'mp_wadong2', tx: 24, ty: 1, label: '↓ 蛙洞二层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_hongciwa_normal_t3', count: 4, area: [4, 12, 14, 16] },
        { m: 'm_hongciwa_elite_t3', count: 1, area: [4, 12, 14, 16] },
        { m: 'm_lvwa_normal_t3', count: 3, area: [30, 12, 14, 16] },
        { m: 'm_lvwa_jumo_t3', count: 1, area: [30, 12, 14, 16] },
        { m: 'm_lvwa_elite_t3', count: 1, area: [30, 12, 14, 16] }
      ],
      boss: { m: 'm_watongling_normal_t3', x: 24, y: 5 }
    },

    /* ---------- 野猪洞 ---------- */
    mp_yezhudong1: {
      id: 'mp_yezhudong1', name: '野猪洞一层', tier: 2, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [8, 18], desc: '野猪刨出的洞穴，红野猪与黑野猪在此。',
      ports: [
        { x: 24, y: 35, to: 'mp_zhaolinxi', tx: 24, ty: 1, label: '↓ 沼林西' },
        { x: 24, y: 0, to: 'mp_yezhudong2', tx: 24, ty: 34, label: '↑ 野猪洞二层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_hongyezhu_normal_t2', count: 5, area: [4, 4, 16, 26] },
        { m: 'm_hongyezhu_phantom_t2', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_hongyezhu_flame_t2', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_hongyezhu_elite_t2', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_heiyezhu_normal_t2', count: 4, area: [28, 4, 16, 26] }
      ]
    },

    mp_yezhudong2: {
      id: 'mp_yezhudong2', name: '野猪洞二层', tier: 3, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [18, 28], desc: '洞穴深处，幻魔猪与白野猪出没。',
      ports: [
        { x: 24, y: 35, to: 'mp_yezhudong1', tx: 24, ty: 1, label: '↓ 野猪洞一层' },
        { x: 24, y: 0, to: 'mp_yezhuchaoxue', tx: 24, ty: 34, label: '↑ 野猪巢穴' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_heiyezhu_normal_t3', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_heiyezhu_dianli_t3', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_huanmozhu_normal_t3', count: 3, area: [28, 4, 16, 26] },
        { m: 'm_huanmozhu_elite_t3', count: 1, area: [28, 4, 16, 26] },
        { m: 'm_baiyezhu_normal_t3', count: 3, area: [18, 24, 12, 8] }
      ]
    },

    mp_yezhuchaoxue: {
      id: 'mp_yezhuchaoxue', name: '野猪巢穴', tier: 3, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [18, 28], desc: '野猪王与白野猪统领的巢穴。',
      ports: [
        { x: 24, y: 35, to: 'mp_yezhudong2', tx: 24, ty: 1, label: '↓ 野猪洞二层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_huanmozhu_normal_t3', count: 3, area: [4, 12, 14, 16] },
        { m: 'm_huanmozhu_phantom_t3', count: 2, area: [4, 12, 14, 16] },
        { m: 'm_baiyezhu_normal_t3', count: 3, area: [30, 12, 14, 16] },
        { m: 'm_baiyezhu_dianli_t3', count: 1, area: [30, 12, 14, 16] },
        { m: 'm_baiyezhu_elite_t3', count: 1, area: [30, 12, 14, 16] }
      ],
      boss: { m: 'm_yezhuwang_normal_t3', x: 20, y: 5 },
      boss2: { m: 'm_baiyezhutongling_normal_t3', x: 28, y: 5 }
    },

    /* ---------- 华月城 ---------- */
    mp_huayuechengnan: {
      id: 'mp_huayuechengnan', name: '华月城南', tier: 3, terrain: 'town', safe: true,
      w: W, h: H, levelRange: [18, 28], desc: '华月城的南市，当铺与药铺林立。',
      ports: [
        { x: 0, y: 18, to: 'mp_linhaizhenbei', tx: 46, ty: 18, label: '← 临海镇北' },
        { x: 24, y: 0, to: 'mp_huayuechengbei', tx: 24, ty: 34, label: '↑ 华月城北' }
      ],
      npcs: [
        { id: 'npc_dangpu', x: 20, y: 16 },
        { id: 'npc_huayue_yao', x: 28, y: 16 },
        { id: 'npc_portal_huayue', x: 16, y: 16 },
        { id: 'npc_store_huayue', x: 16, y: 20 }
      ],
      spawns: [
        { m: 'm_duogoumiao_normal_t3', count: 3, area: [6, 24, 12, 8] }
      ]
    },

    mp_huayuechengbei: {
      id: 'mp_huayuechengbei', name: '华月城北', tier: 3, terrain: 'town', safe: true,
      w: W, h: H, levelRange: [18, 28], desc: '华月城北的府衙与隐士居所。',
      ports: [
        { x: 24, y: 35, to: 'mp_huayuechengnan', tx: 24, ty: 1, label: '↓ 华月城南' },
        { x: 47, y: 18, to: 'mp_milin', tx: 1, ty: 18, label: '→ 密林' },
        { x: 24, y: 0, to: 'mp_elangling', tx: 24, ty: 34, label: '↑ 饿狼领' }
      ],
      npcs: [
        { id: 'npc_taishou', x: 20, y: 16 },
        { id: 'npc_yinshi', x: 28, y: 16 },
        { id: 'npc_mafu_huayue', x: 24, y: 24 }
      ],
      spawns: [
        { m: 'm_lang_normal_t3', count: 2, area: [4, 24, 10, 8] }
      ]
    },

    /* ---------- 密林 / 饿狼 / 蝙蝠 ---------- */
    mp_milin: {
      id: 'mp_milin', name: '密林', tier: 3, terrain: 'forest', safe: false,
      w: W, h: H, levelRange: [18, 28], desc: '遮天蔽日的密林，虫豸与蝙蝠横行。',
      ports: [
        { x: 0, y: 18, to: 'mp_huayuechengbei', tx: 46, ty: 18, label: '← 华月城北' },
        { x: 24, y: 0, to: 'mp_bianfudong1', tx: 24, ty: 34, label: '↑ 蝙蝠洞一层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_fenchong_normal_t3', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_quchong_normal_t3', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_bianfu_normal_t3', count: 3, area: [28, 4, 16, 12] },
        { m: 'm_bianfu_elite_t3', count: 1, area: [28, 4, 16, 12] },
        { m: 'm_dingpamiao_normal_t3', count: 4, area: [28, 20, 16, 12] },
        { m: 'm_dingpamiao_phantom_t3', count: 2, area: [28, 20, 16, 12] },
        { m: 'm_dingpamiao_elite_t3', count: 1, area: [28, 20, 16, 12] }
      ]
    },

    mp_elangling: {
      id: 'mp_elangling', name: '饿狼领', tier: 3, terrain: 'forest', safe: false,
      w: W, h: H, levelRange: [18, 28], desc: '饿狼的领地，狼嚎声在夜里格外清晰。',
      ports: [
        { x: 24, y: 35, to: 'mp_huayuechengbei', tx: 24, ty: 1, label: '↓ 华月城北' },
        { x: 24, y: 0, to: 'mp_elangchaoxue', tx: 24, ty: 34, label: '↑ 饿狼巢穴' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_elang_normal_t3', count: 5, area: [4, 4, 16, 26] },
        { m: 'm_elang_phantom_t3', count: 2, area: [4, 4, 16, 26] },
        { m: 'm_elang_elite_t3', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_lang_normal_t3', count: 3, area: [28, 4, 16, 26] },
        { m: 'm_lang_elite_t3', count: 1, area: [28, 4, 16, 26] }
      ]
    },

    mp_elangchaoxue: {
      id: 'mp_elangchaoxue', name: '饿狼巢穴', tier: 4, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [28, 40], desc: '狼王的巢穴，白骨堆满洞口。',
      ports: [
        { x: 24, y: 35, to: 'mp_elangling', tx: 24, ty: 1, label: '↓ 饿狼领' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_elang_normal_t4', count: 4, area: [4, 14, 14, 14] },
        { m: 'm_elang_phantom_t4', count: 1, area: [4, 14, 14, 14] },
        { m: 'm_elang_elite_t4', count: 1, area: [4, 14, 14, 14] },
        { m: 'm_lang_phantom_t4', count: 2, area: [30, 14, 14, 14] }
      ],
      boss: { m: 'm_langwang_normal_t4', x: 24, y: 5 }
    },

    mp_bianfudong1: {
      id: 'mp_bianfudong1', name: '蝙蝠洞一层', tier: 3, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [18, 28], desc: '阴暗的蝙蝠洞，蛆虫在角落蠕动。',
      ports: [
        { x: 24, y: 35, to: 'mp_milin', tx: 24, ty: 1, label: '↓ 密林' },
        { x: 24, y: 0, to: 'mp_bianfudong2', tx: 24, ty: 34, label: '↑ 蝙蝠洞二层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_quchong_normal_t3', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_quchong_phantom_t3', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_quchong_elite_t3', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_bianfu_normal_t3', count: 4, area: [28, 4, 16, 26] },
        { m: 'm_bianfu_elite_t3', count: 1, area: [28, 4, 16, 26] }
      ]
    },

    mp_bianfudong2: {
      id: 'mp_bianfudong2', name: '蝙蝠洞二层', tier: 4, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [28, 40], desc: '洞窟深处传出尖啸，月魔蝙蝠倒挂在洞顶。',
      ports: [
        { x: 24, y: 35, to: 'mp_bianfudong1', tx: 24, ty: 1, label: '↓ 蝙蝠洞一层' },
        { x: 24, y: 0, to: 'mp_bianfuchaoxue', tx: 24, ty: 34, label: '↑ 蝙蝠巢穴' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_bianfu_normal_t4', count: 4, area: [4, 4, 16, 26] },
        { m: 'm_bianfu_phantom_t4', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_bianfu_elite_t4', count: 1, area: [4, 4, 16, 26] },
        { m: 'm_yuemobianfu_normal_t4', count: 3, area: [28, 4, 16, 26] },
        { m: 'm_yuemobianfu_phantom_t4', count: 1, area: [28, 4, 16, 26] }
      ]
    },

    mp_bianfuchaoxue: {
      id: 'mp_bianfuchaoxue', name: '蝙蝠巢穴', tier: 4, terrain: 'cave', safe: false,
      w: W, h: H, levelRange: [28, 40], desc: '蝙蝠王的巢穴，洞顶密布猩红的眼睛。',
      ports: [
        { x: 24, y: 35, to: 'mp_bianfudong2', tx: 24, ty: 1, label: '↓ 蝙蝠洞二层' }
      ],
      npcs: [],
      spawns: [
        { m: 'm_yuemobianfu_normal_t4', count: 4, area: [4, 14, 14, 14] },
        { m: 'm_yuemobianfu_elite_t4', count: 1, area: [4, 14, 14, 14] },
        { m: 'm_bianfu_normal_t4', count: 3, area: [30, 14, 14, 14] },
        { m: 'm_bianfu_phantom_t4', count: 1, area: [30, 14, 14, 14] }
      ],
      boss: { m: 'm_bianfuwang_normal_t4', x: 24, y: 5 }
    }
  };

  Object.keys(M).forEach(function (id) { G.MAPS[id] = M[id]; });
})();
