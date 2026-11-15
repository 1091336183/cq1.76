/* ===== 弹道与飘字 ===== */
(function () {
  G.Projectile = {
    spawn: function (from, target, opt) {
      const ang = Math.atan2(target.y - from.py, target.x - from.px);
      G.S.projectiles.push({
        x: from.px, y: from.py - 18,
        target: target,
        tx: target.x, ty: target.y - 12,
        vx: Math.cos(ang) * (opt.speed || 400),
        vy: Math.sin(ang) * (opt.speed || 400),
        dmg: opt.dmg,
        kind: opt.kind || 'magic',
        color: opt.color || '#9f7bff',
        life: 2.2,
        tag: opt.tag || ''
      });
    },

    spawnAt: function (tx, ty, opt) {
      G.S.projectiles.push({
        x: tx, y: ty,
        target: null, tx: tx, ty: ty,
        vx: 0, vy: 0,
        dmg: opt.dmg,
        kind: opt.kind || 'magic',
        color: opt.color || '#9f7bff',
        life: opt.life || 0.5,
        tag: opt.tag || ''
      });
    },

    float: function (x, y, text, color) {
      G.S.floats.push({ x: x, y: y, text: text, color: color || '#fff', life: 0.95, vy: -42 });
    },

    update: function (dt) {
      // 弹道
      for (let i = G.S.projectiles.length - 1; i >= 0; i--) {
        const pr = G.S.projectiles[i];
        pr.life -= dt;
        if (pr.life <= 0) { G.S.projectiles.splice(i, 1); continue; }
        if (!pr.target) { pr.x = pr.tx; pr.y = pr.ty; continue; }
        if (pr.target.hp <= 0) {
          // 目标已死：继续飞向最后位置然后消失
          pr.target = null;
          continue;
        }
        const dx = pr.target.x - pr.x;
        const dy = (pr.target.y - 14) - pr.y;
        const d = Math.hypot(dx, dy);
        if (d <= 16) {
          G.Dmg.hitMonster(pr.target, pr.dmg, pr.color);
          G.S.projectiles.splice(i, 1);
          continue;
        }
        const sp = Math.hypot(pr.vx, pr.vy);
        pr.vx = dx / d * sp;
        pr.vy = dy / d * sp;
        pr.x += pr.vx * dt;
        pr.y += pr.vy * dt;
      }
      // 飘字
      for (let i = G.S.floats.length - 1; i >= 0; i--) {
        const f = G.S.floats[i];
        f.life -= dt;
        f.y += f.vy * dt;
        if (f.life <= 0) G.S.floats.splice(i, 1);
      }
    }
  };
})();
