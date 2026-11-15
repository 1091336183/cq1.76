/* ===== 系统设置面板 ===== */
(function () {
  function ck(v) { return v ? ' checked' : ''; }

  G.PageSystem = {
    open: function () {
      G.Panel.open('system', '系统', this.html(), { width: 452, x: 300, y: 66 });
    },

    render: function () {
      if (G.Panel.isOpen('system')) G.Panel.setHTML('system', this.html());
    },

    html: function () {
      const p = G.S.player;
      const s = G.S.settings;
      return '<div class="set-sec">显示</div>' +
        '<div class="set-row"><span>伤害数字</span><input type="checkbox" data-act="sys-toggle" data-key="showDmg"' + ck(s.showDmg) + '></div>' +
        '<div class="set-row"><span>敌人血条</span><input type="checkbox" data-act="sys-toggle" data-key="showHpBar"' + ck(s.showHpBar) + '></div>' +
        '<div class="set-row"><span>地面物品名称</span><input type="checkbox" data-act="sys-toggle" data-key="showNames"' + ck(s.showNames) + '></div>' +
        '<div class="set-sec">声音</div>' +
        '<div class="set-row"><span>音效音量</span><input type="range" min="0" max="100" value="' + Math.round((s.sfx || 0) * 100) + '" data-act="sys-volume"></div>' +
        '<div class="set-sec">地图</div>' +
        '<div class="set-row"><span>视野缩放 <span class="dim">' + Math.round(G.Camera.zoom() * 100) + '%</span></span>' +
        '<span style="display:flex;gap:6px">' +
        '<button class="btn small" data-act="zoom-out">－ 缩小</button>' +
        '<button class="btn small" data-act="zoom-reset">重置</button>' +
        '<button class="btn small" data-act="zoom-in">放大 ＋</button>' +
        '</span></div>' +
        '<div class="set-row"><span>小地图（滚轮 / M 键亦可）</span>' +
        '<span style="display:flex;gap:6px">' +
        '<button class="btn small" data-act="mini-out">－</button>' +
        '<button class="btn small" data-act="mini-in">＋</button>' +
        '<button class="btn small" data-act="mini-hide">隐藏</button>' +
        '<button class="btn small" data-act="mini-show">显示</button>' +
        '</span></div>' +
        '<div class="set-sec">存档</div>' +
        '<div class="set-row"><span>自动存档（切换地图 / 60 秒 / 升级）</span><input type="checkbox" data-act="sys-toggle" data-key="autoSave"' + ck(s.autoSave) + '></div>' +
        this.slotRows() +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">' +
        '<button class="btn primary" data-act="sys-save">保存当前存档</button>' +
        '<button class="btn" data-act="sys-menu">返回主菜单</button>' +
        '<button class="btn" data-act="sys-restart">重新开始</button>' +
        '</div>' +
        '<div class="start-tip">传奇1.76 · 重生 ' + G.CFG.VERSION_NAME + '（' + G.CFG.VERSION + '）<br>' +
        '当前角色：' + G.U.esc(p.name) + ' ｜ 游戏时长：' + G.U.timeText(G.S.playTime) +
        ' ｜ 当前存档：' + (G.S.slot || 1) + '</div>';
    },

    // 存档位列表（V0.2.01）
    slotRows: function () {
      let h = '';
      G.State.list().forEach(function (r) {
        const cur = r.slot === (G.S.slot || 1);
        let info = '空槽位';
        if (!r.empty) {
          const sp = r.obj.player;
          info = 'Lv.' + sp.level + ' ' + (G.JOB_NAME[sp.job] || '') + ' · ' +
            ((G.mapDef(sp.mapId) || { name: '?' }).name);
        }
        h += '<div class="set-row"><span>' + (cur ? '▶ ' : '') + '存档 ' + r.slot +
          ' <span class="dim">' + G.U.esc(info) + '</span></span>' +
          '<span style="display:flex;gap:4px">' +
          '<button class="btn small" data-act="sys-save-slot" data-slot="' + r.slot + '">保存</button>' +
          (r.empty ? '' :
            '<button class="btn small" data-act="sys-load-slot" data-slot="' + r.slot + '">读取</button>' +
            '<button class="btn small" data-act="sys-del-slot" data-slot="' + r.slot + '">删除</button>') +
          '</span></div>';
      });
      return h;
    }
  };
})();
