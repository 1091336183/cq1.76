/* ===== 任务面板（V0.2：主线三章 + 支线） ===== */
(function () {
  G.PageQuest = {
    open: function () {
      G.Panel.open('quest', '任务', this.html(), { width: 520, x: 252, y: 70 });
    },

    render: function () {
      if (G.Panel.isOpen('quest')) G.Panel.setHTML('quest', this.html());
    },

    html: function () {
      const p = G.S.player;
      const cur = G.Quest.current(p);
      const q = cur.chapter;
      const list = G.Quest.sideList(p);
      let steps = '';
      q.steps.forEach(function (s, i) {
        let cls = 'quest-step';
        let mark = '○';
        if (i < p.quest.step) { cls += ' done'; mark = '✓'; }
        else if (i === p.quest.step && !p.quest.done) { cls += ' cur'; mark = '▶'; }
        let prog = '';
        if (s.type === 'kill') {
          const have = Math.min(p.quest.kills[s.base] || 0, s.count);
          prog = ' <span class="prog">' + have + '/' + s.count + '</span>';
        }
        const rw = s.reward
          ? ' <span class="dim">（奖励：经验 ' + (s.reward.exp || 0) + ' · 金币 ' + (s.reward.gold || 0) + '）</span>'
          : '';
        steps += '<div class="' + cls + '"><span class="qk">' + mark + ' ' + (i + 1) + '.</span>' +
          '<span>' + G.U.esc(s.text) + prog + '<br><span class="dim">' + G.U.esc(s.hint) + '</span>' + rw + '</span></div>';
      });

      let sides = '';
      list.forEach(function (s) {
        const d = s.def;
        if (!s.active) {
          sides += '<div class="quest-step" style="opacity:.35"><span class="qk">·</span>' +
            '<span>' + G.U.esc(d.text) + '（进入后续章节解锁）</span></div>';
          return;
        }
        const cls = 'quest-step' + (s.done ? ' done' : '');
        const mark = s.done ? '✓' : '◇';
        sides += '<div class="' + cls + '"><span class="qk">' + mark + '</span>' +
          '<span>' + G.U.esc(d.text) + ' <span class="prog">' + s.n + '/' + s.count + '</span>' +
          '<br><span class="dim">' + G.U.esc(d.hint) + '（经验 ' + (d.reward.exp || 0) +
          ' · 金币 ' + (d.reward.gold || 0) + '）</span></span></div>';
      });

      return '<div class="quest-chap">' + G.U.esc(q.name) + (p.quest.done ? '（已通关）' : '') + '</div>' +
        steps +
        '<div class="divider"></div>' +
        '<div class="quest-chap">支线 · 12</div>' +
        '<div class="quest-sides">' + sides + '</div>' +
        '<div class="divider"></div>' +
        '<div class="char-sub">当前等级 Lv.' + p.level + ' ｜ 等级上限 Lv.' + G.CFG.LEVEL_CAP +
        ' ｜ 已完成章节 ' + (G.CHAPTER_ORDER || []).indexOf(p.quest.chapter) + '/3</div>' +
        '<div class="start-tip">核心目标：击败狼王 → 向华月太守复命 → 第三章结算通关。</div>';
    }
  };
})();
