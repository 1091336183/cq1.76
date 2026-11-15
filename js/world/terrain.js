/* ===== 地形生成（程序化，无图片素材） ===== */
(function () {
  const PAL = {
    village: {
      base: ['#4f7040', '#557745', '#4a6b3a', '#587b47'],
      road: ['#8a7550', '#816d49', '#93805a'],
      tree: '#2c4522', tree2: '#37552b', rock: '#6f695b', water: '#2b5069'
    },
    grass: {
      base: ['#45663a', '#4c6d3f', '#3f6034', '#527345'],
      road: ['#6d5c3c', '#655437', '#756442'],
      tree: '#27401f', tree2: '#33502a', rock: '#6b6558', water: '#2a4f6b'
    },
    forest: {
      base: ['#2f4a2b', '#344f2e', '#2a4326', '#3a5533'],
      road: ['#4a3f28', '#443923', '#524730'],
      tree: '#1c2f17', tree2: '#26401f', rock: '#5a564a', water: '#25455c'
    },
    coast: {
      base: ['#c2b183', '#c8b78a', '#baa97c', '#cfbe93'],
      road: ['#a89466', '#9e8b5f', '#b29e70'],
      tree: '#3f5c32', tree2: '#4b6a3b', rock: '#8a8272', water: '#2a5470'
    },
    cemetery: {
      base: ['#4a5140', '#505744', '#444b3b', '#565d49'],
      road: ['#55503f', '#4d4938', '#5d5846'],
      tree: '#2b3324', tree2: '#36402c', rock: '#6a6a62', water: '#2a4457'
    },
    // V0.2 新增地形
    town: {
      base: ['#6a6558', '#716c5e', '#635e51', '#787264'],
      road: ['#8f8468', '#877c60', '#9a8f73'],
      tree: '#3d5130', tree2: '#4a6039', rock: '#7d776a', water: '#2f536b'
    },
    swamp: {
      base: ['#3c4a2e', '#354328', '#445234', '#2f3d24'],
      road: ['#5a5236', '#524a30', '#625a3d'],
      tree: '#22301c', tree2: '#2d3f24', rock: '#5c5f4c', water: '#2e4a3d'
    },
    cave: {
      base: ['#3b342c', '#423a31', '#352f28', '#484037'],
      road: ['#514738', '#4a4133', '#584d3d'],
      tree: '#2a241e', tree2: '#332c24', rock: '#6b6154', water: '#243f46'
    }
  };

  function flood(grid, w, h, sx, sy) {
    const seen = [];
    for (let y = 0; y < h; y++) seen.push(new Uint8Array(w));
    if (grid[sy][sx] === 1) return seen;
    const stack = [[sx, sy]];
    seen[sy][sx] = 1;
    while (stack.length) {
      const p = stack.pop();
      const x = p[0], y = p[1];
      const nb = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (let i = 0; i < nb.length; i++) {
        const nx = nb[i][0], ny = nb[i][1];
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (seen[ny][nx] || grid[ny][nx] === 1) continue;
        seen[ny][nx] = 1;
        stack.push([nx, ny]);
      }
    }
    return seen;
  }

  function carveLine(grid, ax, ay, bx, by) {
    let x = ax, y = ay;
    while (x !== bx) { grid[y][x] = 0; x += (bx > x ? 1 : -1); }
    while (y !== by) { grid[y][x] = 0; y += (by > y ? 1 : -1); }
    grid[by][bx] = 0;
  }

  G.Terrain = {
    build: function (mapDef) {
      const w = mapDef.w, h = mapDef.h, T = G.CFG.TILE;
      const rand = G.U.rng(G.U.hash(mapDef.id + '|' + (mapDef.terrain || '')));
      const pal = PAL[mapDef.terrain] || PAL.grass;
      const grid = [], tileType = [], deco = [];

      for (let y = 0; y < h; y++) {
        grid.push(new Uint8Array(w));
        tileType.push([]);
        for (let x = 0; x < w; x++) {
          const road = (x >= 22 && x <= 25) || (y >= 16 && y <= 19);
          tileType[y][x] = road ? 'road' : 'base';
        }
      }

      // 障碍密度
      const DENSITY = {
        village: 0.055, grass: 0.10, forest: 0.16, coast: 0.085, cemetery: 0.09,
        town: 0.05, swamp: 0.135, cave: 0.12
      };
      const dens = DENSITY[mapDef.terrain] || 0.1;

      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          if (tileType[y][x] === 'road') continue;
          if (rand() < dens) {
            grid[y][x] = 1;
            let type = 'tree';
            if (mapDef.terrain === 'cemetery') type = 'tomb';
            else if (mapDef.terrain === 'coast') type = rand() < 0.55 ? 'water' : 'rock';
            else if (mapDef.terrain === 'village') type = rand() < 0.5 ? 'tree' : 'fence';
            else if (mapDef.terrain === 'forest') type = 'tree';
            else if (mapDef.terrain === 'town') type = rand() < 0.5 ? 'fence' : 'rock';
            else if (mapDef.terrain === 'swamp') type = rand() < 0.45 ? 'water' : 'tree';
            else if (mapDef.terrain === 'cave') type = rand() < 0.75 ? 'rock' : 'tomb';
            else type = rand() < 0.7 ? 'tree' : 'rock';
            deco.push({ x: x, y: y, type: type, seed: rand() });
          }
        }
      }

      // 关键点（传送、NPC、BOSS、刷怪区中心）清空
      const keys = [];
      (mapDef.ports || []).forEach(function (p) { keys.push({ x: p.x, y: p.y, r: 2 }); });
      (mapDef.npcs || []).forEach(function (n) { keys.push({ x: n.x, y: n.y, r: 2 }); });
      if (mapDef.boss) keys.push({ x: mapDef.boss.x, y: mapDef.boss.y, r: 3 });
      if (mapDef.boss2) keys.push({ x: mapDef.boss2.x, y: mapDef.boss2.y, r: 3 });
      (mapDef.spawns || []).forEach(function (s) {
        keys.push({ x: s.area[0] + Math.floor(s.area[2] / 2), y: s.area[1] + Math.floor(s.area[3] / 2), r: 2 });
      });
      keys.forEach(function (k) {
        for (let dy = -k.r; dy <= k.r; dy++) {
          for (let dx = -k.r; dx <= k.r; dx++) {
            const x = k.x + dx, y = k.y + dy;
            if (x < 0 || y < 0 || x >= w || y >= h) continue;
            grid[y][x] = 0;
          }
        }
      });
      // 清掉被清空区域里的装饰
      for (let i = deco.length - 1; i >= 0; i--) {
        if (grid[deco[i].y][deco[i].x] === 0) deco.splice(i, 1);
      }

      // 连通性：从中心向各关键点开路
      const center = { x: 24, y: 18 };
      let reach = flood(grid, w, h, center.x, center.y);
      keys.forEach(function (k) {
        if (!reach[k.y] || !reach[k.y][k.x]) {
          carveLine(grid, k.x, k.y, center.x, center.y);
          reach = flood(grid, w, h, center.x, center.y);
        }
      });

      // 可达格子列表
      const walkList = [];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (grid[y][x] === 0 && reach[y][x]) walkList.push({ x: x, y: y });
        }
      }

      // 渲染到离屏 canvas
      const canvas = document.createElement('canvas');
      canvas.width = w * T;
      canvas.height = h * T;
      const c = canvas.getContext('2d');
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const road = tileType[y][x] === 'road';
          const arr = road ? pal.road : pal.base;
          const col = arr[Math.floor(rand() * arr.length)];
          c.fillStyle = col;
          c.fillRect(x * T, y * T, T, T);
          // 细碎纹理
          if (!road && rand() < 0.22) {
            c.fillStyle = 'rgba(0,0,0,.07)';
            c.fillRect(x * T + Math.floor(rand() * 24) + 2, y * T + Math.floor(rand() * 24) + 2, 4, 2);
          }
          if (road && rand() < 0.18) {
            c.fillStyle = 'rgba(255,240,200,.10)';
            c.fillRect(x * T + Math.floor(rand() * 22) + 4, y * T + Math.floor(rand() * 22) + 4, 3, 2);
          }
        }
      }

      // 障碍装饰
      deco.forEach(function (d) {
        const px = d.x * T, py = d.y * T;
        if (d.type === 'tree') {
          c.fillStyle = 'rgba(0,0,0,.22)';
          c.beginPath(); c.ellipse(px + 16, py + 28, 12, 5, 0, 0, Math.PI * 2); c.fill();
          c.fillStyle = '#4a3520';
          c.fillRect(px + 14, py + 18, 4, 11);
          c.fillStyle = pal.tree;
          c.beginPath(); c.arc(px + 16, py + 15, 12, 0, Math.PI * 2); c.fill();
          c.fillStyle = pal.tree2;
          c.beginPath(); c.arc(px + 11, py + 11, 7, 0, Math.PI * 2); c.fill();
          c.beginPath(); c.arc(px + 22, py + 17, 6, 0, Math.PI * 2); c.fill();
        } else if (d.type === 'rock') {
          c.fillStyle = 'rgba(0,0,0,.2)';
          c.beginPath(); c.ellipse(px + 16, py + 27, 11, 4, 0, 0, Math.PI * 2); c.fill();
          c.fillStyle = pal.rock;
          c.beginPath();
          c.moveTo(px + 6, py + 26); c.lineTo(px + 10, py + 12); c.lineTo(px + 19, py + 8);
          c.lineTo(px + 27, py + 17); c.lineTo(px + 25, py + 26); c.closePath(); c.fill();
          c.fillStyle = 'rgba(255,255,255,.12)';
          c.beginPath(); c.moveTo(px + 10, py + 12); c.lineTo(px + 19, py + 8); c.lineTo(px + 20, py + 16); c.closePath(); c.fill();
        } else if (d.type === 'tomb') {
          c.fillStyle = 'rgba(0,0,0,.22)';
          c.beginPath(); c.ellipse(px + 16, py + 27, 10, 4, 0, 0, Math.PI * 2); c.fill();
          c.fillStyle = '#8a8a80';
          c.fillRect(px + 9, py + 10, 14, 17);
          c.beginPath(); c.arc(px + 16, py + 10, 7, Math.PI, 0); c.fill();
          c.fillStyle = '#5d5d55';
          c.fillRect(px + 15, py + 7, 2, 12);
          c.fillRect(px + 11, py + 11, 10, 2);
        } else if (d.type === 'water') {
          c.fillStyle = pal.water;
          c.fillRect(px, py, T, T);
          c.strokeStyle = 'rgba(180,220,255,.28)';
          c.lineWidth = 1;
          for (let i = 0; i < 2; i++) {
            c.beginPath();
            c.moveTo(px + 3, py + 9 + i * 11);
            c.quadraticCurveTo(px + 12, py + 5 + i * 11, px + 22, py + 9 + i * 11);
            c.quadraticCurveTo(px + 27, py + 11 + i * 11, px + 30, py + 9 + i * 11);
            c.stroke();
          }
        } else if (d.type === 'fence') {
          c.fillStyle = '#6b4f2a';
          c.fillRect(px + 4, py + 10, 3, 16);
          c.fillRect(px + 15, py + 8, 3, 18);
          c.fillRect(px + 26, py + 10, 3, 16);
          c.fillRect(px + 3, py + 13, 27, 2);
        }
      });

      return {
        grid: grid,
        tileType: tileType,
        canvas: canvas,
        walkList: walkList,
        reach: reach,
        isWalk: function (gx, gy) {
          return gx >= 0 && gy >= 0 && gx < w && gy < h && grid[gy][gx] === 0;
        },
        spawnTiles: function (area, count) {
          const pool = walkList.filter(function (p) {
            return p.x >= area[0] && p.x < area[0] + area[2] &&
                   p.y >= area[1] && p.y < area[1] + area[3];
          });
          G.U.shuffle(pool, rand);
          const out = pool.slice(0, count);
          if (out.length < count) {
            const extra = G.U.shuffle(walkList.slice(), rand);
            for (let i = 0; i < extra.length && out.length < count; i++) out.push(extra[i]);
          }
          return out;
        }
      };
    }
  };
})();
