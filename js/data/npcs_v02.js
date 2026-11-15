/* ===== V0.2 NPC 与商店（临海镇 / 华月城） ===== */
(function () {
  const N = {
    npc_linhai_zhang: {
      id: 'npc_linhai_zhang', name: '临海镇长', color: '#c8b06a', kind: 'elder',
      lines: {
        default: ['临海镇最近不太平，沼林里的蛙群越来越凶。', '若你愿意出手，镇民都会记你一份情。'],
        step0: ['你就是海曦村来的冒险者？', '沼林的鼻涕虫和独眼蛙已经伤了不少人。',
          '先清掉 8 只鼻涕虫，再回来找我。'],
        step1: ['做得好。独眼蛙聚在沼林深处，去清掉 6 只。'],
        step2: ['蛙群背后有蛙统领在号令。', '进蛙洞二层，击败蛙统领。'],
        step3: ['蛙洞平息了，可野猪洞又出了乱子。', '野猪巢穴里的白野猪统领会率领猪群冲出洞穴。'],
        step4: ['你连白野猪统领都解决了。', '华月城北的太守正在召集人手，去见他吧。']
      }
    },
    npc_caifeng: {
      id: 'npc_caifeng', name: '裁缝', color: '#b08a4a', kind: 'merchant',
      shop: 'shop_tailor',
      lines: { default: ['布衣、鞋靴、护甲，都是我一针一线缝的。', '要量身改衣也可以，先看看料子。'] }
    },
    npc_linhai_yao: {
      id: 'npc_linhai_yao', name: '临海药商', color: '#7fae7f', kind: 'merchant',
      shop: 'shop_linhai_potion',
      lines: { default: ['金疮药、魔法药，还有回城卷与传送符。', '往北是沼林，多带点药总没错。'] }
    },
    npc_mafu_linhai: {
      id: 'npc_mafu_linhai', name: '马夫', color: '#9a7a4a', kind: 'merchant',
      ferry: [
        { to: 'mp_huayuechengnan', tx: 24, ty: 20, cost: 50, label: '前往华月城南（50 金）' }
      ],
      lines: { default: ['车马劳顿，但总比走路快。', '华月城来回五十金，坐稳了。'] }
    },
    npc_dangpu: {
      id: 'npc_dangpu', name: '当铺掌柜', color: '#a08a6a', kind: 'merchant',
      shop: 'shop_pawn',
      lines: { default: ['旧装备、稀罕物，都可以拿来换钱。', '当铺只收干净的货。'] }
    },
    npc_huayue_yao: {
      id: 'npc_huayue_yao', name: '华月药商', color: '#7fae7f', kind: 'merchant',
      shop: 'shop_huayue_potion',
      lines: { default: ['华月城的老字号，药效有保证。', '往北是饿狼领，往东是密林。'] }
    },
    npc_taishou: {
      id: 'npc_taishou', name: '华月太守', color: '#d8c06a', kind: 'elder',
      lines: {
        default: ['华月城危在旦夕，狼群与蝙蝠已经逼近城郊。', '壮士若肯出手，华月城上下感激不尽。'],
        step0: ['临海镇长来信提起过你。', '密林里的钉耙猫伤了猎户，先清掉 8 只。'],
        step1: ['蝙蝠洞二层有月魔蝙蝠出没，它们才是夜袭的元凶。'],
        step2: ['饿狼巢穴的狼王是狼群之首，击败它，狼群自散。'],
        step3: ['只剩蝙蝠王了。它在蝙蝠巢穴最深处。'],
        step4: ['狼王与蝙蝠王皆除，三镇终于能喘口气。', '我会将你的名字记入华月城的功勋簿。']
      }
    },
    npc_yinshi: {
      id: 'npc_yinshi', name: '隐士', color: '#8fa8d8', kind: 'monk',
      shop: 'shop_hermit',
      lines: { default: ['武学之道，重在积累。', '技能书可以助你精进招式，但也要看自身修为。'] }
    },
    npc_mafu_huayue: {
      id: 'npc_mafu_huayue', name: '马夫', color: '#9a7a4a', kind: 'merchant',
      ferry: [
        { to: 'mp_linhaizhen', tx: 24, ty: 20, cost: 50, label: '前往临海镇（50 金）' }
      ],
      lines: { default: ['回临海镇吗？五十金，马上就走。'] }
    },

    /* ---------- V0.2.02 城市传送阵 ---------- */
    npc_portal_haixi: {
      id: 'npc_portal_haixi', name: '传送阵', color: '#6ad0d8', kind: 'portal',
      portal: true,
      lines: { default: ['古老的传送阵在地面缓缓旋转。', '已点亮的城市之间可以免费传送。'] }
    },
    npc_portal_linhai: {
      id: 'npc_portal_linhai', name: '传送阵', color: '#6ad0d8', kind: 'portal',
      portal: true,
      lines: { default: ['阵纹映着海风微微发亮。', '走过的地方，都能再回去。'] }
    },
    npc_portal_huayue: {
      id: 'npc_portal_huayue', name: '传送阵', color: '#6ad0d8', kind: 'portal',
      portal: true,
      lines: { default: ['华月城的传送阵由太守府修缮。', '已点亮的城市之间可以免费传送。'] }
    },

    /* ---------- V0.2.02 城市仓库 ---------- */
    npc_store_haixi: {
      id: 'npc_store_haixi', name: '仓库管理员', color: '#c8a24a', kind: 'warehouse',
      store: true,
      lines: { default: ['海曦村仓库，十页八百格。', '存取的物品不计负重，也不收费用。'] }
    },
    npc_store_linhai: {
      id: 'npc_store_linhai', name: '仓库管理员', color: '#c8a24a', kind: 'warehouse',
      store: true,
      lines: { default: ['临海镇仓库，十页八百格。', '贵重物品放这儿，总比背在身上稳当。'] }
    },
    npc_store_huayue: {
      id: 'npc_store_huayue', name: '仓库管理员', color: '#c8a24a', kind: 'warehouse',
      store: true,
      lines: { default: ['华月城仓库，十页八百格。', '存取自由，记得下次还来找我。'] }
    }
  };

  // 城市列表（V0.2.02）：点亮后可互相传送
  G.TOWNS = [
    { map: 'mp_haixicun', name: '海曦村', tx: 24, ty: 20 },
    { map: 'mp_linhaizhen', name: '临海镇', tx: 24, ty: 20 },
    { map: 'mp_huayuechengnan', name: '华月城', tx: 24, ty: 20 }
  ];
  G.TOWN_BY_MAP = {};
  G.TOWNS.forEach(function (t) { G.TOWN_BY_MAP[t.map] = t; });


  Object.keys(N).forEach(function (id) { G.NPCS[id] = N[id]; });

  G.SHOPS.shop_tailor = {
    name: '裁缝',
    items: ['a_buyi', 'a_liangongfu', 'b_tie', 'b_qingling', 's_caoxie', 's_buxie', 's_v2_50', 's_v2_51']
  };
  G.SHOPS.shop_pawn = {
    name: '当铺',
    items: ['c_hp2', 'c_mp2', 'c_huicheng', 'c_chuansong', 'b_v2_31', 'r_v2_41', 'n_v2_17', 'h_v2_14']
  };
  G.SHOPS.shop_hermit = {
    name: '隐士',
    items: ['c_skillbook', 'c_chuansong', 'c_huicheng']
  };
  G.SHOPS.shop_linhai_potion = {
    name: '临海药商',
    items: ['c_hp1', 'c_hp2', 'c_hp3', 'c_mp1', 'c_mp2', 'c_mp3', 'c_huicheng', 'c_chuansong']
  };
  G.SHOPS.shop_huayue_potion = {
    name: '华月药商',
    items: ['c_hp2', 'c_hp3', 'c_mp2', 'c_mp3', 'c_huicheng', 'c_chuansong']
  };
})();
