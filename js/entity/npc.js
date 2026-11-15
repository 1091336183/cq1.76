/* ===== NPC 对话 ===== */
(function () {
  G.Npc = {
    near: function (p, range) {
      range = range || 2.4;
      let best = null, bd = 1e9;
      (G.S.npcs || []).forEach(function (n) {
        const d = G.U.dist(p.px, p.py, n.x * G.CFG.TILE + 16, n.y * G.CFG.TILE + 16) / G.CFG.TILE;
        if (d < bd) { bd = d; best = n; }
      });
      return (best && bd <= range) ? best : null;
    },

    atTile: function (tx, ty) {
      let found = null;
      (G.S.npcs || []).forEach(function (n) { if (n.x === tx && n.y === ty) found = n; });
      return found;
    },

    talk: function (npc) {
      const p = G.S.player;
      const def = G.npcDef(npc.id);
      if (!def) return;
      const cur = G.Quest.current(p);
      let lines = def.lines.default;
      let action = null;
      if (cur.step && cur.step.type === 'talk' && cur.step.npc === npc.id) {
        lines = def.lines['step' + cur.index] || def.lines.default;
        action = 'quest';
      }
      G.PageDialog.open(npc, lines, action);
    },

    doAction: function (npcId) {
      const p = G.S.player;
      const res = G.Quest.onTalk(p, npcId);
      G.Panel.close('dialog');
      if (res.victory) {
        G.Game.showVictory();
      } else if (res.completed) {
        G.UI.toast('任务已更新', 'good');
        if (G.Panel.isOpen('quest')) G.PageQuest.render();
      } else {
        G.Npc.showIdle(npcId);
      }
    },

    showIdle: function (npcId) {
      const n = (G.S.npcs || []).filter(function (x) { return x.id === npcId; })[0];
      if (n) G.Npc.talk(n);
    }
  };

  G.PageDialog = {
    open: function (npc, lines, action) {
      const nd = G.npcDef(npc.id);
      let html = '<div class="dialog-text">';
      lines.forEach(function (l) { html += '<div>' + G.U.esc(l) + '</div>'; });
      html += '</div><div class="dialog-btns">';
      if (action === 'quest') {
        const label = npc.id === 'npc_lingyunzi' ? '复命' : '接受委托';
        html += '<button class="btn primary" data-act="npc-quest" data-npc="' + npc.id + '">' + label + '</button>';
      }
      if (npc.shop) {
        html += '<button class="btn" data-act="npc-shop" data-shop="' + npc.shop + '">购买 / 出售</button>';
      }
      if (nd && nd.ferry) {
        nd.ferry.forEach(function (f, i) {
          html += '<button class="btn" data-act="npc-ferry" data-map="' + f.to + '" data-tx="' + f.tx +
            '" data-ty="' + f.ty + '" data-cost="' + (f.cost || 0) + '" data-label="' +
            G.U.esc(f.label || '') + '">' + G.U.esc(f.label || ('传送 ' + (i + 1))) + '</button>';
        });
      }
      // 传送阵（V0.2.02）：只列出已点亮且非当前所在的城市
      if (nd && nd.portal) {
        const pl = G.S.player;
        const curId = G.S.map ? G.S.map.id : '';
        let n = 0;
        (G.TOWNS || []).forEach(function (t) {
          if (t.map === curId) return;
          if (!pl.towns || !pl.towns[t.map]) return;
          n += 1;
          html += '<button class="btn" data-act="npc-teleport" data-map="' + t.map +
            '" data-tx="' + t.tx + '" data-ty="' + t.ty + '" data-label="' +
            G.U.esc(t.name) + '">传送到 ' + G.U.esc(t.name) + '</button>';
        });
        if (!n) html += '<span class="gal-note" style="align-self:center">尚未点亮其他城市，先去走一趟吧。</span>';
      }
      // 仓库（V0.2.02）
      if (nd && nd.store) {
        html += '<button class="btn primary" data-act="npc-store">打开仓库</button>';
      }
      html += '<button class="btn" data-act="close" data-panel="dialog">离开</button></div>';
      G.Panel.open('dialog', npc.name, html, { width: 430, x: 300, y: 250 });
    }
  };
})();
