/* ===== 通用工具 ===== */
G.U = {
  clamp(v, a, b) { return v < a ? a : (v > b ? b : v); },
  ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
  rf(a, b) { return a + Math.random() * (b - a); },
  pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); },
  dist2(ax, ay, bx, by) { const dx = ax - bx, dy = ay - by; return dx * dx + dy * dy; },
  rollMinMax(r) { return G.U.rf(r[0], r[1]); },
  rollInt(r) { return G.U.ri(Math.round(r[0]), Math.round(r[1])); },
  fmt(n) {
    n = Math.round(n);
    if (n >= 100000000) return (n / 100000000).toFixed(2) + '亿';
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return String(n);
  },
  timeText(sec) {
    sec = Math.max(0, Math.floor(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return (h > 0 ? h + '时' : '') + m + '分' + s + '秒';
  },
  esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  },
  hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  },
  // mulberry32
  rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },
  shuffle(arr, rand) {
    rand = rand || Math.random;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  },
  needExp(L) { return Math.round(15.35 * L * L); },
  attrRangeText(r) {
    if (!r || (r[0] === 0 && r[1] === 0)) return null;
    return r[0] + '-' + r[1];
  },
  now() { return Date.now(); }
};
