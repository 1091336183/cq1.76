/* ===== HUD ===== */
(function () {
  const $ = function (id) { return document.getElementById(id); };

  G.UI.openers = {
    character: function () { G.PageCharacter.open(); },
    bag: function () { G.PageBag.open(); },
    skill: function () { G.PageSkill.open(); },
    quest: function () { G.PageQuest.open(); },
    gallery: function () { G.PageGallery.render(); },
    system: function () { G.PageSystem.open(); }
  };

  G.UI.initHud = function () {
    const p = G.S.player;
    if (!p) return;
    const job = G.JOBS[p.job];
    $('hud-portrait').style.setProperty('--job-color', job.color);
    $('hud-portrait').innerHTML =
      '<div class="p-head"></div><div class="p-body"></div><div class="p-weapon"></div>';
    $('hud-name').textContent = p.name;
    this.refreshSkillBar();
    this.refreshItemBar();
    this.refreshBottomButtons();
    this.refreshQuestHud();
    this.applyMini();
    $('hud').classList.remove('hidden');
  };

  /* ---------- 小地图：缩放 / 隐藏（V0.1.01） ---------- */
  const MINI_STEPS = [0.75, 1, 1.35];

  G.UI.miniScale = function () {
    const v = G.S.settings ? G.S.settings.miniScale : 1;
    return MINI_STEPS.indexOf(v) >= 0 ? v : 1;
  };

  G.UI.applyMini = function () {
    const s = G.S.settings;
    if (!s) return;
    const box = $('hud-minimap');
    const cv = $('minimap');
    const showBtn = $('mm-show');
    if (!box || !cv) return;
    const sc = this.miniScale();
    const w = Math.round(160 * sc), h = Math.round(120 * sc);
    cv.style.width = w + 'px';
    cv.style.height = h + 'px';
    box.style.width = (w + 4) + 'px';
    box.style.right = '12px';
    box.classList.toggle('hidden', !!s.miniHidden);
    if (showBtn) showBtn.classList.toggle('hidden', !s.miniHidden);
    this.renderMinimap();
  };

  G.UI.miniStep = function (dir) {
    const s = G.S.settings;
    if (!s) return;
    let i = MINI_STEPS.indexOf(this.miniScale());
    if (i < 0) i = 1;
    i = G.U.clamp(i + dir, 0, MINI_STEPS.length - 1);
    s.miniScale = MINI_STEPS[i];
    this.applyMini();
  };

  G.UI.toggleMini = function (force) {
    const s = G.S.settings;
    if (!s) return;
    s.miniHidden = (force == null) ? !s.miniHidden : !!force;
    this.applyMini();
  };

  G.UI.refreshBottomButtons = function () {
    $('hud-btns').innerHTML =
      '<button class="btn" data-act="open" data-page="character">人物<b>E</b></button>' +
      '<button class="btn" data-act="open" data-page="bag">背包<b>Q</b></button>' +
      '<button class="btn" data-act="open" data-page="skill">技能<b>F</b></button>' +
      '<button class="btn" data-act="open" data-page="quest">任务<b>R</b></button>' +
      '<button class="btn" data-act="open" data-page="gallery">图鉴<b>G</b></button>' +
      '<button class="btn" data-act="open" data-page="system">系统<b>Esc</b></button>';
  };

  G.UI.refreshItemBar = function () {
    const p = G.S.player;
    if (!p) return;
    const list = [
      { id: 'c_hp1', key: '1' }, { id: 'c_hp2', key: '2' }, { id: 'c_hp3', key: '3' },
      { id: 'c_mp1', key: '4' }, { id: 'c_mp2', key: '5' }, { id: 'c_mp3', key: '6' }
    ];
    let html = '';
    list.forEach(function (s) {
      const it = G.item(s.id);
      let n = 0;
      p.bag.forEach(function (c) { if (c && c.id === s.id) n += c.qty; });
      html += '<div class="slot" data-act="use-quick" data-item="' + s.id + '" title="' + it.name + '">' +
        '<span class="key">' + s.key + '</span>' +
        (n > 0 ? G.UI.icon(s.id) : '') +
        (n > 0 ? '<span class="qty">' + n + '</span>' : '') + '</div>';
    });
    $('hud-items').innerHTML = html;
  };

  G.UI.refreshSkillBar = function () {
    const p = G.S.player;
    if (!p) return;
    const skills = G.Skills.bookOf(p).filter(function (s) { return !s.def.passive; });
    let html = '';
    for (let i = 0; i < 8; i++) {
      const s = skills[i];
      if (s) {
        const cd = G.Skills.cooldown(p, s.def.id);
        html += '<div class="slot' + (s.learned ? '' : ' disabled') + '" data-act="cast" data-skill="' + s.def.id + '" title="' + s.def.name + '">' +
          '<span class="key">F' + (i + 1) + '</span><span class="sk">' + s.def.icon + '</span>' +
          (cd > 0 ? '<span class="cd">' + Math.ceil(cd) + '</span>' : '') + '</div>';
      } else {
        html += '<div class="slot disabled"><span class="key">F' + (i + 1) + '</span></div>';
      }
    }
    $('hud-skills').innerHTML = html;
  };

  G.UI.refreshQuestHud = function () {
    const p = G.S.player;
    if (!p) return;
    const cur = G.Quest.current(p);
    const box = $('hud-quest');
    if (!cur.step) {
      box.innerHTML = '<div class="q-title">' + cur.chapter.name + '</div>' +
        '<div class="q-goal">本章已通关</div>';
      return;
    }
    box.innerHTML = '<div class="q-title">' + cur.chapter.name + '</div>' +
      '<div class="q-goal">' + G.U.esc(cur.step.text) + G.Quest.progressText(p) + '</div>' +
      '<div class="q-hint">' + G.U.esc(cur.step.hint) + '</div>';
  };

  G.UI.onMapChanged = function (def) {
    $('hud-mapname').textContent = def.name;
    $('mm-label').textContent = def.name;
    G.UI.log('进入 ' + def.name + '（推荐 Lv.' + def.levelRange[0] + '-' + def.levelRange[1] + '）', 'sys');
    this.refreshQuestHud();
    this.renderMinimap();
    if (G.S.settings.autoSave) G.State.save(true);
  };

  G.UI.updateHud = function (dt) {
    const p = G.S.player;
    if (!p || !G.S.map) return;
    const st = G.Equip.stats(p);
    const hpPct = G.U.clamp(p.hp / st.hpMax * 100, 0, 100);
    const mpPct = G.U.clamp(p.mp / st.mpMax * 100, 0, 100);
    const need = G.U.needExp(p.level);
    const expPct = p.level >= G.CFG.LEVEL_CAP ? 100 : G.U.clamp(p.exp / need * 100, 0, 100);
    $('hud-hp-fill').style.width = hpPct + '%';
    $('hud-mp-fill').style.width = mpPct + '%';
    $('hud-exp-fill').style.width = expPct + '%';
    $('hud-hp-text').textContent = Math.ceil(p.hp) + '/' + st.hpMax;
    $('hud-mp-text').textContent = Math.ceil(p.mp) + '/' + st.mpMax;
    $('hud-exp-text').textContent = p.level >= G.CFG.LEVEL_CAP ? 'MAX' : Math.floor(expPct) + '%';
    $('hud-lv').textContent = 'Lv.' + p.level;

    const t = G.World.tileOf(p.px, p.py);
    $('hud-coord').textContent = '(' + t.x + ',' + t.y + ')';

    // 目标
    const tgt = G.S.target;
    const tEl = $('hud-target');
    if (tgt && tgt.hp > 0) {
      tEl.classList.remove('hidden');
      $('hud-target-name').textContent = tgt.def.name + '  Lv.' + tgt.def.level + '  ' +
        Math.ceil(tgt.hp) + '/' + tgt.maxHp;
      $('hud-target-fill').style.width = (tgt.hp / tgt.maxHp * 100) + '%';
    } else {
      tEl.classList.add('hidden');
    }
  };

  G.UI.renderMinimap = function () {
    const cv = document.getElementById('minimap');
    if (!cv || !G.S.terrain || !G.S.map) return;
    const c = cv.getContext('2d');
    const map = G.S.map, tr = G.S.terrain;
    const sx = cv.width / map.w, sy = cv.height / map.h;
    c.clearRect(0, 0, cv.width, cv.height);
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        if (tr.grid[y][x] === 1) c.fillStyle = '#2a2318';
        else if (tr.tileType[y][x] === 'road') c.fillStyle = '#6d5a35';
        else c.fillStyle = map.terrain === 'coast' ? '#8a7d52'
          : map.terrain === 'town' ? '#6b6250'
          : map.terrain === 'cave' ? '#4a4038'
          : map.terrain === 'swamp' ? '#3a4a2a'
          : '#3f4a2c';
        c.fillRect(x * sx, y * sy, Math.ceil(sx), Math.ceil(sy));
      }
    }
    (map.ports || []).forEach(function (p) {
      c.fillStyle = '#ffd75e';
      c.fillRect(p.x * sx - 1, p.y * sy - 1, sx + 2, sy + 2);
    });
    (G.S.npcs || []).forEach(function (n) {
      c.fillStyle = '#7db8ff';
      c.fillRect(n.x * sx, n.y * sy, Math.max(2, sx), Math.max(2, sy));
    });
    (G.S.monsters || []).forEach(function (m) {
      if (m.hp <= 0) return;
      c.fillStyle = m.def.isBoss ? '#ff9f43' : '#c0392b';
      const t = G.World.tileOf(m.x, m.y);
      c.fillRect(t.x * sx, t.y * sy, Math.max(2, sx), Math.max(2, sy));
    });
    const pt = G.World.tileOf(G.S.player.px, G.S.player.py);
    c.fillStyle = '#ffffff';
    c.fillRect(pt.x * sx - 1, pt.y * sy - 1, Math.max(3, sx + 1), Math.max(3, sy + 1));
  };
})();
