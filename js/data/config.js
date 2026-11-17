/* ===== 全局配置 ===== */
window.G = window.G || {};

/* V0.2.04：手机竖屏检测（屏宽 ≤900 且高 > 宽即视为竖屏） */
(function () {
  const ua = navigator.userAgent || '';
  const w = window.innerWidth || 1024;
  const h = window.innerHeight || 768;
  G.MOBILE = {
    touch: ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || /Android|iPhone|iPad|iPod|Mobile/i.test(ua),
    portrait: w <= 900 && h > w
  };
})();

G.CFG = {
  VERSION: '0.2.04',
  VERSION_NAME: 'V0.2.04 三镇修订',
  SAVE_VERSION: 2,
  SAVE_KEY: 'cq176_rebirth_save_v2',
  SAVE_KEY_V1: 'cq176_rebirth_save_v1',
  SAVE_SLOTS: 3,              // 存档位数量（槽 1 沿用 SAVE_KEY）
  TILE: 32,
  // 竖屏使用 480×960 逻辑舞台，只显示地图局部；横屏/桌面保持 1024×768
  VIEW_W: G.MOBILE.portrait ? 480 : 1024,
  VIEW_H: G.MOBILE.portrait ? 960 : 768,
  VIEW_HUD: G.MOBILE.portrait ? 124 : 56,   // 底部操作条高度（可视区需扣除）
  ZOOM_DEFAULT: G.MOBILE.portrait ? 1.0 : 0.86,  // 竖屏视野约 15×26 格
  ZOOM_MIN: 0.7,
  ZOOM_MAX: 1.2,
  EXP_RATE: 100,              // 测试期怪物经验倍率（正式版本改回 1）
  LEVEL_CAP: 60,
  BAG_SIZE: 54,
  START_MAP: 'mp_haixicun',
  START_TX: 24,
  START_TY: 20,
  PLAYER_SPEED: 3.4,          // 格/秒
  MON_BASE_SPEED: 2.0,        // 格/秒
  PLAYER_ATK_CD: 0.9,         // 普攻间隔（秒）
  ATTACK_RANGE: 1.55,         // 战士/道士普攻距离（格）
  MAGE_RANGE: 3.2,            // 法师普攻距离（格）
  MON_ATTACK_RANGE: 1.3,
  PICK_RANGE: 1.9,
  CRIT_BASE: 0.04,
  REGEN_HP: 0.005,            // 每秒恢复上限百分比（脱战）
  REGEN_MP: 0.01,
  AUTOSAVE_MS: 60000
};

G.JOBS = {
  1: {
    id: 1, name: '战士', color: '#b23a2a', icon: '⚔',
    tag: '高生命 · 高防御 · 近战站撸',
    hp: L => 40 + 18 * (L - 1),
    mp: L => 6 + 2 * (L - 1),
    atk: L => [3 + 0.35 * L, 8 + 1.25 * L],
    tao: () => [0, 0],
    mag: () => [0, 0],
    def: L => [2 + 0.5 * L, 6 + 1.0 * L],
    mdef: L => [1 + 0.15 * L, 2 + 0.4 * L],
    main: 'atk'
  },
  2: {
    id: 2, name: '法师', color: '#2f5fa8', icon: '✦',
    tag: '远程魔法 · 高爆发 · 血薄',
    hp: L => 26 + 12 * (L - 1),
    mp: L => 14 + 8 * (L - 1),
    atk: L => [1 + 0.2 * L, 3 + 0.5 * L],
    tao: () => [0, 0],
    mag: L => [4 + 0.6 * L, 9 + 1.6 * L],
    def: L => [1 + 0.3 * L, 3 + 0.6 * L],
    mdef: L => [2 + 0.4 * L, 5 + 1.0 * L],
    main: 'mag'
  },
  3: {
    id: 3, name: '道士', color: '#3f7a52', icon: '☯',
    tag: '道术 · 治疗 · 均衡续航',
    hp: L => 32 + 15 * (L - 1),
    mp: L => 10 + 5 * (L - 1),
    atk: L => [2 + 0.25 * L, 5 + 0.7 * L],
    tao: L => [2 + 0.4 * L, 6 + 1.2 * L],
    mag: () => [0, 0],
    def: L => [1.5 + 0.4 * L, 4 + 0.8 * L],
    mdef: L => [1.5 + 0.35 * L, 4 + 0.9 * L],
    main: 'tao'
  }
};

G.QUALITY = [
  { name: '白板', color: '#e8e8e8' },
  { name: '上品', color: '#5aa9ff' },
  { name: '珍品', color: '#ffd75e' },
  { name: '传说', color: '#c77dff' },
  { name: '神器', color: '#ff9f43' }
];

G.JOB_NAME = { 0: '通用', 1: '战士', 2: '法师', 3: '道士' };
