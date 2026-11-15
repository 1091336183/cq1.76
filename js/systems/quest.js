/* ===== 任务系统（V0.2：第 1-3 章主线 + 支线） ===== */
(function () {
  function def(p) { return G.QUESTS[p.quest.chapter] || G.QUESTS.chapter1; }

  function chapterIndex(id) {
    const i = (G.CHAPTER_ORDER || ['chapter1']).indexOf(id);
    return i < 0 ? 0 : i;
  }

  G.Quest = {
    current: function (p) {
      const q = def(p);
      const step = p.quest.step;
      return {
        chapter: q,
        index: step,
        step: q.steps[step] || null,
        done: !!p.quest.done,
        total: q.steps.length
      };
    },

    progressText: function (p) {
      const cur = this.current(p);
      if (!cur.step) return '';
      if (cur.step.type !== 'kill') return '';
      const have = Math.min(p.quest.kills[cur.step.base] || 0, cur.step.count);
      return ' (' + have + '/' + cur.step.count + ')';
    },

    /* ---------- 支线 ---------- */
    sideList: function (p) {
      const pIdx = chapterIndex(p.quest.chapter);
      return (G.SIDE_QUESTS || []).map(function (q) {
        const st = p.quest.side[q.id] || { n: 0, done: false };
        const active = pIdx >= chapterIndex(q.chapter);
        let n = st.n || 0;
        if (q.kind === 'collect' && active && !st.done) {
          const it = G.itemByName(q.item);
          n = it ? G.Bag.countOf(p, it.id) : 0;
        }
        return {
          id: q.id, def: q, active: active, done: !!st.done,
          n: Math.min(n, q.count), count: q.count
        };
      });
    },

    sideTick: function (p) {
      const pIdx = chapterIndex(p.quest.chapter);
      (G.SIDE_QUESTS || []).forEach(function (q) {
        if (pIdx < chapterIndex(q.chapter)) return;
        const st = p.quest.side[q.id] || (p.quest.side[q.id] = { n: 0, done: false });
        if (st.done) return;
        let n = st.n || 0;
        if (q.kind === 'collect') {
          const it = G.itemByName(q.item);
          n = it ? G.Bag.countOf(p, it.id) : 0;
          st.n = n;
        }
        if (n >= q.count) {
          st.done = true;
          if (q.reward) {
            if (q.reward.exp) G.Player.gainExp(p, q.reward.exp);
            if (q.reward.gold) { p.gold += q.reward.gold; p.stats.goldEarned += q.reward.gold; }
          }
          G.UI.log('支线完成：' + q.text + '（经验 +' + ((q.reward && q.reward.exp) || 0) +
            '，金币 +' + ((q.reward && q.reward.gold) || 0) + '）', 'good');
          G.UI.toast('支线完成：' + q.text, 'good');
          if (G.Panel.isOpen('quest')) G.PageQuest.render();
        }
      });
    },

    /* ---------- 事件 ---------- */
    onKill: function (p, baseName) {
      const cur = this.current(p);
      if (!p.quest.done && cur.step && cur.step.type === 'kill' && cur.step.base === baseName) {
        const k = p.quest.kills;
        k[baseName] = (k[baseName] || 0) + 1;
        if (k[baseName] >= cur.step.count) this.completeStep(p);
        else G.UI.log('任务进度：' + cur.step.text + ' ' + k[baseName] + '/' + cur.step.count, 'sys');
      }
      // 支线击杀统计
      const pIdx = chapterIndex(p.quest.chapter);
      (G.SIDE_QUESTS || []).forEach(function (q) {
        if (q.kind !== 'kill' || q.base !== baseName) return;
        if (pIdx < chapterIndex(q.chapter)) return;
        const st = p.quest.side[q.id] || (p.quest.side[q.id] = { n: 0, done: false });
        if (!st.done) st.n = (st.n || 0) + 1;
      });
      this.sideTick(p);
      G.UI.refreshQuestHud();
      if (G.Panel.isOpen('quest')) G.PageQuest.render();
    },

    onTalk: function (p, npcId) {
      this.sideTick(p);
      if (p.quest.done) return { completed: false, victory: false };
      const cur = this.current(p);
      if (!cur.step || cur.step.type !== 'talk' || cur.step.npc !== npcId) {
        return { completed: false, victory: false };
      }
      return this.completeStep(p);
    },

    completeStep: function (p) {
      const cur = this.current(p);
      const step = cur.step;
      if (!step) return { completed: false, victory: false };
      if (step.reward) {
        if (step.reward.exp) G.Player.gainExp(p, step.reward.exp);
        if (step.reward.gold) {
          p.gold += step.reward.gold;
          p.stats.goldEarned += step.reward.gold;
        }
        G.UI.log('任务奖励：经验 +' + (step.reward.exp || 0) + '，金币 +' + (step.reward.gold || 0), 'gold');
      }
      G.UI.log('完成任务：' + step.text, 'good');
      G.Audio.play('level');
      p.quest.step += 1;

      if (p.quest.step >= cur.chapter.steps.length) {
        const nextId = cur.chapter.next;
        if (nextId && G.QUESTS[nextId]) {
          p.quest.chapter = nextId;
          p.quest.step = 0;
          p.quest.kills = {};
          const nq = G.QUESTS[nextId];
          G.UI.log('『' + cur.chapter.name + '』完成，进入『' + nq.name + '』', 'gold');
          G.UI.toast('新章节：' + nq.name, 'good');
          const first = nq.steps[0];
          if (first) G.UI.log('新的目标：' + first.text + '（' + first.hint + '）', 'sys');
          G.UI.refreshQuestHud();
          if (G.Panel.isOpen('quest')) G.PageQuest.render();
          this.sideTick(p);
          G.State.save(true);
          return { completed: true, victory: false, chapterChanged: true };
        }
        p.quest.done = true;
        G.UI.refreshQuestHud();
        if (G.Panel.isOpen('quest')) G.PageQuest.render();
        G.State.save(true);
        return { completed: true, victory: true };
      }

      const next = this.current(p);
      if (next.step) G.UI.log('新的目标：' + next.step.text + '（' + next.step.hint + '）', 'sys');
      G.UI.refreshQuestHud();
      if (G.Panel.isOpen('quest')) G.PageQuest.render();
      G.State.save(true);
      return { completed: true, victory: false };
    },

    resetForNewGame: function (p) {
      p.quest = { chapter: 'chapter1', step: 0, kills: {}, side: {}, done: false };
    }
  };
})();
