/* ===== 输入 / 交互动作 ===== */
(function () {
  const T = G.CFG.TILE;
  const stageEl = function () { return document.getElementById('stage'); };

  function stagePoint(e) {
    const r = stageEl().getBoundingClientRect();
    return { x: (e.clientX - r.left) / G.UI.scale, y: (e.clientY - r.top) / G.UI.scale };
  }

  function tipFor(v) {
    if (!v) return '';
    const i = v.indexOf(':');
    const kind = v.slice(0, i), key = v.slice(i + 1);
    const p = G.S.player;
    if (!p) return '';
    if (kind === 'bag') { const c = p.bag[+key]; return c ? G.UI.itemTipHTML(c) : ''; }
    if (kind === 'equip') { const c = p.equip[key]; return c ? G.UI.itemTipHTML(c) : ''; }
    if (kind === 'store') {
      const a = key.split(':');
      const c = G.Store.cell(p, +a[0], +a[1]);
      return c ? G.UI.itemTipHTML(c) : '';
    }
    if (kind === 'item') return G.UI.itemTipHTML(key);
    return '';
  }

  /* ---------- 右键菜单 ---------- */
  G.UI.hideCtx = function () {
    const old = document.getElementById('ctx-menu');
    if (old && old.parentNode) old.parentNode.removeChild(old);
  };

  G.UI.showCtx = function (list, cx, cy, data) {
    this.hideCtx();
    const sr = stageEl().getBoundingClientRect();
    const s = G.UI.scale;
    const el = document.createElement('div');
    el.id = 'ctx-menu';
    list.forEach(function (row) {
      const d = document.createElement('div');
      d.className = 'ctx-item';
      d.textContent = row[0];
      const fire = function (ev) {
        ev.stopPropagation();
        G.Actions.run(row[1], { dataset: { idx: String(data.idx) } });
        G.UI.hideCtx();
      };
      d.addEventListener('mousedown', fire);
      d.addEventListener('touchstart', fire, { passive: true });
      el.appendChild(d);
    });
    let x = (cx - sr.left) / s, y = (cy - sr.top) / s;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    stageEl().appendChild(el);
    const w = el.offsetWidth, h = el.offsetHeight;
    if (x + w > 1016) el.style.left = Math.max(2, 1016 - w) + 'px';
    if (y + h > 760) el.style.top = Math.max(2, 760 - h) + 'px';
  };

  /* ---------- 动作 ---------- */
  G.Actions = {
    refresh: function () {
      G.UI.refreshItemBar();
      if (G.Panel.isOpen('bag')) G.PageBag.render();
      if (G.Panel.isOpen('character')) G.PageCharacter.render();
      if (G.Panel.isOpen('shop')) G.PageShop.render();
      if (G.Panel.isOpen('skill')) G.PageSkill.render();
      if (G.Panel.isOpen('quest')) G.PageQuest.render();
      if (G.Panel.isOpen('store')) G.PageStore.render();
    },

    run: function (name, el) {
      const fn = this.map[name];
      if (fn) fn(el || { dataset: {} });
    },

    quickItem: function (itemId) {
      const p = G.S.player;
      if (!p) return;
      for (let i = 0; i < p.bag.length; i++) {
        const c = p.bag[i];
        if (c && c.id === itemId) {
          G.Bag.use(p, i);
          this.refresh();
          return;
        }
      }
      G.UI.toast('没有该药品', 'warn');
    },

    swapBag: function (a, b) {
      const p = G.S.player;
      if (a === b) return;
      const t = p.bag[a];
      p.bag[a] = p.bag[b];
      p.bag[b] = t;
      this.refresh();
    },

    equipTo: function (idx, slot) {
      const p = G.S.player;
      const c = p.bag[idx];
      if (!c) return;
      const it = G.item(c.id);
      if (!it || !G.isEquip(it)) return;
      const ok = it.slot === slot ||
        (it.slot === 'bracelet' && slot.indexOf('bracelet') === 0) ||
        (it.slot === 'ring' && slot.indexOf('ring') === 0);
      if (!ok) { G.UI.toast('该部位无法装备此物品', 'warn'); return; }
      if (G.Equip.equip(p, idx, slot)) this.refresh();
    },

    map: {
      'close': function (el) { G.Panel.close(el.dataset.panel); G.UI.hideTip(); },
      'open': function (el) { G.Panel.toggle(el.dataset.page); },

      'use-quick': function (el) { G.Actions.quickItem(el.dataset.item); },

      'cast': function (el) {
        const p = G.S.player;
        if (!p) return;
        G.Skills.cast(p, el.dataset.skill);
        G.UI.refreshSkillBar();
      },

      // 技能升级（V0.2）
      'skill-up': function (el) {
        const p = G.S.player;
        if (!p) return;
        G.Skills.upgrade(p, el.dataset.skill);
        G.UI.refreshSkillBar();
        if (G.Panel.isOpen('skill')) G.PageSkill.render();
      },

      // 图鉴分页（V0.2）
      'gallery-tab': function (el) {
        G.PageGallery.tab = el.dataset.tab;
        G.PageGallery.render();
      },
      // 图鉴：查看怪物掉落 / 装备属性（V0.2.01）
      'gallery-monster': function (el) {
        G.PageGallery.selMon = el.dataset.name || '';
        G.PageGallery.render();
      },
      'gallery-item': function (el) {
        G.PageGallery.selItem = el.dataset.id || '';
        G.PageGallery.render();
      },

      // 马夫传送（V0.2）
      'npc-ferry': function (el) {
        const p = G.S.player;
        const cost = +el.dataset.cost || 0;
        if (p.gold < cost) { G.UI.toast('金币不足（需要 ' + cost + '）', 'warn'); return; }
        p.gold -= cost;
        G.Panel.close('dialog');
        G.Audio.play('ui');
        G.Game.enterMap(el.dataset.map, +el.dataset.tx, +el.dataset.ty, '乘坐马车前往' + el.dataset.label);
        G.Actions.refresh();
      },

      // 传送阵（V0.2.02）：已点亮城市之间免费传送
      'npc-teleport': function (el) {
        const p = G.S.player;
        if (!p) return;
        if (!p.towns || !p.towns[el.dataset.map]) { G.UI.toast('该城市尚未点亮', 'warn'); return; }
        G.Panel.close('dialog');
        G.Audio.play('ui');
        G.Game.enterMap(el.dataset.map, +el.dataset.tx, +el.dataset.ty, '通过传送阵前往' + el.dataset.label);
        G.State.save(true);
        G.Actions.refresh();
      },

      // 仓库（V0.2.02）
      'npc-store': function () {
        G.Panel.close('dialog');
        G.PageStore.open();
      },
      'store-deposit': function (el) {
        G.Store.deposit(G.S.player, +el.dataset.idx, G.PageStore.page);
        G.Actions.refresh();
      },
      'store-withdraw': function (el) {
        G.Store.withdraw(G.S.player, +el.dataset.page, +el.dataset.slot);
        G.Actions.refresh();
      },
      'store-page': function (el) {
        G.PageStore.page = +el.dataset.page || 1;
        G.PageStore.render();
      },

      // 视野缩放（V0.1.01）
      'zoom-in': function () { G.Camera.zoomBy(0.08); G.PageSystem.render(); },
      'zoom-out': function () { G.Camera.zoomBy(-0.08); G.PageSystem.render(); },
      'zoom-reset': function () { G.Camera.setZoom(G.CFG.ZOOM_DEFAULT); G.PageSystem.render(); },

      // 小地图缩放 / 隐藏（V0.1.01）
      'mini-in': function () { G.UI.miniStep(1); },
      'mini-out': function () { G.UI.miniStep(-1); },
      'mini-hide': function () { G.UI.toggleMini(true); },
      'mini-show': function () { G.UI.toggleMini(false); },

      'unequip': function (el) {
        const p = G.S.player;
        if (G.Equip.unequip(p, el.dataset.slot)) G.Actions.refresh();
      },

      'addpoint': function (el) {
        G.Player.addPoint(G.S.player, el.dataset.stat);
        G.Actions.refresh();
      },

      'bag-equip': function (el) {
        const idx = +el.dataset.idx;
        if (G.Equip.equip(G.S.player, idx)) G.Actions.refresh();
      },

      'bag-use': function (el) {
        const idx = +el.dataset.idx;
        G.Bag.use(G.S.player, idx);
        G.Actions.refresh();
      },

      'bag-sell': function (el) {
        G.Bag.sell(G.S.player, +el.dataset.idx);
        G.Actions.refresh();
      },

      'bag-drop': function (el) {
        const p = G.S.player;
        const idx = +el.dataset.idx;
        const c = p.bag[idx];
        if (!c) return;
        const it = G.item(c.id);
        p.bag[idx] = null;
        G.UI.toast('丢弃了 ' + (it ? it.name : '物品'), 'warn');
        G.Actions.refresh();
      },

      'bag-sort': function () {
        const p = G.S.player;
        const rank = function (c) {
          const it = G.item(c.id);
          if (!it) return 9;
          if (G.isEquip(it)) return 0;
          if (it.use) return 1;
          return 2;
        };
        const list = p.bag.filter(Boolean).sort(function (a, b) {
          const ra = rank(a), rb = rank(b);
          if (ra !== rb) return ra - rb;
          const qa = a.quality || 0, qb = b.quality || 0;
          if (qa !== qb) return qb - qa;
          const ia = G.item(a.id), ib = G.item(b.id);
          return (ia ? ia.name : '').localeCompare(ib ? ib.name : '');
        });
        for (let i = 0; i < p.bag.length; i++) p.bag[i] = list[i] || null;
        G.Actions.refresh();
      },

      'bag-selljunk': function () {
        const p = G.S.player;
        let n = 0;
        for (let i = 0; i < p.bag.length; i++) {
          const c = p.bag[i];
          if (!c) continue;
          const it = G.item(c.id);
          if (!it || !G.isEquip(it)) continue;
          if ((c.quality || 0) !== 0) continue;
          if (G.Bag.sell(p, i)) n++;
        }
        G.UI.toast(n ? '已出售 ' + n + ' 件白装' : '没有可出售的白装', n ? 'good' : 'warn');
        G.Actions.refresh();
      },

      'shop-buy': function (el) {
        G.Shop.buy(G.S.player, el.dataset.item, 1);
        G.Actions.refresh();
      },

      'shop-sell': function (el) {
        G.Shop.sell(G.S.player, +el.dataset.idx);
        G.Actions.refresh();
      },

      'npc-quest': function (el) { G.Npc.doAction(el.dataset.npc); },
      'npc-shop': function (el) {
        G.Panel.close('dialog');
        G.PageShop.open(el.dataset.shop);
      },

      'sys-toggle': function (el) {
        const key = el.dataset.key;
        G.S.settings[key] = !!el.checked;
        if (key === 'autoSave' && el.checked) G.State.save(true);
      },

      'sys-save': function () { G.State.save(); G.PageSystem.render(); },
      'sys-menu': function () {
        G.State.save(true);
        G.Panel.closeAll();
        document.getElementById('hud').classList.add('hidden');
        G.Start.showMenu();
      },
      'sys-restart': function () {
        G.Start.confirm('重新开始', '当前存档进度、角色与背包将全部清空，确定重新开始吗？', 'sys-restart-yes', '确定重开');
      },
      'sys-restart-yes': function () {
        G.State.deleteSave(G.S.slot);
        G.S.player = null;
        G.Panel.closeAll();
        G.Start.hide();
        G.Start._slot = G.S.slot;
        G.Start.showCreate();
      },

      'start-new': function () {
        G.Start._slot = G.State.firstEmpty();
        G.Start.showCreate();
      },
      'start-continue': function () { G.Start.showSaves(); },
      'start-back': function () { G.Start.showMenu(); },

      // 存档槽位（V0.2.01）
      'start-load-slot': function (el) {
        const slot = +el.dataset.slot || 1;
        G.Start.hide();
        G.Game.loadFromDisk(slot);
      },
      'start-del-slot': function (el) {
        G.Start._delSlot = +el.dataset.slot || 1;
        G.Start.confirm('删除存档', '确定删除「存档 ' + G.Start._delSlot + '」吗？此操作不可撤销。', 'start-del-yes', '删除');
      },
      'start-del-yes': function () {
        G.State.deleteSave(G.Start._delSlot);
        G.UI.toast('存档 ' + G.Start._delSlot + ' 已删除', 'warn');
        G.Start.showSaves();
      },
      'start-new-slot': function (el) {
        G.Start._slot = +el.dataset.slot || 1;
        G.Start.showCreate();
      },
      'start-pick-slot': function (el) {
        const input = document.getElementById('create-name');
        const nm = input ? input.value : '';
        G.Start._slot = +el.dataset.slot || 1;
        G.Start.showCreate(nm);
      },

      'sys-load-slot': function (el) {
        G.Game.loadFromDisk(+el.dataset.slot || 1);
      },
      'sys-save-slot': function (el) {
        G.State.save(false, +el.dataset.slot || G.S.slot);
        G.PageSystem.render();
      },
      'sys-del-slot': function (el) {
        G.Start._delSlot = +el.dataset.slot || 1;
        G.Start.confirm('删除存档', '确定删除「存档 ' + G.Start._delSlot + '」吗？此操作不可撤销。', 'sys-del-yes', '删除');
      },
      'sys-del-yes': function () {
        G.State.deleteSave(G.Start._delSlot);
        G.UI.toast('存档 ' + G.Start._delSlot + ' 已删除', 'warn');
        G.PageSystem.render();
      },

      'pick-job': function (el) {
        G.Start._job = +el.dataset.job;
        const cards = el.parentNode.querySelectorAll('.job-card');
        for (let i = 0; i < cards.length; i++) {
          cards[i].classList.toggle('sel', cards[i] === el);
        }
      },

      'pick-gender': function (el) {
        G.Start._gender = +el.dataset.gender;
        const btns = el.parentNode.querySelectorAll('.gender-btn');
        for (let i = 0; i < btns.length; i++) {
          btns[i].classList.toggle('sel', btns[i] === el);
        }
      },

      'start-game': function () {
        const input = document.getElementById('create-name');
        let name = input ? input.value.trim() : '';
        if (!name) name = '无名侠';
        if (name.length > 8) name = name.slice(0, 8);
        G.S.slot = G.Start._slot || G.State.firstEmpty();
        G.Start.hide();
        G.Game.newGame(name, G.Start._job, G.Start._gender);
      },

      'revive-town': function () {
        G.Start.hide();
        G.Player.revive(G.S.player, true);
      },

      'revive-here': function () {
        G.Start.hide();
        G.Player.revive(G.S.player, false);
      },

      'victory-continue': function () {
        G.Start.hide();
        G.S.mode = 'play';
        G.State.save(true);
      },

      'victory-menu': function () {
        G.State.save(true);
        G.Start.hide();
        G.Panel.closeAll();
        document.getElementById('hud').classList.add('hidden');
        G.Start.showMenu();
      },

      'confirm-no': function () { G.Start.hide(); }
    }
  };

  /* ---------- 画布交互 ---------- */
  function nearestAdjacent(nx, ny, p) {
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    let best = null, bd = 1e9;
    dirs.forEach(function (d) {
      const x = nx + d[0], y = ny + d[1];
      if (!G.World.isWalkTile(x, y)) return;
      const dist = G.U.dist(p.px / T, p.py / T, x, y);
      if (dist < bd) { bd = dist; best = { x: x, y: y }; }
    });
    return best;
  }

  function onCanvasDown(e) {
    const p = G.S.player;
    if (!p || G.S.mode !== 'play') return;
    const sp = stagePoint(e);
    const w = G.Camera.toWorld(sp.x, sp.y);

    // 右键：纯移动
    if (e.button === 2) {
      const t = G.World.tileOf(w.x, w.y);
      G.S.pending = null;
      G.Player.attackMove = false;
      p.target = null;
      G.S.target = null;
      G.Player.walkTo(p, t.x, t.y);
      return;
    }
    if (e.button !== 0) return;

    // 怪物
    let mon = null, md = 26;
    (G.S.monsters || []).forEach(function (m) {
      if (m.hp <= 0) return;
      const d = G.U.dist(w.x, w.y, m.x, m.y - 10);
      if (d < md) { md = d; mon = m; }
    });
    if (mon) {
      G.S.pending = null;
      G.S.target = mon;
      p.target = mon;
      p.attackMove = true;
      return;
    }

    // 地面物品
    let gnd = null, gd = 22;
    (G.S.ground || []).forEach(function (g) {
      const d = G.U.dist(w.x, w.y, g.x, g.y - 8);
      if (d < gd) { gd = d; gnd = g; }
    });
    if (gnd) {
      if (G.U.dist(p.px, p.py, gnd.x, gnd.y) / T <= G.CFG.PICK_RANGE) {
        G.Loot.pickUp(gnd);
      } else {
        const t = G.World.tileOf(gnd.x, gnd.y);
        G.S.pending = { type: 'pick', g: gnd };
        G.Player.walkTo(p, t.x, t.y);
      }
      return;
    }

    // NPC
    const nt = G.World.tileOf(w.x, w.y);
    let npc = null;
    (G.S.npcs || []).forEach(function (n) { if (n.x === nt.x && n.y === nt.y) npc = n; });
    if (npc) {
      const near = G.U.dist(p.px, p.py, npc.x * T + T / 2, npc.y * T + T / 2) / T;
      if (near <= 2.6) {
        G.S.pending = null;
        G.Npc.talk(npc);
      } else {
        const adj = nearestAdjacent(npc.x, npc.y, p);
        if (adj) {
          G.S.pending = { type: 'talk', npc: npc };
          G.Player.walkTo(p, adj.x, adj.y);
        } else {
          G.UI.toast('无法靠近该 NPC', 'warn');
        }
      }
      return;
    }

    // 地面
    G.S.pending = null;
    G.Player.attackMove = false;
    p.target = null;
    G.S.target = null;
    G.Player.walkTo(p, nt.x, nt.y);
  }

  function cycleTarget() {
    const p = G.S.player;
    if (!p) return;
    const list = (G.S.monsters || []).filter(function (m) {
      return m.hp > 0 && G.U.dist(p.px, p.py, m.x, m.y) / T <= 9;
    }).sort(function (a, b) {
      return G.U.dist(p.px, p.py, a.x, a.y) - G.U.dist(p.px, p.py, b.x, b.y);
    });
    if (!list.length) { G.UI.toast('附近没有目标', 'warn'); return; }
    let idx = list.indexOf(G.S.target);
    idx = (idx + 1) % list.length;
    G.S.target = list[idx];
    p.target = list[idx];
    p.attackMove = true;
  }

  G.Input = {
    bound: false,

    bind: function () {
      if (this.bound) return;
      this.bound = true;
      const cv = document.getElementById('game');

      cv.addEventListener('mousedown', function (e) {
        if (G.S.paused) return;   // 暂停时不响应地图点击
        G.UI.hideCtx();
        onCanvasDown(e);
      });
      cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

      // 触屏适配（V0.2.03）：轻触=地图点击，滑动/长按不触发
      let touchStart = null;
      cv.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) { touchStart = null; return; }
        const t = e.touches[0];
        touchStart = { x: t.clientX, y: t.clientY, t: Date.now() };
      }, { passive: true });
      cv.addEventListener('touchmove', function () { touchStart = null; }, { passive: true });
      cv.addEventListener('touchend', function (e) {
        if (!touchStart) return;
        const t = e.changedTouches[0];
        const moved = Math.hypot(t.clientX - touchStart.x, t.clientY - touchStart.y);
        const held = Date.now() - touchStart.t;
        touchStart = null;
        e.preventDefault();
        if (G.S.paused || moved > 12 || held > 600) return;
        G.UI.hideCtx();
        onCanvasDown({ clientX: t.clientX, clientY: t.clientY, button: 0 });
      }, { passive: false });

      // 滚轮缩放视野（V0.1.01）
      cv.addEventListener('wheel', function (e) {
        if (G.S.mode !== 'play') return;
        e.preventDefault();
        G.Camera.zoomBy(e.deltaY > 0 ? -0.06 : 0.06);
      }, { passive: false });

      document.addEventListener('mousedown', function (e) {
        if (!e.target.closest('#ctx-menu')) G.UI.hideCtx();
      });

      // 通用点击委托
      document.addEventListener('click', function (e) {
        const el = e.target.closest('[data-act]');
        if (!el || el.disabled) return;
        const fn = G.Actions.map[el.dataset.act];
        if (!fn) return;
        e.preventDefault();
        fn(el, e);
      });

      // 双击背包格
      document.addEventListener('dblclick', function (e) {
        const cell = e.target.closest('.cell[data-idx]');
        if (!cell || !cell.closest('[data-panel="bag"]')) return;
        const idx = +cell.dataset.idx;
        const p = G.S.player;
        const c = p.bag[idx];
        if (!c) return;
        const it = G.item(c.id);
        if (G.isEquip(it)) G.Actions.run('bag-equip', { dataset: { idx: String(idx) } });
        else if (it && it.use) G.Actions.run('bag-use', { dataset: { idx: String(idx) } });
      });

      // 触屏背包操作（V0.2.03）：双击穿戴/使用，长按弹出操作菜单
      let lastTap = { idx: -1, t: 0 };
      let pressTimer = null;
      function bagCtx(idx, cx, cy) {
        const p = G.S.player;
        const c = p.bag[idx];
        if (!c) return;
        const it = G.item(c.id);
        const list = [];
        if (G.isEquip(it)) list.push(['穿戴', 'bag-equip']);
        else if (it && it.use) list.push(['使用', 'bag-use']);
        list.push(['出售', 'bag-sell'], ['丢弃', 'bag-drop']);
        G.UI.showCtx(list, cx, cy, { idx: idx });
      }
      document.addEventListener('touchstart', function (e) {
        const cell = e.target.closest('.cell[data-idx]');
        if (!cell || !cell.closest('[data-panel="bag"]')) {
          if (!e.target.closest('#ctx-menu')) G.UI.hideCtx();
          return;
        }
        const idx = +cell.dataset.idx;
        const now = Date.now();
        if (lastTap.idx === idx && now - lastTap.t < 360) {
          lastTap = { idx: -1, t: 0 };
          const c = G.S.player.bag[idx];
          if (!c) return;
          const it = G.item(c.id);
          if (G.isEquip(it)) G.Actions.run('bag-equip', { dataset: { idx: String(idx) } });
          else if (it && it.use) G.Actions.run('bag-use', { dataset: { idx: String(idx) } });
          return;
        }
        lastTap = { idx: idx, t: now };
        const r = cell.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        pressTimer = setTimeout(function () {
          pressTimer = null;
          lastTap = { idx: -1, t: 0 };
          bagCtx(idx, cx, cy);
        }, 520);
      }, { passive: true });
      ['touchend', 'touchmove', 'touchcancel'].forEach(function (ev) {
        document.addEventListener(ev, function () {
          if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
        }, { passive: true });
      });

      // 右键菜单
      document.addEventListener('contextmenu', function (e) {
        if (!e.target.closest('#stage')) return;
        e.preventDefault();
        const cell = e.target.closest('.cell[data-idx]');
        if (!cell || !cell.closest('[data-panel="bag"]')) return;
        const idx = +cell.dataset.idx;
        const p = G.S.player;
        const c = p.bag[idx];
        if (!c) return;
        const it = G.item(c.id);
        const list = [];
        if (G.isEquip(it)) list.push(['穿戴', 'bag-equip']);
        else if (it && it.use) list.push(['使用', 'bag-use']);
        list.push(['出售', 'bag-sell'], ['丢弃', 'bag-drop']);
        G.UI.showCtx(list, e.clientX, e.clientY, { idx: idx });
      });

      // Tooltip
      document.addEventListener('mouseover', function (e) {
        const t = e.target.closest('[data-tip]');
        if (!t) return;
        const html = tipFor(t.dataset.tip);
        if (html) G.UI.showTip(html, e.clientX, e.clientY);
      });
      document.addEventListener('mouseout', function (e) {
        if (e.target.closest('[data-tip]')) G.UI.hideTip();
      });

      // 设置控件
      document.addEventListener('change', function (e) {
        const el = e.target.closest('[data-act="sys-toggle"]');
        if (!el) return;
        G.S.settings[el.dataset.key] = !!el.checked;
        if (el.dataset.key === 'autoSave' && el.checked) G.State.save(true);
      });
      document.addEventListener('input', function (e) {
        const el = e.target.closest('[data-act="sys-volume"]');
        if (!el) return;
        const v = +el.value / 100;
        G.S.settings.sfx = v;
        G.Audio.volume = v;
      });

      // 背包拖拽
      let drag = null;
      document.addEventListener('mousedown', function (e) {
        if (e.button !== 0) return;
        const cell = e.target.closest('.cell[data-drag="bag"][data-idx]');
        if (!cell) return;
        drag = { idx: +cell.dataset.idx, sx: e.clientX, sy: e.clientY, moved: false, ghost: null, el: cell };
      });
      document.addEventListener('mousemove', function (e) {
        if (!drag) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 4) {
          drag.moved = true;
          const ghost = document.createElement('div');
          ghost.id = 'drag-ghost';
          const c = G.S.player.bag[drag.idx];
          ghost.innerHTML = c ? G.UI.icon(c.id) : '';
          stageEl().appendChild(ghost);
          drag.ghost = ghost;
          drag.el.classList.add('drag-src');
          G.UI.hideTip();
        }
        if (drag.moved && drag.ghost) {
          const r = stageEl().getBoundingClientRect();
          drag.ghost.style.left = ((e.clientX - r.left) / G.UI.scale) + 'px';
          drag.ghost.style.top = ((e.clientY - r.top) / G.UI.scale) + 'px';
        }
      });
      document.addEventListener('mouseup', function (e) {
        if (!drag) return;
        const d = drag;
        drag = null;
        if (d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
        if (d.el) d.el.classList.remove('drag-src');
        if (!d.moved) return;
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        if (!hit) return;
        const drop = hit.closest('[data-drop]');
        if (!drop) return;
        const kind = drop.dataset.drop;
        if (kind === 'bag') G.Actions.swapBag(d.idx, +drop.dataset.idx);
        else if (kind === 'equip') G.Actions.equipTo(d.idx, drop.dataset.slot);
      });

      // 键盘
      document.addEventListener('keydown', function (e) {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;
        if (G.S.mode !== 'play' && e.key !== 'Escape') return;
        const p = G.S.player;
        if (!p) return;

        if (e.key === 'e' || e.key === 'E') { G.Panel.toggle('character'); }
        else if (e.key === 'q' || e.key === 'Q') { G.Panel.toggle('bag'); }
        else if (e.key === 'f' || e.key === 'F') { G.Panel.toggle('skill'); }
        else if (e.key === 'r' || e.key === 'R') { G.Panel.toggle('quest'); }
        else if (e.key === 'g' || e.key === 'G') { G.Panel.toggle('gallery'); }
        else if (e.key === 'Escape') {
          const any = ['character', 'bag', 'skill', 'quest', 'gallery', 'system', 'shop', 'dialog', 'store'].some(function (id) {
            return G.Panel.isOpen(id);
          });
          if (any) { G.Panel.closeAll(); G.UI.hideTip(); }
          else if (G.S.mode === 'play') G.Panel.toggle('system');
        } else if (e.key === ' ') {
          e.preventDefault();
          const g = G.Loot.nearestGround(p, G.CFG.PICK_RANGE);
          if (g) G.Loot.pickUp(g);
          else G.UI.toast('附近没有可拾取的物品', 'warn');
        } else if (e.key === 'Tab') {
          e.preventDefault();
          cycleTarget();
        } else if (e.key === 'm' || e.key === 'M') {
          G.UI.toggleMini();
        } else if (e.key === '-' || e.key === '_') {
          G.Camera.zoomBy(-0.08);
        } else if (e.key === '=' || e.key === '+') {
          G.Camera.zoomBy(0.08);
        } else if (e.key === '0') {
          G.Camera.setZoom(G.CFG.ZOOM_DEFAULT);
        } else if (/^F([1-8])$/.test(e.key)) {
          e.preventDefault();
          const idx = +e.key.slice(1) - 1;
          const skills = G.Skills.bookOf(p).filter(function (s) { return !s.def.passive; });
          if (skills[idx]) G.Actions.map['cast']({ dataset: { skill: skills[idx].def.id } });
        } else if (/^[1-6]$/.test(e.key)) {
          const list = ['c_hp1', 'c_hp2', 'c_hp3', 'c_mp1', 'c_mp2', 'c_mp3'];
          G.Actions.quickItem(list[+e.key - 1]);
        }
      });
    }
  };
})();
