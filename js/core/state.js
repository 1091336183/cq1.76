/* ===== 全局状态 / 存档 ===== */
(function () {
  G.S = {
    mode: 'menu',              // menu | create | play | dead | victory
    player: null,
    map: null,
    terrain: null,
    spawners: [],
    monsters: [],
    ground: [],
    projectiles: [],
    floats: [],
    npcs: [],
    cam: { x: 0, y: 0 },
    target: null,
    pending: null,             // 待拾取/待交互
    mouse: { sx: 0, sy: 0, wx: 0, wy: 0, tx: 0, ty: 0, down: false },
    time: 0,
    playTime: 0,
    lastAuto: 0,
    paused: false,
    slot: 1,                   // 当前存档位（V0.2.01：1~3）
    portalLock: false,
    settings: {
      sfx: 0.5, showDmg: true, showHpBar: true, showNames: true, autoSave: true,
      zoom: 0.86,            // 世界视野缩放（V0.1.01）
      miniScale: 1,          // 小地图缩放档位：0.75 / 1 / 1.35
      miniHidden: false      // 小地图隐藏状态
    },
    debug: { invincible: false, speed: 1 }
  };

  const RUNTIME_KEYS = ['px', 'py', 'path', 'face', 'atkAnim', 'atkCd', 'skillCd',
    'buffs', 'target', 'lastCombat', 'moving', 'dead'];

  function newPlayer(name, job, gender) {
    const p = {
      name: name, job: job, gender: gender,
      level: 1, exp: 0, points: 0,
      alloc: { atk: [0, 0], tao: [0, 0], mag: [0, 0], def: [0, 0], mdef: [0, 0] },
      hp: 1, mp: 1, gold: 300,
      bag: new Array(G.CFG.BAG_SIZE).fill(null),
      equip: G.Equip.emptyEquip(),
      skills: {},
      mapId: G.CFG.START_MAP, tx: G.CFG.START_TX, ty: G.CFG.START_TY,
      quest: { chapter: 'chapter1', step: 0, kills: {}, side: {}, done: false },
      gallery: { kill: {}, drop: {}, claim: {} },
      towns: { mp_haixicun: true },
      store: G.Store.empty(),
      stats: { kills: 0, deaths: 0, goldEarned: 0, itemsFound: 0, startAt: Date.now() },
      buffs: []
    };
    // 新手补给
    G.Bag.add(p, 'c_hp1', 5);
    const st = G.Equip.stats(p);
    p.hp = st.hpMax; p.mp = st.mpMax;
    return p;
  }

  // 存档位键名：槽 1 沿用 cq176_rebirth_save_v2，槽 2/3 追加后缀
  function keyFor(slot) {
    const s = slot || 1;
    return s === 1 ? G.CFG.SAVE_KEY : G.CFG.SAVE_KEY + '_' + s;
  }

  function migrate(obj) {
    if (!obj || !obj.player) return null;
    const p = obj.player;
    p.alloc = p.alloc || { atk: [0, 0], tao: [0, 0], mag: [0, 0], def: [0, 0], mdef: [0, 0] };
    p.bag = p.bag || new Array(G.CFG.BAG_SIZE).fill(null);
    while (p.bag.length < G.CFG.BAG_SIZE) p.bag.push(null);
    p.equip = p.equip || G.Equip.emptyEquip();
    p.skills = p.skills || {};
    p.quest = p.quest || { chapter: 'chapter1', step: 0, kills: {}, done: false };
    p.quest.chapter = p.quest.chapter || 'chapter1';
    if (!p.quest.side) p.quest.side = {};
    p.gallery = p.gallery || { kill: {}, drop: {}, claim: {} };
    if (!p.gallery.kill) p.gallery.kill = {};
    if (!p.gallery.drop) p.gallery.drop = {};
    if (!p.gallery.claim) p.gallery.claim = {};
    p.towns = p.towns || {};
    if (!p.towns[G.CFG.START_MAP]) p.towns[G.CFG.START_MAP] = true;
    p.store = G.Store.normalize(p.store);
    p.stats = p.stats || { kills: 0, deaths: 0, goldEarned: 0, itemsFound: 0, startAt: Date.now() };
    p.buffs = [];
    p.path = [];
    p.skillCd = {};
    p.atkCd = 0;
    obj.player = p;
    return obj;
  }

  G.State = {
    keyFor: keyFor,
    slotCount: function () { return G.CFG.SAVE_SLOTS || 3; },

    newGame: function (name, job, gender) {
      const p = newPlayer(name, job, gender);
      G.S.player = p;
      G.S.mode = 'play';
      G.S.playTime = 0;
      G.S.lastAuto = 0;
      return p;
    },

    // 读取指定槽位（含 v1 迁移），失败返回 null
    readSlot: function (slot) {
      try {
        const s = slot || 1;
        let raw = localStorage.getItem(keyFor(s));
        let oldVer = false;
        if (!raw && s === 1 && G.CFG.SAVE_KEY_V1) {
          raw = localStorage.getItem(G.CFG.SAVE_KEY_V1);
          oldVer = !!raw;
        }
        if (!raw) return null;
        const obj = migrate(JSON.parse(raw));
        if (!obj) return null;
        obj.migratedFromV1 = oldVer;
        obj.slot = s;
        return obj;
      } catch (e) { return null; }
    },

    // 三个槽位摘要，供主菜单/系统面板展示
    list: function () {
      const out = [];
      for (let i = 1; i <= this.slotCount(); i++) {
        const obj = this.readSlot(i);
        out.push({ slot: i, empty: !obj, obj: obj });
      }
      return out;
    },

    // 首个空槽（没有则返回 1）
    firstEmpty: function () {
      const l = this.list();
      for (let i = 0; i < l.length; i++) if (l[i].empty) return l[i].slot;
      return 1;
    },

    hasSave: function () {
      for (let i = 1; i <= this.slotCount(); i++) {
        if (this.readSlot(i)) return true;
      }
      return false;
    },

    save: function (silent, slot) {
      if (!G.S.player) return false;
      const s = slot || G.S.slot || 1;
      const p = G.S.player;
      const copy = JSON.parse(JSON.stringify(p));
      RUNTIME_KEYS.forEach(function (k) { delete copy[k]; });
      const obj = {
        v: G.CFG.SAVE_VERSION,
        ver: G.CFG.VERSION,
        slot: s,
        savedAt: Date.now(),
        playTime: Math.round(G.S.playTime),
        settings: G.S.settings,
        player: copy
      };
      try {
        localStorage.setItem(keyFor(s), JSON.stringify(obj));
        G.S.slot = s;
        if (!silent) G.UI.log('游戏已保存（存档 ' + s + '）', 'sys');
        return true;
      } catch (e) {
        if (!silent) G.UI.toast('存档失败：浏览器存储不可用', 'warn');
        return false;
      }
    },

    load: function (slot) {
      const s = slot || G.S.slot || 1;
      const obj = this.readSlot(s);
      if (obj) G.S.slot = s;
      return obj;
    },

    deleteSave: function (slot) {
      try {
        const s = slot || G.S.slot || 1;
        localStorage.removeItem(keyFor(s));
        if (s === 1 && G.CFG.SAVE_KEY_V1) localStorage.removeItem(G.CFG.SAVE_KEY_V1);
      } catch (e) { /* ignore */ }
    },

    // 从存档对象恢复
    restore: function (obj) {
      G.S.player = obj.player;
      G.S.slot = obj.slot || G.S.slot || 1;
      G.S.playTime = obj.playTime || 0;
      if (obj.settings) Object.assign(G.S.settings, obj.settings);
      G.Audio.volume = G.S.settings.sfx;
      G.S.mode = 'play';
      const p = G.S.player;
      const st = G.Equip.stats(p);
      p.hp = Math.min(p.hp, st.hpMax);
      p.mp = Math.min(p.mp, st.mpMax);
      if (!p.hp || p.hp <= 0) p.hp = st.hpMax;
    },

    resetRuntime: function () {
      G.S.monsters = [];
      G.S.ground = [];
      G.S.projectiles = [];
      G.S.floats = [];
      G.S.spawners = [];
      G.S.target = null;
      G.S.pending = null;
      G.S.portalLock = false;
      G.Panel.closeAll();
    }
  };
})();
