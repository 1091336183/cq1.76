/* ===== 怪物实体 / AI ===== */
(function () {
  const T = G.CFG.TILE;

  G.Mon = {
    create: function (def, tx, ty, spawner) {
      const m = {
        def: def,
        name: def.name,
        hp: def.hp,
        maxHp: def.hp,
        x: tx * T + T / 2,
        y: ty * T + T / 2,
        hx: tx * T + T / 2,
        hy: ty * T + T / 2,
        state: 'idle',
        atkCd: G.U.rf(0, 0.5),
        wanderT: G.U.rf(0.5, 2.5),
        wtx: null, wty: null,
        flash: 0,
        face: 2,
        spawner: spawner || null,
        deadT: 0,
        anim: Math.random() * 6.28
      };
      return m;
    },

    update: function (m, dt) {
      const p = G.S.player;
      if (!p) return;
      m.flash = Math.max(0, m.flash - dt);
      m.atkCd = Math.max(0, m.atkCd - dt);
      m.anim += dt * 3;
      // 麻痹定身：不移动、不攻击
      if (m.stun > 0) {
        m.stun = Math.max(0, m.stun - dt);
        return;
      }
      const speed = G.CFG.MON_BASE_SPEED * m.def.speed * T;
      const distP = G.U.dist(m.x, m.y, p.px, p.py) / T;
      const distHome = G.U.dist(m.x, m.y, m.hx, m.hy) / T;

      if (p.dead) {
        m.state = 'idle';
      }

      if (m.state !== 'return' && !p.dead) {
        if (distP < 6.5) m.state = 'chase';
        else if (m.state === 'chase' && distP > 9.5) m.state = 'idle';
      }
      if (distHome > 14 && m.state !== 'return') m.state = 'return';

      if (m.state === 'chase' && !p.dead) {
        const atkRange = m.def.isBoss ? 1.6 : G.CFG.MON_ATTACK_RANGE;
        if (distP <= atkRange + 0.2) {
          if (m.atkCd <= 0) {
            m.atkCd = m.def.isBoss ? 1.6 : 1.45;
            G.Mon.attack(m, p);
          }
        } else {
          G.Mon.moveToward(m, p.px, p.py, speed, dt);
        }
        return;
      }

      if (m.state === 'return') {
        if (distHome < 0.8) {
          m.state = 'idle';
          m.hp = Math.min(m.maxHp, m.hp + m.maxHp * 0.4);
        } else {
          G.Mon.moveToward(m, m.hx, m.hy, speed, dt);
          m.hp = Math.min(m.maxHp, m.hp + m.maxHp * 0.02 * dt);
        }
        return;
      }

      // 游荡
      m.wanderT -= dt;
      if (m.wanderT <= 0) {
        m.wanderT = G.U.rf(2.5, 6);
        const ang = Math.random() * Math.PI * 2;
        const r = G.U.rf(1, 3.5) * T;
        m.wtx = m.hx + Math.cos(ang) * r;
        m.wty = m.hy + Math.sin(ang) * r;
      }
      if (m.wtx != null) {
        if (G.U.dist(m.x, m.y, m.wtx, m.wty) < 6) {
          m.wtx = null; m.wty = null;
        } else {
          G.Mon.moveToward(m, m.wtx, m.wty, speed * 0.45, dt);
        }
      }
    },

    moveToward: function (m, tx, ty, speed, dt) {
      const dx = tx - m.x, dy = ty - m.y;
      const d = Math.hypot(dx, dy);
      if (d < 1) return;
      let vx = dx / d * speed * dt;
      let vy = dy / d * speed * dt;
      m.face = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? 1 : 3) : (vy > 0 ? 2 : 0);
      const nx = m.x + vx, ny = m.y + vy;
      if (G.World.canWalk(nx, ny, 8)) {
        m.x = nx; m.y = ny;
        return;
      }
      if (G.World.canWalk(nx, m.y, 8)) { m.x = nx; return; }
      if (G.World.canWalk(m.x, ny, 8)) { m.y = ny; return; }
      // 被卡住时随机侧移
      const side = (Math.random() < 0.5 ? -1 : 1);
      const sx = m.x + (Math.abs(vx) > Math.abs(vy) ? 0 : side * speed * dt);
      const sy = m.y + (Math.abs(vx) > Math.abs(vy) ? side * speed * dt : 0);
      if (G.World.canWalk(sx, sy, 8)) { m.x = sx; m.y = sy; }
    },

    attack: function (m, p) {
      const st = G.Equip.stats(p);
      const chance = G.U.clamp(0.80 + (m.def.acc - st.agi) * 0.01 - (st.dodgeP || 0) * 0.01, 0.5, 0.97);
      if (Math.random() > chance) {
        G.Projectile.float(p.px, p.py - 30, '闪避', '#9fd8ff');
        return;
      }
      let dmg = Math.max(1, Math.round(G.U.rollMinMax(m.def.atk) - G.U.rollMinMax(st.def)));
      dmg = Math.max(1, Math.round(dmg * G.U.rf(0.9, 1.1)));
      if (m.def.variant === 'elite') dmg = Math.round(dmg * 1.1);
      if (m.def.isBoss) dmg = Math.round(dmg * 1.15);
      G.Player.takeDamage(p, dmg, m);

      // 变体附加效果
      if (m.def.variant === 'poison' && Math.random() < 0.30) {
        p.buffs.push({ type: 'poison', t: 3, dps: st.hpMax * 0.02, tick: 0 });
        G.UI.log('你中毒了！', 'warn');
      }
      if (m.def.variant === 'flame' && Math.random() < 0.30) {
        p.buffs.push({ type: 'burn', t: 3, dps: st.hpMax * 0.02, tick: 0 });
        G.UI.log('你被点燃了！', 'warn');
      }
    }
  };
})();
