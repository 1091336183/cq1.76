/* ===== 开始界面 / 建角 / 死亡 / 通关结算 ===== */
(function () {
  const ov = function () { return document.getElementById('overlay'); };
  const NAMES = ['海曦浪客', '青衫客', '孤舟', '无名侠', '拾荒者'];

  G.Start = {
    _job: 1,
    _gender: 0,

    overlay: function (html) {
      const o = ov();
      o.innerHTML = html;
      o.classList.remove('hidden');
    },

    hide: function () {
      const o = ov();
      o.classList.add('hidden');
      o.innerHTML = '';
    },

    // 存档槽列表（主菜单 / 系统面板共用）
    saveRows: function (prefix) {
      const list = G.State.list();
      let h = '<div class="save-list">';
      list.forEach(function (r) {
        h += '<div class="save-row' + (r.empty ? ' empty' : '') + '">';
        h += '<span class="sl">存档 ' + r.slot + '</span>';
        if (r.empty) {
          h += '<span class="si">空槽位</span><span class="sbt">' +
            '<button class="btn small" data-act="' + prefix + '-new-slot" data-slot="' + r.slot + '">在此新建</button>' +
            '</span>';
        } else {
          const p = r.obj.player;
          const map = (G.mapDef(p.mapId) || { name: '?' }).name;
          h += '<span class="si">Lv.' + p.level + ' ' + (G.JOB_NAME[p.job] || '') + ' · ' + G.U.esc(map) +
            ' · ' + G.U.timeText(r.obj.playTime || 0) + '</span>';
          h += '<span class="sbt">' +
            '<button class="btn small primary" data-act="' + prefix + '-load-slot" data-slot="' + r.slot + '">读取</button>' +
            '<button class="btn small" data-act="' + prefix + '-del-slot" data-slot="' + r.slot + '">删除</button>' +
            '</span>';
        }
        h += '</div>';
      });
      h += '</div>';
      return h;
    },

    showSaves: function () {
      G.S.mode = 'menu';
      G.UI.hideTip();
      this.overlay('<div class="ov-box start-box" style="width:540px">' +
        '<div class="game-logo">传奇1.76</div>' +
        '<div class="game-sub">重 生 · 选择存档</div>' +
        this.saveRows('start') +
        '<div class="menu-actions">' +
        '<button class="btn" data-act="start-back">返回主菜单</button>' +
        '</div>' +
        '<div class="start-tip">点击「读取」进入对应存档；「在此新建」会在该槽位开始新游戏。</div>' +
        '</div>');
    },

    showMenu: function () {
      G.S.mode = 'menu';
      G.UI.hideTip();
      const list = G.State.list();
      const used = list.filter(function (r) { return !r.empty; }).length;
      const info = '存档位 ' + list.length + ' 个 ｜ 已用 ' + used + ' 个';
      this.overlay('<div class="ov-box start-box">' +
        '<div class="game-logo">传奇1.76</div>' +
        '<div class="game-sub">重 生 · ' + G.CFG.VERSION_NAME + '</div>' +
        '<div class="ov-text">' + G.U.esc(info) + '</div>' +
        '<div class="menu-actions">' +
        '<button class="btn primary" data-act="start-new">开始新游戏</button>' +
        '<button class="btn" data-act="start-continue"' + (used ? '' : ' disabled') + '>继续游戏</button>' +
        '</div>' +
        '<div class="start-tip">鼠标左键移动/攻击 ｜ 右键移动 ｜ 1-6 喝药 ｜ F1-F8 技能<br>' +
        'E 人物 ｜ Q 背包 ｜ F 技能 ｜ R 任务 ｜ G 图鉴 ｜ Esc 系统 ｜ 空格 拾取</div>' +
        '</div>');
    },

    showCreate: function (keepName) {
      G.S.mode = 'create';
      this._job = this._job || 1;
      this._gender = this._gender || 0;
      if (!this._slot) this._slot = G.State.firstEmpty();
      const self = this;
      let cards = '';
      [1, 2, 3].forEach(function (id) {
        const j = G.JOBS[id];
        cards += '<div class="job-card' + (id === self._job ? ' sel' : '') + '" data-act="pick-job" data-job="' + id + '">' +
          '<div class="jc-ico" style="color:' + j.color + '">' + j.icon + '</div>' +
          '<div class="jc-name" style="color:' + j.color + '">' + j.name + '</div>' +
          '<div class="jc-tag">' + j.tag + '<br>' +
          'Lv30：HP ' + Math.round(j.hp(30)) + ' ／ MP ' + Math.round(j.mp(30)) + '<br>' +
          '主属性：' + ({ 1: '攻击', 2: '魔法', 3: '道术' }[id]) + '</div></div>';
      });
      let slotRow = '<div class="name-row slot-pick">';
      G.State.list().forEach(function (r) {
        const tag = r.empty ? '空' : ('Lv.' + r.obj.player.level);
        slotRow += '<button class="gender-btn' + (self._slot === r.slot ? ' sel' : '') +
          '" data-act="start-pick-slot" data-slot="' + r.slot + '">存档 ' + r.slot + '（' + tag + '）</button>';
      });
      slotRow += '</div>';
      const name = keepName || NAMES[Math.floor(Math.random() * NAMES.length)];
      this.overlay('<div class="ov-box start-box">' +
        '<div class="ov-title">创 建 角 色</div>' +
        '<div class="job-cards">' + cards + '</div>' +
        '<div class="name-row"><input id="create-name" maxlength="8" value="' + G.U.esc(name) + '"></div>' +
        '<div class="name-row">' +
        '<button class="gender-btn' + (this._gender === 0 ? ' sel' : '') + '" data-act="pick-gender" data-gender="0">男（HP/负重更高）</button>' +
        '<button class="gender-btn' + (this._gender === 1 ? ' sel' : '') + '" data-act="pick-gender" data-gender="1">女（闪避/魔法更高）</button>' +
        '</div>' +
        slotRow +
        '<div class="menu-actions">' +
        '<button class="btn primary" data-act="start-game">开始冒险</button>' +
        '<button class="btn" data-act="start-back">返回</button>' +
        '</div>' +
        '<div class="start-tip">新角色将写入「存档 ' + this._slot + '」；若该槽已有角色会被覆盖。</div>' +
        '</div>');
    },

    showDeath: function () {
      const p = G.S.player;
      if (!p) return;
      const lost = Math.floor(p.gold * 0.1);
      this.overlay('<div class="ov-box">' +
        '<div class="ov-title" style="color:#ff9d86">你 被 击 败 了</div>' +
        '<div class="ov-text">' + G.U.esc(p.name) + ' 倒下了。<br>' +
        '回城复活：恢复 50% 生命，返回海曦村。<br>' +
        '原地复活：恢复 50% 生命，损失 10% 金币（约 ' + lost + ' 金）。</div>' +
        '<div class="ov-btns">' +
        '<button class="btn primary" data-act="revive-town">回城复活</button>' +
        '<button class="btn" data-act="revive-here">原地复活（-' + lost + ' 金）</button>' +
        '</div></div>');
    },

    showVictory: function (p) {
      const q = G.QUESTS.chapter3;
      this.overlay('<div class="ov-box" style="width:480px">' +
        '<div class="ov-title">第 三 章 · 通 关</div>' +
        '<div class="ov-text">' + G.U.esc(q ? q.name : '第三章') + ' 已完成。<br>' +
        '狼王与蝙蝠王伏诛，华月城、临海镇与海曦村三镇重归安宁。<br>' +
        '苍梧镇方向传来新的消息……</div>' +
        '<div class="result-grid">' +
        '<div><span>游戏时长</span><b>' + G.U.timeText(G.S.playTime) + '</b></div>' +
        '<div><span>等级</span><b>Lv.' + p.level + '</b></div>' +
        '<div><span>击杀怪物</span><b>' + p.stats.kills + '</b></div>' +
        '<div><span>死亡次数</span><b>' + p.stats.deaths + '</b></div>' +
        '<div><span>金币</span><b>' + G.U.fmt(p.gold) + '</b></div>' +
        '<div><span>战力</span><b>' + G.Equip.power(p) + '</b></div>' +
        '</div>' +
        '<div class="ov-text" style="font-size:12px;color:#9c8a68">V0.2「三镇」主线已全部体验，苍梧镇将在后续版本开放。</div>' +
        '<div class="ov-btns">' +
        '<button class="btn primary" data-act="victory-continue">继续冒险</button>' +
        '<button class="btn" data-act="victory-menu">保存并返回主菜单</button>' +
        '</div></div>');
    },

    confirm: function (title, text, yesAct, yesLabel) {
      this.overlay('<div class="ov-box">' +
        '<div class="ov-title">' + G.U.esc(title) + '</div>' +
        '<div class="ov-text">' + text + '</div>' +
        '<div class="ov-btns">' +
        '<button class="btn primary" data-act="' + yesAct + '">' + G.U.esc(yesLabel || '确定') + '</button>' +
        '<button class="btn" data-act="confirm-no">取消</button>' +
        '</div></div>');
    }
  };
})();
