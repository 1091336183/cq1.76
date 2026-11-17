/* ===== UI 基础设施：面板 / 图标 / Tooltip / 提示 ===== */
(function () {
  G.UI = G.UI || {};
  G.UI.scale = 1;
  G.UI.zTop = 30;

  const stage = function () { return document.getElementById('stage'); };

  /* ---------- 物品图标（纯 SVG） ---------- */
  G.UI.icon = function (itemId) {
    const it = G.item(itemId);
    if (!it) return '';
    const t = it.type;
    let inner = '';
    const jobColor = it.reqJob === 2 ? '#9f7bff' : (it.reqJob === 3 ? '#7fd8a0' : '#d8dee6');
    if (t === 'weapon') {
      inner =
        '<path d="M7 26 L21 6 L26 10 L12 29 Z" fill="' + jobColor + '" stroke="#6d727a" stroke-width="1"/>' +
        '<path d="M6 23 L10 27 L6 30 L3 27 Z" fill="#8a5a2a"/>' +
        '<rect x="9" y="20" width="9" height="3" rx="1" transform="rotate(-45 13 21)" fill="#c9a227"/>';
    } else if (t === 'armor') {
      inner =
        '<path d="M10 6 L22 6 L26 12 L23 27 L9 27 L6 12 Z" fill="' + (it.reqJob === 2 ? '#3f5b9a' : (it.reqJob === 3 ? '#3f7a52' : '#8a5b3a')) + '" stroke="#c9a227" stroke-width="1"/>' +
        '<path d="M12 6 L16 12 L20 6" fill="none" stroke="#e9c964" stroke-width="1.5"/>';
    } else if (t === 'helmet') {
      inner =
        '<path d="M7 20 A9 9 0 0 1 25 20 L25 25 L7 25 Z" fill="' + (it.reqJob === 2 ? '#8a4f8f' : '#a83a2a') + '" stroke="#c9a227" stroke-width="1"/>' +
        '<rect x="7" y="21" width="18" height="3" fill="#5a3a18"/>' +
        '<path d="M16 5 L18 6 L17 13 L15 13 Z" fill="#e9c964"/>';
    } else if (t === 'necklace') {
      inner =
        '<path d="M7 8 Q16 24 25 8" fill="none" stroke="#d8c06a" stroke-width="2"/>' +
        '<circle cx="16" cy="22" r="4" fill="#6ad0d8" stroke="#c9a227" stroke-width="1"/>';
    } else if (t === 'bracelet') {
      inner =
        '<ellipse cx="16" cy="17" rx="9" ry="7" fill="none" stroke="#c8ced6" stroke-width="3"/>' +
        '<circle cx="23" cy="13" r="2.5" fill="#7cfc7c"/>';
    } else if (t === 'ring') {
      inner =
        '<circle cx="16" cy="19" r="7" fill="none" stroke="#c0c8d0" stroke-width="3"/>' +
        '<path d="M16 4 L20 9 L16 13 L12 9 Z" fill="#5aa9ff" stroke="#c9a227" stroke-width="1"/>';
    } else if (t === 'boots') {
      inner =
        '<path d="M10 6 L19 6 L20 17 L26 21 L26 26 L10 26 Z" fill="#6b4a2a" stroke="#c9a227" stroke-width="1"/>' +
        '<rect x="10" y="23" width="16" height="3" fill="#3a2614"/>';
    } else if (t === 'shield') {
      inner =
        '<path d="M16 4 L27 9 L25 20 Q16 30 7 20 L5 9 Z" fill="#7a5a30" stroke="#c9a227" stroke-width="1.5"/>' +
        '<path d="M16 8 L22 11 L21 18 Q16 24 11 18 L10 11 Z" fill="#9a7a44"/>';
    } else if (t === 'potion') {
      const red = it.use && it.use.hp;
      inner =
        '<rect x="13" y="4" width="6" height="4" fill="#c9a227"/>' +
        '<path d="M11 9 L21 9 L21 26 A3 3 0 0 1 18 29 L14 29 A3 3 0 0 1 11 26 Z" fill="#2a1a0c" stroke="#8a6a32" stroke-width="1"/>' +
        '<rect x="12" y="16" width="8" height="11" fill="' + (red ? '#c0281c' : '#2f6bd8') + '"/>';
    } else if (t === 'scroll') {
      inner =
        '<rect x="8" y="6" width="16" height="20" rx="2" fill="#e6d7a8" stroke="#a4812f"/>' +
        '<path d="M11 11 H21 M11 15 H21 M11 19 H18" stroke="#8a6a32" stroke-width="1.4"/>' +
        '<rect x="6" y="5" width="20" height="3" rx="1.5" fill="#c9a227"/>';
    } else {
      const hues = ['#6ad0d8', '#d86a9f', '#d8c06a', '#8fd86a', '#b08cd8'];
      const col = hues[G.U.hash(itemId) % hues.length];
      inner =
        '<path d="M16 5 L26 12 L23 25 L9 25 L6 12 Z" fill="' + col + '" stroke="#c9a227" stroke-width="1"/>' +
        '<path d="M16 5 L16 25 M6 12 L26 12" stroke="rgba(255,255,255,.35)" stroke-width="1"/>';
    }
    return '<svg class="item-svg" viewBox="0 0 32 32">' + inner + '</svg>';
  };

  G.UI.qualityColor = function (q) {
    const item = G.QUALITY[q || 0] || G.QUALITY[0];
    return item.color;
  };

  /* ---------- Tooltip ---------- */
  const tipEl = function () { return document.getElementById('tooltip'); };

  G.UI.showTip = function (html, cx, cy) {
    const el = tipEl();
    el.innerHTML = html;
    el.classList.remove('hidden');
    const stageRect = stage().getBoundingClientRect();
    const sx = (cx - stageRect.left) / G.UI.scale;
    const sy = (cy - stageRect.top) / G.UI.scale;
    const w = el.offsetWidth, h = el.offsetHeight;
    let x = sx + 16, y = sy + 12;
    if (x + w > G.CFG.VIEW_W - 14) x = sx - w - 12;
    if (y + h > G.CFG.VIEW_H - 10) y = G.CFG.VIEW_H - 10 - h;
    if (y < 2) y = 2;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  };

  G.UI.hideTip = function () { tipEl().classList.add('hidden'); };

  G.UI.itemTipHTML = function (cellOrId, quality) {
    const isCell = typeof cellOrId === 'object';
    const item = isCell ? G.item(cellOrId.id) : G.item(cellOrId);
    if (!item) return '';
    const q = isCell ? (cellOrId.quality || 0) : (quality || 0);
    const color = this.qualityColor(q);
    let h = '<div class="tip-name" style="color:' + color + '">' + G.U.esc(item.name) + '</div>';
    if (G.isEquip(item)) {
      h += '<div class="tip-sub">' + (G.Equip.slotLabel(item.slot) || item.type) +
        ' ｜ 需求 Lv.' + item.reqLevel + ' ｜ ' + (G.JOB_NAME[item.reqJob] || '通用') + '</div>';
      const rows = [
        ['攻击', item.atk], ['魔法', item.mag], ['道术', item.tao],
        ['防御', item.def], ['魔防', item.mdef]
      ];
      let attrs = '';
      rows.forEach(function (r) {
        if (r[1] && (r[1][0] || r[1][1])) {
          attrs += '<div class="tip-line"><span>' + r[0] + '</span><span class="v">' + r[1][0] + '-' + r[1][1] + '</span></div>';
        }
      });
      if (item.hp) attrs += '<div class="tip-line"><span>生命</span><span class="v">+' + item.hp + '</span></div>';
      if (item.mp) attrs += '<div class="tip-line"><span>魔法值</span><span class="v">+' + item.mp + '</span></div>';
      if (item.acc) attrs += '<div class="tip-line"><span>准确</span><span class="v">+' + item.acc + '</span></div>';
      if (item.agi) attrs += '<div class="tip-line"><span>敏捷</span><span class="v">+' + item.agi + '</span></div>';
      if (item.para) attrs += '<div class="tip-line"><span>麻痹</span><span class="v">' + item.para + '% 定身 1.5 秒</span></div>';
      if (attrs) h += attrs + '<div class="tip-sep"></div>';
      if (item.setText) {
        h += '<div class="tip-desc" style="color:#c9a227">' + G.U.esc(item.setText) + '</div>';
      }
    } else if (item.use) {
      h += '<div class="tip-sub">' + (item.type === 'scroll' ? '卷轴' : '消耗品') + '</div>';
      if (item.use.hp) h += '<div class="tip-line"><span>恢复生命</span><span class="v">+' + item.use.hp + '</span></div>';
      if (item.use.mp) h += '<div class="tip-line"><span>恢复魔法</span><span class="v">+' + item.use.mp + '</span></div>';
      if (item.use.town) h += '<div class="tip-line"><span>效果</span><span class="v">返回海曦村</span></div>';
      h += '<div class="tip-sep"></div>';
    } else {
      h += '<div class="tip-sub">材料</div>';
    }
    if (item.desc) h += '<div class="tip-desc">' + G.U.esc(item.desc) + '</div>';
    h += '<div class="tip-sep"></div>';
    h += '<div class="tip-line"><span>重量</span><span class="v">' + item.weight + '</span></div>';
    h += '<div class="tip-line"><span>售价</span><span class="v">' + item.price + ' 金</span></div>';
    if (item.source) h += '<div class="tip-src">来源：' + G.U.esc(item.source) + '</div>';
    return h;
  };

  /* ---------- Toast / Log ---------- */
  G.UI.toast = function (text, type) {
    const layer = document.getElementById('toast-layer');
    const d = document.createElement('div');
    d.className = 'toast' + (type ? ' ' + type : '');
    d.textContent = text;
    layer.appendChild(d);
    setTimeout(function () {
      d.style.transition = 'opacity .25s';
      d.style.opacity = '0';
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 260);
    }, 1800);
  };

  G.UI.log = function (text, cls) {
    const box = document.getElementById('hud-log');
    const d = document.createElement('div');
    if (cls) d.className = cls;
    d.textContent = text;
    box.appendChild(d);
    while (box.children.length > 9) box.removeChild(box.firstChild);
  };

  /* ---------- 面板管理 ---------- */
  G.Panel = {
    list: {},

    open: function (id, title, html, opts) {
      opts = opts || {};
      let rec = this.list[id];
      if (!rec) {
        const el = document.createElement('div');
        el.className = 'panel';
        el.setAttribute('data-panel', id);
        const portrait = !!(G.MOBILE && G.MOBILE.portrait);
        const VW = G.CFG.VIEW_W;
        const n = Object.keys(this.list).length % 3;
        const w = portrait ? Math.min(opts.width || 520, VW - 16) : (opts.width || 520);
        const left = portrait ? 8 : (opts.x != null ? opts.x : Math.max(10, (VW - w) / 2 + n * 24));
        const top = portrait ? 12 : (opts.y != null ? opts.y : 80 + n * 28);
        el.style.left = left + 'px';
        el.style.top = top + 'px';
        el.style.width = w + 'px';
        el.innerHTML =
          '<div class="panel-head"><span class="panel-title">' + G.U.esc(title) + '</span>' +
          '<button class="panel-close" data-act="close" data-panel="' + id + '">✕</button></div>' +
          '<div class="panel-body"></div>';
        document.getElementById('panel-layer').appendChild(el);
        this.bindDrag(el);
        rec = this.list[id] = { el: el, title: title };
      }
      rec.el.querySelector('.panel-title').textContent = title;
      rec.el.querySelector('.panel-body').innerHTML = html;
      rec.el.classList.remove('hidden');
      this.raise(id);
      this.syncPause();
      return rec.el;
    },

    setHTML: function (id, html) {
      const rec = this.list[id];
      if (!rec) return;
      rec.el.querySelector('.panel-body').innerHTML = html;
    },

    raise: function (id) {
      const rec = this.list[id];
      if (!rec) return;
      G.UI.zTop += 1;
      rec.el.style.zIndex = G.UI.zTop;
    },

    close: function (id) {
      const rec = this.list[id];
      if (!rec) return;
      rec.el.classList.add('hidden');
      this.syncPause();
    },

    // 系统面板打开即暂停（V0.2.01）
    syncPause: function () {
      G.S.paused = this.isOpen('system');
    },

    closeAll: function () {
      Object.keys(this.list).forEach(function (id) { G.Panel.close(id); });
      G.UI.hideTip();
    },

    isOpen: function (id) {
      const rec = this.list[id];
      return !!(rec && !rec.el.classList.contains('hidden'));
    },

    toggle: function (id) { if (this.isOpen(id)) this.close(id); else if (G.UI.openers[id]) G.UI.openers[id](); },

    bindDrag: function (el) {
      const head = el.querySelector('.panel-head');
      let dragging = false, ox = 0, oy = 0;
      head.addEventListener('mousedown', function (e) {
        if (e.target.closest('.panel-close')) return;
        dragging = true;
        const r = el.getBoundingClientRect();
        const s = G.UI.scale;
        ox = e.clientX - r.left;
        oy = e.clientY - r.top;
        G.UI.zTop += 1;
        el.style.zIndex = G.UI.zTop;
        e.preventDefault();
      });
      document.addEventListener('mousemove', function (e) {
        if (!dragging) return;
        const sr = stage().getBoundingClientRect();
        const s = G.UI.scale;
        let x = (e.clientX - sr.left) / s - ox;
        let y = (e.clientY - sr.top) / s - oy;
        x = G.U.clamp(x, -el.offsetWidth + 80, G.CFG.VIEW_W - 80);
        y = G.U.clamp(y, 0, G.CFG.VIEW_H - 34);
        el.style.left = x + 'px';
        el.style.top = y + 'px';
      });
      document.addEventListener('mouseup', function () { dragging = false; });
    }
  };
})();
