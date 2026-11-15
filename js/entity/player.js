/* ===== 玩家实体 ===== */
(function () {
  const T = G.CFG.TILE;

  function center(tx, ty) { return { x: tx * T + T / 2, y: ty * T + T / 2 }; }

  G.Player = {
    update: function (p, dt) {
      if (!p || p.dead) return;
      p.atkCd = Math.max(0, (p.atkCd || 0) - dt);
      p.atkAnim = Math.max(0, (p.atkAnim || 0) - dt);
      p.lastCombat = (p.lastCombat || 0) + dt;

      // 冷却
      Object.keys(p.skillCd || {}).forEach(function (k) {
        if (p.skillCd[k] > 0) p.skillCd[k] = Math.max(0, p.skillCd[k] - dt);
      });

      // 持续伤害
      if (p.buffs && p.buffs.length) {
        for (let i = p.buffs.length - 1; i >= 0; i--) {
          const b = p.buffs[i];
          b.t -= dt;
          b.tick = (b.tick || 0) + dt;
          if (b.tick >= 1) {
            b.tick -= 1;
            if (b.dps > 0) {
              const dmg = Math.max(1, Math.round(b.dps));
              p.hp -= dmg;
              G.Projectile.float(p.px + G.U.rf(-8, 8), p.py - 26, '-' + dmg, b.type === 'burn' ? '#ff9f43' : '#c77dff');
              if (p.hp <= 0) { G.Player.die(p); return; }
            }
          }
          if (b.t <= 0) p.buffs.splice(i, 1);
        }
      }

      const st = G.Equip.stats(p);
      if (p.hp > st.hpMax) p.hp = st.hpMax;
      if (p.mp > st.mpMax) p.mp = st.mpMax;

      // 脱战恢复
      if (p.lastCombat > 4) {
        p.hp = Math.min(st.hpMax, p.hp + st.hpMax * G.CFG.REGEN_HP * dt);
        p.mp = Math.min(st.mpMax, p.mp + st.mpMax * G.CFG.REGEN_MP * dt);
      }

      // 路径移动
      if (p.path && p.path.length) {
        const spd = G.CFG.PLAYER_SPEED * (G.S.debug.speed || 1) * T;
        let move = spd * dt;
        while (move > 0 && p.path.length) {
          const node = p.path[0];
          const c = center(node.x, node.y);
          const dx = c.x - p.px, dy = c.y - p.py;
          const d = Math.hypot(dx, dy);
          if (d <= move) {
            p.px = c.x; p.py = c.y;
            p.tx = node.x; p.ty = node.y;
            p.path.shift();
            move -= d;
          } else {
            p.px += dx / d * move;
            p.py += dy / d * move;
            p.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);
            move = 0;
          }
        }
        p.moving = p.path.length > 0;
        if (!p.path.length) {
          p.tx = Math.round((p.px - T / 2) / T);
          p.ty = Math.round((p.py - T / 2) / T);
          if (G.S.pending && G.S.pending.type === 'pick') G.Game.tryPickPending();
        }
      } else {
        p.moving = false;
      }

      // 目标丢失
      if (p.target && (p.target.hp <= 0 || G.S.monsters.indexOf(p.target) < 0)) {
        p.target = null;
        G.S.target = null;
      }

      // 自动攻击
      if (p.target && p.target.hp > 0) {
        const range = p.job === 2 ? G.CFG.MAGE_RANGE : G.CFG.ATTACK_RANGE;
        const d = G.U.dist(p.px, p.py, p.target.x, p.target.y) / T;
        if (d <= range + 0.25) {
          p.path = [];
          if (p.atkCd <= 0) G.Player.attack(p, p.target);
        } else if (p.attackMove) {
          p.repathCd = (p.repathCd || 0) - dt;
          if (p.repathCd <= 0) {
            p.repathCd = 0.6;
            const t = G.World.tileOf(p.target.x, p.target.y);
            G.Player.walkTo(p, t.x, t.y);
          }
        }
      }
    },

    walkTo: function (p, tx, ty) {
      const st = G.World.tileOf(p.px, p.py);
      if (st.x === tx && st.y === ty) { p.path = []; return true; }
      const path = G.Path.find(G.S.terrain.grid, G.S.map.w, G.S.map.h, st.x, st.y, tx, ty);
      if (!path) { p.path = []; G.UI.toast('无法到达那里', 'warn'); return false; }
      p.path = path;
      return true;
    },

    attack: function (p, m) {
      const st = G.Equip.stats(p);
      p.atkCd = G.CFG.PLAYER_ATK_CD / (1 + (st.aspd || 0) * 0.15);
      p.atkAnim = 0.22;
      p.lastCombat = 0;
      p.face = Math.abs(m.x - p.px) > Math.abs(m.y - p.py) ? (m.x > p.px ? 1 : 3) : (m.y > p.py ? 2 : 0);
      p.target = m;
      G.S.target = m;

      if (p.job === 2) {
        // 法师普攻：魔法弹
        const dmg = G.Dmg.calcMagic(st.mag, 0.85, m.def.mdef, st.acc, m.def.agi, st.dodgeP);
        G.Projectile.spawn(p, m, {
          kind: 'magic', color: '#8f7bff', speed: 420, dmg: dmg, tag: '普攻'
        });
        G.Audio.play('cast');
      } else if (p.job === 3) {
        // 道士普攻：攻击 + 道术×0.5（物理）
        const atkR = [st.atk[0] + st.tao[0] * 0.5, st.atk[1] + st.tao[1] * 0.5];
        const dmg = G.Dmg.calcPhysical(atkR, m.def.def, st.acc, m.def.agi, st.dodgeP);
        G.Dmg.hitMonster(m, dmg, '#ffe9b0');
        if (!dmg.miss) G.Dmg.tryPara(m, st);
        G.Audio.play('hit');
      } else {
        const dmg = G.Dmg.calcPhysical(st.atk, m.def.def, st.acc, m.def.agi, st.dodgeP);
        G.Dmg.hitMonster(m, dmg, '#ffffff');
        if (!dmg.miss) G.Dmg.tryPara(m, st);
        G.Audio.play('hit');
      }
    },

    gainExp: function (p, amount) {
      if (!amount) return;
      p.exp += amount;
      let leveled = false;
      while (p.level < G.CFG.LEVEL_CAP && p.exp >= G.U.needExp(p.level)) {
        p.exp -= G.U.needExp(p.level);
        G.Player.levelUp(p);
        leveled = true;
      }
      if (p.level >= G.CFG.LEVEL_CAP) p.exp = Math.min(p.exp, G.U.needExp(G.CFG.LEVEL_CAP));
      if (leveled) {
        G.UI.refreshQuestHud();
        if (G.Panel.isOpen('character')) G.PageCharacter.render();
        if (G.Panel.isOpen('skill')) G.PageSkill.render();
        G.State.save(true);   // 升级后自动存档
      }
    },

    levelUp: function (p) {
      p.level += 1;
      p.points += 2;
      const after = G.Equip.stats(p);
      // V0.2.01：升级后生命/魔法回满
      p.hp = after.hpMax;
      p.mp = after.mpMax;
      G.Audio.play('level');
      G.Projectile.float(p.px, p.py - 44, '升级！', '#ffd75e');
      G.UI.log('升级！当前等级 Lv.' + p.level + '（获得 2 点属性点）', 'good');
      // 自动学习技能
      G.Skills.checkLearn(p);
      if (p.level >= G.CFG.LEVEL_CAP) G.UI.log('已达到本版本等级上限 Lv.' + G.CFG.LEVEL_CAP, 'sys');
    },

    takeDamage: function (p, dmg, from) {
      if (!p || p.dead) return;
      if (G.S.debug.invincible) { G.Projectile.float(p.px, p.py - 30, '无敌', '#7cfc7c'); return; }
      // V0.2 护盾减伤（魔法盾 / 幽灵盾）
      let reduce = 0;
      (p.buffs || []).forEach(function (b) {
        if ((b.type === 'shield' || b.type === 'ghost') && b.val) reduce += b.val;
      });
      if (reduce > 0) dmg = Math.max(1, Math.round(dmg * (1 - Math.min(0.6, reduce))));
      p.hp -= dmg;
      p.lastCombat = 0;
      G.Projectile.float(p.px + G.U.rf(-8, 8), p.py - 28, '-' + dmg, '#ff7a6a');
      G.Audio.play('hurt');
      G.Camera.shakeIt(3);
      if (p.hp <= 0) {
        p.hp = 0;
        G.Player.die(p);
      }
    },

    die: function (p) {
      if (p.dead) return;
      p.dead = true;
      p.path = [];
      p.buffs = [];
      p.stats.deaths += 1;
      G.S.mode = 'dead';
      G.Audio.play('die');
      G.UI.log('你被击败了……', 'warn');
      G.Game.showDeath();
    },

    revive: function (p, town) {
      const st = G.Equip.stats(p);
      p.dead = false;
      p.hp = Math.max(1, Math.round(st.hpMax * 0.5));
      p.mp = Math.max(0, Math.round(st.mpMax * 0.5));
      p.buffs = [];
      p.path = [];
      G.S.mode = 'play';
      if (town) {
        G.Game.enterMap(G.CFG.START_MAP, G.CFG.START_TX, G.CFG.START_TY, '你在海曦村复活');
      } else {
        const lost = Math.floor(p.gold * 0.1);
        p.gold -= lost;
        G.UI.log('原地复活，损失 ' + lost + ' 金币', 'warn');
        G.Game.closeOverlay();
      }
    },

    addPoint: function (p, stat) {
      if (p.points <= 0) { G.UI.toast('没有可分配的属性点', 'warn'); return; }
      const a = p.alloc[stat];
      if (!a) { G.UI.toast('该属性不可加点', 'warn'); return; }
      if (a[0] < a[1] * 0.3) a[0] += 1;
      else a[1] += 1;
      p.points -= 1;
      G.Audio.play('ui');
      if (G.Panel.isOpen('character')) G.PageCharacter.render();
    }
  };
})();
