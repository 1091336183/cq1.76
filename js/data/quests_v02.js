/* ===== V0.2 任务：第 2 / 3 章主线 + 12 条支线 ===== */
(function () {
  G.QUESTS.chapter1.next = 'chapter2';

  G.QUESTS.chapter2 = {
    id: 'chapter2', name: '第二章 · 临海镇的蛙患', next: 'chapter3',
    steps: [
      { type: 'talk', npc: 'npc_linhai_zhang', text: '与临海镇长对话', hint: '临海镇中央', reward: null },
      { type: 'kill', base: '鼻涕虫', count: 8, text: '消灭 8 只鼻涕虫', hint: '沼林 / 沼林西', reward: { exp: 1200, gold: 300 } },
      { type: 'kill', base: '独眼蛙', count: 6, text: '消灭 6 只独眼蛙', hint: '沼林 / 蛙洞一层', reward: { exp: 1800, gold: 400 } },
      { type: 'kill', base: '蛙统领', count: 1, text: '击败蛙统领', hint: '蛙巢（蛙洞二层向北）', reward: { exp: 3000, gold: 800 } },
      { type: 'kill', base: '白野猪统领', count: 1, text: '击败白野猪统领', hint: '野猪巢穴（野猪洞二层向北）', reward: { exp: 4200, gold: 1000 } },
      { type: 'talk', npc: 'npc_linhai_zhang', text: '回临海镇向镇长复命', hint: '临海镇中央', reward: { exp: 3000, gold: 1200 } }
    ]
  };

  G.QUESTS.chapter3 = {
    id: 'chapter3', name: '第三章 · 华月城的黑夜', next: null,
    steps: [
      { type: 'talk', npc: 'npc_taishou', text: '拜见华月太守', hint: '华月城北府衙', reward: null },
      { type: 'kill', base: '钉耙猫', count: 8, text: '消灭 8 只钉耙猫', hint: '密林', reward: { exp: 3600, gold: 900 } },
      { type: 'kill', base: '月魔蝙蝠', count: 6, text: '消灭 6 只月魔蝙蝠', hint: '蝙蝠洞二层 / 蝙蝠巢穴', reward: { exp: 5400, gold: 1400 } },
      { type: 'kill', base: '狼王', count: 1, text: '击败狼王', hint: '饿狼巢穴（饿狼领向北）', reward: { exp: 8000, gold: 2000 } },
      { type: 'kill', base: '蝙蝠王', count: 1, text: '击败蝙蝠王', hint: '蝙蝠巢穴（蝙蝠洞二层向北）', reward: { exp: 9000, gold: 2400 } },
      { type: 'talk', npc: 'npc_taishou', text: '向华月太守复命，结算第三章', hint: '华月城北府衙', reward: { exp: 6000, gold: 3000 } }
    ]
  };

  /* 支线：达到对应章节后自动接取，达成即自动完成并发奖 */
  G.SIDE_QUESTS = [
    { id: 'sq_1', chapter: 'chapter2', kind: 'kill', base: '甲壳虫', count: 15,
      text: '甲虫克星', hint: '海曦村北 / 树林深处', reward: { exp: 800, gold: 200 } },
    { id: 'sq_2', chapter: 'chapter2', kind: 'kill', base: '鹿', count: 10,
      text: '鹿群清剿', hint: '海曦村北 / 树林深处', reward: { exp: 900, gold: 220 } },
    { id: 'sq_3', chapter: 'chapter2', kind: 'kill', base: '墓地爬尸', count: 10,
      text: '墓地安宁', hint: '墓地', reward: { exp: 1000, gold: 260 } },
    { id: 'sq_4', chapter: 'chapter2', kind: 'collect', item: '蛙眼', count: 10,
      text: '蛙眼收集', hint: '独眼蛙 / 独眼红蛙掉落', reward: { exp: 1200, gold: 300 } },
    { id: 'sq_5', chapter: 'chapter2', kind: 'collect', item: '猪肉', count: 10,
      text: '猪肉储备', hint: '猪 / 野猪类掉落', reward: { exp: 1000, gold: 320 } },
    { id: 'sq_6', chapter: 'chapter2', kind: 'kill', base: '红野猪', count: 12,
      text: '红野猪清剿', hint: '野猪洞一层', reward: { exp: 1500, gold: 380 } },
    { id: 'sq_7', chapter: 'chapter2', kind: 'kill', base: '白野猪', count: 10,
      text: '白野猪讨伐', hint: '野猪洞二层 / 野猪巢穴', reward: { exp: 1800, gold: 450 } },
    { id: 'sq_8', chapter: 'chapter2', kind: 'collect', item: '狼毫', count: 8,
      text: '狼毫收集', hint: '狼类怪物掉落', reward: { exp: 1600, gold: 500 } },
    { id: 'sq_9', chapter: 'chapter3', kind: 'collect', item: '狼牙', count: 6,
      text: '狼牙收集', hint: '恶狼 / 狼王掉落', reward: { exp: 2200, gold: 600 } },
    { id: 'sq_10', chapter: 'chapter3', kind: 'kill', base: '月魔蝙蝠', count: 8,
      text: '月魔夜袭', hint: '蝙蝠洞二层 / 蝙蝠巢穴', reward: { exp: 2600, gold: 700 } },
    { id: 'sq_11', chapter: 'chapter3', kind: 'kill', base: '蝙蝠', count: 12,
      text: '蝙蝠清剿', hint: '密林 / 蝙蝠洞', reward: { exp: 2400, gold: 650 } },
    { id: 'sq_12', chapter: 'chapter3', kind: 'kill', base: '钉耙猫', count: 10,
      text: '钉耙猫之患', hint: '密林', reward: { exp: 2000, gold: 560 } }
  ];

  G.CHAPTER_ORDER = ['chapter1', 'chapter2', 'chapter3'];

  G.chapter = function (id) { return G.QUESTS[id] || G.QUESTS.chapter1; };
})();
