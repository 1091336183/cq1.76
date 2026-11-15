/* ===== 任务数据（V0.1：第一章 5 步） ===== */
(function () {
  G.QUESTS = {
    chapter1: {
      id: 'chapter1',
      name: '第一章 · 海曦村的委托',
      steps: [
        {
          type: 'talk', npc: 'npc_cunzhang',
          text: '与海曦村长对话', hint: '海曦村中央',
          reward: null
        },
        {
          type: 'kill', base: '甲壳虫', count: 5,
          text: '消灭 5 只甲壳虫', hint: '海曦村北',
          reward: { exp: 120, gold: 60 }
        },
        {
          type: 'kill', base: '稻草人', count: 3,
          text: '消灭 3 只稻草人', hint: '英雄海岸',
          reward: { exp: 300, gold: 120 }
        },
        {
          type: 'kill', base: '墓地尸王', count: 1,
          text: '击败墓地尸王', hint: '墓地深处（英雄村外向北）',
          reward: { exp: 800, gold: 300 }
        },
        {
          type: 'talk', npc: 'npc_lingyunzi',
          text: '回海曦村向凌云子复命', hint: '海曦村',
          reward: { exp: 1500, gold: 500 }
        }
      ]
    }
  };

  G.chapter = function () { return G.QUESTS.chapter1; };
})();
