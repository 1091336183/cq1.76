/* ===== A* 寻路（8 方向，禁止穿墙角） ===== */
(function () {
  const DIRS = [
    [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
    [1, 1, 1.4142], [1, -1, 1.4142], [-1, 1, 1.4142], [-1, -1, 1.4142]
  ];

  function walkable(grid, w, h, x, y) {
    return x >= 0 && y >= 0 && x < w && y < h && grid[y][x] === 0;
  }

  function nearestWalkable(grid, w, h, tx, ty, sx, sy) {
    if (walkable(grid, w, h, tx, ty)) return { x: tx, y: ty };
    for (let r = 1; r <= 4; r++) {
      let best = null, bestD = 1e9;
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          const x = tx + dx, y = ty + dy;
          if (!walkable(grid, w, h, x, y)) continue;
          const d = (x - sx) * (x - sx) + (y - sy) * (y - sy);
          if (d < bestD) { bestD = d; best = { x: x, y: y }; }
        }
      }
      if (best) return best;
    }
    return null;
  }

  G.Path = {
    walkable: function (grid, w, h, x, y) { return walkable(grid, w, h, x, y); },

    find: function (grid, w, h, sx, sy, tx, ty) {
      sx = Math.round(sx); sy = Math.round(sy);
      tx = Math.round(tx); ty = Math.round(ty);
      if (!walkable(grid, w, h, sx, sy)) return null;
      const goal = nearestWalkable(grid, w, h, tx, ty, sx, sy);
      if (!goal) return null;
      tx = goal.x; ty = goal.y;
      if (sx === tx && sy === ty) return [];

      const size = w * h;
      const gScore = new Float32Array(size).fill(Infinity);
      const fScore = new Float32Array(size).fill(Infinity);
      const came = new Int32Array(size).fill(-1);
      const closed = new Uint8Array(size);
      const open = [];
      const startIdx = sy * w + sx;
      const goalIdx = ty * w + tx;
      gScore[startIdx] = 0;
      fScore[startIdx] = Math.hypot(tx - sx, ty - sy);
      open.push(startIdx);

      let iter = 0;
      while (open.length && iter++ < 6000) {
        // 取 f 最小
        let bi = 0;
        for (let i = 1; i < open.length; i++) if (fScore[open[i]] < fScore[open[bi]]) bi = i;
        const cur = open.splice(bi, 1)[0];
        if (cur === goalIdx) {
          const path = [];
          let n = cur;
          while (n !== startIdx && n !== -1) {
            path.push({ x: n % w, y: Math.floor(n / w) });
            n = came[n];
          }
          path.reverse();
          return path;
        }
        closed[cur] = 1;
        const cx = cur % w, cy = Math.floor(cur / w);
        for (let i = 0; i < DIRS.length; i++) {
          const dx = DIRS[i][0], dy = DIRS[i][1], cost = DIRS[i][2];
          const nx = cx + dx, ny = cy + dy;
          if (!walkable(grid, w, h, nx, ny)) continue;
          if (dx !== 0 && dy !== 0) {
            if (!walkable(grid, w, h, cx + dx, cy) || !walkable(grid, w, h, cx, cy + dy)) continue;
          }
          const ni = ny * w + nx;
          if (closed[ni]) continue;
          const ng = gScore[cur] + cost;
          if (ng < gScore[ni]) {
            gScore[ni] = ng;
            came[ni] = cur;
            fScore[ni] = ng + Math.hypot(tx - nx, ty - ny);
            if (open.indexOf(ni) < 0) open.push(ni);
          }
        }
      }
      return null;
    }
  };
})();
