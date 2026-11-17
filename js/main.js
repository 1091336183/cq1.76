/* ===== 主流程 / 渲染 ===== */
(function () {
  const T = G.CFG.TILE, VW = G.CFG.VIEW_W, VH = G.CFG.VIEW_H;
  const HUD_H = G.CFG.VIEW_HUD;                 // 底部操作条占用高度
  const VIEW_H = VH - HUD_H;                    // 实际可视高度
  const PORTRAIT = !!(G.MOBILE && G.MOBILE.portrait);   // V0.2.04：当前是否为竖屏布局
  let cv = null, ctx = null, last = 0, hudT = 0, mmT = 0;

  /* ---------- 自适应缩放 ---------- */
  function fit() {
    const s = Math.min(window.innerWidth / VW, window.innerHeight / VH);
    const stage = document.getElementById('stage');
    const ox = (window.innerWidth - VW * s) / 2;
    const oy = (window.innerHeight - VH * s) / 2;
    stage.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + s + ')';
    G.UI.scale = s;
  }

  /* ---------- 横竖屏切换：布局模式变化时自动保存并重载 ---------- */
  function isPortraitNow() {
    return window.innerWidth <= 900 && window.innerHeight > window.innerWidth;
  }

  function onViewportChange() {
    if (isPortraitNow() !== PORTRAIT) {
      if (G.S && G.S.player) G.State.save(true);
      location.reload();
      return;
    }
    fit();
  }

  /* ---------- 文本 ---------- */
  function textOut(t, x, y, color, size, align) {
    ctx.font = (size || 12) + 'px "Microsoft YaHei",sans-serif';
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(0,0,0,.85)';
    ctx.strokeText(t, x, y);
    ctx.fillStyle = color || '#ffffff';
    ctx.fillText(t, x, y);
  }

  function shadowEllipse(x, y, rx, ry) {
    ctx.fillStyle = 'rgba(0,0,0,.28)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------- 场景元素绘制 ---------- */
  // 传入世界坐标，判断是否落在当前视野（含余量）内
  function visible(wx, wy, padX, padY) {
    const c = G.S.cam;
    const vw = G.Camera.viewW(), vh = G.Camera.viewH();
    return wx > c.x - padX && wx < c.x + vw + padX &&
      wy > c.y - padY && wy < c.y + vh + padY;
  }

  function drawPortal(p, camx, camy) {
    const x = p.x * T + T / 2 - camx, y = p.y * T + T / 2 - camy;
    if (!visible(x, y, 70, 70)) return;
    const pulse = 0.55 + 0.45 * Math.sin(G.S.time * 3 + p.x);
    const z = G.Camera.zoom();
    // 换算屏幕坐标，用于判断是否贴近可视区上下边缘
    const sy = (y - G.S.cam.y) * z;
    // 贴近可视区下沿（底部操作条上方）时整体上移，保证传送圈完整可见
    let cy = y;
    if (sy > VIEW_H - 34 * z) cy = y - 12;
    else if (sy < 34 * z) cy = y + 12;   // 贴近上沿时下移，避免圆环被画面裁掉
    // 贴近上沿时把标签放到圈下方，避免文字被裁掉
    const ly = (sy < 58) ? cy + 40 : cy - 22;
    ctx.save();
    ctx.globalAlpha = 0.22 * pulse;
    ctx.fillStyle = '#ffd75e';
    ctx.beginPath(); ctx.arc(x, cy, 24, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = '#ffd75e';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, cy, 15, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    textOut(p.label || '', x, ly, '#ffe9b0', 11);
  }

  function drawGround(g, camx, camy) {
    const x = g.x - camx, y = g.y - camy;
    if (!visible(x, y, 50, 50)) return;
    const it = G.item(g.itemId);
    if (!it) return;
    const bob = Math.sin(G.S.time * 3 + g.x * 0.1) * 2;
    shadowEllipse(x, y + 4, 8, 3);
    let col = '#cfe4ff';
    if (G.isEquip(it)) col = (G.QUALITY[g.quality || 0] || G.QUALITY[0]).color;
    ctx.save();
    ctx.translate(x, y - 6 + bob);
    ctx.fillStyle = 'rgba(12,8,3,.85)';
    ctx.fillRect(-7, -8, 14, 14);
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-7, -8, 14, 14);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(0, -1, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    if (G.S.settings.showNames) {
      textOut(it.name, x, y - 20 + bob, col, 11);
    }
  }

  function drawNpc(n, camx, camy) {
    const x = n.x * T + T / 2 - camx, y = n.y * T + T / 2 - camy;
    if (!visible(x, y, 70, 70)) return;
    // 传送阵（V0.2.02）：旋转符文光环
    if (n.kind === 'portal') {
      const tt = G.S.time;
      ctx.save();
      ctx.globalAlpha = 0.22 + 0.14 * Math.sin(tt * 2.4);
      ctx.fillStyle = '#6ad0d8';
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = '#bff3ff';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(160,230,255,.7)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const a = tt * 0.8 + i * Math.PI / 3;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * 8, y + Math.sin(a) * 8);
        ctx.lineTo(x + Math.cos(a) * 15, y + Math.sin(a) * 15);
        ctx.stroke();
      }
      ctx.restore();
      textOut('传送阵', x, y - 26, '#bff3ff', 12);
      return;
    }
    const p = G.S.player;
    const cur = p ? G.Quest.current(p) : null;
    const isTarget = !!(cur && cur.step && cur.step.type === 'talk' && cur.step.npc === n.id && !p.quest.done);
    shadowEllipse(x, y + 6, 13, 5);
    ctx.fillStyle = n.color || '#b08a4a';
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 6);
    ctx.lineTo(x - 7, y - 20);
    ctx.lineTo(x + 7, y - 20);
    ctx.lineTo(x + 10, y + 6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d7b189';
    ctx.beginPath(); ctx.arc(x, y - 25, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a1a0c';
    ctx.beginPath(); ctx.arc(x, y - 30, 7, Math.PI, 0); ctx.fill();
    textOut(n.name, x, y - 38, '#ffe9b0', 12);
    if (isTarget) {
      const bob = Math.sin(G.S.time * 4) * 2;
      textOut('!', x, y - 50 + bob, '#ffd75e', 18);
    }
  }

  function drawMonster(m, camx, camy) {
    const x = m.x - camx, y = m.y - camy;
    if (!visible(x, y, 80, 110)) return;
    const dead = m.hp <= 0;
    const alpha = dead ? Math.max(0, 1 - (m.deadT || 0) / 0.6) : 1;
    if (G.S.target === m && !dead) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,215,94,.8)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(x, y + 3, 20, 9, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    const s = m.def.isBoss ? 1.5 : 1;
    ctx.translate(x, y);
    ctx.scale(s, s);
    shadowEllipse(0, 2, m.def.isBoss ? 20 : 13, m.def.isBoss ? 8 : 5);

    const c1 = m.def.color || '#6f5a34';
    const shape = m.def.shape;

    if (shape === 'beetle' || shape === 'boss_beetle') {
      ctx.strokeStyle = 'rgba(20,12,6,.75)';
      ctx.lineWidth = 2;
      [-8, -3, 3, 8].forEach(function (lx) {
        ctx.beginPath(); ctx.moveTo(lx, -9); ctx.lineTo(lx - 4, 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(lx, -9); ctx.lineTo(lx + 4, 2); ctx.stroke();
      });
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -11, 13, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.22)';
      ctx.beginPath(); ctx.ellipse(0, -11, 4, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2a1a0c';
      ctx.beginPath(); ctx.arc(10, -12, 5, 0, Math.PI * 2); ctx.fill();
      if (shape === 'boss_beetle') {
        ctx.fillStyle = '#ffd75e';
        ctx.beginPath();
        ctx.moveTo(-6, -21); ctx.lineTo(-3, -28); ctx.lineTo(0, -21);
        ctx.lineTo(3, -28); ctx.lineTo(6, -21);
        ctx.closePath(); ctx.fill();
      }
    } else if (shape === 'deer') {
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -15, 13, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(7, -26, 5, 12);
      ctx.beginPath(); ctx.arc(11, -28, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#6b4a24';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(12, -32); ctx.lineTo(16, -40); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9, -32); ctx.lineTo(6, -40); ctx.stroke();
      ctx.strokeStyle = 'rgba(30,20,10,.65)';
      [-8, -3, 4, 8].forEach(function (lx) {
        ctx.beginPath(); ctx.moveTo(lx, -10); ctx.lineTo(lx, 1); ctx.stroke();
      });
    } else if (shape === 'scarecrow') {
      ctx.strokeStyle = '#6b4f2a';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(0, -28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-13, -20); ctx.lineTo(13, -20); ctx.stroke();
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.arc(0, -30, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#8a6a32';
      ctx.beginPath();
      ctx.moveTo(-8, -33); ctx.lineTo(0, -42); ctx.lineTo(8, -33);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = c1;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-13, -20); ctx.lineTo(-18, -16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(13, -20); ctx.lineTo(18, -16); ctx.stroke();
    } else if (shape === 'moth') {
      ctx.fillStyle = 'rgba(183,166,214,.85)';
      ctx.beginPath();
      ctx.ellipse(-9, -16, 9, 6, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(9, -16, 9, 6, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a2a44';
      ctx.beginPath(); ctx.ellipse(0, -12, 4, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -22, 4, 0, Math.PI * 2); ctx.fill();
    } else if (shape === 'chicken') {
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -10, 9, 7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -19, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c0392b';
      ctx.beginPath(); ctx.arc(7, -24, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e8a33a';
      ctx.beginPath();
      ctx.moveTo(11, -19); ctx.lineTo(16, -17); ctx.lineTo(11, -16);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#c9a227';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-2, -3); ctx.lineTo(-2, 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(2, -3); ctx.lineTo(2, 2); ctx.stroke();
    } else if (shape === 'pig') {
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -13, 13, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(11, -16, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e0a0a0';
      ctx.beginPath(); ctx.ellipse(16, -16, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.moveTo(9, -22); ctx.lineTo(12, -27); ctx.lineTo(15, -21); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(25,15,8,.7)'; ctx.lineWidth = 2;
      [-7, 2, 8].forEach(function (lx) {
        ctx.beginPath(); ctx.moveTo(lx, -8); ctx.lineTo(lx, 1); ctx.stroke();
      });
    } else if (shape === 'boar') {
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -14, 16, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(13, -17, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#e8e0c0'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(17, -16); ctx.quadraticCurveTo(23, -20, 24, -12); ctx.stroke();
      ctx.fillStyle = '#2a1a10';
      ctx.beginPath(); ctx.arc(15, -20, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(25,15,8,.75)'; ctx.lineWidth = 2.4;
      [-10, -3, 5, 11].forEach(function (lx) {
        ctx.beginPath(); ctx.moveTo(lx, -7); ctx.lineTo(lx, 2); ctx.stroke();
      });
      ctx.fillStyle = 'rgba(255,255,255,.14)';
      ctx.beginPath(); ctx.ellipse(-2, -19, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    } else if (shape === 'frog') {
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -9, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-7, -20, 5, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(7, -20, 5, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f4f0d8';
      ctx.beginPath(); ctx.arc(-7, -21, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -21, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a1a12';
      ctx.beginPath(); ctx.arc(-7, -21, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(7, -21, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = c1; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-12, -4); ctx.lineTo(-17, 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(12, -4); ctx.lineTo(17, 2); ctx.stroke();
    } else if (shape === 'slug') {
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -8, 15, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(4, -15, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = c1; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(10, -19); ctx.lineTo(14, -26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(7, -19); ctx.lineTo(8, -27); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.beginPath(); ctx.ellipse(-3, -12, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
    } else if (shape === 'grub') {
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i % 2 ? c1 : 'rgba(0,0,0,.18)';
        ctx.beginPath(); ctx.arc(-12 + i * 6, -10 - Math.sin(i) * 3, 5 - i * 0.3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = '#2a2016';
      ctx.beginPath(); ctx.arc(-13, -15, 1.8, 0, Math.PI * 2); ctx.fill();
    } else if (shape === 'bat') {
      ctx.fillStyle = 'rgba(60,44,60,.92)';
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.quadraticCurveTo(-16, -26, -22, -12);
      ctx.quadraticCurveTo(-12, -14, 0, -10);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.quadraticCurveTo(16, -26, 22, -12);
      ctx.quadraticCurveTo(12, -14, 0, -10);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -12, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -21, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff5a5a';
      ctx.beginPath(); ctx.arc(-2, -22, 1.1, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(2, -22, 1.1, 0, Math.PI * 2); ctx.fill();
    } else if (shape === 'wolf') {
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(-1, -15, 15, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(13, -20, 6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(9, -24); ctx.lineTo(11, -30); ctx.lineTo(14, -25); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(14, -24); ctx.lineTo(17, -30); ctx.lineTo(18, -23); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = c1; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-15, -16); ctx.quadraticCurveTo(-23, -20, -20, -10); ctx.stroke();
      ctx.fillStyle = '#ffd75e';
      ctx.beginPath(); ctx.arc(15, -21, 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(25,15,8,.7)'; ctx.lineWidth = 2;
      [-10, -4, 3, 9].forEach(function (lx) {
        ctx.beginPath(); ctx.moveTo(lx, -8); ctx.lineTo(lx, 1); ctx.stroke();
      });
    } else if (shape === 'cat') {
      ctx.fillStyle = c1;
      ctx.beginPath(); ctx.ellipse(0, -11, 11, 7, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(9, -19, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6, -23); ctx.lineTo(7, -29); ctx.lineTo(10, -24); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(11, -24); ctx.lineTo(13, -29); ctx.lineTo(14, -23); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = c1; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(-11, -12); ctx.quadraticCurveTo(-20, -18, -16, -26); ctx.stroke();
      ctx.fillStyle = '#7cfc7c';
      ctx.beginPath(); ctx.arc(11, -20, 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(25,15,8,.7)'; ctx.lineWidth = 1.8;
      [-7, 0, 6].forEach(function (lx) {
        ctx.beginPath(); ctx.moveTo(lx, -6); ctx.lineTo(lx, 1); ctx.stroke();
      });
    } else {
      ctx.fillStyle = 'rgba(30,22,14,.7)';
      ctx.fillRect(-7, -12, 5, 13);
      ctx.fillRect(2, -12, 5, 13);
      ctx.fillStyle = c1;
      ctx.fillRect(-9, -30, 18, 20);
      ctx.beginPath(); ctx.arc(0, -34, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2a1f16';
      ctx.fillRect(-14, -26, 6, 12);
      ctx.fillRect(8, -26, 6, 12);
      ctx.fillStyle = '#c0392b';
      ctx.beginPath(); ctx.arc(-3, -35, 1.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(3, -35, 1.6, 0, Math.PI * 2); ctx.fill();
    }

    // BOSS 标识（V0.2：新增 BOSS 复用普通外观，另加金色王冠）
    if (m.def.isBoss) {
      ctx.fillStyle = '#ffd75e';
      ctx.beginPath();
      ctx.moveTo(-6, -38); ctx.lineTo(-3, -46); ctx.lineTo(0, -38);
      ctx.lineTo(3, -46); ctx.lineTo(6, -38);
      ctx.closePath(); ctx.fill();
    }

    if (m.flash > 0) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.ellipse(0, -14, 15, 15, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    // 血条
    const boss = m.def.isBoss;
    const stunned = !dead && m.stun > 0;
    const showBar = !dead && (stunned || (G.S.settings.showHpBar && (m.hp < m.maxHp || G.S.target === m || boss)));
    if (showBar) {
      const bw = boss ? 58 : 38, bh = 4;
      const by = y - (boss ? 56 : 40);
      ctx.fillStyle = 'rgba(0,0,0,.7)';
      ctx.fillRect(x - bw / 2, by, bw, bh);
      ctx.fillStyle = boss ? '#ff9f43' : '#d8442f';
      ctx.fillRect(x - bw / 2, by, bw * Math.max(0, m.hp / m.maxHp), bh);
      ctx.strokeStyle = 'rgba(0,0,0,.8)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - bw / 2, by, bw, bh);
      // 定身状态（V0.2.03）：血条下方显示
      if (stunned) {
        ctx.fillStyle = 'rgba(0,0,0,.55)';
        ctx.fillRect(x - 15, by + bh + 2, 30, 12);
        textOut('定身', x, by + bh + 12, '#9fd8ff', 10);
      }
    }
    if (!dead && (G.S.target === m || boss)) {
      textOut(m.def.name + ' Lv.' + m.def.level, x, y - (boss ? 62 : 46), boss ? '#ffcf8a' : '#e8dcc0', 11);
    }
  }

  function drawPlayer(p, camx, camy) {
    const x = p.px - camx, y = p.py - camy;
    const job = G.JOBS[p.job];
    const bob = p.moving ? Math.sin(G.S.time * 12) * 1.5 : 0;
    shadowEllipse(x, y + 1, 11, 4);
    ctx.fillStyle = '#2f2418';
    ctx.fillRect(x - 7, y - 8, 5, 10);
    ctx.fillRect(x + 2, y - 8, 5, 10);
    ctx.fillStyle = job.color;
    ctx.beginPath();
    ctx.moveTo(x - 9, y - 10 + bob);
    ctx.lineTo(x - 8, y - 25 + bob);
    ctx.lineTo(x + 8, y - 25 + bob);
    ctx.lineTo(x + 9, y - 10 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#d7b189';
    ctx.beginPath(); ctx.arc(x, y - 30 + bob, 6.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2a1a0c';
    ctx.beginPath(); ctx.arc(x, y - 33 + bob, 6.8, Math.PI, 0); ctx.fill();

    let ang = p.face === 1 ? 0 : (p.face === 3 ? Math.PI : (p.face === 2 ? Math.PI / 2 : -Math.PI / 2));
    if (p.atkAnim > 0) {
      const prog = 1 - p.atkAnim / 0.22;
      ang += (-1.1 + prog * 2.2) * (p.face === 3 ? -1 : 1);
    }
    ctx.save();
    ctx.translate(x, y - 18 + bob);
    ctx.rotate(ang);
    ctx.strokeStyle = '#e8e0c8';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(24, -7); ctx.stroke();
    ctx.strokeStyle = '#8a6a32';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(5, 2); ctx.lineTo(9, -1); ctx.stroke();
    ctx.restore();
  }

  function drawProjectile(pr, camx, camy) {
    const x = pr.x - camx, y = pr.y - camy;
    ctx.save();
    if (pr.kind === 'thunder') {
      ctx.strokeStyle = '#dceaff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 46);
      ctx.lineTo(x + 2, y - 24);
      ctx.lineTo(x - 4, y - 22);
      ctx.lineTo(x + 6, y);
      ctx.stroke();
    } else if (pr.kind === 'heal') {
      const k = 1 - pr.life / 0.5;
      ctx.globalAlpha = Math.max(0, 1 - k);
      ctx.strokeStyle = '#7cfc7c';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 8 + k * 22, 0, Math.PI * 2); ctx.stroke();
    } else {
      ctx.globalAlpha = 0.28;
      ctx.fillStyle = pr.color;
      ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = pr.color;
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function drawFloats(camx, camy) {
    ctx.save();
    ctx.textAlign = 'center';
    for (let i = 0; i < G.S.floats.length; i++) {
      const f = G.S.floats[i];
      const a = Math.max(0, Math.min(1, f.life / 0.6));
      ctx.globalAlpha = a;
      textOut(f.text, f.x - camx, f.y - camy, f.color, 13);
    }
    ctx.restore();
  }

  /* ---------- 渲染总入口 ---------- */
  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, VW, VH);
    ctx.fillStyle = '#0d0b09';
    ctx.fillRect(0, 0, VW, VH);
    if (!G.S.player || !G.S.map || !G.S.terrain) return;

    const sh = G.Camera.shake;
    const ox = sh > 0 ? G.U.rf(-sh, sh) : 0;
    const oy = sh > 0 ? G.U.rf(-sh, sh) : 0;
    const camx = G.S.cam.x + ox, camy = G.S.cam.y + oy;
    const z = G.Camera.zoom();

    // 世界层：裁剪到操作条以上，再按缩放平移到相机位置
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, VW, VIEW_H);
    ctx.clip();
    ctx.setTransform(z, 0, 0, z, -camx * z, -camy * z);

    ctx.drawImage(G.S.terrain.canvas, 0, 0);

    (G.S.map.ports || []).forEach(function (p) { drawPortal(p, 0, 0); });
    (G.S.ground || []).forEach(function (g) { drawGround(g, 0, 0); });
    (G.S.npcs || []).forEach(function (n) { drawNpc(n, 0, 0); });

    const ents = [];
    (G.S.monsters || []).forEach(function (m) {
      if (m.hp > 0 || (m.deadT || 0) < 0.6) {
        ents.push({ y: m.y, fn: function () { drawMonster(m, 0, 0); } });
      }
    });
    ents.push({ y: G.S.player.py, fn: function () { drawPlayer(G.S.player, 0, 0); } });
    ents.sort(function (a, b) { return a.y - b.y; });
    ents.forEach(function (e) { e.fn(); });

    (G.S.projectiles || []).forEach(function (pr) { drawProjectile(pr, 0, 0); });
    drawFloats(0, 0);

    ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 暂停提示（V0.2.01）
    if (G.S.paused) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,.38)';
      ctx.fillRect(0, 0, VW, VIEW_H);
      textOut('已 暂 停', VW / 2, VIEW_H / 2 - 6, '#ffe9b0', 26);
      textOut('关闭系统面板（Esc）继续游戏', VW / 2, VIEW_H / 2 + 22, '#c8b896', 12);
      ctx.restore();
    }
  }

  /* ---------- 更新 ---------- */
  function update(dt) {
    const p = G.S.player;
    if (!p || !G.S.map) return;
    if (G.S.mode !== 'play') {
      G.Camera.update(dt);
      return;
    }
    if (G.S.paused) return;   // V0.2.01：系统面板打开时暂停
    G.S.time += dt;
    G.S.playTime += dt;

    G.Player.update(p, dt);
    G.World.update(dt);
    G.Projectile.update(dt);

    // 待交互（NPC 对话）
    const pend = G.S.pending;
    if (pend && pend.type === 'talk' && p.path && p.path.length === 0) {
      const n = pend.npc;
      if (n && G.U.dist(p.px, p.py, n.x * T + T / 2, n.y * T + T / 2) / T <= 2.9) {
        G.S.pending = null;
        G.Npc.talk(n);
      }
    }

    G.Camera.update(dt);

    if (G.S.settings.autoSave && G.S.playTime - G.S.lastAuto > 60) {
      G.S.lastAuto = G.S.playTime;
      G.State.save(true);
    }
  }

  function loop(ts) {
    requestAnimationFrame(loop);
    const now = ts || performance.now();
    let dt = (now - last) / 1000;
    last = now;
    if (!isFinite(dt) || dt <= 0) dt = 0.016;
    if (dt > 0.05) dt = 0.05;

    update(dt);
    render();

    hudT += dt;
    if (hudT >= 0.1) {
      hudT = 0;
      if (G.S.player && G.S.map) G.UI.updateHud(dt);
    }
    mmT += dt;
    if (mmT >= 0.6) {
      mmT = 0;
      if (G.S.map) G.UI.renderMinimap();
      if (G.S.player) G.UI.refreshSkillBar();
    }
  }

  /* ---------- 对外接口 ---------- */
  G.Game = {
    start: function () {
      cv = document.getElementById('game');
      ctx = cv.getContext('2d');
      const stage = document.getElementById('stage');
      cv.width = VW;
      cv.height = VH;
      stage.style.width = VW + 'px';
      stage.style.height = VH + 'px';
      document.body.classList.toggle('portrait', PORTRAIT);
      fit();
      window.addEventListener('resize', onViewportChange);
      window.addEventListener('orientationchange', function () { setTimeout(onViewportChange, 150); });
      G.Input.bind();
      G.Start.showMenu();
      last = performance.now();
      requestAnimationFrame(loop);
    },

    newGame: function (name, job, gender) {
      G.State.newGame(name, job, gender);
      G.S.paused = false;
      G.World.load(G.CFG.START_MAP, G.CFG.START_TX, G.CFG.START_TY);
      G.UI.initHud();
      G.UI.log('欢迎来到海曦村，' + name + '。', 'good');
      G.UI.log('先与村长（村庄中央偏左）对话接取委托。', 'sys');
      G.State.save(true);
    },

    loadFromDisk: function (slot) {
      const obj = G.State.load(slot);
      if (!obj) { G.UI.toast('没有可用存档', 'warn'); return false; }
      G.Panel.closeAll();
      G.State.restore(obj);
      const p = G.S.player;
      G.World.load(p.mapId || G.CFG.START_MAP, p.tx || G.CFG.START_TX, p.ty || G.CFG.START_TY);
      G.UI.initHud();
      G.Start.hide();
      G.S.mode = 'play';
      G.UI.log('读取存档成功，继续冒险。', 'good');
      return true;
    },

    enterMap: function (id, tx, ty, msg) {
      if (!G.S.player) return;
      if (!G.World.load(id, tx, ty)) return;
      if (msg) G.UI.log(msg, 'sys');
      G.Camera.snap();
    },

    tryPickPending: function () {
      const pend = G.S.pending;
      if (!pend || pend.type !== 'pick') return;
      const p = G.S.player;
      const g = pend.g;
      G.S.pending = null;
      if (!g || G.S.ground.indexOf(g) < 0) return;
      if (G.U.dist(p.px, p.py, g.x, g.y) / T <= G.CFG.PICK_RANGE) G.Loot.pickUp(g);
    },

    showDeath: function () { G.Start.showDeath(); },

    showVictory: function () {
      G.S.mode = 'victory';
      G.State.save(true);
      G.Start.showVictory(G.S.player);
    },

    closeOverlay: function () {
      G.Start.hide();
      if (G.S.mode === 'dead') G.S.mode = 'play';
    }
  };

  window.addEventListener('load', function () {
    try { G.Game.start(); }
    catch (e) {
      console.error(e);
      document.getElementById('overlay').innerHTML =
        '<div class="ov-box"><div class="ov-title">启动失败</div><div class="ov-text">' +
        String(e && e.message ? e.message : e) + '</div></div>';
      document.getElementById('overlay').classList.remove('hidden');
    }
  });
})();
