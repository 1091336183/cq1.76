/* ===== V0.2 新增掉落表（按 名称#阶 索引） ===== */
(function () {
  const T = {
  '独眼红蛙#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 25 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '草鞋', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '小木盾', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '独眼红蛙-幻影#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 10 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 10 },
    { item: '草鞋', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 10 },
    { item: '小木盾', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '独眼红蛙-烈焰#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 25 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '草鞋', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '小木盾', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '独眼红蛙-精英#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 15 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '草鞋', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '小木盾', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '独眼蛙#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 35 },
    { item: '草鞋', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '小木盾', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '独眼蛙-幻影#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 10 },
    { item: '草鞋', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 10 },
    { item: '小戒指', qty: 1, n: 10 },
    { item: '小木盾', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '独眼蛙-拒魔#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 35 },
    { item: '草鞋', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '小木盾', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '独眼蛙-精英#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 15 },
    { item: '草鞋', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '小木盾', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '猪#2': [
    { item: '金疮药小', qty: 1, n: 20 },
    { item: '魔法药小', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 }
  ],
  '红野猪#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 15 },
    { item: '银蛇', qty: 1, n: 25 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '红野猪-幻影#2': [
    { item: '金疮药小', qty: 1, n: 10 },
    { item: '魔法药小', qty: 1, n: 10 },
    { item: '猪肉', qty: 1, n: 15 },
    { item: '银蛇', qty: 1, n: 10 },
    { item: '翠珠项链', qty: 1, n: 10 },
    { item: '青石项链', qty: 1, n: 10 },
    { item: '玉珠项链', qty: 1, n: 10 },
    { item: '铁手镯', qty: 1, n: 10 },
    { item: '小戒指', qty: 1, n: 10 },
    { item: '布鞋', qty: 1, n: 10 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '红野猪-烈焰#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 15 },
    { item: '银蛇', qty: 1, n: 25 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '红野猪-精英#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 15 },
    { item: '银蛇', qty: 1, n: 25 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '黑野猪#2': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 15 },
    { item: '海魂', qty: 1, n: 25 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '鼻涕虫#2': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '蓝色项链', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '鼻涕虫-幻影#2': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '蓝色项链', qty: 1, n: 10 },
    { item: '回城卷', qty: 1, n: 10 }
  ],
  '鼻涕虫-精英#2': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '蓝色项链', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 },
    { item: '金疮药小', qty: 2, n: 1 },
    { item: '魔法药小', qty: 2, n: 1 },
    { item: '匕首', qty: 1, n: 3 },
    { item: '青铜斧', qty: 1, n: 10 },
    { item: '海魂', qty: 1, n: 10 },
    { item: '银蛇', qty: 1, n: 10 },
    { item: '练功服', qty: 1, n: 10 },
    { item: '铁手镯', qty: 1, n: 2 },
    { item: '生铁戒指', qty: 1, n: 2 },
    { item: '布鞋', qty: 1, n: 10 },
    { item: '回城卷', qty: 1, n: 1 },
    { item: '金疮药小', qty: 1, n: 1 },
    { item: '魔法药小', qty: 1, n: 1 },
    { item: '木剑', qty: 1, n: 5 },
    { item: '乌木剑', qty: 1, n: 5 },
    { item: '匕首', qty: 1, n: 5 },
    { item: '青铜斧', qty: 1, n: 10 },
    { item: '铁手镯', qty: 1, n: 3 },
    { item: '生铁戒指', qty: 1, n: 3 },
    { item: '回城卷', qty: 1, n: 1 }
  ],
  '多钩猫#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '玻璃项链', qty: 1, n: 20 },
    { item: '法术手镯', qty: 1, n: 20 },
    { item: '黄环戒指', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '多钩猫-幻影#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '玻璃项链', qty: 1, n: 10 },
    { item: '法术手镯', qty: 1, n: 10 },
    { item: '黄环戒指', qty: 1, n: 10 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '多钩猫-精英#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '玻璃项链', qty: 1, n: 20 },
    { item: '法术手镯', qty: 1, n: 20 },
    { item: '黄环戒指', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '幻魔猪#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '清风项链', qty: 1, n: 20 },
    { item: '蓝石项链', qty: 1, n: 20 },
    { item: '战斗披风', qty: 1, n: 20 },
    { item: '魔法长袍', qty: 1, n: 20 },
    { item: '道士长袍', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 }
  ],
  '幻魔猪-幻影#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '清风项链', qty: 1, n: 20 },
    { item: '蓝石项链', qty: 1, n: 20 },
    { item: '战斗披风', qty: 1, n: 20 },
    { item: '魔法长袍', qty: 1, n: 20 },
    { item: '道士长袍', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 }
  ],
  '幻魔猪-精英#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '清风项链', qty: 1, n: 20 },
    { item: '蓝石项链', qty: 1, n: 20 },
    { item: '战斗披风', qty: 1, n: 20 },
    { item: '魔法长袍', qty: 1, n: 20 },
    { item: '道士长袍', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 }
  ],
  '恶狼#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '狼毫', qty: 1, n: 20 },
    { item: '狼牙', qty: 1, n: 30 },
    { item: '狩猎头盔', qty: 1, n: 30 },
    { item: '狩猎项链', qty: 1, n: 30 },
    { item: '狩猎手镯', qty: 1, n: 30 },
    { item: '狩猎戒指', qty: 1, n: 30 },
    { item: '玻璃戒指', qty: 1, n: 20 },
    { item: '神木（狗）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '恶狼-幻影#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '狼毫', qty: 1, n: 20 },
    { item: '狼牙', qty: 1, n: 30 },
    { item: '狩猎头盔', qty: 1, n: 30 },
    { item: '狩猎项链', qty: 1, n: 30 },
    { item: '狩猎手镯', qty: 1, n: 30 },
    { item: '狩猎戒指', qty: 1, n: 30 },
    { item: '玻璃戒指', qty: 1, n: 20 },
    { item: '神木（狗）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '恶狼-精英#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '狼毫', qty: 1, n: 20 },
    { item: '狼牙', qty: 1, n: 30 },
    { item: '狩猎头盔', qty: 1, n: 30 },
    { item: '狩猎项链', qty: 1, n: 30 },
    { item: '狩猎手镯', qty: 1, n: 30 },
    { item: '狩猎戒指', qty: 1, n: 30 },
    { item: '玻璃戒指', qty: 1, n: 20 },
    { item: '神木（狗）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '狼#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '狼毫', qty: 1, n: 20 },
    { item: '狼牙', qty: 1, n: 30 },
    { item: '狩猎头盔', qty: 1, n: 30 },
    { item: '狩猎项链', qty: 1, n: 30 },
    { item: '狩猎手镯', qty: 1, n: 30 },
    { item: '狩猎戒指', qty: 1, n: 30 },
    { item: '玻璃戒指', qty: 1, n: 20 },
    { item: '神木（狗）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '狼-精英#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '狼毫', qty: 1, n: 20 },
    { item: '狼牙', qty: 1, n: 30 },
    { item: '狩猎头盔', qty: 1, n: 30 },
    { item: '狩猎项链', qty: 1, n: 30 },
    { item: '狩猎手镯', qty: 1, n: 30 },
    { item: '狩猎戒指', qty: 1, n: 30 },
    { item: '玻璃戒指', qty: 1, n: 20 },
    { item: '神木（狗）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '白野猪#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '红樱头盔', qty: 1, n: 20 },
    { item: '红樱项链', qty: 1, n: 20 },
    { item: '红樱手镯', qty: 1, n: 20 },
    { item: '红樱戒指', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 }
  ],
  '白野猪-幻影#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '红樱头盔', qty: 1, n: 10 },
    { item: '红樱项链', qty: 1, n: 10 },
    { item: '红樱手镯', qty: 1, n: 10 },
    { item: '红樱戒指', qty: 1, n: 10 },
    { item: '神木（猪）', qty: 1, n: 100 }
  ],
  '白野猪-电离#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '红樱头盔', qty: 1, n: 20 },
    { item: '红樱项链', qty: 1, n: 20 },
    { item: '红樱手镯', qty: 1, n: 20 },
    { item: '红樱戒指', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 }
  ],
  '白野猪-精英#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '红樱头盔', qty: 1, n: 20 },
    { item: '红樱项链', qty: 1, n: 20 },
    { item: '红樱手镯', qty: 1, n: 20 },
    { item: '红樱戒指', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 }
  ],
  '粪虫#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 }
  ],
  '红刺蛙#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 }
  ],
  '红刺蛙-幻影#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '翠珠项链', qty: 1, n: 10 },
    { item: '青石项链', qty: 1, n: 10 },
    { item: '玉珠项链', qty: 1, n: 10 },
    { item: '练功服', qty: 1, n: 10 },
    { item: '铁手镯', qty: 1, n: 10 },
    { item: '小戒指', qty: 1, n: 10 },
    { item: '布鞋', qty: 1, n: 10 }
  ],
  '红刺蛙-烈焰#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 }
  ],
  '红刺蛙-精英#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 }
  ],
  '绿蛙#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 }
  ],
  '绿蛙-幻影#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '翠珠项链', qty: 1, n: 10 },
    { item: '青石项链', qty: 1, n: 10 },
    { item: '玉珠项链', qty: 1, n: 10 },
    { item: '练功服', qty: 1, n: 10 },
    { item: '铁手镯', qty: 1, n: 10 },
    { item: '小戒指', qty: 1, n: 10 },
    { item: '布鞋', qty: 1, n: 20 }
  ],
  '绿蛙-拒魔#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 }
  ],
  '绿蛙-精英#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '练功服', qty: 1, n: 20 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 }
  ],
  '蛆虫#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '虫卵', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '蛆虫-幻影#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '虫卵', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '蛆虫-精英#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '虫卵', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '蝙蝠#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '轻手镯', qty: 1, n: 30 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '蝙蝠-精英#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '轻手镯', qty: 1, n: 30 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '被诱惑的狼#3': [
    { item: '金疮药小', qty: 1, n: 20 },
    { item: '魔法药小', qty: 1, n: 20 }
  ],
  '被诱惑的猫#3': [
    { item: '金疮药小', qty: 1, n: 20 },
    { item: '魔法药小', qty: 1, n: 20 }
  ],
  '钉耙猫#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '粉木头盔', qty: 1, n: 20 },
    { item: '粉木项链', qty: 1, n: 20 },
    { item: '粉木手镯', qty: 1, n: 20 },
    { item: '粉木戒指', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '钉耙猫-幻影#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '粉木头盔', qty: 1, n: 20 },
    { item: '粉木项链', qty: 1, n: 20 },
    { item: '粉木手镯', qty: 1, n: 20 },
    { item: '粉木戒指', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '钉耙猫-精英#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '粉木头盔', qty: 1, n: 20 },
    { item: '粉木项链', qty: 1, n: 20 },
    { item: '粉木手镯', qty: 1, n: 20 },
    { item: '粉木戒指', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '黑野猪-幻影#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 5 },
    { item: '海魂', qty: 1, n: 25 },
    { item: '翠珠项链', qty: 1, n: 10 },
    { item: '青石项链', qty: 1, n: 10 },
    { item: '玉珠项链', qty: 1, n: 10 },
    { item: '铁手镯', qty: 1, n: 10 },
    { item: '小戒指', qty: 1, n: 10 },
    { item: '布鞋', qty: 1, n: 10 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '黑野猪-电离#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 15 },
    { item: '海魂', qty: 1, n: 25 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '黑野猪-精英#3': [
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 15 },
    { item: '海魂', qty: 1, n: 25 },
    { item: '翠珠项链', qty: 1, n: 25 },
    { item: '青石项链', qty: 1, n: 25 },
    { item: '玉珠项链', qty: 1, n: 25 },
    { item: '铁手镯', qty: 1, n: 20 },
    { item: '小戒指', qty: 1, n: 20 },
    { item: '布鞋', qty: 1, n: 20 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 },
    { item: '金疮药小', qty: 1, n: 15 },
    { item: '魔法药小', qty: 1, n: 15 },
    { item: '战斗披风', qty: 1, n: 25 },
    { item: '魔法长袍', qty: 1, n: 25 },
    { item: '道士长袍', qty: 1, n: 25 },
    { item: '神木（猪）', qty: 1, n: 100 },
    { item: '金疮药小', qty: 1, n: 1 },
    { item: '魔法药小', qty: 1, n: 1 },
    { item: '祈祷之刃', qty: 1, n: 15 },
    { item: '修罗', qty: 1, n: 15 },
    { item: '青铜斧', qty: 1, n: 10 },
    { item: '匕首', qty: 1, n: 5 },
    { item: '短剑', qty: 1, n: 15 },
    { item: '海魂', qty: 1, n: 10 },
    { item: '银蛇', qty: 1, n: 10 },
    { item: '偃月', qty: 1, n: 15 },
    { item: '练功服', qty: 1, n: 10 },
    { item: '翠珠项链', qty: 1, n: 5 },
    { item: '青石项链', qty: 1, n: 5 },
    { item: '玉珠项链', qty: 1, n: 5 },
    { item: '轻手镯', qty: 1, n: 5 },
    { item: '布鞋', qty: 1, n: 5 },
    { item: '回城卷', qty: 1, n: 1 },
    { item: '金疮药中', qty: 1, n: 1 },
    { item: '魔法药中', qty: 1, n: 1 },
    { item: '野猪牙', qty: 1, n: 1 },
    { item: '修罗', qty: 1, n: 5 },
    { item: '柴刀', qty: 1, n: 10 },
    { item: '骨玉权杖', qty: 1, n: 10 },
    { item: '魔杖', qty: 1, n: 5 },
    { item: '真武剑', qty: 1, n: 5 },
    { item: '凌风', qty: 1, n: 10 },
    { item: '棉鞋', qty: 1, n: 5 },
    { item: '回城卷', qty: 1, n: 1 }
  ],
  '月魔蝙蝠#4': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '黄铜头盔', qty: 1, n: 30 },
    { item: '黄铜项链', qty: 1, n: 30 },
    { item: '黄铜手镯', qty: 1, n: 30 },
    { item: '黄铜戒指', qty: 1, n: 30 },
    { item: '玻璃戒指', qty: 1, n: 30 },
    { item: '翡翠戒指', qty: 1, n: 30 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '月魔蝙蝠-幻影#4': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '黄铜头盔', qty: 1, n: 20 },
    { item: '黄铜项链', qty: 1, n: 20 },
    { item: '黄铜手镯', qty: 1, n: 20 },
    { item: '黄铜戒指', qty: 1, n: 20 },
    { item: '玻璃戒指', qty: 1, n: 30 },
    { item: '翡翠戒指', qty: 1, n: 30 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '月魔蝙蝠-精英#4': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '黄铜头盔', qty: 1, n: 30 },
    { item: '黄铜项链', qty: 1, n: 30 },
    { item: '黄铜手镯', qty: 1, n: 30 },
    { item: '黄铜戒指', qty: 1, n: 30 },
    { item: '玻璃戒指', qty: 1, n: 30 },
    { item: '翡翠戒指', qty: 1, n: 30 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '狼-幻影#4': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '狼毫', qty: 1, n: 20 },
    { item: '狼牙', qty: 1, n: 30 },
    { item: '狩猎头盔', qty: 1, n: 30 },
    { item: '狩猎项链', qty: 1, n: 30 },
    { item: '狩猎手镯', qty: 1, n: 30 },
    { item: '狩猎戒指', qty: 1, n: 30 },
    { item: '玻璃戒指', qty: 1, n: 20 },
    { item: '神木（狗）', qty: 1, n: 100 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '蝙蝠-幻影#4': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '轻手镯', qty: 1, n: 30 },
    { item: '回城卷', qty: 1, n: 10 },
    { item: '金疮药中', qty: 1, n: 1 },
    { item: '魔法药中', qty: 1, n: 1 },
    { item: '狼毫', qty: 1, n: 1 },
    { item: '修罗', qty: 1, n: 5 },
    { item: '柴刀', qty: 1, n: 10 },
    { item: '骨玉权杖', qty: 1, n: 10 },
    { item: '魔杖', qty: 1, n: 5 },
    { item: '真武剑', qty: 1, n: 5 },
    { item: '凌风', qty: 1, n: 10 },
    { item: '红翎手镯', qty: 1, n: 5 },
    { item: '玻璃戒指', qty: 1, n: 5 },
    { item: '回城卷', qty: 1, n: 1 },
    { item: '金疮药中', qty: 2, n: 1 },
    { item: '魔法药中', qty: 2, n: 1 },
    { item: '柴刀', qty: 1, n: 10 },
    { item: '修罗', qty: 1, n: 5 },
    { item: '八荒', qty: 1, n: 10 },
    { item: '魔杖', qty: 1, n: 5 },
    { item: '骨玉权杖', qty: 1, n: 10 },
    { item: '真武剑', qty: 1, n: 5 },
    { item: '凌风', qty: 1, n: 10 },
    { item: '野蛮项链', qty: 1, n: 5 },
    { item: '翡翠戒指', qty: 1, n: 5 },
    { item: '回城卷', qty: 1, n: 1 }
  ],
  '蝙蝠王#4': [
    { item: '金疮药中', qty: 1, n: 10 },
    { item: '魔法药中', qty: 1, n: 10 },
    { item: '天尊道袍', qty: 1, n: 5 },
    { item: '紫碧魔袍', qty: 1, n: 5 },
    { item: '勇士盾', qty: 1, n: 5 },
    { item: '幽冥项链', qty: 1, n: 5 },
    { item: '幽冥手镯', qty: 1, n: 5 },
    { item: '幽冥戒指', qty: 1, n: 5 },
    { item: '麻痹戒指', qty: 1, n: 1 },
    { item: '回城卷', qty: 1, n: 10 },
    { item: '技能书', qty: 1, n: 5 }
  ],
  /* ---- V0.2 补充掉落表（同阶跨图怪物 / 二阶以上 BOSS） ---- */
  '鼻涕虫#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 25 },
    { item: '野猪牙', qty: 1, n: 20 },
    { item: '黄铜头盔', qty: 1, n: 10 },
    { item: '黄铜戒指', qty: 1, n: 10 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '鼻涕虫-幻影#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 10 },
    { item: '黄铜头盔', qty: 1, n: 10 },
    { item: '黄铜戒指', qty: 1, n: 10 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '鼻涕虫-精英#3': [
    { item: '金疮药中', qty: 1, n: 20 },
    { item: '魔法药中', qty: 1, n: 20 },
    { item: '蛙眼', qty: 1, n: 30 },
    { item: '黄铜头盔', qty: 1, n: 20 },
    { item: '黄铜项链', qty: 1, n: 20 },
    { item: '黄铜戒指', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '独眼红蛙#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '蛙眼', qty: 1, n: 25 },
    { item: '黄铜手镯', qty: 1, n: 15 },
    { item: '黄铜戒指', qty: 1, n: 15 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '独眼红蛙-精英#3': [
    { item: '金疮药中', qty: 1, n: 20 },
    { item: '魔法药中', qty: 1, n: 20 },
    { item: '蛙眼', qty: 1, n: 30 },
    { item: '黄铜手镯', qty: 1, n: 20 },
    { item: '黄铜戒指', qty: 1, n: 20 },
    { item: '玻璃戒指', qty: 1, n: 20 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '蛙统领#3': [
    { item: '金疮药中', qty: 2, n: 20 },
    { item: '魔法药中', qty: 2, n: 20 },
    { item: '蛙眼', qty: 3, n: 50 },
    { item: '紫碧魔袍', qty: 1, n: 8 },
    { item: '紫棉靴', qty: 1, n: 10 },
    { item: '勇士盾', qty: 1, n: 10 },
    { item: '技能书', qty: 1, n: 8 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '红野猪#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 30 },
    { item: '野猪牙', qty: 1, n: 25 },
    { item: '黄铜头盔', qty: 1, n: 15 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '黑野猪#3': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '猪肉', qty: 1, n: 30 },
    { item: '野猪牙', qty: 1, n: 25 },
    { item: '黄铜手镯', qty: 1, n: 15 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '白野猪统领#3': [
    { item: '金疮药中', qty: 2, n: 20 },
    { item: '魔法药中', qty: 2, n: 20 },
    { item: '猪肉', qty: 3, n: 60 },
    { item: '野猪牙', qty: 2, n: 40 },
    { item: '天尊道袍', qty: 1, n: 8 },
    { item: '坚木盾', qty: 1, n: 10 },
    { item: '技能书', qty: 1, n: 8 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '野猪王#3': [
    { item: '金疮药中', qty: 2, n: 20 },
    { item: '魔法药中', qty: 2, n: 20 },
    { item: '猪肉', qty: 3, n: 60 },
    { item: '野猪牙', qty: 2, n: 40 },
    { item: '战斗披风', qty: 1, n: 8 },
    { item: '神木（猪）', qty: 1, n: 15 },
    { item: '技能书', qty: 1, n: 8 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '恶狼#4': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '狼毫', qty: 1, n: 30 },
    { item: '狼牙', qty: 1, n: 20 },
    { item: '幽冥项链', qty: 1, n: 8 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '恶狼-幻影#4': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '狼毫', qty: 1, n: 20 },
    { item: '狼牙', qty: 1, n: 15 },
    { item: '幽冥手镯', qty: 1, n: 8 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '恶狼-精英#4': [
    { item: '金疮药中', qty: 1, n: 20 },
    { item: '魔法药中', qty: 1, n: 20 },
    { item: '狼毫', qty: 2, n: 40 },
    { item: '狼牙', qty: 1, n: 25 },
    { item: '幽冥项链', qty: 1, n: 12 },
    { item: '幽冥戒指', qty: 1, n: 12 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '狼王#4': [
    { item: '金疮药大', qty: 2, n: 20 },
    { item: '魔法药大', qty: 2, n: 20 },
    { item: '狼毫', qty: 3, n: 60 },
    { item: '狼牙', qty: 3, n: 50 },
    { item: '神木（狗）', qty: 1, n: 20 },
    { item: '裁决之杖', qty: 1, n: 5 },
    { item: '真武剑', qty: 1, n: 5 },
    { item: '麻痹戒指', qty: 1, n: 1 },
    { item: '技能书', qty: 1, n: 10 },
    { item: '回城卷', qty: 1, n: 20 }
  ],
  '蝙蝠#4': [
    { item: '金疮药中', qty: 1, n: 15 },
    { item: '魔法药中', qty: 1, n: 15 },
    { item: '虫卵', qty: 1, n: 25 },
    { item: '狼牙', qty: 1, n: 15 },
    { item: '黄铜项链', qty: 1, n: 15 },
    { item: '回城卷', qty: 1, n: 15 }
  ],
  '蝙蝠-精英#4': [
    { item: '金疮药中', qty: 1, n: 20 },
    { item: '魔法药中', qty: 1, n: 20 },
    { item: '虫卵', qty: 1, n: 30 },
    { item: '幽冥项链', qty: 1, n: 10 },
    { item: '幽冥手镯', qty: 1, n: 10 },
    { item: '回城卷', qty: 1, n: 15 }
  ]
  };
  Object.keys(T).forEach(function (k) {
    G.DROPS[k] = T[k].map(function (d) {
      const it = G.itemByName(d.item);
      return { item: it ? it.id : d.item, qty: d.qty, n: d.n };
    });
  });
})();
