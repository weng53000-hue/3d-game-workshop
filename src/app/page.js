'use client'

import { useState, useRef } from "react";

// ── 3D Template Definitions ──────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: "threejs-rpg",
    name: "闖關冒險遊戲",
    emoji: "⚔️",
    tagline: "像薩爾達傳說那樣，在 3D 世界裡走動、打怪、探索地圖",
    plain: "角色可以在立體世界裡自由移動，有地圖、有敵人、有任務。適合想做 RPG 或冒險故事類遊戲的學員。",
    whoFor: "想說一個冒險故事的人",
    feel: "🗺️ 有地圖可以走  ⚔️ 可以打怪  💬 可以跟 NPC 說話",
    difficulty: "需要一點程式基礎",
    diffColor: "#e67e22",
    github: "https://github.com/NikLever/THREEjs_RPG_Game",
    stack: "Three.js + Vite",
    deploy: "Vercel",
    color: "#c0392b",
    docs: [
      { label: "📘 Three.js 官方文件", url: "https://threejs.org/docs/" },
      { label: "🎮 模板 GitHub", url: "https://github.com/NikLever/THREEjs_RPG_Game" },
      { label: "▲ Vercel 部署指南", url: "https://vercel.com/docs/deployments/overview" },
      { label: "⚡ Vite 快速上手", url: "https://vitejs.dev/guide/" },
    ],
    yaml_template: `name: threejs-rpg-game
description: "{{GAME_TITLE}} - 3D RPG 冒險遊戲"
template:
  source: https://github.com/NikLever/THREEjs_RPG_Game
  type: threejs-vite

config:
  game_title: "{{GAME_TITLE}}"
  game_theme: "{{GAME_THEME}}"
  player_image: "{{IMAGE_PATH}}"

build:
  framework: vite
  node_version: "20"
  install_cmd: npm install
  build_cmd: npm run build
  output_dir: dist

deploy:
  platform: vercel
  project_name: "{{PROJECT_SLUG}}"
  env:
    VITE_GAME_TITLE: "{{GAME_TITLE}}"
    VITE_GAME_THEME: "{{GAME_THEME}}"

assets:
  player_sprite: "{{IMAGE_PATH}}"
  world_theme: "{{GAME_THEME}}"

steps:
  - name: 下載模板
    run: git clone https://github.com/NikLever/THREEjs_RPG_Game {{PROJECT_SLUG}}
  - name: 安裝套件
    run: cd {{PROJECT_SLUG}} && npm install
  - name: 設定遊戲
    run: echo "VITE_GAME_TITLE={{GAME_TITLE}}" > .env.local
  - name: 建置
    run: npm run build
  - name: 部署
    run: npx vercel --prod`,
  },
  {
    id: "idle-rpg",
    name: "放置型養成遊戲",
    emoji: "🧙",
    tagline: "不用一直按按鈕，角色自動升級、自動戰鬥，玩家專注在策略分配",
    plain: "玩家設定好角色技能跟裝備，遊戲就會自動跑。適合想做模擬養成、學習成長類遊戲的學員，程式量相對少。",
    whoFor: "想做角色養成或學習模擬的人",
    feel: "📈 角色自動升級  🎒 收集裝備  🧩 策略分配點數",
    difficulty: "程式初學者也能上手",
    diffColor: "#27ae60",
    github: "https://github.com/GoldinGuy/OpenSourceRpg",
    stack: "React + TypeScript + Vite",
    deploy: "Vercel",
    color: "#8e44ad",
    docs: [
      { label: "📘 React 官方文件", url: "https://react.dev" },
      { label: "🎮 模板 GitHub", url: "https://github.com/GoldinGuy/OpenSourceRpg" },
      { label: "📦 TypeScript 入門", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
      { label: "▲ Vercel 部署指南", url: "https://vercel.com/docs/frameworks/vite" },
    ],
    yaml_template: `name: idle-rpg-game
description: "{{GAME_TITLE}} - 放置養成遊戲"
template:
  source: https://github.com/GoldinGuy/OpenSourceRpg
  type: react-vite-typescript

config:
  game_title: "{{GAME_TITLE}}"
  game_theme: "{{GAME_THEME}}"

build:
  framework: vite
  node_version: "20"
  install_cmd: npm install
  build_cmd: npm run build
  output_dir: dist
  typescript: true

deploy:
  platform: vercel
  project_name: "{{PROJECT_SLUG}}"
  env:
    VITE_GAME_TITLE: "{{GAME_TITLE}}"

assets:
  hero_image: "{{IMAGE_PATH}}"

steps:
  - name: 下載模板
    run: git clone https://github.com/GoldinGuy/OpenSourceRpg {{PROJECT_SLUG}}
  - name: 安裝套件
    run: cd {{PROJECT_SLUG}} && npm install
  - name: 設定遊戲
    run: echo "VITE_GAME_TITLE={{GAME_TITLE}}" > .env.local
  - name: 建置
    run: npm run build
  - name: 部署
    run: npx vercel --prod`,
  },
  {
    id: "nextjs-3d",
    name: "互動場景展示",
    emoji: "🏰",
    tagline: "在網頁裡放一個可以旋轉、縮放的 3D 場景，用滑鼠就能操控",
    plain: "畫面有漂亮的 3D 物件，使用者可以用滑鼠拖拉旋轉。適合想做作品展示、互動說明或虛擬展覽的學員，部署到 Vercel 最快速。",
    whoFor: "想做作品展示或互動介紹的人",
    feel: "🖱️ 滑鼠拖拉旋轉  ✨ 3D 燈光效果  📱 手機也能看",
    difficulty: "最容易部署，新手推薦",
    diffColor: "#27ae60",
    github: "https://github.com/mooncat126/threejs-control-game",
    stack: "Next.js + React Three Fiber",
    deploy: "Vercel（一鍵部署）",
    color: "#27ae60",
    docs: [
      { label: "📘 React Three Fiber 文件", url: "https://docs.pmnd.rs/react-three-fiber" },
      { label: "🎮 模板 GitHub", url: "https://github.com/mooncat126/threejs-control-game" },
      { label: "▲ Next.js + Vercel 指南", url: "https://nextjs.org/docs/deployment" },
      { label: "🎨 Drei 輔助元件庫", url: "https://github.com/pmndrs/drei" },
    ],
    yaml_template: `name: nextjs-3d-scene
description: "{{GAME_TITLE}} - 互動 3D 場景"
template:
  source: https://github.com/mooncat126/threejs-control-game
  type: nextjs-r3f

config:
  game_title: "{{GAME_TITLE}}"
  world_theme: "{{GAME_THEME}}"

build:
  framework: nextjs
  node_version: "20"
  install_cmd: npm install
  build_cmd: npm run build
  output_dir: .next

deploy:
  platform: vercel
  project_name: "{{PROJECT_SLUG}}"
  env:
    NEXT_PUBLIC_GAME_TITLE: "{{GAME_TITLE}}"
    NEXT_PUBLIC_THEME: "{{GAME_THEME}}"

steps:
  - name: 建立 Next.js 專案
    run: npx create-next-app@latest {{PROJECT_SLUG}} --typescript --tailwind --app
  - name: 安裝 3D 套件
    run: cd {{PROJECT_SLUG}} && npm install three @react-three/fiber @react-three/drei
  - name: 設定環境變數
    run: echo "NEXT_PUBLIC_GAME_TITLE={{GAME_TITLE}}" > .env.local
  - name: 部署到 Vercel
    run: npx vercel --prod`,
  },
  {
    id: "phaser-topdown",
    name: "俯視角地圖遊戲",
    emoji: "🗺️",
    tagline: "像早期神奇寶貝或勇者鬥惡龍那樣，從上往下看的 2.5D 地圖冒險",
    plain: "畫面從上往下看，可以畫地圖格子、設定路徑。適合想做教學關卡、解謎遊戲或校園地圖探索的學員，資源最豐富。",
    whoFor: "想做關卡設計或解謎遊戲的人",
    feel: "🗺️ 自由畫地圖  🧩 設計關卡  👾 碰撞偵測",
    difficulty: "文件最多，社群最大",
    diffColor: "#2980b9",
    github: "https://github.com/photonstorm/phaser3-project-template",
    stack: "Phaser 3 + Webpack",
    deploy: "Vercel Static",
    color: "#e67e22",
    docs: [
      { label: "📘 Phaser 3 官方文件", url: "https://phaser.io/phaser3" },
      { label: "🎮 模板 GitHub", url: "https://github.com/photonstorm/phaser3-project-template" },
      { label: "🗺️ Tiled 地圖編輯器", url: "https://www.mapeditor.org/" },
      { label: "▲ Vercel Static 部署", url: "https://vercel.com/docs/deployments/overview" },
      { label: "📚 Phaser 範例庫", url: "https://phaser.io/examples" },
    ],
    yaml_template: `name: phaser3-topdown
description: "{{GAME_TITLE}} - 俯視角地圖遊戲"
template:
  source: https://github.com/photonstorm/phaser3-project-template
  type: phaser3-webpack

config:
  game_title: "{{GAME_TITLE}}"
  game_width: 800
  game_height: 600
  tile_theme: "{{GAME_THEME}}"

build:
  framework: webpack
  node_version: "20"
  install_cmd: npm install
  build_cmd: npm run build
  output_dir: dist

deploy:
  platform: vercel
  project_name: "{{PROJECT_SLUG}}"

assets:
  player_sprite: "{{IMAGE_PATH}}"
  map_theme: "{{GAME_THEME}}"

steps:
  - name: 下載 Phaser 模板
    run: git clone https://github.com/photonstorm/phaser3-project-template {{PROJECT_SLUG}}
  - name: 安裝 Phaser
    run: cd {{PROJECT_SLUG}} && npm install phaser
  - name: 建置
    run: npm run build
  - name: 部署
    run: npx vercel dist --prod`,
  },
  {
    id: "babylon-world",
    name: "全真實感 3D 世界",
    emoji: "🌍",
    tagline: "有陰影、有光線、有物理效果，像 Unity 遊戲那樣的真實感 3D 場景",
    plain: "畫面最接近真實遊戲，有陰影、有重力、物體會碰撞。適合想挑戰高品質視覺、做出接近商業遊戲質感的進階學員。",
    whoFor: "想做高品質視覺、挑戰進階的人",
    feel: "💡 真實陰影燈光  🌊 物理碰撞效果  🎬 電影感畫面",
    difficulty: "適合有程式基礎的進階學員",
    diffColor: "#c0392b",
    github: "https://github.com/BabylonJS/Babylon.js",
    stack: "Babylon.js + Vite + TypeScript",
    deploy: "Vercel",
    color: "#2980b9",
    docs: [
      { label: "📘 Babylon.js 官方文件", url: "https://doc.babylonjs.com/" },
      { label: "🎮 Babylon.js GitHub", url: "https://github.com/BabylonJS/Babylon.js" },
      { label: "🛝 Babylon.js Playground", url: "https://playground.babylonjs.com/" },
      { label: "▲ Vercel + Vite 指南", url: "https://vercel.com/docs/frameworks/vite" },
      { label: "🎨 Babylon.js 範例", url: "https://www.babylonjs.com/community/" },
    ],
    yaml_template: `name: babylon-3d-world
description: "{{GAME_TITLE}} - 全真實感 3D 世界"
template:
  source: https://github.com/BabylonJS/Babylon.js
  type: babylonjs-vite

config:
  game_title: "{{GAME_TITLE}}"
  world_name: "{{GAME_THEME}} World"
  physics_engine: cannon.js
  shadow_quality: high

build:
  framework: vite
  node_version: "20"
  install_cmd: npm install
  build_cmd: npm run build
  output_dir: dist

deploy:
  platform: vercel
  project_name: "{{PROJECT_SLUG}}"
  env:
    VITE_GAME_TITLE: "{{GAME_TITLE}}"

assets:
  character_model: "{{IMAGE_PATH}}"
  world_theme: "{{GAME_THEME}}"

steps:
  - name: 建立 Vite 專案
    run: npm create vite@latest {{PROJECT_SLUG}} -- --template vanilla-ts
  - name: 安裝 Babylon.js
    run: cd {{PROJECT_SLUG}} && npm install @babylonjs/core @babylonjs/loaders @babylonjs/materials
  - name: 安裝物理引擎
    run: npm install cannon-es
  - name: 設定環境變數
    run: echo "VITE_GAME_TITLE={{GAME_TITLE}}" > .env
  - name: 建置
    run: npm run build
  - name: 部署
    run: npx vercel --prod`,
  },
];

// ── YAML Generator ───────────────────────────────────────────────────────────
function generateYAML(template, gameTitle, gameTheme, imageName) {
  const slug = gameTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "my-3d-game";
  return template.yaml_template
    .replace(/\{\{GAME_TITLE\}\}/g, gameTitle)
    .replace(/\{\{GAME_THEME\}\}/g, gameTheme)
    .replace(/\{\{PROJECT_SLUG\}\}/g, slug)
    .replace(/\{\{IMAGE_PATH\}\}/g, imageName ? `public/assets/${imageName}` : "public/assets/hero.png");
}

// ── Deploy Steps ─────────────────────────────────────────────────────────────
function DeployGuide({ template, gameTitle }) {
  const [activeStep, setActiveStep] = useState(0);
  const slug = gameTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "my-3d-game";

  const steps = [
    {
      icon: "🛠️", tool: "準備環境",
      title: "安裝電腦工具",
      desc: "先把必要程式裝好，之後每次做新專案都不用再裝",
      commands: [
        "# 步驟一：到官網下載 Node.js（選 LTS 版本）",
        "# https://nodejs.org",
        "",
        "# 步驟二：開終端機，確認安裝成功",
        "node --version",
        "npm --version",
        "",
        "# 步驟三：安裝 Vercel 部署工具",
        "npm install -g vercel",
        "",
        "# 步驟四：登入 Vercel 帳號",
        "vercel login",
      ],
      codex: `請幫我設定開發環境。確認 Node.js 版本是否 >= 20，如果沒有請告訴我去哪下載。然後執行 npm install -g vercel 安裝部署工具，最後執行 vercel login 讓我可以登入帳號。`,
      claude: `幫我做環境準備：1) 檢查 node --version 確認 >= 20，2) npm install -g vercel，3) vercel login。如果有任何問題請告訴我怎麼修。`,
    },
    {
      icon: "📦", tool: "下載模板",
      title: `取得「${template.name}」模板`,
      desc: "把遊戲的基本架構下載到你的電腦",
      commands: [
        `# 下載模板原始碼`,
        `git clone ${template.github} ${slug}`,
        ``,
        `# 進入專案資料夾`,
        `cd ${slug}`,
        ``,
        `# 安裝所需套件（等它跑完就好）`,
        `npm install`,
        ``,
        `# 確認資料夾結構正確`,
        `ls`,
      ],
      codex: `請執行：1) git clone ${template.github} ${slug}，2) cd ${slug}，3) npm install。如果 clone 失敗請嘗試下載 ZIP 並解壓縮。安裝完成後列出資料夾內容確認正常。`,
      claude: `幫我克隆 ${template.github} 到資料夾 ${slug}，然後 cd 進去執行 npm install。完成後用 ls 列出檔案結構讓我確認。`,
    },
    {
      icon: "🖼️", tool: "放入素材",
      title: "把你的圖片放進遊戲",
      desc: "將上傳的照片放到正確位置，讓遊戲能讀取",
      commands: [
        `# 建立放圖片的資料夾`,
        `mkdir -p public/assets`,
        ``,
        `# 把你的圖片複製進去`,
        `# （把 your-image.jpg 換成你真正的檔名）`,
        `cp ~/Downloads/your-image.jpg public/assets/hero.jpg`,
        ``,
        `# 確認圖片已經在正確位置`,
        `ls public/assets/`,
      ],
      codex: `幫我建立 public/assets/ 資料夾，並把使用者提供的圖片放進去命名為 hero.jpg。然後確認檔案路徑正確，並在程式碼裡找到圖片引用的地方把路徑改成 /assets/hero.jpg。`,
      claude: `建立 public/assets 目錄，把使用者的圖片複製進去。然後搜尋專案裡所有引用預設圖片的地方，把路徑都改成 /assets/hero.jpg。`,
    },
    {
      icon: "🧪", tool: "本機測試",
      title: "在自己電腦先看看效果",
      desc: "確認遊戲正常之後再上線，有錯馬上修",
      commands: [
        `# 啟動本機測試伺服器`,
        `npm run dev`,
        ``,
        `# 打開瀏覽器，輸入以下網址`,
        `# http://localhost:3000`,
        `# 或 http://localhost:5173`,
        ``,
        `# 如果有錯誤，先看錯誤訊息`,
        `npm run build`,
      ],
      codex: `執行 npm run dev 啟動遊戲。如果瀏覽器打開是空白或有錯誤，請讀取終端機的錯誤訊息並自動修復。確保遊戲能在 localhost 正常顯示。`,
      claude: `執行 npm run dev，然後告訴我遊戲在哪個 port 啟動（3000 還是 5173）。如果有任何 error 或 warning 請直接修復，不用問我。`,
    },
    {
      icon: "🚀", tool: "上線部署",
      title: "發佈到網路，取得公開網址",
      desc: "讓所有人都能用瀏覽器開啟你的遊戲",
      commands: [
        `# 先建置正式版本`,
        `npm run build`,
        ``,
        `# 部署到 Vercel（第一次會問你幾個問題，照著填就好）`,
        `vercel --prod`,
        ``,
        `# 部署完成後會出現網址，類似：`,
        `# https://my-game-xxx.vercel.app`,
        ``,
        `# 把這個網址分享給同學！`,
      ],
      codex: `執行 npm run build 建置，確認沒有錯誤後執行 vercel --prod 部署。如果問 project name 就填 ${slug}，其他選項全部按 Enter 預設。部署完成後把網址告訴我。`,
      claude: `執行 npm run build，成功後執行 vercel --prod。project name 設為 ${slug}，全部用預設值。最後把生成的 vercel.app 網址複製給我。`,
    },
  ];

  const s = steps[activeStep];
  const copy = (text) => navigator.clipboard.writeText(text).catch(() => {});

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Step pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setActiveStep(i)} style={{
            padding: "7px 13px", borderRadius: 20, border: "none", cursor: "pointer",
            background: activeStep === i ? template.color : "#13132a",
            color: activeStep === i ? "#fff" : "#666",
            fontSize: 12, fontFamily: "inherit",
            outline: activeStep === i ? `2px solid ${template.color}` : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            {st.icon} {i + 1}. {st.tool}
          </button>
        ))}
      </div>

      {/* Step body */}
      <div style={{ background: "#080816", borderRadius: 14, border: `1px solid ${template.color}44`, overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${template.color}22, transparent)`, padding: "16px 20px", borderBottom: `1px solid ${template.color}22` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>步驟 {activeStep + 1}：{s.title}</div>
              <div style={{ color: "#777", fontSize: 12, marginTop: 3 }}>{s.desc}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: 18 }}>
          {/* Terminal */}
          <div style={{ background: "#000", borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#444", fontSize: 11 }}>Terminal</span>
              <button onClick={() => copy(s.commands.join("\n"))} style={{
                marginLeft: "auto", background: "#1a1a1a", border: "1px solid #333",
                color: "#888", padding: "3px 10px", borderRadius: 5, cursor: "pointer", fontSize: 11, fontFamily: "inherit",
              }}>複製全部</button>
            </div>
            <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre-wrap" }}>
              {s.commands.map((cmd, i) => (
                <div key={i} style={{ color: cmd.startsWith("#") ? "#3d3d5c" : cmd === "" ? "transparent" : "#a8e6cf" }}>
                  {cmd.startsWith("#") ? cmd : cmd === "" ? "‎" : `$ ${cmd}`}
                </div>
              ))}
            </pre>
          </div>

          {/* AI Prompts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "ChatGPT / Codex", icon: "🤖", text: s.codex, color: "#10a37f" },
              { label: "Claude Code", icon: "⚡", text: s.claude, color: "#d97706" },
            ].map(({ label, icon, text, color }) => (
              <div key={label} style={{ background: "#0d0d1e", border: `1px solid ${color}33`, borderRadius: 10, padding: 14 }}>
                <div style={{ color: color, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{icon} 貼給 {label}</div>
                <div style={{ color: "#bbb", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{text}</div>
                <button onClick={() => copy(text)} style={{
                  width: "100%", background: `${color}18`, border: `1px solid ${color}44`,
                  color: color, padding: "6px 0", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit",
                }}>複製 Prompt</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
        <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} style={{
          padding: "9px 18px", borderRadius: 8, border: "1px solid #222",
          background: activeStep === 0 ? "#0d0d1e" : "#13132a",
          color: activeStep === 0 ? "#333" : "#aaa",
          cursor: activeStep === 0 ? "not-allowed" : "pointer", fontSize: 13, fontFamily: "inherit",
        }}>← 上一步</button>
        <span style={{ color: "#444", fontSize: 12, alignSelf: "center" }}>{activeStep + 1} / {steps.length}</span>
        <button onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))} disabled={activeStep === steps.length - 1} style={{
          padding: "9px 18px", borderRadius: 8, border: "none",
          background: activeStep === steps.length - 1 ? "#0d0d1e" : template.color,
          color: activeStep === steps.length - 1 ? "#333" : "#fff",
          cursor: activeStep === steps.length - 1 ? "not-allowed" : "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700,
        }}>下一步 →</button>
      </div>
    </div>
  );
}

// ── Template Card ─────────────────────────────────────────────────────────────
function TemplateCard({ t, selected, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: selected ? `${t.color}14` : "#0e0e20",
      border: `2px solid ${selected ? t.color : "#1a1a3e"}`,
      borderRadius: 16, padding: 18, cursor: "pointer",
      transition: "all 0.2s", position: "relative",
    }}>
      {selected && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          background: t.color, borderRadius: "50%", width: 22, height: 22,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff",
        }}>✓</div>
      )}

      {/* 主要卡片內容 — 點擊選擇 */}
      <div onClick={() => onSelect(t)}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 32 }}>{t.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: selected ? t.color : "#fff" }}>{t.name}</div>
            <div style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 10, display: "inline-block", marginTop: 3,
              background: `${t.diffColor}22`, color: t.diffColor, border: `1px solid ${t.diffColor}44`,
            }}>{t.difficulty}</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "#a0a0c0", lineHeight: 1.6, marginBottom: 10, fontStyle: "italic" }}>
          「{t.tagline}」
        </div>
        <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, marginBottom: 12 }}>{t.plain}</div>

        <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>👤 {t.whoFor}</div>
        <div style={{ fontSize: 12, color: "#555" }}>{t.feel}</div>
      </div>

      {/* 展開技術文件 */}
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        style={{
          marginTop: 14, width: "100%", background: "transparent",
          border: `1px solid ${t.color}44`, borderRadius: 8,
          color: t.color, padding: "7px 0", cursor: "pointer",
          fontSize: 12, fontFamily: "inherit", transition: "all 0.2s",
        }}
      >
        {expanded ? "▲ 收起技術文件" : "▼ 查看技術文件 & GitHub"}
      </button>

      {expanded && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
            技術棧：{t.stack} · 部署：{t.deploy}
          </div>
          {t.docs.map(({ label, url }) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 12px", background: "#080814",
              border: `1px solid ${t.color}33`, borderRadius: 8,
              color: "#ccc", textDecoration: "none", fontSize: 13,
              transition: "all 0.15s",
            }}>
              <span>{label}</span>
              <span style={{ color: t.color, fontSize: 11 }}>開啟 ↗</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("input");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [gameContent, setGameContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedYAML, setGeneratedYAML] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [geminiKey, setGeminiKey] = useState(process.env.NEXT_PUBLIC_GEMINI_KEY || "");
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState("yaml");
  const fileRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage({ url: URL.createObjectURL(file), name: file.name });
    const r = new FileReader();
    r.onload = (ev) => setImageBase64(ev.target.result.split(",")[1]);
    r.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return alert("請先選擇一個遊戲模板");
    if (!gameContent.trim()) return alert("請描述你的遊戲內容");
    setLoading(true);
    const title = gameTitle || "我的 3D 遊戲";
    try {
      let analysis = "";
      if (geminiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        const parts = [];
        if (imageBase64) parts.push({ inline_data: { mime_type: "image/jpeg", data: imageBase64 } });
        parts.push({ text: `你是 3D 遊戲設計師。根據以下資訊，用繁體中文生成遊戲企劃摘要（3-4句話，白話易懂）：\n遊戲標題：${title}\n描述：${gameContent}\n模板：${selectedTemplate.name}（${selectedTemplate.plain}）${image ? "\n已上傳圖片" : ""}` });
        const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts }] }) });
        if (res.ok) {
          const data = await res.json();
          analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
      }
      if (!analysis) {
        analysis = `「${title}」是一款採用「${selectedTemplate.name}」風格的網頁遊戲，${gameContent.slice(0, 50)}...。使用 ${selectedTemplate.stack} 技術，可直接部署到 Vercel 讓所有人用瀏覽器開啟。完成後將是很棒的課堂作品！`;
      }
      setAiAnalysis(analysis);
      setGeneratedYAML(generateYAML(selectedTemplate, title, gameContent.slice(0, 50), image?.name));
      setPhase("result");
    } finally {
      setLoading(false);
    }
  };

  const downloadYAML = () => {
    const blob = new Blob([generatedYAML], { type: "text/yaml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(gameTitle || "game").toLowerCase().replace(/\s+/g, "-")}-config.yml`;
    a.click();
  };

  const bg = "#060612";
  const card = "#0e0e20";
  const border = "#1a1a3e";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: "#e2e8f0", fontFamily: "'Syne', system-ui, sans-serif", position: "relative" }}>
      {/* Grid bg */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(#1a1a3e0d 1px, transparent 1px), linear-gradient(90deg, #1a1a3e0d 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: "radial-gradient(ellipse, #4f46e51a 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 920, margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: 10, padding: "5px 14px", fontSize: 10, letterSpacing: 3, fontWeight: 700, color: "#c4b5fd", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace" }}>
            ◈ GEMINI × 3D GAME GENERATOR
          </div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 900, margin: "0 0 10px", background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1 }}>
            3D 遊戲設計工坊
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>上傳圖片 → 描述遊戲 → 選擇模板 → 產出設定 → 逐步部署</p>
        </div>

        {phase === "input" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

            {/* API Key */}
            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span>🔑</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>Gemini API Key</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: "#444", fontFamily: "'JetBrains Mono', monospace" }}>選填 — 空白則用 Demo 模式</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input type={showKey ? "text" : "password"} placeholder="AIza..." value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} style={{ flex: 1, background: "#080814", border: `1px solid ${border}`, borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", outline: "none" }} />
                <button onClick={() => setShowKey(!showKey)} style={{ background: "#13132a", border: `1px solid ${border}`, color: "#aaa", padding: "0 13px", borderRadius: 8, cursor: "pointer", fontSize: 15 }}>{showKey ? "🙈" : "👁️"}</button>
              </div>
            </div>

            {/* Upload + Content */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 18 }}>
              <div onClick={() => fileRef.current.click()} style={{ background: card, border: `2px dashed ${image ? "#4f46e5" : border}`, borderRadius: 14, padding: 20, cursor: "pointer", textAlign: "center", minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                {image ? (
                  <>
                    <img src={image.url} alt="upload" style={{ width: "100%", maxHeight: 110, objectFit: "cover", borderRadius: 8 }} />
                    <div style={{ fontSize: 11, color: "#4f46e5", fontWeight: 600 }}>✓ {image.name}</div>
                    <div style={{ fontSize: 10, color: "#444" }}>點擊重新上傳</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 36 }}>🖼️</div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>上傳遊戲圖片</div>
                    <div style={{ fontSize: 11, color: "#555", lineHeight: 1.5 }}>主角、場景、LOGO<br />JPG / PNG / WebP</div>
                  </>
                )}
              </div>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>遊戲標題</label>
                  <input value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} placeholder="例：星際守護者 / 魔法學院" style={{ width: "100%", background: "#080814", border: `1px solid ${border}`, borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 5 }}>遊戲內容描述</label>
                  <textarea value={gameContent} onChange={(e) => setGameContent(e.target.value)} placeholder="描述你想做的遊戲：主題、玩法、角色、故事...&#10;例：太空探索遊戲，玩家在外星球收集資源對抗怪物，有升級系統跟裝備合成" style={{ width: "100%", height: 130, background: "#080814", border: `1px solid ${border}`, borderRadius: 8, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
              </div>
            </div>

            {/* Templates */}
            <div>
              <div style={{ fontSize: 13, color: "#777", fontWeight: 700, marginBottom: 14 }}>
                選擇遊戲類型 <span style={{ color: "#444", fontWeight: 400, fontSize: 11 }}>（點「查看技術文件」可展開相關資源連結）</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 14 }}>
                {TEMPLATES.map((t) => (
                  <TemplateCard key={t.id} t={t} selected={selectedTemplate?.id === t.id} onSelect={setSelectedTemplate} />
                ))}
              </div>
            </div>

            {/* Generate */}
            <button onClick={handleGenerate} disabled={loading || !selectedTemplate || !gameContent.trim()} style={{
              width: "100%", padding: "15px 24px",
              background: loading || !selectedTemplate || !gameContent.trim() ? "#13132a" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
              border: "none", borderRadius: 12,
              color: loading || !selectedTemplate || !gameContent.trim() ? "#333" : "#fff",
              fontSize: 15, fontWeight: 800, cursor: loading || !selectedTemplate || !gameContent.trim() ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              {loading ? (
                <><div style={{ width: 16, height: 16, border: "2px solid #444", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Gemini 分析中...</>
              ) : "⚡ 產出 YAML + 部署引導"}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setPhase("input")} style={{ background: "#13132a", border: `1px solid ${border}`, color: "#aaa", padding: "7px 13px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← 返回</button>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{selectedTemplate.emoji} {gameTitle || "我的 3D 遊戲"}</div>
                <div style={{ fontSize: 11, color: "#555" }}>模板：{selectedTemplate.name} · {selectedTemplate.stack}</div>
              </div>
            </div>

            {aiAnalysis && (
              <div style={{ background: "#4f46e514", border: "1px solid #4f46e533", borderRadius: 12, padding: 18 }}>
                <div style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>✨ Gemini 企劃分析</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#c4b5fd" }}>{aiAnalysis}</p>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", gap: 4, background: "#080814", padding: 4, borderRadius: 10, border: `1px solid ${border}` }}>
              {[{ id: "yaml", label: "📄 YAML 設定檔" }, { id: "deploy", label: "🚀 逐步部署引導" }, { id: "docs", label: "📚 技術文件" }].map(({ id, label }) => (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  flex: 1, padding: "9px 14px", borderRadius: 8, border: "none",
                  background: activeTab === id ? selectedTemplate.color : "transparent",
                  color: activeTab === id ? "#fff" : "#555",
                  cursor: "pointer", fontSize: 13, fontWeight: activeTab === id ? 700 : 400, fontFamily: "inherit", transition: "all 0.2s",
                }}>{label}</button>
              ))}
            </div>

            {activeTab === "yaml" && (
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "13px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>📄 game-config.yml</span>
                  <button onClick={downloadYAML} style={{ background: selectedTemplate.color, border: "none", color: "#fff", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                    ⬇ 下載 YML
                  </button>
                </div>
                <pre style={{ margin: 0, padding: 18, fontSize: 12, lineHeight: 1.9, overflowX: "auto", fontFamily: "'JetBrains Mono', monospace", background: "#000" }}>
                  {generatedYAML.split("\n").map((line, i) => {
                    let color = "#a8e6cf";
                    if (line.trim().startsWith("#")) color = "#3a3a5c";
                    else if (line.includes(":") && !line.trim().startsWith("-")) color = "#7ec8e3";
                    else if (line.trim().startsWith("-")) color = "#f9c74f";
                    return <div key={i} style={{ color }}>{line || " "}</div>;
                  })}
                </pre>
              </div>
            )}

            {activeTab === "deploy" && <DeployGuide template={selectedTemplate} gameTitle={gameTitle || "我的 3D 遊戲"} />}

            {activeTab === "docs" && (
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 22 }}>
                <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{selectedTemplate.emoji} {selectedTemplate.name} — 相關資源</div>
                <div style={{ fontSize: 13, color: "#777", marginBottom: 20 }}>{selectedTemplate.plain}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selectedTemplate.docs.map(({ label, url }) => (
                    <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 18px", background: "#080814",
                      border: `1px solid ${selectedTemplate.color}33`, borderRadius: 10,
                      color: "#ddd", textDecoration: "none", fontSize: 14, transition: "all 0.15s",
                    }}>
                      <span>{label}</span>
                      <span style={{ color: selectedTemplate.color, fontSize: 12 }}>開啟 ↗</span>
                    </a>
                  ))}
                </div>
                <div style={{ marginTop: 20, padding: 14, background: "#080814", border: `1px solid #1a1a3e`, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>技術棧</div>
                  <div style={{ fontSize: 13, color: "#aaa" }}>{selectedTemplate.stack}</div>
                  <div style={{ fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono', monospace", marginTop: 10, marginBottom: 6 }}>部署平台</div>
                  <div style={{ fontSize: 13, color: "#aaa" }}>{selectedTemplate.deploy}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
