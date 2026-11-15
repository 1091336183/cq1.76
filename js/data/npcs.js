/* ===== NPC 与商店（V0.1） ===== */
(function () {
  G.NPCS = {
    npc_cunzhang: {
      id: 'npc_cunzhang', name: '海曦村长', color: '#c8b06a', kind: 'elder',
      lines: {
        default: ['最近村子北边不太平，甲壳虫和鹿群都躁动起来了。', '若你愿意帮忙，去村北清理一些甲壳虫吧。'],
        step0: ['年轻人，你终于来了。', '村北的甲壳虫泛滥成灾，已经有村民受伤了。', '去村北消灭 5 只甲壳虫，回来后我再告诉你更多。']
      }
    },
    npc_lingyunzi: {
      id: 'npc_lingyunzi', name: '凌云子', color: '#8fa8d8', kind: 'monk',
      lines: {
        default: ['修行之路，在于坚持。'],
        step4: ['你回来了。墓地尸王已除，海曦村暂时安宁了。', '这只是开始，真正的考验还在远方。']
      }
    },
    npc_zahuoshang: {
      id: 'npc_zahuoshang', name: '杂货商', color: '#b08a4a', kind: 'merchant',
      shop: 'shop_general',
      lines: {
        default: ['客官看看，兵器、衣服、药水都有。', '本小利薄，概不赊账。']
      }
    },
    npc_yaoshang: {
      id: 'npc_yaoshang', name: '药商', color: '#7fae7f', kind: 'merchant',
      shop: 'shop_potion',
      lines: {
        default: ['金疮药、魔法药，出门必备。', '受伤了记得先喝药，别硬撑。']
      }
    }
  };

  G.SHOPS = {
    shop_general: {
      name: '杂货商',
      items: [
        'c_hp1', 'c_hp2', 'c_hp3', 'c_mp1', 'c_mp2', 'c_mp3', 'c_huicheng',
        'w_qidao', 'a_mofachangpao', 'a_daoshichangpao',
        'h_hongying', 'h_fenmu', 'n_canque', 'b_qingling', 'r_xiao'
      ]
    },
    shop_potion: {
      name: '药商',
      items: ['c_hp1', 'c_hp2', 'c_hp3', 'c_mp1', 'c_mp2', 'c_mp3', 'c_huicheng']
    }
  };

  G.npcDef = function (id) { return G.NPCS[id] || null; };
  G.shopDef = function (id) { return G.SHOPS[id] || null; };
})();
