/* ===== 物品数据（V0.1：22 件装备 + 消耗品/材料） ===== */
(function () {
  const ITEMS = {};

  function def(o) {
    const it = Object.assign({
      type: 'material', slot: null, reqLevel: 1, reqJob: 0,
      atk: [0, 0], tao: [0, 0], mag: [0, 0], def: [0, 0], mdef: [0, 0],
      hp: 0, mp: 0, acc: 0, agi: 0, aspd: 0, mspd: 0,
      weight: 1, price: 10, stack: 1, quality: 0,
      setId: null, setText: '', desc: '', source: '', use: null
    }, o);
    ITEMS[it.id] = it;
    return it;
  }

  /* ---------- 武器 7 ---------- */
  def({ id: 'w_mujian', name: '木剑', type: 'weapon', slot: 'weapon', reqLevel: 2, reqJob: 1,
    atk: [2, 6], weight: 10, price: 120, desc: '新手战士的木制长剑，轻便顺手。',
    source: '甲虫王 1/5、甲壳虫 1/6、稻草人 1/6、尖头甲虫 1/15' });
  def({ id: 'w_bishou', name: '匕首', type: 'weapon', slot: 'weapon', reqLevel: 8, reqJob: 1,
    atk: [3, 9], acc: 1, weight: 12, price: 210, desc: '短小锋利的匕首，出手迅捷。',
    source: '墓地尸王 1/3、甲虫王 1/5、墓地电尸 1/10、墓地行尸 1/20' });
  def({ id: 'w_qingtongfu', name: '青铜斧', type: 'weapon', slot: 'weapon', reqLevel: 8, reqJob: 1,
    atk: [3, 9], acc: 1, weight: 12, price: 210, desc: '青铜铸成的战斧，势大力沉。',
    source: '甲虫王 1/10、墓地尸王 1/10' });
  def({ id: 'w_wumujian', name: '乌木剑', type: 'weapon', slot: 'weapon', reqLevel: 2, reqJob: 2,
    atk: [0, 1], mag: [2, 5], weight: 10, price: 120, desc: '乌木削成的法剑，可导引魔力。',
    source: '甲虫王 1/5、甲壳虫 1/6、稻草人 1/6、尖头甲虫 1/20' });
  def({ id: 'w_haihun', name: '海魂', type: 'weapon', slot: 'weapon', reqLevel: 8, reqJob: 2,
    atk: [0, 1], mag: [3, 7], acc: 1, weight: 12, price: 210, desc: '蕴含海之魂魄的法杖。',
    source: '墓地尸王 1/10' });
  def({ id: 'w_yinshe', name: '银蛇', type: 'weapon', slot: 'weapon', reqLevel: 8, reqJob: 3,
    atk: [1, 2], tao: [3, 7], acc: 1, weight: 12, price: 210, desc: '形如银蛇的短剑，道士爱用。',
    source: '墓地尸王 1/10' });
  def({ id: 'w_qidao', name: '祈祷之刃', type: 'weapon', slot: 'weapon', reqLevel: 19, reqJob: 3,
    atk: [1, 3], tao: [4, 8], acc: 1, weight: 14, price: 300, desc: '刻满祷文的弯刃，道术加成可观。',
    source: '海曦村杂货商出售' });

  /* ---------- 衣服 4 ---------- */
  def({ id: 'a_buyi', name: '布衣', type: 'armor', slot: 'armor', reqLevel: 2, reqJob: 0,
    def: [1, 2], mdef: [1, 2], hp: 15, weight: 20, price: 230, desc: '粗布缝制的轻便衣甲。',
    source: '鹿 1/6' });
  def({ id: 'a_liangongfu', name: '练功服', type: 'armor', slot: 'armor', reqLevel: 2, reqJob: 0,
    def: [1, 2], mdef: [1, 2], hp: 15, weight: 20, price: 230, desc: '习武之人常穿的练功服。',
    source: '墓地尸王 1/10' });
  def({ id: 'a_mofachangpao', name: '魔法长袍', type: 'armor', slot: 'armor', reqLevel: 19, reqJob: 2,
    def: [3, 6], mdef: [2, 5], hp: 45, mp: 18, weight: 28, price: 450, desc: '绣有法阵的长袍，增幅魔力。',
    source: '海曦村杂货商出售' });
  def({ id: 'a_daoshichangpao', name: '道士长袍', type: 'armor', slot: 'armor', reqLevel: 19, reqJob: 3,
    def: [3, 6], mdef: [2, 5], hp: 45, mp: 18, weight: 28, price: 450, desc: '道门制式长袍，清心凝神。',
    source: '海曦村杂货商出售' });

  /* ---------- 头盔 2 ---------- */
  def({ id: 'h_hongying', name: '红樱头盔', type: 'helmet', slot: 'helmet', reqLevel: 8, reqJob: 1,
    atk: [0, 2], def: [1, 3], mdef: [1, 3], hp: 40, weight: 6, price: 200,
    setId: 'set_hongying', setText: '红樱套装（3件：防御+4｜5件：主属性+5）',
    desc: '缀有红缨的铁盔。', source: '海曦村杂货商出售' });
  def({ id: 'h_fenmu', name: '粉木头盔', type: 'helmet', slot: 'helmet', reqLevel: 8, reqJob: 2,
    mag: [0, 1], def: [1, 3], mdef: [1, 3], hp: 40, weight: 6, price: 200,
    setId: 'set_fenmu', setText: '粉木套装（3件：防御+4｜5件：主属性+5）',
    desc: '粉木打造的轻盔，便于施法。', source: '海曦村杂货商出售' });

  /* ---------- 项链 2 ---------- */
  def({ id: 'n_canque', name: '残缺玉佩（左）', type: 'necklace', slot: 'necklace', reqLevel: 2, reqJob: 0,
    atk: [0, 1], weight: 2, price: 100, desc: '只剩一半的玉佩，仍有余韵。',
    source: '海曦村杂货商出售' });
  def({ id: 'n_xiao', name: '小项链', type: 'necklace', slot: 'necklace', reqLevel: 2, reqJob: 0,
    atk: [1, 2], weight: 2, price: 100, desc: '细链挂着的小坠子。',
    source: '鹿 1/6、墓地行尸 1/15、墓地爬尸 1/15、墓地电尸 1/15' });

  /* ---------- 手镯 2 ---------- */
  def({ id: 'b_tie', name: '铁手镯', type: 'bracelet', slot: 'bracelet', reqLevel: 2, reqJob: 0,
    atk: [0, 1], def: [0, 1], weight: 2, price: 100, desc: '生铁打制的手镯。',
    source: '墓地尸王 1/2、甲虫王 1/3、稻草人 1/6、墓地行尸 1/15' });
  def({ id: 'b_qingling', name: '青灵手镯', type: 'bracelet', slot: 'bracelet', reqLevel: 8, reqJob: 3,
    tao: [1, 2], def: [0, 1], weight: 3, price: 140, desc: '透着青灵之气的玉镯。',
    source: '海曦村杂货商出售' });

  /* ---------- 戒指 2 ---------- */
  def({ id: 'r_shengtie', name: '生铁戒指', type: 'ring', slot: 'ring', reqLevel: 2, reqJob: 0,
    atk: [0, 1], hp: 5, weight: 1, price: 80, desc: '粗糙的生铁戒指。',
    source: '墓地尸王 1/2、甲虫王 1/3、甲壳虫 1/6、尖头甲虫 1/15' });
  def({ id: 'r_xiao', name: '小戒指', type: 'ring', slot: 'ring', reqLevel: 8, reqJob: 0,
    atk: [1, 2], hp: 10, weight: 1, price: 130, desc: '镶着小石头的戒指。',
    source: '海曦村杂货商出售' });

  /* ---------- 鞋子 2 ---------- */
  def({ id: 's_caoxie', name: '草鞋', type: 'boots', slot: 'boots', reqLevel: 2, reqJob: 0,
    def: [1, 1], mdef: [0, 1], weight: 4, price: 80,
    setId: 'set_caoxie', setText: '草鞋套装（3件：防御+3｜5件：主属性+4）',
    desc: '编织草鞋，轻便耐磨。', source: '鹿 1/6、稻草人 1/15' });
  def({ id: 's_buxie', name: '布鞋', type: 'boots', slot: 'boots', reqLevel: 8, reqJob: 0,
    def: [1, 2], mdef: [0, 2], weight: 5, price: 120,
    setId: 'set_buxie', setText: '布鞋套装（3件：防御+4｜5件：主属性+5）',
    desc: '厚底布鞋，走路无声。', source: '墓地尸王 1/10' });

  /* ---------- 盾牌 1 ---------- */
  def({ id: 'd_xiaomu', name: '小木盾', type: 'shield', slot: 'shield', reqLevel: 2, reqJob: 0,
    def: [1, 3], mdef: [1, 2], weight: 13, price: 160, desc: '木制圆盾，聊胜于无。',
    source: '鹿 1/6、稻草人 1/15' });

  /* ---------- 消耗品 ---------- */
  def({ id: 'c_hp1', name: '金疮药小', type: 'potion', stack: 99, price: 30, weight: 1,
    use: { hp: 50 }, desc: '恢复 50 点生命。' });
  def({ id: 'c_hp2', name: '金疮药中', type: 'potion', stack: 99, price: 90, weight: 1,
    use: { hp: 150 }, desc: '恢复 150 点生命。' });
  def({ id: 'c_hp3', name: '金疮药大', type: 'potion', stack: 99, price: 180, weight: 1,
    use: { hp: 320 }, desc: '恢复 320 点生命。' });
  def({ id: 'c_mp1', name: '魔法药小', type: 'potion', stack: 99, price: 40, weight: 1,
    use: { mp: 30 }, desc: '恢复 30 点魔法。' });
  def({ id: 'c_mp2', name: '魔法药中', type: 'potion', stack: 99, price: 110, weight: 1,
    use: { mp: 90 }, desc: '恢复 90 点魔法。' });
  def({ id: 'c_mp3', name: '魔法药大', type: 'potion', stack: 99, price: 220, weight: 1,
    use: { mp: 180 }, desc: '恢复 180 点魔法。' });
  def({ id: 'c_huicheng', name: '回城卷', type: 'scroll', stack: 20, price: 60, weight: 1,
    use: { town: true }, desc: '使用后返回海曦村。' });

  /* ---------- 材料 / 其他 ---------- */
  def({ id: 'm_hexiancao', name: '鹤仙草', type: 'material', price: 25, weight: 1, desc: '墓地边常见的草药。' });
  def({ id: 'm_lurou', name: '鹿肉', type: 'material', price: 12, weight: 1, desc: '新鲜的鹿肉，可卖钱。' });
  def({ id: 'm_lurong', name: '鹿茸', type: 'material', price: 40, weight: 1, desc: '名贵药材。' });
  def({ id: 'm_caobang', name: '一堆草棒', type: 'material', price: 8, weight: 1, desc: '稻草人身上掉落的草棒。' });
  def({ id: 'm_jidan', name: '鸡蛋', type: 'material', price: 8, weight: 1, desc: '普通鸡蛋。' });
  def({ id: 'm_jindan', name: '金蛋', type: 'material', price: 60, weight: 1, desc: '罕见的金蛋，能卖好价钱。' });
  def({ id: 'm_shenmu_ji', name: '神木（鸡）', type: 'material', price: 100, weight: 1, desc: '极稀有的神木，炼金材料。' });

  G.ITEMS = ITEMS;
  G.ITEM_BY_NAME = {};
  Object.keys(ITEMS).forEach(function (id) { G.ITEM_BY_NAME[ITEMS[id].name] = ITEMS[id]; });
  G.item = function (id) { return ITEMS[id] || null; };
  G.itemByName = function (name) { return G.ITEM_BY_NAME[name] || null; };
  // V0.2：供扩展数据文件（items_v02.js）追加物品
  G.addItem = function (o) {
    const it = def(o);
    G.ITEM_BY_NAME[it.name] = it;
    return it;
  };

  G.EQUIP_TYPES = { weapon: 1, armor: 1, helmet: 1, necklace: 1, bracelet: 1, ring: 1, boots: 1, shield: 1 };
  G.isEquip = function (it) { return !!(it && G.EQUIP_TYPES[it.type]); };
})();
