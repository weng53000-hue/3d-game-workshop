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
const GAMES_3D = [
  {
    id: "racing_3d",
    emoji: "🏎️",
    name: "3D 賽車競速",
    tagline: "像附圖那樣！真實 3D 視角在賽道上高速競速",
    desc: "有真實物理引擎的第三人稱賽車遊戲，漂移過彎、衝刺直線，挑戰最快圈速。",
    controls: "WASD / 方向鍵 控制車輛  空白鍵 手煞車漂移",
    win: "完成圈數、最快時間",
    color: "#e74c3c",
    diff: "⭐⭐ 一般",
    diffColor: "#e67e22",
    features: ["真實車輛物理", "第三人稱視角", "計時系統", "賽道碰撞"],
    imageUse: "賽車塗裝或車隊 Logo",
    stack: "React Three Fiber + Rapier 物理引擎",
    github: "https://github.com/pmndrs/racing-game",
    githubNote: "pmndrs 官方出品，CC0 素材，社群共建",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei @react-three/rapier", "npm install zustand leva"],
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
    name: "3D 第一人稱射擊",
    tagline: "FPS 視角在 3D 場景中移動瞄準射擊",
    desc: "第一人稱視角射擊遊戲，3D 場景中自由移動，有碰撞偵測、彈道系統、敵人 AI。",
    controls: "WASD 移動  滑鼠瞄準  左鍵射擊  Space 跳躍",
    win: "擊倒所有敵人",
    color: "#c0392b",
    diff: "⭐⭐⭐ 進階",
    diffColor: "#c0392b",
    features: ["FPS 視角", "3D 碰撞偵測", "彈道物理", "敵人 AI"],
    imageUse: "玩家頭像或武器貼圖",
    stack: "Three.js + Solid.js（開源 FPS 框架）",
    github: "https://github.com/lume/lume",
    githubNote: "開源 FPS 基礎框架，可分享連結多人遊玩",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei @react-three/rapier", "npm install ecctrl zustand"],
    preview: "https://lume.io/",
    docs: [
      { label: "🎯 lume FPS GitHub", url: "https://github.com/lume/lume" },
      { label: "🕹 ecctrl 角色控制器", url: "https://github.com/pmndrs/ecctrl" },
      { label: "📘 React Three Fiber 文件", url: "https://docs.pmnd.rs/react-three-fiber" },
      { label: "⚡ Rapier 物理引擎", url: "https://rapier.rs/" },
    ],
  },
  {
    id: "marble_3d",
    emoji: "⚽",
    name: "3D 滾球闖關",
    tagline: "控制球在立體關卡上滾動，不掉落就能過關",
    desc: "類似 Super Monkey Ball，控制一顆球在懸空平台上滾動前進，掉落就重來，到達終點過關。",
    controls: "WASD / 方向鍵 控制滾動方向",
    win: "球滾到終點平台",
    color: "#9b59b6",
    diff: "⭐ 新手",
    diffColor: "#27ae60",
    features: ["真實滾球物理", "懸空平台", "多關卡", "重力感應"],
    imageUse: "球的貼圖外觀（用你的照片貼在球上！）",
    stack: "React Three Fiber + Rapier + Zustand",
    github: "https://github.com/pmndrs/react-three-rapier",
    githubNote: "pmndrs 出品 Rapier 物理套件，官方含 marble race 範例",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei", "npm install @react-three/rapier zustand"],
    preview: "https://github.com/pmndrs/react-three-rapier",
    docs: [
      { label: "⚽ react-three-rapier GitHub", url: "https://github.com/pmndrs/react-three-rapier" },
      { label: "📘 Rapier 物理引擎", url: "https://rapier.rs/" },
      { label: "🎮 Marble Race 範例", url: "https://github.com/topics/r3f?o=asc&s=stars" },
      { label: "🌐 Drei 輔助元件", url: "https://github.com/pmndrs/drei" },
    ],
  },
  {
    id: "platformer_3d",
    emoji: "🗺️",
    name: "3D 立體冒險",
    tagline: "在真實立體世界中跑跳探索，有物理碰撞的 3D 關卡",
    desc: "類似低多邊形風格的 3D 平台冒險，在立體場景中跑跳、收集物品、到達終點。有角色動畫與完整物理引擎。",
    controls: "WASD 移動  Space 跳躍  Shift 衝刺",
    win: "收集所有物品並到達終點",
    color: "#27ae60",
    diff: "⭐⭐ 一般",
    diffColor: "#e67e22",
    features: ["3D 角色控制", "跳躍物理", "低多邊形美術", "收集系統"],
    imageUse: "角色貼圖或場景主題色",
    stack: "React Three Fiber + ecctrl 角色控制器 + Rapier",
    github: "https://github.com/pmndrs/ecctrl",
    githubNote: "pmndrs 出品角色控制器，直接整合物理引擎",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei", "npm install ecctrl @react-three/rapier zustand"],
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
    name: "3D 地城冒險 RPG",
    tagline: "第三人稱在 3D 地城中探索、打怪、找寶藏",
    desc: "低多邊形風格的 3D 地城，第三人稱視角操控角色探索迷宮般的地城，與怪物戰鬥，找到出口進入下一層。",
    controls: "WASD 移動  Space 跳躍  左鍵 攻擊",
    win: "打敗關主並找到出口",
    color: "#8e44ad",
    diff: "⭐⭐⭐ 進階",
    diffColor: "#c0392b",
    features: ["3D 地城生成", "戰鬥系統", "怪物 AI", "NPC 互動"],
    imageUse: "主角角色貼圖或怪物外觀",
    stack: "React Three Fiber + Yuka AI + Rapier",
    github: "https://github.com/ssethsara/react-three-npc",
    githubNote: "Yuka.js NPC AI 系統，整合 R3F 角色尋路",
    vercelDeploy: true,
    install: ["npm install three @react-three/fiber @react-three/drei", "npm install @ssethsara/react-three-npc ecctrl @react-three/rapier"],
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
    name: "3D 太空射擊",
    tagline: "在太空中駕駛飛船，閃躲隕石、擊落敵艦",
    desc: "3D 太空環境，玩家駕駛太空船自由飛行，擊落敵方飛船與隕石群，關卡越深越難。視覺效果華麗。",
    controls: "WASD 飛行方向  滑鼠瞄準  左鍵射擊",
    win: "擊敗所有波次敵艦",
    color: "#2980b9",
    diff: "⭐⭐ 一般",
    diffColor: "#e67e22",
    features: ["3D 飛行物理", "粒子爆炸特效", "敵艦波次", "武器升級"],
    imageUse: "飛船外觀貼圖或陣營標誌",
    stack: "React Three Fiber + Drei + Zustand",
    github: "https://github.com/pmndrs/react-three-fiber",
    githubNote: "R3F 官方生態，豐富太空場景元件",
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

// ── YAML Builder ──────────────────────────────────────────────────────────────
function buildYAML(game, is3D, gameTitle, gameDesc, imageName, ai) {
  const slug = (gameTitle||"my-game").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
  const a = ai || {};
  const obj = {
    meta: {
      game_title: gameTitle || "我的遊戲",
      game_slug: slug,
      game_type: game.id,
      is_3d: is3D,
      description: gameDesc,
      created_at: new Date().toISOString().split("T")[0],
      player_image: imageName ? `public/assets/${imageName}` : "public/assets/player.png",
      image_role: game.imageUse || (is3D ? "3D 場景素材" : "遊戲主角圖片"),
    },
    tech: {
      framework: "Next.js 14 (App Router)",
      engine: game.stack || (is3D ? "React Three Fiber + Rapier" : "Phaser 3"),
      deploy: "Vercel",
      node: "20",
      packages: is3D ? (game.install || []) : ["phaser", "next"],
    },
    gameplay: {
      type: game.id,
      controls: game.controls,
      win_condition: game.win,
      features: game.features,
      ...(is3D ? {
        physics_engine: "Rapier (WASM)",
        render_mode: "WebGL / Three.js",
        camera: game.id === "fps_3d" ? "first_person" : "third_person",
        world_theme: a.worldTheme || gameDesc.slice(0,30),
        player_model: "low_poly_character",
        map_size: "medium",
      } : {
        resolution: "800x600",
        world_theme: a.worldTheme || gameDesc.slice(0,30),
      }),
    },
    customization: {
      title_screen_text: gameTitle || "我的遊戲",
      background_theme: a.theme || gameDesc.slice(0,20),
      color_primary: (a.colors||[])[0] || "#4f46e5",
      color_secondary: (a.colors||[])[1] || "#7c3aed",
      enemy_name: a.enemy || "怪物",
      item_name: a.item || "星星",
      boss_name: a.boss || "終極Boss",
      win_message: a.winMsg || "恭喜過關！你太厲害了！",
      language: "zh-TW",
    },
    ai_build_instructions: {
      summary: `請依照此 YAML 設定，用 ${game.stack || "Next.js + Phaser 3"} 實作一個完整可玩的「${game.name}」遊戲。`,
      image_instruction: `上傳圖片路徑：public/assets/${imageName||"player.png"}，用途：${game.imageUse || "遊戲主角"}`,
      required_features: game.features,
      must_be_playable: true,
      language_zh_tw: true,
      deploy_ready: true,
      ...(is3D && {
        github_template: game.github,
        clone_first: `git clone ${game.github} ${slug}`,
        install_cmd: (game.install||[]).join(" && "),
        note: `這是一個真實 3D 遊戲，請使用 React Three Fiber + Rapier 物理引擎，參考 ${game.github} 的實作方式。`,
      }),
    },
    deploy_steps: [
      { step:1, cmd: `npx create-next-app@latest ${slug} --typescript --tailwind --app` },
      { step:2, cmd: (game.install||["npm install phaser"]).join(" && ") },
      { step:3, cmd: "mkdir -p public/assets" },
      { step:4, cmd: "# 把此 YAML 放入專案根目錄：game-config.yml" },
      { step:5, cmd: "# 把下方完整 Prompt 貼給 Codex 或 Claude Code" },
      { step:6, cmd: "npm run dev" },
      { step:7, cmd: "npx vercel --prod" },
    ],
  };
  return jsonToYaml(obj);
}

function jsonToYaml(obj, indent=0) {
  const pad = "  ".repeat(indent);
  let out = "";
  for (const [k,v] of Object.entries(obj)) {
    if (v===null||v===undefined) continue;
    if (Array.isArray(v)) {
      out += `${pad}${k}:\n`;
      for (const item of v) {
        if (typeof item==="object") {
          const lines = jsonToYaml(item,indent+2).split("\n").filter(Boolean);
          out += `${"  ".repeat(indent+1)}- ${lines[0].trim()}\n`;
          for (let i=1;i<lines.length;i++) out += `${lines[i]}\n`;
        } else out += `${"  ".repeat(indent+1)}- "${item}"\n`;
      }
    } else if (typeof v==="object") {
      out += `${pad}${k}:\n${jsonToYaml(v,indent+1)}`;
    } else {
      out += `${pad}${k}: ${typeof v==="string"?`"${v}"`:v}\n`;
    }
  }
  return out;
}

function buildPrompt(game, is3D, gameTitle, yaml, tool) {
  const base = `我要建立一個「${game.name}」類型的網頁遊戲，遊戲標題是「${gameTitle}」。

## 技術棧
${game.stack || "Next.js 14 + Phaser 3"}
部署平台：Vercel

${is3D ? `## 3D 遊戲特別說明
這是一個真實 3D 遊戲，請使用 React Three Fiber（R3F）+ Rapier 物理引擎實作。
參考這個 GitHub 專案的架構：${game.github}
` : ""}
## 遊戲規格（來自 YAML）
\`\`\`yaml
${yaml}
\`\`\`

## 必須實作的功能
${game.features.map(f=>`- ${f}`).join("\n")}

## 操作方式
${game.controls}

## 過關條件
${game.win}

## 要求
- 遊戲嵌入 Next.js 的 /game 路由頁面
- 所有 UI 使用繁體中文
- 在桌機 1280x720 正常遊玩
- 圖片放在 public/assets/ 並套用至 YAML 指定用途
- 完成後可直接 vercel --prod 部署`;

  return tool === "claude"
    ? base + "\n\n請直接開始實作，優先完成可玩版本，再做美化。"
    : base + "\n\n請逐步實作，先完成核心遊戲邏輯，再加 UI 與美術。";
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
  const [yaml, setYaml] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [activeTab, setActiveTab] = useState("yaml");
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
      setYaml(buildYAML(selectedGame, is3D, title, gameContent, image?.name, ai));
      setAiAnalysis(analysis);
      setPhase("result");
    } finally { setLoading(false); setLoadMsg(""); }
  };

  const downloadYAML = () => {
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([yaml],{type:"text/yaml"}));
    a.download=`${(gameTitle||"game").toLowerCase().replace(/\s+/g,"-")}-game-config.yml`;
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
              label="真實 3D 遊戲"
              sublabel="React Three Fiber + Rapier 物理引擎 · GitHub 開源套件 · 可 Vercel 部署"
              icon="🌐"
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
              {[{id:"yaml",label:"📄 遊戲規格 YAML"},{id:"deploy",label:"🤖 AI 實作 + 部署引導"}].map(({id,label})=>(
                <button key={id} onClick={()=>setActiveTab(id)} style={{ flex:1,padding:"8px 14px",borderRadius:8,border:"none",background:activeTab===id?selectedGame.color:"transparent",color:activeTab===id?"#fff":sub,cursor:"pointer",fontSize:13,fontWeight:activeTab===id?700:400,fontFamily:"inherit",transition:"all 0.2s" }}>{label}</button>
              ))}
            </div>

            {activeTab==="yaml"&&(
              <div style={{ background:card,border:`1px solid ${border}`,borderRadius:14,overflow:"hidden" }}>
                <div style={{ padding:"12px 18px",borderBottom:`1px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                  <div>
                    <span style={{ fontWeight:700,fontSize:13,fontFamily:"'JetBrains Mono',monospace",color:text }}>📄 game-config.yml</span>
                    <span style={{ marginLeft:10,fontSize:11,color:sub }}>包含完整遊戲規格，直接貼給 Codex / Claude Code 就能實作</span>
                  </div>
                  <button onClick={downloadYAML} style={{ background:selectedGame.color,border:"none",color:"#fff",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"inherit",whiteSpace:"nowrap" }}>⬇ 下載 YML</button>
                </div>
                <pre style={{ margin:0,padding:16,fontSize:11.5,lineHeight:1.9,overflowX:"auto",fontFamily:"'JetBrains Mono',monospace",background:isDark?"#000":"#1a1a2e",maxHeight:520 }}>
                  {yaml.split("\n").map((line,i)=>{
                    let c="#a8e6cf";
                    if(line.trim().startsWith("#")) c="#3a3a5c";
                    else if(/^[a-z_]+:/.test(line.trim())) c="#7ec8e3";
                    else if(line.trim().startsWith("-")) c="#f9c74f";
                    else if(line.includes('"')) c="#ffd166";
                    return <div key={i} style={{ color:c }}>{line||" "}</div>;
                  })}
                </pre>
              </div>
            )}
            {activeTab==="deploy"&&<DeployGuide game={selectedGame} is3D={is3D} gameTitle={gameTitle||"我的遊戲"} yaml={yaml} isDark={isDark} />}
          </div>
        )}
      </div>
    </div>
  );
}
