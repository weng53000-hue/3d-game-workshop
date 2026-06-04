'use client'
import { useState, useRef } from "react";

// ══════════════════════════════════════════════════════════════════════════════
// SECTION A：8 種 2D / 2.5D 網頁遊戲（Phaser 3 + React）
// ══════════════════════════════════════════════════════════════════════════════
const GAMES_2D = [
  { id:"platformer",      emoji:"🏃", name:"平台跑酷",    tagline:"像瑪利歐，跳躍躲障礙到終點",      controls:"← → 移動  空白鍵跳躍",  win:"到達終點旗幟",  color:"#e74c3c", diff:"⭐ 新手",    diffColor:"#27ae60", features:["重力物理","多關卡","計分","道具"] },
  { id:"topdown_shooter", emoji:"🔫", name:"俯視角射擊",  tagline:"從上往下看，射擊怪物收集道具",    controls:"WASD移動  滑鼠射擊",    win:"擊敗所有波次", color:"#8e44ad", diff:"⭐⭐ 一般",  diffColor:"#e67e22", features:["8方向移動","波次敵人","Boss戰","HP系統"] },
  { id:"maze",            emoji:"🌀", name:"迷宮解謎",    tagline:"在迷宮裡找鑰匙、解機關、找出口",  controls:"WASD 移動",              win:"集齊鑰匙逃脫", color:"#16a085", diff:"⭐⭐ 一般",  diffColor:"#e67e22", features:["程序迷宮","鑰匙機關","計時","多層"] },
  { id:"breakout",        emoji:"🧱", name:"打磚塊",      tagline:"反彈球打掉所有磚塊過關",          controls:"← → 方向鍵 / 滑鼠",    win:"清除所有磚塊", color:"#d35400", diff:"⭐ 新手",    diffColor:"#27ae60", features:["物理彈射","道具掉落","速度加快","多關卡"] },
  { id:"endless_runner",  emoji:"🏄", name:"無盡跑者",    tagline:"自動前衝，閃躲障礙，撐越久分越高",controls:"空白鍵跳  下鍵滑行",   win:"高分挑戰",     color:"#2980b9", diff:"⭐ 新手",    diffColor:"#27ae60", features:["無盡生成","速度遞增","高分榜","雙段跳"] },
  { id:"tower_defense",   emoji:"🏰", name:"塔防遊戲",    tagline:"放塔阻擋敵人，守護基地不被攻破",  controls:"滑鼠點擊放塔",          win:"敵人全波擊退", color:"#27ae60", diff:"⭐⭐⭐ 進階", diffColor:"#c0392b", features:["路徑尋路","多種塔型","升級系統","波次管理"] },
  { id:"memory_match",    emoji:"🃏", name:"記憶翻牌",    tagline:"翻開卡片配對，照片直接變牌面！",  controls:"滑鼠點擊翻牌",          win:"時間內完成配對",color:"#f39c12", diff:"⭐ 新手",    diffColor:"#27ae60", features:["圖片卡片","計時","難度選擇","最佳紀錄"] },
  { id:"snake_evolution", emoji:"🐍", name:"貪吃蛇進化版",tagline:"吃東西長大，加入傳送門與特殊道具",controls:"WASD / 方向鍵轉向",    win:"達目標長度",   color:"#1abc9c", diff:"⭐ 新手",    diffColor:"#27ae60", features:["速度道具","傳送門","障礙物","成長動畫"] },
];

// ══════════════════════════════════════════════════════════════════════════════
// SECTION B：6 種真實 3D 遊戲（React Three Fiber + Rapier 物理引擎）
// 每個都附真實 GitHub 來源，可直接 Vercel 部署
// ══════════════════════════════════════════════════════════════════════════════
// ── 皮克斯視覺風格常數（所有 3D 遊戲共用）────────────────────────────────────
const PIXAR_STYLE = {
  badge: "🎬 皮克斯／迪士尼風格",
  summary: "圓潤 Smooth Mesh · 卡通高質感材質 · 電影級軟陰影",
  rules: [
    "角色：圓潤大頭短腳比例，表面如充飽氣的氣球，無硬邊方塊感",
    "材質：次表面散射（SSS）皮膚、PVC 光澤、絨毛布料質感",
    "光影：溫暖主光 + 淡藍補光，漸層軟陰影，Fresnel 邊緣發光",
    "場景：鵝卵石圓石、棒棒糖圓頂樹、蓬鬆草地，所有邊角皆倒角磨圓",
    "❌ 禁止：Low-poly / Voxel / 積木 / Minecraft / 樂高 任何方塊外觀",
  ],
  threeJs: {
    renderer: "WebGLRenderer({ antialias: true, toneMapping: ACESFilmicToneMapping })",
    toneMappingExposure: 1.2,
    shadows: "PCFSoftShadowMap（軟陰影）",
    lights: [
      "DirectionalLight #fff8e1 intensity=2.5（溫暖主光）",
      "HemisphereLight sky=#ffe4b5 ground=#4169e1 intensity=0.8（天空補光）",
      "AmbientLight #ffeedd intensity=0.4",
    ],
    material: "MeshStandardMaterial roughness=0.35 metalness=0.05（卡通柔光質感）",
    postprocessing: ["Bloom（glow 光暈）", "SSAO（接觸陰影）", "ChromaticAberration（輕微色差）"],
  },
};

const GAMES_3D = [
  {
    id: "racing_3d",
    emoji: "🏎️",
    name: "3D 賽車競速",
    tagline: "皮克斯風格的玩具賽車！圓滾滾車身在彩色賽道上漂移飛馳",
    desc: "《汽車總動員》式的卡通賽車遊戲——車身圓潤光滑像充氣玩具，賽道鮮豔如糖果樂園，有真實物理引擎的漂移與碰撞。",
    controls: "WASD / 方向鍵 控制車輛  空白鍵 手煞車漂移",
    win: "完成圈數、最快時間",
    color: "#e74c3c",
    diff: "⭐⭐ 一般",
    diffColor: "#e67e22",
    features: ["真實車輛物理", "皮克斯圓潤車身", "糖果色賽道場景", "電影級軟陰影"],
    imageUse: "賽車車身貼圖（材質貼圖，貼在圓潤車體上）",
    stack: "React Three Fiber + Rapier 物理引擎",
    github: "https://github.com/pmndrs/racing-game",
    githubNote: "pmndrs 官方出品，CC0 素材，社群共建",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei @react-three/rapier", "npm install zustand @react-three/postprocessing"],
    preview: "https://racing.pmnd.rs/",
    docs: [
      { label: "🏎 pmndrs/racing-game GitHub", url: "https://github.com/pmndrs/racing-game" },
      { label: "📘 React Three Fiber 文件", url: "https://docs.pmnd.rs/react-three-fiber" },
      { label: "⚡ Rapier 物理引擎文件", url: "https://rapier.rs/docs/user_guides/javascript/" },
      { label: "🎮 線上試玩 Demo", url: "https://racing.pmnd.rs/" },
    ],
  },
  {
    id: "fps_3d",
    emoji: "🎯",
    name: "3D 卡通射擊",
    tagline: "像《玩具總動員》裡的玩具大戰！圓潤玩具角色互射泡泡彈",
    desc: "皮克斯風格的第一人稱卡通射擊——角色是充氣感的玩具士兵，武器射出彩色泡泡彈，場景是圓潤柔軟的玩具房間。",
    controls: "WASD 移動  滑鼠瞄準  左鍵射擊  Space 跳躍",
    win: "擊倒所有敵人玩具",
    color: "#c0392b",
    diff: "⭐⭐⭐ 進階",
    diffColor: "#c0392b",
    features: ["FPS 視角", "圓潤玩具角色", "彩色泡泡彈道", "卡通爆炸特效"],
    imageUse: "玩家頭像（貼在 FPS HUD 或角色臉部）",
    stack: "React Three Fiber + Rapier + ecctrl",
    github: "https://github.com/pmndrs/ecctrl",
    githubNote: "ecctrl 角色控制器，整合 Rapier 物理引擎",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei @react-three/rapier", "npm install ecctrl zustand @react-three/postprocessing"],
    preview: "https://github.com/pmndrs/ecctrl",
    docs: [
      { label: "🕹 ecctrl 角色控制器", url: "https://github.com/pmndrs/ecctrl" },
      { label: "📘 React Three Fiber 文件", url: "https://docs.pmnd.rs/react-three-fiber" },
      { label: "⚡ Rapier 物理引擎", url: "https://rapier.rs/" },
      { label: "✨ Postprocessing 特效", url: "https://github.com/pmndrs/postprocessing" },
    ],
  },
  {
    id: "marble_3d",
    emoji: "⚽",
    name: "3D 滾球闖關",
    tagline: "像《怪獸電力公司》裡的彩色毛球！在圓潤糖果平台上滾動冒險",
    desc: "皮克斯風格的滾球遊戲——球體表面是你上傳的照片，平台像是巨大的棉花糖積木（圓角無硬邊），背景是夢幻雲朵天空。",
    controls: "WASD / 方向鍵 控制滾動方向",
    win: "球安全滾到終點平台",
    color: "#9b59b6",
    diff: "⭐ 新手",
    diffColor: "#27ae60",
    features: ["真實滾球物理", "照片貼球體表面", "圓潤糖果平台", "夢幻雲朵場景"],
    imageUse: "球體表面貼圖（你的照片會包覆在圓球上，像個人化玩具球！）",
    stack: "React Three Fiber + Rapier + Drei",
    github: "https://github.com/pmndrs/react-three-rapier",
    githubNote: "pmndrs 出品 Rapier 物理套件，含 marble race 範例",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei", "npm install @react-three/rapier zustand @react-three/postprocessing"],
    preview: "https://github.com/pmndrs/react-three-rapier",
    docs: [
      { label: "⚽ react-three-rapier GitHub", url: "https://github.com/pmndrs/react-three-rapier" },
      { label: "📘 Rapier 物理引擎", url: "https://rapier.rs/" },
      { label: "🌐 Drei 輔助元件", url: "https://github.com/pmndrs/drei" },
      { label: "✨ Postprocessing 特效", url: "https://github.com/pmndrs/postprocessing" },
    ],
  },
  {
    id: "platformer_3d",
    emoji: "🗺️",
    name: "3D 卡通冒險",
    tagline: "像《超人特攻隊》裡的角色！在圓潤彩色世界裡跑跳收集寶物",
    desc: "皮克斯風格的 3D 跑跳冒險——主角是大眼圓潤的卡通人物，場景是彩色鮮豔的糖果世界，每個物件都有果凍般的彈性感。",
    controls: "WASD 移動  Space 跳躍  Shift 衝刺",
    win: "收集所有閃亮寶物並到達終點",
    color: "#27ae60",
    diff: "⭐⭐ 一般",
    diffColor: "#e67e22",
    features: ["圓潤卡通角色", "彈性果凍物理", "鮮豔糖果場景", "收集系統"],
    imageUse: "角色臉部貼圖（貼在圓潤卡通人物的臉上）",
    stack: "React Three Fiber + ecctrl + Rapier",
    github: "https://github.com/pmndrs/ecctrl",
    githubNote: "pmndrs 出品角色控制器，直接整合物理引擎",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei", "npm install ecctrl @react-three/rapier zustand @react-three/postprocessing"],
    preview: "https://github.com/pmndrs/ecctrl",
    docs: [
      { label: "🗺 ecctrl 角色控制器", url: "https://github.com/pmndrs/ecctrl" },
      { label: "📘 React Three Fiber", url: "https://docs.pmnd.rs/react-three-fiber" },
      { label: "⚡ Rapier 物理引擎", url: "https://rapier.rs/" },
      { label: "🎨 Drei 場景元件", url: "https://github.com/pmndrs/drei" },
    ],
  },
  {
    id: "dungeon_3d",
    emoji: "🏯",
    name: "3D 卡通地城冒險",
    tagline: "像《勇敢傳說》的魔法城堡！可愛圓潤角色在夢幻地城打怪找寶藏",
    desc: "皮克斯風格的地城 RPG——城堡牆壁是圓弧石磚，怪物是毛茸茸或橡皮質感的可愛生物，魔法特效如彩色光球漂浮。",
    controls: "WASD 移動  Space 跳躍  左鍵 攻擊",
    win: "打敗關主可愛怪物並找到出口",
    color: "#8e44ad",
    diff: "⭐⭐⭐ 進階",
    diffColor: "#c0392b",
    features: ["皮克斯可愛怪物", "魔法彩球特效", "圓弧石磚地城", "NPC 互動對話"],
    imageUse: "主角角色臉部貼圖（大眼圓潤的卡通人物）",
    stack: "React Three Fiber + Yuka NPC AI + Rapier",
    github: "https://github.com/ssethsara/react-three-npc",
    githubNote: "Yuka.js NPC AI 系統，整合 R3F 角色尋路",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei", "npm install ecctrl @react-three/rapier zustand @react-three/postprocessing"],
    preview: "https://github.com/ssethsara/react-three-npc",
    docs: [
      { label: "🏯 react-three-npc GitHub", url: "https://github.com/ssethsara/react-three-npc" },
      { label: "🤖 Yuka.js AI 尋路", url: "https://mugen87.github.io/yuka/" },
      { label: "📘 React Three Fiber", url: "https://docs.pmnd.rs/react-three-fiber" },
      { label: "⚡ ecctrl 角色控制器", url: "https://github.com/pmndrs/ecctrl" },
    ],
  },
  {
    id: "spaceshooter_3d",
    emoji: "🚀",
    name: "3D 卡通太空冒險",
    tagline: "像《星際大戰》卡通版！圓潤玩具飛船在夢幻星空中閃避隕石射擊",
    desc: "皮克斯風格的太空射擊——飛船造型圓潤如玩具，隕石是圓滾滾的石頭球，爆炸是彩色泡泡煙火，星空背景夢幻絢麗。",
    controls: "WASD 飛行方向  滑鼠瞄準  左鍵射擊",
    win: "擊敗所有波次可愛敵艦",
    color: "#2980b9",
    diff: "⭐⭐ 一般",
    diffColor: "#e67e22",
    features: ["圓潤玩具飛船", "彩色泡泡爆炸", "夢幻星雲場景", "Bloom 光暈特效"],
    imageUse: "飛船機身貼圖（貼在圓潤玩具飛船的機身上）",
    stack: "React Three Fiber + Drei + Postprocessing",
    github: "https://github.com/pmndrs/react-three-fiber",
    githubNote: "R3F 官方生態，豐富太空場景元件與特效",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei", "npm install zustand @react-three/postprocessing"],
    preview: "https://docs.pmnd.rs/react-three-fiber",
    docs: [
      { label: "🚀 React Three Fiber GitHub", url: "https://github.com/pmndrs/react-three-fiber" },
      { label: "✨ Postprocessing 特效", url: "https://github.com/pmndrs/postprocessing" },
      { label: "📘 R3F 文件", url: "https://docs.pmnd.rs/react-three-fiber" },
      { label: "🌐 Drei 太空元件", url: "https://github.com/pmndrs/drei" },
    ],
  },
];
// ══════════════════════════════════════════════════════════════════════════════
// buildSpec：唯一產出函式，YAML + MD 合併成一份完整規格書
// AI 只需讀這一份文件就能做出完整且正確的遊戲
// ══════════════════════════════════════════════════════════════════════════════
function buildSpec(game, is3D, gameTitle, gameDesc, imageName, ai) {
  const a = ai || {};
  const slug = (gameTitle||"my-game").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"") || "my-game";
  const imgPath = imageName ? `public/assets/${imageName}` : "public/assets/player.png";
  const date = new Date().toLocaleDateString("zh-TW");
  const pkgs = is3D ? (game.install||[]) : ["npm install phaser"];

  // ── 各遊戲類型專屬詳細規格 ──────────────────────────────────────────────
  const specMap = {
    platformer: {
      yaml_gameplay: [
        `  gravity: 800`,`  jump_force: -500`,`  move_speed: 200`,`  lives: 3`,
        `  level_1_name: "${a.level1||gameDesc.slice(0,8)+" 第一關"}"`,
        `  level_2_name: "${a.level2||gameDesc.slice(0,8)+" 第二關"}"`,
        `  enemy_type: "${a.enemy||"巡邏守衛"}"`,
        `  item_name: "${a.item||"星星"}"`,
        `  item_score: 10`,`  win_condition: "reach_flag"`,`  lose_condition: "lives_zero"`,
      ],
      md_detail: `
### 場景與物理
| 參數 | 數值 |
|------|------|
| 場景尺寸 | 1280 × 360 px（橫向捲軸）|
| 重力加速度 | 800 px/s² |
| 跳躍初速度 | -500 px/s（向上）|
| 移動速度 | 200 px/s |
| 玩家生命 | 3 顆愛心 |

### 關卡設計
| 項目 | 第一關 | 第二關 |
|------|--------|--------|
| 名稱 | ${a.level1||gameDesc.slice(0,8)+" 第一關"} | ${a.level2||gameDesc.slice(0,8)+" 第二關"} |
| 平台數 | 8 個 | 12 個 |
| 敵人數 | 3 隻 | 6 隻 |
| 收集物 | 5 個 | 8 個 |

### 敵人行為
- 左右巡邏，碰牆折返
- 玩家**踩頭**：消滅敵人，得 +10 分
- 玩家**側碰**：扣 1 命，無敵 2 秒

### 圖片套用
\`\`\`typescript
// Phaser 3 — 在 preload() 中
this.load.image('player', '${imgPath}')
// 在 create() 中建立 Sprite
this.player = this.physics.add.sprite(100, 200, 'player').setScale(0.5)
\`\`\``,
    },

    topdown_shooter: {
      yaml_gameplay: [
        `  move_speed: 180`,`  bullet_speed: 400`,`  fire_rate: 0.3`,`  player_hp: 5`,
        `  wave_1_enemy: "${a.enemy1||"小怪"}"`,`  wave_1_count: 5`,
        `  wave_2_enemy: "${a.enemy2||"速度怪"}"`,`  wave_2_count: 10`,
        `  boss_name: "${a.boss||"終極Boss"}"`,`  boss_hp: 30`,
        `  map_theme: "${a.mapTheme||gameDesc.slice(0,20)}"`,`  obstacles: 15`,
      ],
      md_detail: `
### 核心數值
| 參數 | 數值 |
|------|------|
| 移動速度 | 180 px/s（8 方向）|
| 子彈速度 | 400 px/s |
| 射擊間隔 | 0.3 秒 |
| 玩家 HP | 5 格 |

### 波次設計
| 波次 | 敵人 | 數量 | 出生間隔 |
|------|------|------|---------|
| Wave 1 | ${a.enemy1||"小怪"} | 5 | 2 秒 |
| Wave 2 | ${a.enemy2||"速度怪"} | 10 | 1.5 秒 |
| Wave 3 | Boss「${a.boss||"終極Boss"}」| 1（HP×30）| — |

### 道具掉落（擊敗敵人後）
- HP 回復：10% 機率
- 速度提升：8% 機率
- 連射強化：5% 機率

### 圖片套用
\`\`\`typescript
this.load.image('player', '${imgPath}')
this.player = this.physics.add.sprite(512, 384, 'player')
// 滑鼠瞄準：旋轉角色朝向滑鼠位置
\`\`\``,
    },

    maze: {
      yaml_gameplay: [
        `  maze_width: 15`,`  maze_height: 15`,`  algorithm: "recursive_backtrack"`,
        `  time_limit: 120`,`  move_speed: 150`,
        `  key_count: ${a.keyCount||3}`,`  trap_type: "${a.trap||"尖刺"}"`,
        `  trap_count: 5`,`  trap_penalty_sec: 10`,
        `  hint_count: 3`,`  hint_radius: 3`,
        `  intro_text: "${a.mazeIntro||"你被困在迷宮裡，找到出口逃脫吧！"}"`,
        `  win_message: "${a.winMsg||"恭喜逃脫！"}"`,
      ],
      md_detail: `
### 迷宮設定
| 參數 | 數值 |
|------|------|
| 迷宮尺寸 | 15 × 15 格（每格 40 px）|
| 生成算法 | Recursive Backtracking（確保有解）|
| 時間限制 | 120 秒 |
| 移動速度 | 150 px/s |

### 道具與機關
| 道具 | 數量 | 效果 |
|------|------|------|
| 金色鑰匙 | ${a.keyCount||3} 把 | 全收集才能開出口 |
| ${a.trap||"尖刺"}陷阱 | 5 個 | 觸碰扣 10 秒時間 |
| 提示道具 | 3 個 | 點亮周圍 3 格視野 |

### 故事文字
- **開場訊息：** 「${a.mazeIntro||"你被困在迷宮裡，找到出口逃脫吧！"}」
- **過關訊息：** 「${a.winMsg||"恭喜逃脫成功！你真厲害！"}」`,
    },

    breakout: {
      yaml_gameplay: [
        `  ball_speed_init: 300`,`  ball_speed_inc: 20`,`  paddle_speed: 400`,`  lives: 3`,
        `  level_1_rows: 4`,`  level_1_cols: 8`,`  brick_theme_1: "${a.brick1||"普通磚"}"`,
        `  level_2_rows: 6`,`  level_2_cols: 10`,`  brick_theme_2: "${a.brick2||"石頭磚"}"`,
        `  level_3_rows: 8`,`  level_3_cols: 12`,`  brick_theme_3: "${a.brick3||"鋼鐵磚"}"`,
        `  special_brick: "${a.specialBrick||"爆炸磚（炸掉周圍3格）"}"`,
      ],
      md_detail: `
### 核心數值
| 參數 | 數值 |
|------|------|
| 場景 | 800 × 600 px |
| 擋板 | 寬 100 px，Y = 560 |
| 球半徑 | 8 px |
| 初始球速 | 300 px/s，每次反彈 +20 |
| 生命 | 3 顆球 |

### 關卡設計
| 關卡 | 排列 | 主題 | 特殊磚 |
|------|------|------|--------|
| Level 1 | 4×8 | ${a.brick1||"普通磚"} | 2 個 |
| Level 2 | 6×10 | ${a.brick2||"石頭磚"} | 5 個 |
| Level 3 | 8×12 | ${a.brick3||"鋼鐵磚"} | 8 個 |

**特殊磚：** ${a.specialBrick||"爆炸磚（炸掉周圍 3 格）"}

### 道具掉落
- 擴大擋板：10% / 多球：5% / 慢速球：8%

### 圖片套用
\`\`\`typescript
// 磚塊貼圖替換
this.load.image('brick', '${imgPath}')
\`\`\``,
    },

    endless_runner: {
      yaml_gameplay: [
        `  init_speed: 300`,`  speed_inc: 10`,`  speed_interval_sec: 5`,
        `  jump_force: -550`,`  double_jump: true`,`  slide_duration: 0.6`,
        `  world_theme: "${a.worldTheme||gameDesc.slice(0,15)}"`,
        `  obstacle_1: "${a.obs1||"大石頭"}"`,`  obstacle_1_action: "jump"`,
        `  obstacle_2: "${a.obs2||"低枝樹幹"}"`,`  obstacle_2_action: "slide"`,
        `  collectible: "${a.collectible||"金幣"}"`,`  collectible_score: 5`,
        `  milestone_1_score: 100`,`  milestone_1_msg: "${a.msg1||"太厲害了！繼續加油！"}"`,
        `  milestone_2_score: 500`,`  milestone_2_msg: "${a.msg2||"速度提升！小心障礙！"}"`,
      ],
      md_detail: `
### 核心數值
| 參數 | 數值 |
|------|------|
| 初始速度 | 300 px/s |
| 速度增量 | +10 每 5 秒 |
| 跳躍力道 | -550 px/s |
| 二段跳 | ✅ 支援 |
| 滑行持續 | 0.6 秒 |

### 障礙物設計
| 類型 | 高度 | 閃躲動作 |
|------|------|---------|
| ${a.obs1||"大石頭"} | 低 | 跳躍 |
| ${a.obs2||"低枝樹幹"} | 高 | 滑行 |
| ${a.obs3||"連續陷阱"} | 雙重 | 跳躍+滑行 |

### 里程碑
- **100 分：** 「${a.msg1||"太厲害了！繼續加油！"}」
- **500 分：** 「${a.msg2||"速度提升！小心障礙！"}」新障礙物登場

### 圖片套用
\`\`\`typescript
// 主角跑步動畫 Sprite Sheet（建議 4 幀 × 48px）
this.load.spritesheet('player', '${imgPath}', { frameWidth: 48, frameHeight: 48 })
this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('player', { start:0, end:3 }), frameRate: 10, repeat: -1 })
\`\`\``,
    },

    tower_defense: {
      yaml_gameplay: [
        `  start_gold: 150`,`  gold_per_kill: 10`,`  base_hp: 20`,`  total_waves: 10`,
        `  map_theme: "${a.mapTheme||gameDesc.slice(0,20)}"`,
        `  tower_1_name: "${a.tower1||"基礎箭塔"}"`,`  tower_1_cost: 50`,`  tower_1_dmg: 10`,`  tower_1_range: 150`,
        `  tower_2_name: "${a.tower2||"狙擊塔"}"`,`  tower_2_cost: 100`,`  tower_2_dmg: 40`,`  tower_2_range: 300`,
        `  tower_3_name: "${a.tower3||"火焰塔"}"`,`  tower_3_cost: 150`,`  tower_3_dmg: 20`,`  tower_3_splash: true`,
        `  enemy_1_name: "${a.enemy1||"小怪"}"`,`  enemy_1_hp: 50`,`  enemy_1_speed: 80`,
        `  enemy_2_name: "${a.enemy2||"速度怪"}"`,`  enemy_2_hp: 30`,`  enemy_2_speed: 150`,
        `  enemy_3_name: "${a.enemy3||"大鐵甲"}"`,`  enemy_3_hp: 200`,`  enemy_3_speed: 50`,
        `  defend_target: "${a.defend||"王國城堡"}"`,
      ],
      md_detail: `
### 地圖與資源
| 參數 | 數值 |
|------|------|
| 地圖主題 | ${a.mapTheme||gameDesc.slice(0,20)} |
| 格子大小 | 40 px |
| 起始金幣 | 150 枚 |
| 擊殺獎勵 | +10 金幣 |
| 基地 HP | 20 |
| 總波次 | 10 波 |

### 防禦塔
| 塔名 | 費用 | 傷害 | 射程 | 攻速 | 特效 |
|------|------|------|------|------|------|
| ${a.tower1||"基礎箭塔"} | 50 | 10 | 150 | 1/s | — |
| ${a.tower2||"狙擊塔"} | 100 | 40 | 300 | 0.4/s | 穿透 |
| ${a.tower3||"火焰塔"} | 150 | 20 | 120 | 0.8/s | 範圍濺射 |

### 敵人種類
| 名稱 | HP | 速度 | 獎勵 |
|------|----|----|------|
| ${a.enemy1||"小怪"} | 50 | 80 | 10 金 |
| ${a.enemy2||"速度怪"} | 30 | 150 | 15 金 |
| ${a.enemy3||"大鐵甲"} | 200 | 50 | 30 金 |

**守護目標：** ${a.defend||"王國城堡"}`,
    },

    memory_match: {
      yaml_gameplay: [
        `  flip_back_delay: 1.2`,`  easy_grid: "4x3"`,`  easy_pairs: 6`,`  easy_time: 90`,
        `  normal_grid: "4x4"`,`  normal_pairs: 8`,`  normal_time: 60`,
        `  hard_grid: "6x4"`,`  hard_pairs: 12`,`  hard_time: 45`,
        `  card_back_color: "${a.cardBack||"#4f46e5"}"`,
        `  card_style: "${a.cardStyle||"圓角卡片"}"`,
        `  bg_color: "${a.bgColor||"#1a1a2e"}"`,
      ],
      md_detail: `
### 難度模式
| 難度 | 格子 | 配對數 | 時間 |
|------|------|--------|------|
| 簡單 | 4×3 | 6 對 | 90 秒 |
| 普通 | 4×4 | 8 對 | 60 秒 |
| 困難 | 6×4 | 12 對 | 45 秒 |

### 翻牌機制
- 翻回延遲：1.2 秒（讓玩家記憶）
- 翻牌動畫：Y 軸 180° 翻轉（0.3 秒）
- 配對成功：卡片保持正面 + 閃光特效

### ⭐ 圖片直接變牌面
\`\`\`typescript
// 上傳的圖片自動裁切成多個配對區塊
const img = new Image()
img.src = '${imgPath}'
// 裁切為 N × M 等分，每份作為一張牌的正面
// 配對牌使用相同裁切區塊
\`\`\`
- 牌背顏色：${a.cardBack||"#4f46e5"}
- 背景顏色：${a.bgColor||"#1a1a2e"}`,
    },

    snake_evolution: {
      yaml_gameplay: [
        `  init_speed_ms: 150`,`  speed_inc_per_50pts: 5`,`  grid_size: 20`,`  init_length: 3`,
        `  grid_color: "${a.gridColor||"#111827"}"`,`  snake_color: "${a.snakeColor||"#2ecc71"}"`,
        `  wall_kill: true`,
        `  food_1: "${a.food1||"蘋果"}"`,`  food_1_score: 10`,`  food_1_rate: 0.7`,
        `  food_2: "${a.food2||"黃金蘋果"}"`,`  food_2_score: 30`,`  food_2_rate: 0.15`,
        `  food_3: "${a.food3||"閃電"}"`,`  food_3_effect: "speed_up"`,`  food_3_rate: 0.1`,
        `  food_4: "${a.food4||"冰塊"}"`,`  food_4_effect: "slow_down"`,`  food_4_rate: 0.05`,
        `  portal_enabled: true`,`  portal_count: 2`,
        `  obstacle_appear_at: 50`,`  obstacle_count: ${a.obstacleCount||5}`,
        `  msg_at_length_10: "${a.snakeMsg1||"傳送門出現！"}"`,
        `  msg_at_length_20: "${a.snakeMsg2||"障礙物登場！"}"`,
      ],
      md_detail: `
### 核心數值
| 參數 | 數值 |
|------|------|
| 初始速度 | 150 ms/格（越低越快）|
| 速度增量 | 每得 50 分 -5 ms |
| 格子大小 | 20 px |
| 撞牆即死 | ✅ |

### 食物系統
| 名稱 | 分數 | 效果 | 出現率 |
|------|------|------|--------|
| ${a.food1||"蘋果"} | +10 | 長大 1 格 | 70% |
| ${a.food2||"黃金蘋果"} | +30 | 不長大 | 15% |
| ${a.food3||"閃電"} | +5 | 加速 3 秒 | 10% |
| ${a.food4||"冰塊"} | +5 | 減速 3 秒 | 5% |

### 解鎖進程
- **長度 10：** 「${a.snakeMsg1||"傳送門出現！"}」→ 啟用 2 個傳送門
- **長度 20：** 「${a.snakeMsg2||"障礙物登場！"}」→ 出現 ${a.obstacleCount||5} 個固定障礙

### 圖片套用
\`\`\`typescript
// 蛇頭貼圖（4 個方向各一張）
this.load.image('head_up',    '${imgPath}')
this.load.image('head_down',  '${imgPath}')
this.load.image('head_left',  '${imgPath}')
this.load.image('head_right', '${imgPath}')
\`\`\``,
    },

    racing_3d: {
      yaml_gameplay: [
        `  engine: "react-three-rapier"`,`  github_ref: "https://github.com/pmndrs/racing-game"`,
        `  camera: "third_person_follow"`,`  cam_back: 5`,`  cam_up: 2`,
        `  max_speed: 120`,`  acceleration: 1500`,`  brake_friction: 0.1`,
        `  suspension: "independent_front_rear"`,
        `  track_theme: "${a.worldTheme||gameDesc.slice(0,20)}"`,
        `  track_type: "closed_circuit"`,`  total_laps: 3`,`  track_width: 12`,
        `  ai_opponents: 2`,`  countdown: "3-2-1-GO"`,
      ],
      md_detail: `
### 車輛物理（Rapier）
| 參數 | 數值 |
|------|------|
| 最高速度 | 120 km/h |
| 加速力道 | 1500 N |
| 手煞車摩擦係數 | 0.1（漂移）|
| 懸吊系統 | 前後獨立彈簧阻尼 |
| 物理更新率 | 60 fps |

### 賽道設計
- **主題：** ${a.worldTheme||gameDesc.slice(0,20)}
- **類型：** 封閉環形，寬 12m，含護欄碰撞體
- **總圈數：** 3 圈
- **AI 對手：** 2 台（路徑跟隨）

### 競速系統
- 最快圈速 HUD 顯示
- 起跑倒數：3-2-1-GO 動畫
- 過終點線觸發圈數計數

### 圖片套用（材質貼圖）
\`\`\`typescript
import { useTexture } from '@react-three/drei'
const carTexture = useTexture('${imgPath}')
<meshStandardMaterial map={carTexture} />
\`\`\``,
    },

    fps_3d: {
      yaml_gameplay: [
        `  engine: "three.js + rapier"`,`  github_ref: "https://github.com/lume/lume"`,
        `  fov: 75`,`  mouse_lock: true`,
        `  player_hp: 100`,`  hit_damage: 20`,`  regen_delay: 3`,
        `  move_speed: 5`,`  sprint_speed: 8`,`  jump_height: 1.5`,
        `  weapon_1: "pistol"`,`  weapon_1_dmg: 20`,`  weapon_1_firerate: 2`,`  weapon_1_ammo: 12`,
        `  weapon_2: "shotgun"`,`  weapon_2_dmg: 60`,`  weapon_2_firerate: 0.5`,
        `  enemy_count: 10`,`  enemy_ai: "patrol_and_chase"`,
        `  map_theme: "${a.worldTheme||gameDesc.slice(0,20)}"`,
      ],
      md_detail: `
### 玩家系統
| 參數 | 數值 |
|------|------|
| HP | 100，被擊中 -20 |
| 回血 | 3 秒無受傷後開始 |
| 移動速度 | 5 m/s，衝刺 8 m/s |
| 跳躍高度 | 1.5 m |
| FOV | 75° |

### 武器系統
| 武器 | 傷害 | 射速 | 彈匣 |
|------|------|------|------|
| 手槍 | 20 | 2/s | 12 |
| 霰彈槍 | 60 | 0.5/s | 6 |

子彈系統：Raycasting（即時命中，無彈道下墜）

### 敵人 AI
- 巡邏狀態：固定路徑左右巡邏
- 警覺狀態：發現玩家（視野 15m）→ 追擊
- 攻擊狀態：距離 5m 內開始射擊

### 圖片套用
\`\`\`typescript
// HUD 頭像 / 武器貼圖
const hudTexture = useTexture('${imgPath}')
\`\`\``,
    },

    marble_3d: {
      yaml_gameplay: [
        `  engine: "react-three-rapier"`,`  github_ref: "https://github.com/pmndrs/react-three-rapier"`,
        `  ball_radius: 0.3`,`  gravity: -9.81`,`  ball_density: 1.5`,
        `  platform_friction: 0.8`,`  ball_restitution: 0.2`,`  control_force: 15`,
        `  level_1: "直線+轉彎平台（教學關）"`,
        `  level_2: "窄路橋+旋轉平台"`,
        `  level_3: "移動平台+彈射板"`,
        `  checkpoint_respawn: true`,
      ],
      md_detail: `
### 物理設定（Rapier）
| 參數 | 數值 |
|------|------|
| 球半徑 | 0.3 m |
| 重力 | -9.81 m/s² |
| 球體密度 | 1.5（影響滾動慣性）|
| 平台摩擦 | 0.8 |
| 反彈係數 | 0.2 |
| 控制力 | 15 N（施加在球上）|

### 關卡設計
| 關卡 | 主題 | 特點 |
|------|------|------|
| Level 1 | 直線+轉彎 | 教學關，無障礙 |
| Level 2 | 窄路橋 | 旋轉平台 |
| Level 3 | 移動平台 | 彈射板 |

掉落即重置至最近檢查點（Checkpoint 系統）

### 圖片套用（貼在球體表面！）
\`\`\`typescript
const ballTexture = useTexture('${imgPath}')
<mesh><sphereGeometry args={[0.3,32,32]} /><meshStandardMaterial map={ballTexture} /></mesh>
\`\`\``,
    },

    platformer_3d: {
      yaml_gameplay: [
        `  engine: "react-three-fiber + ecctrl + rapier"`,`  github_ref: "https://github.com/pmndrs/ecctrl"`,
        `  art_style: "low_poly"`,`  camera: "third_person_isometric"`,
        `  capsule_radius: 0.3`,`  capsule_height: 1.8`,
        `  move_speed: 4`,`  jump_force: 8`,`  sprint_multiplier: 1.6`,`  max_slope: 45`,
        `  collectible: "${a.item||"星星"}"`,`  collectible_count: 20`,
        `  world_theme: "${a.worldTheme||gameDesc.slice(0,20)}"`,
        `  hazard: "深淵（掉落重置）"`,`  goal: "旋轉傳送門"`,
      ],
      md_detail: `
### 角色控制（ecctrl）
| 參數 | 數值 |
|------|------|
| 移動速度 | 4 m/s |
| 跳躍力道 | 8 N/kg |
| 衝刺倍率 | ×1.6 |
| 最大爬坡 | 45° |
| 碰撞體 | 膠囊（半徑0.3m, 高1.8m）|

### 場景設計
- **主題：** ${a.worldTheme||gameDesc.slice(0,20)}，低多邊形美術風格
- **收集物：** ${a.item||"星星"} × 20 個，分散場景中
- **危險區域：** 掉入深淵 → 重置至最近 Checkpoint
- **終點：** 旋轉發光傳送門（碰觸觸發過關）

### 圖片套用
\`\`\`typescript
// 套用至角色模型材質
const charTexture = useTexture('${imgPath}')
<meshStandardMaterial map={charTexture} />
\`\`\``,
    },

    dungeon_3d: {
      yaml_gameplay: [
        `  engine: "react-three-fiber + react-three-npc + rapier"`,`  github_ref: "https://github.com/ssethsara/react-three-npc"`,
        `  camera: "third_person_30deg"`,`  art_style: "low_poly_dungeon"`,
        `  player_hp: 100`,`  player_atk: 25`,`  atk_range: 1.5`,`  atk_speed: 1`,
        `  enemy_1: "${a.enemy1||"小骷髏"}"`,`  enemy_1_hp: 30`,`  enemy_1_ai: "patrol_chase"`,
        `  enemy_2: "${a.enemy2||"石頭人"}"`,`  enemy_2_hp: 80`,`  enemy_2_ai: "guard"`,
        `  boss: "${a.boss||"地城王"}"`,`  boss_hp: 300`,`  boss_ai: "skill_ai"`,
        `  rooms: 5`,`  room_size: "10x10m"`,`  corridor_width: "3m"`,
      ],
      md_detail: `
### 戰鬥系統
| 參數 | 數值 |
|------|------|
| 玩家 HP | 100 |
| 玩家攻擊傷害 | 25 |
| 攻擊範圍 | 1.5 m |
| 攻速 | 1 次/秒 |

### 怪物 AI（Yuka.js）
| 怪物 | HP | 傷害 | 行為 | 獎勵 |
|------|----|----|------|------|
| ${a.enemy1||"小骷髏"} | 30 | 10 | 巡邏→追擊 | 20 金 |
| ${a.enemy2||"石頭人"} | 80 | 25 | 站立守衛 | 50 金 |
| ${a.boss||"地城王"} | 300 | 40 | 技能 AI | 200 金 |

### 地城生成
- 5 個房間隨機程序連接
- 隨機放置怪物與寶箱
- 房間 10m×10m，走廊 3m 寬

### 圖片套用
\`\`\`typescript
const charTexture = useTexture('${imgPath}')
// 套用至主角低多邊形人物模型
\`\`\``,
    },

    spaceshooter_3d: {
      yaml_gameplay: [
        `  engine: "react-three-fiber + drei + zustand"`,`  github_ref: "https://github.com/pmndrs/react-three-fiber"`,
        `  scene: "infinite_space"`,`  starfield: true`,
        `  max_speed: 50`,`  acceleration: 20`,`  auto_level: true`,
        `  weapon_cooldown: 0.25`,`  bullet_type: "raycast"`,
        `  enemy_1: "偵察艦"`,`  enemy_1_hp: 15`,`  enemy_1_speed: 30`,
        `  enemy_2: "戰鬥艦"`,`  enemy_2_hp: 40`,`  enemy_2_speed: 20`,
        `  enemy_3: "旗艦"`,`  enemy_3_hp: 120`,`  enemy_3_speed: 10`,
        `  total_waves: 5`,`  enemies_per_wave_inc: 3`,
        `  world_theme: "${a.worldTheme||gameDesc.slice(0,20)}"`,
      ],
      md_detail: `
### 飛船系統
| 參數 | 數值 |
|------|------|
| 最大速度 | 50 units/s |
| 加速度 | 20 units/s² |
| 自動水平對齊 | ✅（防暈機）|
| 武器冷卻 | 0.25 秒 |

### 敵艦種類
| 名稱 | HP | 速度 | 行為 |
|------|----|----|------|
| 偵察艦 | 15 | 30 | 快速追蹤 |
| 戰鬥艦 | 40 | 20 | 保持距離射擊 |
| 旗艦 | 120 | 10 | 週期技能 |

### 波次設計
5 波，每波 +3 艘敵艦，第 5 波出現旗艦

### 視覺特效（@react-three/postprocessing）
- 爆炸：火焰粒子球 + 衝擊波
- 環境：流星群 + 遠景星雲 + Bloom 光暈

### 圖片套用
\`\`\`typescript
const shipTexture = useTexture('${imgPath}')
<meshStandardMaterial map={shipTexture} />  // 飛船機身貼圖
\`\`\``,
    },
  };

  const spec = specMap[game.id] || { yaml_gameplay: [], md_detail: "" };

  // ── 組合 YAML 區塊 ────────────────────────────────────────────────────────
  const yamlBlock = [
    `# ══════════════════════════════════════════════════════`,
    `# 遊戲規格 YAML — 此設定檔與下方 Markdown 為同一份規格`,
    `# 請 AI 同時參考 YAML 數值與 Markdown 說明來實作遊戲`,
    `# ══════════════════════════════════════════════════════`,
    ``,
    `meta:`,
    `  game_title: "${gameTitle||"我的遊戲"}"`,
    `  game_slug: "${slug}"`,
    `  game_type: "${game.id}"`,
    `  is_3d: ${is3D}`,
    `  description: "${gameDesc.replace(/"/g,"'")}"`,
    `  created_at: "${date}"`,
    `  language: "zh-TW"`,
    ``,
    `player_image:`,
    `  path: "${imgPath}"`,
    `  role: "${game.imageUse||"遊戲主角圖片"}"`,
    `  size_recommend: "${is3D?"512×512 px（材質貼圖）":"48×48 px（Sprite）"}"`,
    ``,
    `tech:`,
    `  framework: "Next.js 14 App Router + TypeScript"`,
    `  engine: "${game.stack||"Phaser 3"}"`,
    `  deploy: "Vercel"`,
    `  node_version: ">=20"`,
    `  packages:`,
    ...pkgs.map(p => `    - "${p}"`),
    ``,
    `gameplay:`,
    `  type: "${game.id}"`,
    `  controls: "${game.controls}"`,
    `  win_condition: "${game.win}"`,
    `  required_features:`,
    ...game.features.map(f => `    - "${f}"`),
    ...spec.yaml_gameplay,
    ``,
    `customization:`,
    `  enemy_name: "${a.enemy||"怪物"}"`,
    `  item_name: "${a.item||"星星"}"`,
    `  boss_name: "${a.boss||"終極Boss"}"`,
    `  world_theme: "${a.worldTheme||gameDesc.slice(0,30)}"`,
    `  color_primary: "${(a.colors||[])[0]||"#4f46e5"}"`,
    `  color_secondary: "${(a.colors||[])[1]||"#7c3aed"}"`,
    `  win_message: "${a.winMsg||"恭喜過關！你太厲害了！"}"`,
    ``,
    `ai_contract:`,
    `  # ⚠️ 以下是 AI 與設計者的共識協議，AI 必須嚴格遵守`,
    `  must_be_playable_in_browser: true`,
    `  game_route: "/game"`,
    `  resolution: "1280x720 桌機瀏覽器"`,
    `  all_ui_in_zh_tw: true`,
    `  image_must_be_used: true`,
    `  image_path: "${imgPath}"`,
    `  image_role: "${game.imageUse||"主角"}"`,
    `  deploy_ready: true`,
    `  no_external_assets: true`,
    `  ${is3D ? `use_real_physics: true` : `use_phaser3: true`}`,
    `  ${is3D ? `github_reference: "${game.github||""}"` : `canvas_in_client_component: true`}`,
    ...(is3D ? [
    ``,
    `pixar_style_contract:`,
    `  # 🎬 皮克斯／迪士尼動畫風格 — 嚴格執行，不得使用任何方塊或低多邊形`,
    `  style: "Pixar / Disney Smooth 3D"`,
    `  forbidden: ["Low-poly", "Voxel", "Minecraft", "Lego", "積木", "方塊", "低多邊形"]`,
    `  character_style: "圓潤大頭短腳，表面如充氣氣球，無任何硬邊"`,
    `  material: "MeshStandardMaterial roughness=0.35 metalness=0.05（卡通柔光）"`,
    `  sss_skin: true  # 次表面散射，讓皮膚/橡皮質感透光`,
    `  renderer: "WebGLRenderer antialias=true ACESFilmicToneMapping exposure=1.2"`,
    `  shadows: "PCFSoftShadowMap（電影級軟陰影，不得用硬邊陰影）"`,
    `  lights:`,
    `    key_light: "DirectionalLight #fff8e1 intensity=2.5（溫暖主光）"`,
    `    fill_light: "HemisphereLight sky=#ffe4b5 ground=#4169e1 intensity=0.8"`,
    `    ambient: "AmbientLight #ffeedd intensity=0.4"`,
    `  postprocessing: ["Bloom（光暈）", "SSAO（接觸陰影）"]`,
    `  scene_style: "鵝卵石圓石、棒棒糖圓頂樹、蓬鬆草地，所有邊角皆倒角磨圓"`,
    ] : []),
  ].join("\n");

  // ── 組合完整 Markdown 規格書 ──────────────────────────────────────────────
  return `# 🎮 ${gameTitle||"我的遊戲"} — 遊戲開發完整規格書
> **產出日期：** ${date}　**類型：** ${game.name}（${is3D?"真實 3D":"2D 網頁遊戲"}）
> **技術棧：** ${game.stack||"Next.js 14 + Phaser 3"}　**部署：** Vercel
>
> ⚠️ **本文件同時包含 YAML 設定與 Markdown 說明，是 AI 與設計者的共同規格協議。**
> AI 實作時必須嚴格遵守所有數值與規則，不得自行更改核心邏輯。

---

## 一、專案概述

| 項目 | 內容 |
|------|------|
| 遊戲名稱 | **${gameTitle||"我的遊戲"}** |
| 遊戲類型 | ${game.name}（${is3D?"真實 3D WebGL":"2D 瀏覽器遊戲"}）|
| 技術棧 | ${game.stack||"Next.js 14 + Phaser 3"} |
| 部署平台 | Vercel |
| 操作方式 | ${game.controls} |
| 過關條件 | ${game.win} |
| 目標解析度 | 1280×720（桌機瀏覽器）|
| 介面語言 | 繁體中文 |
| 玩家圖片路徑 | \`${imgPath}\` |
| 圖片用途 | ${game.imageUse||"遊戲主角"} |

**遊戲描述：** ${gameDesc}

---

## 二、技術架構

\`\`\`
框架：Next.js 14（App Router + TypeScript）
${is3D?`遊戲引擎：React Three Fiber（R3F）v8
物理引擎：@react-three/rapier（Rapier WASM）
參考 GitHub：${game.github||""}
3D 輔助：@react-three/drei`:`遊戲引擎：Phaser 3.x
畫布：Phaser.Game → 嵌入 Next.js Client Component`}
狀態管理：Zustand
部署：Vercel（npm run build → vercel --prod）
Node.js：>= 20
\`\`\`

### 安裝指令
\`\`\`bash
npx create-next-app@latest ${slug} --typescript --tailwind --app
cd ${slug}
${pkgs.join("\n")}
mkdir -p public/assets
\`\`\`

### 必要功能清單
${game.features.map(f=>`- ✅ ${f}`).join("\n")}

---

## 三、遊戲詳細規格
${spec.md_detail}

---

## 四、AI 與設計者共識協議（Contract）

> 以下規則是設計者的需求，AI **必須逐條遵守**，不得以「預設值」或「簡化實作」跳過任何一條：

| # | 規則 | 說明 |
|---|------|------|
| 1 | **遊戲必須真實可玩** | 打開 \`/game\` 頁面即可操控，不是展示 demo 或靜態畫面 |
| 2 | **圖片必須套用** | \`${imgPath}\` 必須出現在遊戲中，用途：${game.imageUse||"主角"} |
| 3 | **數值不得自行修改** | 所有 YAML 中的數值（速度、HP、傷害…）必須與規格書一致 |
| 4 | **繁體中文介面** | 所有 HUD、訊息、按鈕一律使用繁體中文 |
| 5 | **1280×720 正常運作** | 在此解析度下完整顯示，不能有元素超出畫面 |
| 6 | **Client Component** | Phaser / R3F Canvas 必須在 \`'use client'\` 元件中 |
| ${is3D?"7":"7"} | **${is3D?"真實 3D 物理":"Phaser 3 實作"}** | ${is3D?`必須使用 @react-three/rapier，不能用 CSS 3D 變形偽裝`:`必須使用 Phaser 3 的 Physics.Arcade 系統`} |
| 8 | **Vercel 部署就緒** | \`npm run build\` 必須成功，無 TypeScript 錯誤 |
${is3D ? `| 9 | **🎬 皮克斯視覺風格** | 所有角色、場景、物件必須符合 Pixar/Disney Smooth 3D 風格 |
| 10 | **❌ 禁止方塊外觀** | 絕對不得出現 Low-poly、Voxel、積木、Minecraft、樂高、低多邊形任何幾何風格 |
| 11 | **圓潤 Smooth Mesh** | 所有模型必須經過 Subdivision 處理，邊角倒角磨圓，無硬邊 |
| 12 | **電影級光影** | 必須使用 PCFSoftShadowMap 軟陰影 + ACESFilmic 色調映射 |` : ""}

${is3D ? `
---

## 四之一、皮克斯風格技術規格

> 🎬 **這是本遊戲最重要的視覺規範，AI 必須在開始寫任何程式碼之前先看完這一節。**

### 視覺方向
想像《玩具總動員》裡巴斯光年的太空衣光澤、《怪獸電力公司》毛茸茸的質感、《海底總動員》水中柔光——**每個物件都像是真的從工廠製作的玩具，摸起來有溫度、有重量。**

### 禁止清單（AI 不得使用以下任何風格）
| ❌ 禁止 | ✅ 替代 |
|---------|---------|
| Low-poly 低多邊形 | Smooth Mesh + Subdivision |
| Voxel 體素 / Minecraft 方塊 | 圓潤有機造型 |
| 樂高 / 積木感 | 充氣氣球般的圓潤邊角 |
| 硬邊 Flat Shading | Smooth Shading + 倒角 |
| 卡通輪廓線（Toon Outline）| 改用光影製造立體感 |

### Three.js 渲染器設定（必須完全複製）
\`\`\`typescript
// renderer 設定
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap   // 軟陰影
renderer.toneMapping = THREE.ACESFilmicToneMapping  // 電影色調
renderer.toneMappingExposure = 1.2
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 或在 R3F 中
<Canvas shadows={{ type: THREE.PCFSoftShadowMap }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
\`\`\`

### 光源設定（必須完全複製）
\`\`\`typescript
// 溫暖主光（模擬皮克斯工作室燈）
<directionalLight
  position={[10, 15, 8]}
  intensity={2.5}
  color="#fff8e1"
  castShadow
  shadow-mapSize={[2048, 2048]}
  shadow-camera-far={50}
  shadow-radius={8}           // 陰影柔化半徑
/>

// 天空補光（冷暖對比，製造立體感）
<hemisphereLight skyColor="#ffe4b5" groundColor="#4169e1" intensity={0.8} />

// 環境光（避免全黑死角）
<ambientLight color="#ffeedd" intensity={0.4} />
\`\`\`

### 材質設定（所有物件使用）
\`\`\`typescript
// 標準卡通質感材質
<meshStandardMaterial
  roughness={0.35}      // 輕微粗糙，不全亮也不全霧
  metalness={0.05}      // 幾乎無金屬感（除非是金屬零件）
  envMapIntensity={0.6} // 輕微環境反射
/>

// 皮膚 / 橡皮質感（SSS 模擬）
<meshStandardMaterial
  roughness={0.5}
  metalness={0}
  color="#ffcba4"        // 膚色底色
  // 用 subsurfaceColor 近似 SSS
/>
\`\`\`

### Postprocessing（視覺加工）
\`\`\`typescript
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom luminanceThreshold={0.9} intensity={0.4} />  {/* 光暈 */}
  <SSAO radius={0.05} intensity={20} />               {/* 接觸陰影 */}
</EffectComposer>
\`\`\`

### 角色造型規範
- **頭身比：** 1:1.5（大頭矮身，皮克斯標準比例）
- **眼睛：** 佔臉部 35% 以上，圓形或橢圓形，有高光反射點
- **四肢：** 短而圓，手腳末端膨脹（像充氣手套）
- **表面細分：** 所有幾何體最少 Subdivision Level 2
- **邊角：** 所有邊角 Bevel Radius ≥ 0.1（無任何 90° 硬邊）
` : ""}

---

## 五、檔案結構

\`\`\`
${slug}/
├── src/app/
│   ├── page.tsx           ← 首頁（遊戲入口按鈕）
│   ├── game/
│   │   └── page.tsx       ← 遊戲主頁面（'use client'）
│   └── layout.tsx
├── components/game/
│   ├── GameCanvas.tsx     ← 遊戲畫布主元件
│   ├── Player.tsx         ← 玩家角色
│   ├── Enemy.tsx          ← 敵人
│   └── HUD.tsx            ← 分數/HP/計時
├── public/assets/
│   └── ${imageName||"player.png"}      ← 玩家上傳的圖片
├── game-spec.md           ← 本規格書
└── package.json
\`\`\`

---

## 六、逐步實作指引

### Step 1：建立專案
\`\`\`bash
npx create-next-app@latest ${slug} --typescript --tailwind --app
cd ${slug}
${pkgs.join("\n")}
mkdir -p public/assets
cp ~/Downloads/${imageName||"player.png"} public/assets/
\`\`\`

### Step 2：貼給 Codex 或 Claude Code 的完整啟動 Prompt

> 📋 複製以下全部內容，貼入 AI 後直接開始實作：

\`\`\`
我需要你幫我實作一個完整可玩的「${game.name}」網頁遊戲，標題是「${gameTitle||"我的遊戲"}」。

技術棧：${game.stack||"Next.js 14 + Phaser 3"}
遊戲路由：/game（src/app/game/page.tsx）

請嚴格按照以下規格書的每一個數值實作，這是設計者與 AI 的共識協議：

操作方式：${game.controls}
過關條件：${game.win}
必要功能：${game.features.join("、")}
圖片套用：${imgPath} → 用作「${game.imageUse||"主角"}」
所有 UI 使用繁體中文
在 1280×720 桌機瀏覽器正常遊玩
${is3D?`使用 React Three Fiber + Rapier 實作真實 3D 物理，參考 ${game.github}`:"使用 Phaser 3 Arcade Physics，Canvas 放在 'use client' 元件中"}

詳細數值規格請見 game-spec.md 第三節。請從 GameCanvas.tsx 開始，先完成可玩的核心版本。
\`\`\`

### Step 3：本機測試
\`\`\`bash
npm run dev
# 開啟 http://localhost:3000/game 確認遊戲可玩
\`\`\`

### Step 4：常見問題排除
| 問題 | 解法 |
|------|------|
| 遊戲畫面空白 | 加 \`'use client'\` 在 GameCanvas.tsx 頂部 |
| 圖片 404 | 確認圖片在 \`public/assets/\`，路徑用 \`/assets/檔名\` |
| TypeScript 錯誤 | tsconfig.json 加 \`"skipLibCheck": true\` |
| ${is3D?"Rapier WASM 失敗":"Phaser 找不到 window"} | ${is3D?"確認 @react-three/rapier 版本 ≥ 1.0 且用 R3F v8":"dynamic import: `const Phaser = await import('phaser')`"} |
| Vercel 部署失敗 | 先跑 \`npm run build\` 確認本機無錯誤 |

---

## 七、部署

\`\`\`bash
npm run build          # 確認 build 成功
npx vercel --prod      # 部署（project name: ${slug}）
\`\`\`

---

## 八、YAML 設定檔（與上方規格完全對應）

> ⚠️ 此 YAML 與上方 Markdown 為**同一份規格的雙重格式**。
> AI 可以用 Markdown 理解邏輯，用 YAML 讀取精確數值。兩者必須一致。

\`\`\`yaml
${yamlBlock}
\`\`\`

---
> 📌 本規格書由 **網頁遊戲設計工坊** 自動產生 · ${date}
> 🔗 ${is3D?`GitHub 參考：${game.github}`:"技術棧：Phaser 3 + Next.js 14"}
> ✅ YAML 與 Markdown 已合併為單一共識文件，AI 與設計者共同遵守
`;
}

// buildPrompt 現在直接引用 spec 文件
function buildPrompt(game, is3D, gameTitle, spec, tool) {
  const intro = `我需要你幫我實作一個完整可玩的「${game.name}」網頁遊戲，標題是「${gameTitle||"我的遊戲"}」。

技術棧：${game.stack||"Next.js 14 + Phaser 3"}　部署：Vercel
遊戲路由：/game（src/app/game/page.tsx）

以下是完整規格書（YAML + Markdown 合併版），請嚴格按照所有數值與規則實作：

---

${spec}

---
`;
  return tool === "claude"
    ? intro + "\n請直接開始實作，從 GameCanvas.tsx 核心邏輯開始，完成可玩版本後再美化。"
    : intro + "\n請逐步實作，先完成核心遊戲邏輯與物理，再加入 HUD 與美術。";
}

// ── Tiny Card ─────────────────────────────────────────────────────────────────
function GameCard2D({ g, selected, onSelect, isDark }) {
  const bg = selected ? `${g.color}18` : (isDark?"#0e0e20":"#fff");
  const bd = selected ? g.color : (isDark?"#1a1a3e":"#d4d8f0");
  return (
    <div onClick={()=>onSelect(g)} style={{ background:bg, border:`2px solid ${bd}`, borderRadius:12, padding:14, cursor:"pointer", transition:"all 0.2s", position:"relative" }}>
      {selected && <div style={{ position:"absolute",top:8,right:8,background:g.color,borderRadius:"50%",width:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff" }}>✓</div>}
      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
        <span style={{ fontSize:24 }}>{g.emoji}</span>
        <div>
          <div style={{ fontWeight:800,fontSize:13,color:selected?g.color:(isDark?"#fff":"#1a1a3e") }}>{g.name}</div>
          <div style={{ fontSize:9,padding:"1px 6px",borderRadius:8,display:"inline-block",marginTop:1,background:`${g.diffColor}22`,color:g.diffColor,border:`1px solid ${g.diffColor}44` }}>{g.diff}</div>
        </div>
      </div>
      <div style={{ fontSize:11,color:isDark?"#999":"#666",lineHeight:1.5,marginBottom:6 }}>{g.tagline}</div>
      <div style={{ fontSize:10,color:isDark?"#555":"#aaa" }}>🎮 {g.controls}</div>
      <div style={{ display:"flex",flexWrap:"wrap",gap:3,marginTop:6 }}>
        {g.features.map(f=><span key={f} style={{ fontSize:9,padding:"1px 6px",borderRadius:10,background:`${g.color}18`,color:g.color,border:`1px solid ${g.color}33` }}>{f}</span>)}
      </div>
    </div>
  );
}

function GameCard3D({ g, selected, onSelect, isDark }) {
  const [showDocs, setShowDocs] = useState(false);
  const bg = selected ? `${g.color}18` : (isDark?"#0a0a1a":"#fff");
  const bd = selected ? g.color : (isDark?"#1a1a3e":"#d4d8f0");
  return (
    <div style={{ background:bg, border:`2px solid ${bd}`, borderRadius:14, overflow:"hidden", transition:"all 0.2s" }}>
      {/* 頂部色條 */}
      <div style={{ height:3, background:`linear-gradient(90deg, ${g.color}, ${g.color}88)` }} />
      <div style={{ padding:16 }}>
        {selected && <div style={{ position:"absolute",top:20,right:16,background:g.color,borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff" }}>✓</div>}

        <div onClick={()=>onSelect(g)} style={{ cursor:"pointer" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
            <span style={{ fontSize:30 }}>{g.emoji}</span>
            <div>
              <div style={{ fontWeight:900,fontSize:15,color:selected?g.color:(isDark?"#fff":"#111") }}>{g.name}</div>
              <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:3 }}>
                <div style={{ fontSize:9,padding:"2px 8px",borderRadius:8,background:`${g.diffColor}22`,color:g.diffColor,border:`1px solid ${g.diffColor}44` }}>{g.diff}</div>
                <div style={{ fontSize:9,padding:"2px 8px",borderRadius:8,background:"#4f46e522",color:"#818cf8",border:"1px solid #4f46e544" }}>真實 3D</div>
                <div style={{ fontSize:9,padding:"2px 8px",borderRadius:8,background:"#e74c3c18",color:"#ff8fa3",border:"1px solid #e74c3c33" }}>🎬 皮克斯風格</div>
              </div>
            </div>
          </div>
          <div style={{ fontSize:12,color:isDark?"#a0a0c0":"#6666aa",lineHeight:1.5,marginBottom:8,fontStyle:"italic" }}>「{g.tagline}」</div>
          <div style={{ fontSize:12,color:isDark?"#bbb":"#444",lineHeight:1.5,marginBottom:10 }}>{g.desc}</div>
          <div style={{ fontSize:11,color:isDark?"#555":"#aaa",marginBottom:4 }}>🎮 {g.controls}</div>
          <div style={{ fontSize:10,color:isDark?"#444":"#bbb",marginBottom:8,fontFamily:"'JetBrains Mono',monospace" }}>📸 圖片用途：{g.imageUse}</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginBottom:10 }}>
            {g.features.map(f=><span key={f} style={{ fontSize:10,padding:"2px 8px",borderRadius:10,background:`${g.color}18`,color:g.color,border:`1px solid ${g.color}33` }}>{f}</span>)}
          </div>
          {/* GitHub badge */}
          <div style={{ background:isDark?"#111":"#f5f6ff",border:`1px solid ${g.color}33`,borderRadius:8,padding:"8px 12px",marginBottom:10 }}>
            <div style={{ fontSize:10,color:isDark?"#555":"#aaa",marginBottom:3,fontFamily:"'JetBrains Mono',monospace" }}>GitHub 來源</div>
            <div style={{ fontSize:11,color:g.color,wordBreak:"break-all" }}>🔗 {g.github}</div>
            <div style={{ fontSize:10,color:isDark?"#666":"#999",marginTop:2 }}>{g.githubNote}</div>
          </div>
        </div>

        {/* 展開文件 */}
        <button onClick={(e)=>{e.stopPropagation();setShowDocs(!showDocs)}} style={{ width:"100%",background:"transparent",border:`1px solid ${g.color}44`,borderRadius:8,color:g.color,padding:"6px 0",cursor:"pointer",fontSize:11,fontFamily:"inherit",transition:"all 0.2s" }}>
          {showDocs?"▲ 收起技術文件":"▼ 查看技術文件 & 試玩 Demo"}
        </button>
        {showDocs && (
          <div style={{ marginTop:10,display:"flex",flexDirection:"column",gap:6 }}>
            {g.docs.map(({label,url})=>(
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:isDark?"#080814":"#f5f6ff",border:`1px solid ${g.color}33`,borderRadius:8,color:isDark?"#ccc":"#333",textDecoration:"none",fontSize:12 }}>
                <span>{label}</span><span style={{ color:g.color,fontSize:10 }}>開啟 ↗</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Deploy Guide ──────────────────────────────────────────────────────────────
function DeployGuide({ game, is3D, gameTitle, yaml, isDark }) {
  const [step, setStep] = useState(0);
  const slug = (gameTitle||"my-game").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
  const pkgs = is3D ? (game.install||[]).join(" ") : "phaser";

  const steps = [
    { icon:"🛠️",title:"安裝工具",desc:"Node.js + Vercel CLI（只需做一次）",
      cmds:["# 到 https://nodejs.org 下載 LTS 版本","node --version  # 確認 >= 20","npm install -g vercel","vercel login"],
      codex:`確認 Node.js >= 20，安裝 Vercel CLI（npm install -g vercel），執行 vercel login 登入帳號。`,
      claude:`1) 確認 node --version >= 20，2) npm install -g vercel，3) vercel login。有問題告訴我。` },
    { icon:"📦",title:"建立專案",desc:"用 Next.js 建立專案並安裝遊戲引擎",
      cmds:[`npx create-next-app@latest ${slug} --typescript --tailwind --app`,`cd ${slug}`,`npm install ${pkgs}`,"mkdir -p public/assets"],
      codex:`建立 Next.js 專案 ${slug}，安裝 ${pkgs}，建立 public/assets 資料夾。`,
      claude:`npx create-next-app@latest ${slug} --typescript --tailwind --app，然後 cd ${slug} && npm install ${pkgs} && mkdir -p public/assets。` },
    { icon:"🖼️",title:"放入素材",desc:"把圖片放到正確位置",
      cmds:["# 把圖片複製到專案（替換成你的檔名）",`cp ~/Downloads/your-image.jpg ${slug}/public/assets/player.jpg`,"ls public/assets/"],
      codex:`確認 public/assets/player.jpg 存在，並更新程式碼中的圖片引用路徑為 /assets/player.jpg。`,
      claude:`確認 public/assets/player.jpg 存在，若路徑不符 YAML 設定請自動修正。` },
    { icon:"🤖",title:"貼給 AI 實作",desc:"把完整 Prompt 貼給 Codex 或 Claude Code，讓 AI 做出遊戲",
      cmds:[`cp game-config.yml ${slug}/`,"# 開啟 Codex 或 Claude Code","# 複製下方完整 Prompt 貼入 AI"],
      codex: buildPrompt(game, is3D, gameTitle||"我的遊戲", yaml, "codex"),
      claude: buildPrompt(game, is3D, gameTitle||"我的遊戲", yaml, "claude"),
      isMain: true },
    { icon:"🧪",title:"本機測試",desc:"確認遊戲可以在瀏覽器正常遊玩",
      cmds:[`cd ${slug}`,"npm run dev","# 開啟 http://localhost:3000/game"],
      codex:`執行 npm run dev，確認遊戲在 localhost:3000/game 正常遊玩。有錯誤請自動修復。`,
      claude:`npm run dev，確認 /game 路由正常。有 TypeScript 或執行期錯誤請直接修復。` },
    { icon:"🚀",title:"部署上線",desc:"發布到 Vercel，取得網址分享！",
      cmds:[`cd ${slug}`,"npm run build","vercel --prod","# 🎉 取得 vercel.app 網址！"],
      codex:`npm run build 確認無誤，再 vercel --prod 部署。project name = ${slug}，其他按 Enter。`,
      claude:`npm run build 然後 vercel --prod，project name = ${slug}。顯示最終 vercel.app 網址。` },
  ];

  const s = steps[step];
  const copy = t => navigator.clipboard.writeText(t).catch(()=>{});
  const termBg = isDark?"#000":"#1a1a2e";
  const promptBg = isDark?"#0d0d1e":"#f5f6ff";

  return (
    <div style={{ fontFamily:"'JetBrains Mono',monospace" }}>
      <div style={{ display:"flex",gap:5,marginBottom:14,flexWrap:"wrap" }}>
        {steps.map((st,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{ padding:"5px 11px",borderRadius:20,border:"none",cursor:"pointer",background:step===i?game.color:(isDark?"#13132a":"#e8eaff"),color:step===i?"#fff":(isDark?"#666":"#888"),fontSize:11,fontFamily:"inherit",outline:step===i?`2px solid ${game.color}`:"2px solid transparent",transition:"all 0.2s" }}>
            {st.icon} {i+1}. {st.title}
          </button>
        ))}
      </div>
      <div style={{ background:isDark?"#080816":"#f0f2ff",borderRadius:14,border:`1px solid ${game.color}44`,overflow:"hidden" }}>
        <div style={{ background:`linear-gradient(135deg,${game.color}22,transparent)`,padding:"12px 16px",borderBottom:`1px solid ${game.color}22` }}>
          <div style={{ fontWeight:800,fontSize:14 }}>{s.icon} 步驟 {step+1}：{s.title}</div>
          <div style={{ fontSize:11,opacity:0.6,marginTop:2 }}>{s.desc}</div>
        </div>
        <div style={{ padding:14 }}>
          <div style={{ background:termBg,borderRadius:10,padding:12,marginBottom:12 }}>
            <div style={{ display:"flex",gap:5,marginBottom:8 }}>
              {["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} style={{ width:9,height:9,borderRadius:"50%",background:c }} />)}
              <button onClick={()=>copy(s.cmds.join("\n"))} style={{ marginLeft:"auto",background:"#1a1a1a",border:"1px solid #333",color:"#777",padding:"2px 8px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"inherit" }}>複製</button>
            </div>
            <pre style={{ margin:0,fontSize:11.5,lineHeight:1.8,whiteSpace:"pre-wrap",overflowX:"auto" }}>
              {s.cmds.map((cmd,i)=>(
                <div key={i} style={{ color:cmd.startsWith("#")?"#444":cmd===""?"transparent":"#a8e6cf" }}>
                  {cmd.startsWith("#")?cmd:cmd===""?"‎":`$ ${cmd}`}
                </div>
              ))}
            </pre>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
            {[{label:"ChatGPT / Codex",icon:"🤖",key:"codex",color:"#10a37f"},{label:"Claude Code",icon:"⚡",key:"claude",color:"#d97706"}].map(({label,icon,key,color})=>(
              <div key={key} style={{ background:promptBg,border:`1px solid ${color}33`,borderRadius:10,padding:12 }}>
                <div style={{ color,fontSize:11,fontWeight:700,marginBottom:6 }}>{icon} 貼給 {label}</div>
                <div style={{ fontSize:11,lineHeight:1.6,marginBottom:8,maxHeight:s.isMain?200:72,overflow:"auto",opacity:0.85 }}>{s[key]}</div>
                <button onClick={()=>copy(s[key])} style={{ width:"100%",background:`${color}18`,border:`1px solid ${color}44`,color,padding:"5px 0",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"inherit" }}>
                  複製{s.isMain?" 完整 Prompt":" Prompt"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",marginTop:12 }}>
        <button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0} style={{ padding:"8px 16px",borderRadius:8,border:`1px solid ${isDark?"#222":"#ddd"}`,background:step===0?(isDark?"#0d0d1e":"#f5f6ff"):(isDark?"#13132a":"#e8eaff"),color:step===0?(isDark?"#333":"#bbb"):(isDark?"#aaa":"#5555aa"),cursor:step===0?"not-allowed":"pointer",fontSize:13,fontFamily:"inherit" }}>← 上一步</button>
        <span style={{ fontSize:11,opacity:0.4,alignSelf:"center" }}>{step+1}/{steps.length}</span>
        <button onClick={()=>setStep(Math.min(steps.length-1,step+1))} disabled={step===steps.length-1} style={{ padding:"8px 16px",borderRadius:8,border:"none",background:step===steps.length-1?(isDark?"#0d0d1e":"#f5f6ff"):game.color,color:step===steps.length-1?(isDark?"#333":"#bbb"):"#fff",cursor:step===steps.length-1?"not-allowed":"pointer",fontSize:13,fontFamily:"inherit",fontWeight:700 }}>下一步 →</button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("input");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [gameContent, setGameContent] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [selected2D, setSelected2D] = useState(null);
  const [selected3D, setSelected3D] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [spec, setSpec] = useState("");     // 合併後的單一規格書
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [activeTab, setActiveTab] = useState("spec");
  const [isDark, setIsDark] = useState(true);
  const fileRef = useRef();
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_KEY || "";

  const selectedGame = selected3D || selected2D;
  const is3D = !!selected3D;

  // Theme tokens
  const bg      = isDark?"#060612":"#f0f2ff";
  const card    = isDark?"#0e0e20":"#ffffff";
  const border  = isDark?"#1a1a3e":"#d4d8f0";
  const text    = isDark?"#e2e8f0":"#1a1a3e";
  const sub     = isDark?"#6b7280":"#5a5f80";
  const inputBg = isDark?"#080814":"#f5f6ff";

  const handleImage = e => {
    const f = e.target.files[0]; if(!f) return;
    setImage({url:URL.createObjectURL(f),name:f.name});
    const r=new FileReader(); r.onload=ev=>setImageBase64(ev.target.result.split(",")[1]); r.readAsDataURL(f);
  };

  const handleGenerate = async () => {
    if(!selectedGame) return alert("請先選擇遊戲類型");
    if(!gameContent.trim()) return alert("請描述遊戲內容");
    setLoading(true);
    const title = gameTitle || "我的遊戲";
    try {
      let ai = {}; let analysis = "";
      setLoadMsg("Gemini 分析遊戲主題中...");
      if(geminiKey){
        const parts=[];
        if(imageBase64) parts.push({inline_data:{mime_type:"image/jpeg",data:imageBase64}});
        parts.push({text:`你是遊戲設計師，根據以下資訊回傳純 JSON（不要其他文字）：
遊戲標題：${title}
類型：${selectedGame.name}（${is3D?"真實3D":"2D網頁"}遊戲）
描述：${gameContent}
JSON 格式：{"analysis":"3句企劃白話描述","theme":"主題","colors":["主色","副色"],"worldTheme":"世界觀","enemy":"敵人名","item":"道具名","boss":"Boss名","winMsg":"過關訊息"}`});
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts}]})});
          if(res.ok){
            const d=await res.json();
            const raw=d.candidates?.[0]?.content?.parts?.[0]?.text||"";
            const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim());
            ai=parsed; analysis=parsed.analysis||"";
          }
        } catch(_){}
      }
      if(!analysis) analysis=`「${title}」是一款${is3D?"真實 3D":"網頁"}${selectedGame.name}遊戲。${gameContent.slice(0,50)}。使用 ${selectedGame.stack||"Phaser 3"} 技術，操作方式為「${selectedGame.controls}」，目標是「${selectedGame.win}」。完成部署後即可用瀏覽器直接遊玩！`;
      setLoadMsg("產生遊戲規格 YAML...");
      await new Promise(r=>setTimeout(r,200));
      const generatedSpec = buildSpec(selectedGame, is3D, title, gameContent, image?.name, ai);
      setSpec(generatedSpec);
      setAiAnalysis(analysis);
      setPhase("result");
    } finally { setLoading(false); setLoadMsg(""); }
  };

  const downloadSpec = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([spec], { type: "text/markdown" }));
    a.download = `${(gameTitle||"game").toLowerCase().replace(/\s+/g,"-")}-game-spec.md`;
    a.click();
  };

  // ── 分隔線元件 ──
  const SectionDivider = ({label, sublabel, icon, color}) => (
    <div style={{ margin:"8px 0 14px", display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg, ${color}44, transparent)` }} />
      <div style={{ background:`${color}18`, border:`1px solid ${color}44`, borderRadius:20, padding:"6px 16px", display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:18 }}>{icon}</span>
        <div>
          <div style={{ fontWeight:800, fontSize:13, color }}>{label}</div>
          <div style={{ fontSize:10, color:sub }}>{sublabel}</div>
        </div>
      </div>
      <div style={{ flex:1, height:1, background:`linear-gradient(90deg, transparent, ${color}44)` }} />
    </div>
  );

  return (
    <div style={{ minHeight:"100vh",background:bg,color:text,fontFamily:"'Syne',system-ui,sans-serif",position:"relative",transition:"background 0.3s,color 0.3s" }}>
      <div style={{ position:"fixed",inset:0,backgroundImage:`linear-gradient(${isDark?"#1a1a3e0d":"#6b7aff0d"} 1px,transparent 1px),linear-gradient(90deg,${isDark?"#1a1a3e0d":"#6b7aff0d"} 1px,transparent 1px)`,backgroundSize:"40px 40px",pointerEvents:"none",zIndex:0 }} />

      <div style={{ position:"relative",zIndex:1,maxWidth:980,margin:"0 auto",padding:"34px 20px" }}>

        {/* Header */}
        <div style={{ textAlign:"center",marginBottom:32,position:"relative" }}>
          <button onClick={()=>setIsDark(!isDark)} style={{ position:"absolute",top:0,right:0,width:48,height:28,background:isDark?"#1a1a3e":"#e0e4ff",border:`2px solid ${isDark?"#3a3a6e":"#b0b8f0"}`,borderRadius:999,cursor:"pointer",display:"flex",alignItems:"center",padding:"0 4px",transition:"all 0.3s" }}>
            <div style={{ width:18,height:18,borderRadius:"50%",background:isDark?"#4f46e5":"#f59e0b",transform:isDark?"translateX(0)":"translateX(18px)",transition:"transform 0.3s,background 0.3s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>{isDark?"🌙":"☀️"}</div>
          </button>
          <div style={{ display:"inline-block",background:"linear-gradient(135deg,#4f46e5,#7c3aed)",borderRadius:10,padding:"5px 14px",fontSize:10,letterSpacing:3,fontWeight:700,color:"#c4b5fd",marginBottom:12,fontFamily:"'JetBrains Mono',monospace" }}>◈ GEMINI × GAME GENERATOR</div>
          <h1 style={{ fontSize:"clamp(22px,5vw,38px)",fontWeight:900,margin:"0 0 8px",background:"linear-gradient(135deg,#fff 0%,#a78bfa 50%,#818cf8 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-1 }}>網頁遊戲設計工坊</h1>
          <p style={{ color:sub,fontSize:13,margin:0 }}>填資料 → 選遊戲類型（2D 或真實 3D）→ Gemini 產 YAML → 貼給 AI 實作 → Vercel 部署</p>
        </div>

        {phase === "input" ? (
          <div style={{ display:"flex",flexDirection:"column",gap:18 }}>

            {/* 圖片 + 描述 */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:16 }}>
              <div onClick={()=>fileRef.current.click()} style={{ background:card,border:`2px dashed ${image?"#4f46e5":border}`,borderRadius:14,padding:20,cursor:"pointer",textAlign:"center",minHeight:180,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.3s" }}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} />
                {image ? (<><img src={image.url} alt="" style={{ width:"100%",maxHeight:90,objectFit:"cover",borderRadius:8 }} /><div style={{ fontSize:11,color:"#4f46e5",fontWeight:600 }}>✓ {image.name}</div><div style={{ fontSize:10,color:sub }}>點擊重新上傳</div></>) : (<><div style={{ fontSize:32 }}>🖼️</div><div style={{ fontWeight:700,fontSize:13,color:text }}>上傳遊戲圖片</div><div style={{ fontSize:11,color:sub,lineHeight:1.5 }}>主角、場景、賽車塗裝…<br/>JPG / PNG / WebP</div><div style={{ fontSize:10,color:isDark?"#333":"#bbb",marginTop:4,fontStyle:"italic" }}>AI 決定圖片在遊戲中的用途</div></>)}
              </div>
              <div style={{ background:card,border:`1px solid ${border}`,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:12,transition:"background 0.3s" }}>
                <div>
                  <label style={{ fontSize:11,color:sub,display:"block",marginBottom:4 }}>遊戲標題</label>
                  <input value={gameTitle} onChange={e=>setGameTitle(e.target.value)} placeholder="例：星際大戰 / 魔法森林 / 極速賽車手" style={{ width:"100%",background:inputBg,border:`1px solid ${border}`,borderRadius:8,padding:"8px 12px",color:text,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.3s" }} />
                </div>
                <div style={{ flex:1 }}>
                  <label style={{ fontSize:11,color:sub,display:"block",marginBottom:4 }}>遊戲內容描述 <span style={{ color:isDark?"#333":"#bbb",fontSize:10 }}>（Gemini 會根據這段描述填入所有遊戲細節）</span></label>
                  <textarea value={gameContent} onChange={e=>setGameContent(e.target.value)} placeholder="描述遊戲主題、世界觀、角色、故事背景...&#10;&#10;例：在2099年的廢土世界，玩家駕駛改裝賽車在廢棄城市的賽道上競速，對抗 AI 機器人車隊，收集零件升級車輛..." style={{ width:"100%",height:138,background:inputBg,border:`1px solid ${border}`,borderRadius:8,padding:"8px 12px",color:text,fontSize:13,lineHeight:1.6,resize:"none",outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"background 0.3s" }} />
                </div>
              </div>
            </div>

            {/* ── SECTION A：2D 遊戲 ── */}
            <SectionDivider
              label="2D / 2.5D 網頁遊戲"
              sublabel="Phaser 3 驅動 · 輕量快速 · 新手友善"
              icon="🎮"
              color="#4f46e5"
            />
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10 }}>
              {GAMES_2D.map(g=>(
                <GameCard2D key={g.id} g={g} selected={selected2D?.id===g.id} onSelect={g=>{setSelected2D(g);setSelected3D(null)}} isDark={isDark} />
              ))}
            </div>

            {/* ── SECTION B：真實 3D 遊戲 ── */}
            <SectionDivider
              label="真實 3D 遊戲（皮克斯風格）"
              sublabel="React Three Fiber + Rapier 物理 · Smooth Mesh · 電影級軟陰影 · 禁止 Low-poly / Voxel / 積木"
              icon="🎬"
              color="#e74c3c"
            />
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12 }}>
              {GAMES_3D.map(g=>(
                <GameCard3D key={g.id} g={g} selected={selected3D?.id===g.id} onSelect={g=>{setSelected3D(g);setSelected2D(null)}} isDark={isDark} />
              ))}
            </div>

            {/* 產出按鈕 */}
            <button onClick={handleGenerate} disabled={loading||!selectedGame||!gameContent.trim()} style={{
              width:"100%",padding:"14px 24px",border:"none",borderRadius:12,
              background:loading||!selectedGame||!gameContent.trim()?(isDark?"#13132a":"#e8eaff"):"linear-gradient(135deg,#4f46e5,#7c3aed)",
              color:loading||!selectedGame||!gameContent.trim()?(isDark?"#333":"#aaa"):"#fff",
              fontSize:15,fontWeight:800,cursor:loading||!selectedGame||!gameContent.trim()?"not-allowed":"pointer",
              fontFamily:"inherit",transition:"all 0.3s",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            }}>
              {loading?(<><div style={{ width:16,height:16,border:"2px solid #555",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />{loadMsg||"處理中..."}</>):"✨ 用 Gemini 產出遊戲規格 YAML"}
            </button>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>

        ) : (
          /* Result Phase */
          <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
            <div style={{ display:"flex",alignItems:"center",gap:12 }}>
              <button onClick={()=>setPhase("input")} style={{ background:isDark?"#13132a":"#e8eaff",border:`1px solid ${border}`,color:isDark?"#aaa":"#5555aa",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>← 返回</button>
              <div>
                <div style={{ fontWeight:800,fontSize:15 }}>{selectedGame.emoji} {gameTitle||"我的遊戲"} <span style={{ fontSize:11,color:sub,fontWeight:400 }}>— {selectedGame.name}{is3D?" (真實 3D)":""}</span></div>
                <div style={{ fontSize:11,color:sub }}>{selectedGame.stack||"Phaser 3 + Next.js"} · Vercel 部署</div>
              </div>
              {is3D&&<div style={{ marginLeft:"auto",background:"#e74c3c22",border:"1px solid #e74c3c44",borderRadius:8,padding:"4px 12px",fontSize:11,color:"#e74c3c",fontWeight:700 }}>🌐 真實 3D</div>}
            </div>

            {aiAnalysis&&(
              <div style={{ background:"#4f46e514",border:"1px solid #4f46e533",borderRadius:12,padding:16 }}>
                <div style={{ color:"#a78bfa",fontSize:12,fontWeight:700,marginBottom:6 }}>✨ Gemini 遊戲企劃分析</div>
                <p style={{ margin:0,fontSize:14,lineHeight:1.7,color:isDark?"#c4b5fd":"#5b3fd4" }}>{aiAnalysis}</p>
              </div>
            )}

            <div style={{ display:"flex",gap:3,background:isDark?"#080814":"#e8eaff",padding:4,borderRadius:10,border:`1px solid ${border}` }}>
              {[{id:"spec",label:"📋 遊戲規格書（YAML + MD 合併）"},{id:"deploy",label:"🤖 AI 實作 + 部署引導"}].map(({id,label})=>(
                <button key={id} onClick={()=>setActiveTab(id)} style={{ flex:1,padding:"8px 10px",borderRadius:8,border:"none",background:activeTab===id?selectedGame.color:"transparent",color:activeTab===id?"#fff":sub,cursor:"pointer",fontSize:12,fontWeight:activeTab===id?700:400,fontFamily:"inherit",transition:"all 0.2s" }}>{label}</button>
              ))}
            </div>

            {activeTab==="spec"&&(
              <div style={{ background:card,border:`1px solid ${border}`,borderRadius:14,overflow:"hidden" }}>
                <div style={{ padding:"12px 18px",borderBottom:`1px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
                  <div>
                    <span style={{ fontWeight:700,fontSize:13,fontFamily:"'JetBrains Mono',monospace",color:text }}>📋 game-spec.md</span>
                    <span style={{ marginLeft:8,fontSize:11,color:sub }}>YAML 設定 + Markdown 說明 = 單一規格書，直接給 AI 就能做出正確遊戲</span>
                  </div>
                  <div style={{ display:"flex",gap:8 }}>
                    <button onClick={()=>navigator.clipboard.writeText(spec).catch(()=>{})} style={{ background:isDark?"#1a1a3e":"#e8eaff",border:`1px solid ${border}`,color:isDark?"#a78bfa":"#5555aa",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"inherit" }}>📋 複製全文</button>
                    <button onClick={downloadSpec} style={{ background:selectedGame.color,border:"none",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap" }}>⬇ 下載 .md</button>
                  </div>
                </div>
                <div style={{ position:"relative" }}>
                  <pre style={{ margin:0,padding:16,fontSize:11,lineHeight:1.85,overflowX:"auto",fontFamily:"'JetBrains Mono',monospace",background:isDark?"#000":"#1a1a2e",maxHeight:580,whiteSpace:"pre-wrap",wordBreak:"break-word" }}>
                    {spec.split("\n").map((line,i)=>{
                      let c = isDark?"#c9d1d9":"#ccc";
                      if(line.startsWith("# "))       c="#a78bfa";
                      else if(line.startsWith("## ")) c="#7ec8e3";
                      else if(line.startsWith("### "))c="#f9c74f";
                      else if(line.startsWith("> "))  c="#888";
                      else if(line.startsWith("- ✅"))c="#a8e6cf";
                      else if(line.startsWith("- "))  c="#a8e6cf";
                      else if(line.startsWith("|"))   c="#ffd166";
                      else if(line.startsWith("```")) c="#ff9a76";
                      else if(line.startsWith("  #")) c="#3a3a5c";
                      else if(/^[a-z_]+:/.test(line.trim())) c="#7ec8e3";
                      return <div key={i} style={{ color:c }}>{line||" "}</div>;
                    })}
                  </pre>
                </div>
              </div>
            )}

            {activeTab==="deploy"&&<DeployGuide game={selectedGame} is3D={is3D} gameTitle={gameTitle||"我的遊戲"} yaml={spec} isDark={isDark} />}
          </div>
        )}
      </div>
    </div>
  );
}
