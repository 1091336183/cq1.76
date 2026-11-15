/* ===== WebAudio 合成音效（无音频文件） ===== */
(function () {
  let ctx = null;

  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch (e) { ctx = null; }
    return ctx;
  }

  const PRESET = {
    ui:    { f: 620, f2: 760, d: 0.06, type: 'square', g: 0.10 },
    hit:   { f: 180, f2: 90,  d: 0.09, type: 'square', g: 0.16 },
    hurt:  { f: 150, f2: 70,  d: 0.14, type: 'sawtooth', g: 0.15 },
    pick:  { f: 880, f2: 1320, d: 0.09, type: 'sine', g: 0.13 },
    coin:  { f: 1046, f2: 1568, d: 0.11, type: 'sine', g: 0.12 },
    level: { f: 523, f2: 1046, d: 0.30, type: 'triangle', g: 0.16 },
    die:   { f: 300, f2: 60,  d: 0.45, type: 'sawtooth', g: 0.14 },
    cast:  { f: 420, f2: 980, d: 0.16, type: 'sine', g: 0.12 }
  };

  G.Audio = {
    volume: 0.5,
    enabled: true,
    init() { ensure(); },
    play(name) {
      if (!this.enabled) return;
      const c = ensure();
      if (!c) return;
      const p = PRESET[name] || PRESET.ui;
      try {
        if (c.state === 'suspended') c.resume();
        const t0 = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = p.type;
        osc.frequency.setValueAtTime(p.f, t0);
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, p.f2), t0 + p.d);
        gain.gain.setValueAtTime(p.g * this.volume, t0);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + p.d);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(t0);
        osc.stop(t0 + p.d + 0.02);
      } catch (e) { /* 忽略音频异常 */ }
    }
  };
})();
