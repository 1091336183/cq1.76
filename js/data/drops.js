/* ===== 掉落表（V0.1，逐条照抄数据文档：每个掉落项独立 1/N 判定） ===== */
(function () {
  function d(item, n, qty) { return { item: item, n: n, qty: qty || 1 }; }

  function bugCommon(hp, mp, herb, sword, wand, ring, back, nSword, nWand, nRing) {
    return [
      d(hp, 15), d(mp, 15), d(herb, 30),
      d(sword, nSword), d(wand, nWand), d(ring, nRing), d(back, 20)
    ];
  }

  G.DROPS = {
    '甲壳虫': bugCommon('c_hp1', 'c_mp1', 'm_hexiancao', 'w_mujian', 'w_wumujian', 'r_shengtie', 'c_huicheng', 15, 20, 15),
    '甲壳虫-剧毒': bugCommon('c_hp1', 'c_mp1', 'm_hexiancao', 'w_mujian', 'w_wumujian', 'r_shengtie', 'c_huicheng', 15, 20, 15),
    '甲壳虫-幻影': bugCommon('c_hp1', 'c_mp1', 'm_hexiancao', 'w_mujian', 'w_wumujian', 'r_shengtie', 'c_huicheng', 6, 6, 6),
    '甲壳虫-精英': bugCommon('c_hp1', 'c_mp1', 'm_hexiancao', 'w_mujian', 'w_wumujian', 'r_shengtie', 'c_huicheng', 15, 20, 15),

    '尖头甲虫': bugCommon('c_hp1', 'c_mp1', 'm_hexiancao', 'w_mujian', 'w_wumujian', 'r_shengtie', 'c_huicheng', 15, 20, 15),
    '尖头甲虫-剧毒': bugCommon('c_hp1', 'c_mp1', 'm_hexiancao', 'w_mujian', 'w_wumujian', 'r_shengtie', 'c_huicheng', 15, 20, 15),
    '尖头甲虫-幻影': bugCommon('c_hp1', 'c_mp1', 'm_hexiancao', 'w_mujian', 'w_wumujian', 'r_shengtie', 'c_huicheng', 6, 6, 6),
    '尖头甲虫-精英': bugCommon('c_hp1', 'c_mp1', 'm_hexiancao', 'w_mujian', 'w_wumujian', 'r_shengtie', 'c_huicheng', 15, 20, 15),

    '鹿': [
      d('c_hp1', 15), d('c_mp1', 15), d('m_lurou', 10), d('m_lurong', 30),
      d('a_buyi', 15), d('s_caoxie', 15), d('d_xiaomu', 15), d('c_huicheng', 20)
    ],
    '鹿-剧毒': [
      d('c_hp1', 15), d('c_mp1', 15), d('m_lurou', 10), d('m_lurong', 30),
      d('n_xiao', 15), d('a_buyi', 15), d('s_caoxie', 15), d('d_xiaomu', 15), d('c_huicheng', 20)
    ],
    '鹿-幻影': [
      d('c_hp1', 15), d('c_mp1', 15), d('m_lurou', 10), d('m_lurong', 30),
      d('n_xiao', 6), d('a_buyi', 6), d('s_caoxie', 6), d('d_xiaomu', 6), d('c_huicheng', 20)
    ],
    '鹿-精英': [
      d('c_hp1', 15), d('c_mp1', 15), d('m_lurou', 10), d('m_lurong', 30),
      d('n_xiao', 15), d('a_buyi', 15), d('s_caoxie', 15), d('d_xiaomu', 15), d('c_huicheng', 20)
    ],

    '稻草人': [
      d('c_hp1', 15), d('c_mp1', 15), d('w_mujian', 15), d('w_wumujian', 20),
      d('b_tie', 15), d('s_caoxie', 15), d('d_xiaomu', 15), d('m_caobang', 20), d('c_huicheng', 20)
    ],
    '稻草人-幻影': [
      d('c_hp1', 15), d('c_mp1', 15), d('w_mujian', 6), d('w_wumujian', 6),
      d('b_tie', 6), d('s_caoxie', 15), d('d_xiaomu', 15), d('m_caobang', 10), d('c_huicheng', 20)
    ],
    '稻草人-烈焰': [
      d('c_hp1', 15), d('c_mp1', 15), d('w_mujian', 15), d('w_wumujian', 20),
      d('b_tie', 15), d('s_caoxie', 15), d('d_xiaomu', 15), d('m_caobang', 20), d('c_huicheng', 20)
    ],
    '稻草人-精英': [
      d('c_hp1', 15), d('c_mp1', 15), d('w_mujian', 15), d('w_wumujian', 20),
      d('b_tie', 15), d('s_caoxie', 15), d('d_xiaomu', 15), d('m_caobang', 10), d('c_huicheng', 20)
    ],

    '飞蛾': [ d('c_hp1', 15), d('c_mp1', 15), d('n_xiao', 15) ],
    '飞蛾-幻影': [
      d('c_hp1', 15), d('c_mp1', 15), d('w_bishou', 20), d('n_xiao', 15), d('r_shengtie', 20)
    ],
    '飞蛾-烈焰': [ d('c_hp1', 15), d('c_mp1', 15), d('n_xiao', 15) ],
    '飞蛾-精英': [ d('c_hp1', 15), d('c_mp1', 15), d('n_xiao', 15) ],

    '鸡-变异': [
      d('m_jidan', 4), d('m_jindan', 12), d('m_shenmu_ji', 120), d('c_huicheng', 20)
    ],

    '墓地爬尸': [
      d('c_hp1', 15), d('c_mp1', 15), d('w_bishou', 20), d('n_xiao', 15),
      d('r_shengtie', 20), d('c_huicheng', 20)
    ],
    '墓地电尸': [
      d('c_hp1', 15), d('c_mp1', 15), d('w_bishou', 10), d('n_xiao', 15),
      d('r_shengtie', 20), d('c_huicheng', 20)
    ],
    '墓地行尸': [
      d('c_hp1', 15), d('c_mp1', 15), d('w_bishou', 20), d('n_xiao', 15),
      d('b_tie', 15), d('r_shengtie', 20), d('c_huicheng', 20)
    ],

    '甲虫王': [
      d('c_hp1', 1), d('c_mp1', 1), d('w_mujian', 5), d('w_wumujian', 5),
      d('w_bishou', 5), d('w_qingtongfu', 10), d('b_tie', 3), d('r_shengtie', 3),
      d('c_huicheng', 1)
    ],
    '墓地尸王': [
      d('c_hp1', 1, 2), d('c_mp1', 1, 2), d('w_bishou', 3), d('w_qingtongfu', 10),
      d('w_haihun', 10), d('w_yinshe', 10), d('a_liangongfu', 10), d('b_tie', 2),
      d('r_shengtie', 2), d('s_buxie', 10), d('c_huicheng', 1)
    ]
  };

  G.getDrops = function (name) { return G.DROPS[name] || []; };
})();
