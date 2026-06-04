'use client'

import { useState, useRef } from "react";

// ── 8 Game Templates ──────────────────────────────────────────────────────────
const GAME_TYPES = [
  {
    id: "platformer",
    emoji: "🏃",
    name: "平台跑酷",
    tagline: "像瑪利歐那樣左右跑、跳躍、踩敵人、躲障礙",
    desc: "玩家控制角色在平台上移動跳躍，閃躲障礙物，到達終點過關。簡單易上手，適合所有年齡。",
    controls: "← → 移動　空白鍵 跳躍",
    winCondition: "到達關卡終點旗幟",
    playerImageUse: "主角角色圖片（會出現在畫面左側跑動）",
    difficulty: "⭐ 新手友善",
    diffColor: "#27ae60",
    color: "#e74c3c",
    stack: "Phaser 3 + Next.js",
    features: ["重力物理", "碰撞偵測", "多關卡", "分數系統"],
    yamlStructure: {
      game_type: "platformer",
      mechanics: {
        gravity: 800,
        jump_force: 500,
        move_speed: 200,
        lives: 3,
      },
      levels: [
        { id: 1, name: "{{LEVEL_1_NAME}}", platforms: 8, enemies: 3, collectibles: 5 },
        { id: 2, name: "{{LEVEL_2_NAME}}", platforms: 12, enemies: 6, collectibles: 8 },
      ],
      player: { image_use: "主角外觀", width: 48, height: 48 },
      enemies: { type: "{{ENEMY_TYPE}}", behavior: "patrol", damage: 1 },
      collectibles: { type: "{{ITEM_NAME}}", score_value: 10 },
      win_condition: "reach_flag",
      lose_condition: "lives_zero",
    },
  },
  {
    id: "topdown_shooter",
    emoji: "🔫",
    name: "俯視角射擊",
    tagline: "從上往下俯視，移動角色、射擊敵人、收集道具",
    desc: "玩家在地圖上移動並向四方射擊怪物，擊敗敵人獲得分數，打倒 Boss 過關。",
    controls: "WASD 移動　滑鼠瞄準　左鍵 射擊",
    winCondition: "擊敗所有敵人或 Boss",
    playerImageUse: "主角頭像（顯示在角色上方及 HUD 生命欄）",
    difficulty: "⭐⭐ 稍有挑戰",
    diffColor: "#e67e22",
    color: "#8e44ad",
    stack: "Phaser 3 + Next.js",
    features: ["8 方向移動", "射擊系統", "敵人 AI", "HP 血量條"],
    yamlStructure: {
      game_type: "topdown_shooter",
      mechanics: { move_speed: 180, bullet_speed: 400, fire_rate: 0.3, player_hp: 5 },
      waves: [
        { wave: 1, enemy_count: 5, enemy_type: "{{ENEMY_1_NAME}}", spawn_interval: 2 },
        { wave: 2, enemy_count: 10, enemy_type: "{{ENEMY_2_NAME}}", spawn_interval: 1.5 },
        { wave: 3, boss: true, boss_name: "{{BOSS_NAME}}", boss_hp: 30 },
      ],
      player: { image_use: "角色頭像與 HUD 圖示", bullet_color: "{{BULLET_COLOR}}" },
      map: { theme: "{{MAP_THEME}}", size: "1024x1024", obstacles: 15 },
      powerups: ["hp_restore", "speed_boost", "rapid_fire"],
      win_condition: "defeat_all_waves",
    },
  },
  {
    id: "maze",
    emoji: "🌀",
    name: "迷宮解謎",
    tagline: "在迷宮裡找路、解開機關、找到出口逃脫",
    desc: "玩家在程序生成的迷宮中探索，收集鑰匙解鎖門、推箱子觸發機關，找到出口。",
    controls: "WASD 或方向鍵移動",
    winCondition: "找到出口並逃脫迷宮",
    playerImageUse: "探索者角色（在迷宮中行走的小圖示）",
    difficulty: "⭐⭐ 稍有挑戰",
    diffColor: "#e67e22",
    color: "#16a085",
    stack: "Phaser 3 + Next.js",
    features: ["程序生成迷宮", "鑰匙與門機關", "計時挑戰", "多層地圖"],
    yamlStructure: {
      game_type: "maze",
      mechanics: { move_speed: 150, timer: true, time_limit: 120 },
      maze: { width: 15, height: 15, algorithm: "recursive_backtrack", difficulty: "medium" },
      player: { image_use: "迷宮中的探索角色圖示" },
      items: {
        keys: { count: "{{KEY_COUNT}}", color: "gold", required_to_exit: true },
        traps: { type: "{{TRAP_TYPE}}", count: 5, penalty_seconds: 10 },
        hints: { count: 3, reveal_radius: 3 },
      },
      story: { intro: "{{MAZE_INTRO_TEXT}}", escape_message: "{{WIN_MESSAGE}}" },
      win_condition: "reach_exit_with_all_keys",
    },
  },
  {
    id: "breakout",
    emoji: "🧱",
    name: "打磚塊",
    tagline: "用板子反彈球、打掉所有磚塊、一關比一關難",
    desc: "經典打磚塊玩法，控制底部擋板反彈球，擊碎所有磚塊即可過關，磚塊越多越快越難。",
    controls: "← → 方向鍵 或 滑鼠 移動擋板",
    winCondition: "清除所有磚塊",
    playerImageUse: "磚塊圖案（用來替換預設磚塊外觀）",
    difficulty: "⭐ 新手友善",
    diffColor: "#27ae60",
    color: "#d35400",
    stack: "Phaser 3 + Next.js",
    features: ["物理彈射", "多種磚塊", "道具掉落", "速度加快"],
    yamlStructure: {
      game_type: "breakout",
      mechanics: { ball_speed_initial: 300, ball_speed_increment: 20, paddle_speed: 400, lives: 3 },
      levels: [
        { id: 1, rows: 4, cols: 8, brick_theme: "{{BRICK_THEME_1}}", special_bricks: 2 },
        { id: 2, rows: 6, cols: 10, brick_theme: "{{BRICK_THEME_2}}", special_bricks: 5 },
        { id: 3, rows: 8, cols: 12, brick_theme: "{{BRICK_THEME_3}}", special_bricks: 8 },
      ],
      player: { image_use: "磚塊貼圖素材" },
      powerups: [
        { type: "expand_paddle", drop_rate: 0.1 },
        { type: "multi_ball", drop_rate: 0.05 },
        { type: "slow_ball", drop_rate: 0.08 },
      ],
      brick_types: { normal: 1, hard: 2, indestructible: 0, special: "{{SPECIAL_BRICK_EFFECT}}" },
      win_condition: "clear_all_bricks",
    },
  },
  {
    id: "endless_runner",
    emoji: "🏄",
    name: "無盡跑者",
    tagline: "場景自動往前跑，閃躲障礙物，撐越久分越高",
    desc: "角色自動向前衝，玩家只需控制跳躍或閃躲，障礙物越來越快，看誰撐最久、分數最高。",
    controls: "空白鍵 或 上鍵 跳躍　下鍵 滑行",
    winCondition: "撐越久分越高（無盡模式）",
    playerImageUse: "奔跑的主角（會在畫面中持續跑動）",
    difficulty: "⭐ 新手友善",
    diffColor: "#27ae60",
    color: "#2980b9",
    stack: "Phaser 3 + Next.js",
    features: ["無盡地圖生成", "速度遞增", "高分榜", "雙段跳"],
    yamlStructure: {
      game_type: "endless_runner",
      mechanics: {
        initial_speed: 300,
        speed_increment: 10,
        speed_interval: 5,
        jump_force: 550,
        double_jump: true,
        slide_duration: 0.6,
      },
      world: { theme: "{{WORLD_THEME}}", ground_color: "{{GROUND_COLOR}}", sky_color: "{{SKY_COLOR}}" },
      player: { image_use: "主角奔跑動畫素材（4 幀）" },
      obstacles: [
        { type: "{{OBSTACLE_1}}", height: "low", action: "jump" },
        { type: "{{OBSTACLE_2}}", height: "high", action: "slide" },
        { type: "{{OBSTACLE_3}}", height: "double", action: "jump_and_slide" },
      ],
      collectibles: { type: "{{COLLECTIBLE_NAME}}", score: 5, spawn_rate: 0.3 },
      milestones: [
        { score: 100, message: "{{MILESTONE_1_MSG}}", speed_bonus: true },
        { score: 500, message: "{{MILESTONE_2_MSG}}", new_obstacle: true },
      ],
    },
  },
  {
    id: "tower_defense",
    emoji: "🏰",
    name: "塔防遊戲",
    tagline: "在路徑旁放置防禦塔，阻止敵人抵達終點",
    desc: "敵人沿著固定路徑前進，玩家用金幣購買並放置防禦塔來消滅敵人，保護基地不被攻破。",
    controls: "滑鼠點擊 放置塔　右鍵 取消",
    winCondition: "敵人波次全部擊退",
    playerImageUse: "敵人圖示（沿路行走的怪物外觀）",
    difficulty: "⭐⭐⭐ 進階策略",
    diffColor: "#c0392b",
    color: "#27ae60",
    stack: "Phaser 3 + Next.js",
    features: ["路徑尋路", "多種塔型", "升級系統", "波次管理"],
    yamlStructure: {
      game_type: "tower_defense",
      mechanics: { starting_gold: 150, gold_per_kill: 10, base_hp: 20, waves: 10 },
      map: { path: "curved", theme: "{{MAP_THEME}}", grid_size: 40 },
      player: { image_use: "敵人怪物的行走圖示" },
      towers: [
        { id: "basic", name: "{{TOWER_1_NAME}}", cost: 50, damage: 10, range: 150, fire_rate: 1 },
        { id: "sniper", name: "{{TOWER_2_NAME}}", cost: 100, damage: 40, range: 300, fire_rate: 0.4 },
        { id: "splash", name: "{{TOWER_3_NAME}}", cost: 150, damage: 20, range: 120, fire_rate: 0.8, splash: true },
      ],
      enemies: [
        { type: "basic", name: "{{ENEMY_1_NAME}}", hp: 50, speed: 80, reward: 10 },
        { type: "fast", name: "{{ENEMY_2_NAME}}", hp: 30, speed: 150, reward: 15 },
        { type: "tank", name: "{{ENEMY_3_NAME}}", hp: 200, speed: 50, reward: 30 },
      ],
      story: { setting: "{{GAME_SETTING}}", defend_what: "{{DEFEND_TARGET}}" },
    },
  },
  {
    id: "memory_match",
    emoji: "🃏",
    name: "記憶翻牌",
    tagline: "翻開卡片找出相同的配對，全部配對完成就過關",
    desc: "卡片背面朝上，每次翻兩張找出相同圖案，在時間內配對完所有卡片。可用學員上傳的圖片做卡片！",
    controls: "滑鼠點擊翻牌",
    winCondition: "在時間內完成所有配對",
    playerImageUse: "卡片正面圖案（直接用學員的照片做成卡片！）",
    difficulty: "⭐ 新手友善",
    diffColor: "#27ae60",
    color: "#f39c12",
    stack: "React + Next.js",
    features: ["圖片卡片", "計時挑戰", "難度選擇", "最佳紀錄"],
    yamlStructure: {
      game_type: "memory_match",
      mechanics: { time_limit: 60, flip_back_delay: 1.2, pairs_required: "all" },
      difficulty_modes: [
        { name: "簡單", grid: "4x3", pairs: 6, time_limit: 90 },
        { name: "普通", grid: "4x4", pairs: 8, time_limit: 60 },
        { name: "困難", grid: "6x4", pairs: 12, time_limit: 45 },
      ],
      player: { image_use: "卡片正面主圖（上傳的照片會直接變成牌面）" },
      card_back: { color: "{{CARD_BACK_COLOR}}", pattern: "{{CARD_PATTERN}}" },
      categories: ["{{CATEGORY_1}}", "{{CATEGORY_2}}", "{{CATEGORY_3}}"],
      scoring: { base_score: 100, time_bonus: true, combo_multiplier: true },
      theme: { title: "{{GAME_TITLE}}", background: "{{BG_COLOR}}", card_style: "{{CARD_STYLE}}" },
    },
  },
  {
    id: "snake_evolution",
    emoji: "🐍",
    name: "貪吃蛇進化版",
    tagline: "吃東西讓身體長大，避免咬到自己或撞牆，加入特殊道具！",
    desc: "經典貪吃蛇升級版，加入速度道具、障礙物、傳送門等元素，隨著分數增加難度提升。",
    controls: "WASD 或方向鍵 轉向",
    winCondition: "達到目標長度或撐最久（高分模式）",
    playerImageUse: "蛇頭圖案（替換蛇頭的外觀造型）",
    difficulty: "⭐ 新手友善",
    diffColor: "#27ae60",
    color: "#1abc9c",
    stack: "React + Canvas + Next.js",
    features: ["速度道具", "傳送門", "障礙物", "成長動畫"],
    yamlStructure: {
      game_type: "snake_evolution",
      mechanics: { initial_speed: 150, speed_increment: 5, grid_size: 20, initial_length: 3 },
      world: { theme: "{{WORLD_THEME}}", grid_color: "{{GRID_COLOR}}", border_color: "{{BORDER_COLOR}}", wall_kill: true },
      player: { image_use: "蛇頭替換圖示（朝四個方向的頭部造型）", body_color: "{{SNAKE_COLOR}}" },
      food: [
        { type: "normal", name: "{{FOOD_1_NAME}}", score: 10, grow: 1, spawn_rate: 0.7 },
        { type: "bonus", name: "{{FOOD_2_NAME}}", score: 30, grow: 0, spawn_rate: 0.15, duration: 5 },
        { type: "speed_boost", name: "{{FOOD_3_NAME}}", score: 5, effect: "speed_up", duration: 3, spawn_rate: 0.1 },
        { type: "slow", name: "{{FOOD_4_NAME}}", score: 5, effect: "slow_down", duration: 3, spawn_rate: 0.05 },
      ],
      special_features: {
        portals: { enabled: true, count: 2 },
        obstacles: { enabled: true, count: "{{OBSTACLE_COUNT}}", appear_at_score: 50 },
      },
      milestones: [
        { length: 10, message: "{{MSG_1}}", new_feature: "portal" },
        { length: 20, message: "{{MSG_2}}", new_feature: "obstacles" },
      ],
    },
  },
];

// ── Generate Full YAML with AI analysis ──────────────────────────────────────
function buildYAML(game, gameTitle, gameDesc, imageName, aiSuggestions) {
  const slug = gameTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "my-game";
  const suggestions = aiSuggestions || {};

  // Deep clone and fill in placeholders
  let yamlObj = {
    meta: {
      game_title: gameTitle,
      game_slug: slug,
      game_type: game.id,
      description: gameDesc,
      created_at: new Date().toISOString().split("T")[0],
      player_image: imageName ? `public/assets/${imageName}` : "public/assets/player.png",
      image_role: game.playerImageUse,
    },
    tech: {
      framework: "Next.js 14 (App Router)",
      game_engine: game.stack,
      deploy_platform: "Vercel",
      node_version: "20",
      build_cmd: "npm run build",
      output_dir: ".next",
    },
    gameplay: { ...game.yamlStructure },
    customization: {
      theme: suggestions.theme || gameDesc.slice(0, 40),
      color_palette: suggestions.colors || ["#4f46e5", "#7c3aed", "#a78bfa"],
      sound_effects: true,
      background_music: false,
      language: "zh-TW",
    },
    ai_codex_instructions: {
      summary: `這是一個「${game.name}」類型的網頁遊戲。請依照上方所有 gameplay 設定，用 ${game.stack} 實作一個完整可玩的遊戲。`,
      player_image_instruction: `玩家上傳的圖片路徑為 \`${imageName ? `public/assets/${imageName}` : "public/assets/player.png"}\`，請將它用作「${game.playerImageUse}」。`,
      required_features: game.features,
      controls: game.controls,
      win_condition: game.winCondition,
      language_note: "所有 UI 文字請使用繁體中文",
      responsive: "請確保在桌機瀏覽器 1280x720 解析度下能正常遊玩",
    },
    deploy_steps: [
      { step: 1, action: "建立 Next.js 專案", cmd: `npx create-next-app@latest ${slug} --typescript --tailwind --app` },
      { step: 2, action: "安裝遊戲引擎", cmd: `cd ${slug} && npm install phaser` },
      { step: 3, action: "建立素材資料夾並放入圖片", cmd: `mkdir -p public/assets` },
      { step: 4, action: "把這份 YAML 放入專案根目錄", cmd: `cp game-config.yml ${slug}/` },
      { step: 5, action: "請 Codex/Claude Code 讀取 YAML 並實作遊戲", cmd: `# 貼下方 AI Prompt 給 Codex 或 Claude Code` },
      { step: 6, action: "本機測試", cmd: "npm run dev" },
      { step: 7, action: "部署到 Vercel", cmd: "npx vercel --prod" },
    ],
  };

  // Fill template placeholders with AI suggestions or defaults
  const fillMap = {
    "{{LEVEL_1_NAME}}": suggestions.level1 || `${gameDesc.slice(0, 10)} 第一關`,
    "{{LEVEL_2_NAME}}": suggestions.level2 || `${gameDesc.slice(0, 10)} 第二關`,
    "{{ENEMY_TYPE}}": suggestions.enemy || "巡邏守衛",
    "{{ITEM_NAME}}": suggestions.item || "星星",
    "{{BOSS_NAME}}": suggestions.boss || "終極 Boss",
    "{{BULLET_COLOR}}": suggestions.bulletColor || "#f9c74f",
    "{{MAP_THEME}}": suggestions.mapTheme || gameDesc.slice(0, 20),
    "{{ENEMY_1_NAME}}": suggestions.enemy1 || "小怪",
    "{{ENEMY_2_NAME}}": suggestions.enemy2 || "速度怪",
    "{{ENEMY_3_NAME}}": suggestions.enemy3 || "大鐵甲",
    "{{WORLD_THEME}}": suggestions.worldTheme || gameDesc.slice(0, 15),
    "{{GROUND_COLOR}}": suggestions.groundColor || "#8B4513",
    "{{SKY_COLOR}}": suggestions.skyColor || "#87CEEB",
    "{{OBSTACLE_1}}": suggestions.obs1 || "大石頭",
    "{{OBSTACLE_2}}": suggestions.obs2 || "低枝樹幹",
    "{{OBSTACLE_3}}": suggestions.obs3 || "連續陷阱",
    "{{COLLECTIBLE_NAME}}": suggestions.collectible || "金幣",
    "{{MILESTONE_1_MSG}}": suggestions.msg1 || "太厲害了！繼續加油！",
    "{{MILESTONE_2_MSG}}": suggestions.msg2 || "速度提升！小心障礙！",
    "{{TOWER_1_NAME}}": suggestions.tower1 || "基礎箭塔",
    "{{TOWER_2_NAME}}": suggestions.tower2 || "狙擊塔",
    "{{TOWER_3_NAME}}": suggestions.tower3 || "火焰塔",
    "{{GAME_SETTING}}": suggestions.setting || gameDesc.slice(0, 30),
    "{{DEFEND_TARGET}}": suggestions.defend || "王國城堡",
    "{{CARD_BACK_COLOR}}": suggestions.cardBack || "#4f46e5",
    "{{CARD_PATTERN}}": suggestions.cardPattern || "星形圖案",
    "{{CARD_STYLE}}": suggestions.cardStyle || "圓角卡片",
    "{{BG_COLOR}}": suggestions.bgColor || "#1a1a2e",
    "{{CATEGORY_1}}": suggestions.cat1 || "動物",
    "{{CATEGORY_2}}": suggestions.cat2 || "食物",
    "{{CATEGORY_3}}": suggestions.cat3 || "交通工具",
    "{{FOOD_1_NAME}}": suggestions.food1 || "蘋果",
    "{{FOOD_2_NAME}}": suggestions.food2 || "黃金蘋果",
    "{{FOOD_3_NAME}}": suggestions.food3 || "閃電",
    "{{FOOD_4_NAME}}": suggestions.food4 || "冰塊",
    "{{SNAKE_COLOR}}": suggestions.snakeColor || "#2ecc71",
    "{{GRID_COLOR}}": suggestions.gridColor || "#111827",
    "{{BORDER_COLOR}}": suggestions.borderColor || "#374151",
    "{{OBSTACLE_COUNT}}": suggestions.obstacleCount || "5",
    "{{MSG_1}}": suggestions.snakeMsg1 || "長大了！傳送門出現！",
    "{{MSG_2}}": suggestions.snakeMsg2 || "超強！障礙物登場！",
    "{{BRICK_THEME_1}}": suggestions.brick1 || "普通磚",
    "{{BRICK_THEME_2}}": suggestions.brick2 || "石頭磚",
    "{{BRICK_THEME_3}}": suggestions.brick3 || "鋼鐵磚",
    "{{SPECIAL_BRICK_EFFECT}}": suggestions.specialBrick || "爆炸磚（炸掉周圍3格）",
    "{{KEY_COUNT}}": suggestions.keyCount || "3",
    "{{TRAP_TYPE}}": suggestions.trap || "尖刺",
    "{{MAZE_INTRO_TEXT}}": suggestions.mazeIntro || `你被困在迷宮裡，${gameDesc.slice(0, 20)}，找到出口逃脫吧！`,
    "{{WIN_MESSAGE}}": suggestions.winMsg || "恭喜逃脫成功！你真厲害！",
  };

  let yamlStr = JSON.stringify(yamlObj, null, 2);
  for (const [k, v] of Object.entries(fillMap)) {
    yamlStr = yamlStr.replaceAll(k, v);
  }

  // Convert JSON to YAML-like format
  const jsonObj = JSON.parse(yamlStr);
  return jsonToYaml(jsonObj);
}

function jsonToYaml(obj, indent = 0) {
  const pad = "  ".repeat(indent);
  let out = "";
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "object" && !Array.isArray(v)) {
      out += `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
    } else if (Array.isArray(v)) {
      out += `${pad}${k}:\n`;
      for (const item of v) {
        if (typeof item === "object") {
          const lines = jsonToYaml(item, indent + 2).split("\n").filter(Boolean);
          out += `${"  ".repeat(indent + 1)}- ${lines[0].trim()}\n`;
          for (let i = 1; i < lines.length; i++) out += `${lines[i]}\n`;
        } else {
          out += `${"  ".repeat(indent + 1)}- ${item}\n`;
        }
      }
    } else {
      const val = typeof v === "string" ? `"${v}"` : v;
      out += `${pad}${k}: ${val}\n`;
    }
  }
  return out;
}

// ── AI Prompt Builder ─────────────────────────────────────────────────────────
function buildAIPrompt(game, gameTitle, yaml, tool) {
  const base = `我有一份遊戲設定 YAML，請幫我用 Next.js 14 (App Router) + ${game.stack} 實作一個完整可玩的「${game.name}」網頁遊戲。

## 要求
- 遊戲類型：${game.name}（${game.tagline}）
- 操作方式：${game.controls}
- 過關條件：${game.winCondition}
- 必要功能：${game.features.join("、")}
- 所有 UI 文字使用繁體中文
- 在 1280x720 桌機瀏覽器正常運作
- 遊戲畫面嵌入在 Next.js 的 /game 路由頁面

## 遊戲設定 YAML
\`\`\`yaml
${yaml}
\`\`\`

## 步驟
1. 讀取上方 YAML 的所有設定
2. 建立 \`src/app/game/page.tsx\` 作為遊戲主頁面
3. 實作完整遊戲邏輯（物理、碰撞、計分、過關判斷）
4. 將 YAML 中指定的圖片路徑套用到對應角色/元素
5. 確保遊戲可以在瀏覽器中直接開始遊玩`;

  if (tool === "claude") {
    return base + `\n\n請直接開始實作，不要問我問題，先完成最基本可玩版本再說。`;
  } else {
    return base + `\n\n請逐步實作，每個步驟完成後告訴我進度。先從主遊戲畫面開始。`;
  }
}

// ── Deploy Guide Component ────────────────────────────────────────────────────
function DeployGuide({ game, gameTitle, yaml, isDark }) {
  const [activeStep, setActiveStep] = useState(0);
  const slug = gameTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "my-game";

  const bg0    = isDark ? "#000"    : "#1a1a2e";
  const btnBg  = isDark ? "#13132a" : "#e8eaff";
  const btnTxt = isDark ? "#aaa"    : "#5555aa";
  const stepBg = isDark ? "#0d0d1e" : "#f0f2ff";
  const promptBg = isDark ? "#0d0d1e" : "#f5f6ff";

  const steps = [
    {
      icon: "🛠️", title: "安裝必要工具",
      desc: "先把 Node.js 跟 Git 裝好（只需做一次）",
      cmds: ["# 到 https://nodejs.org 下載 LTS 版本", "node --version  # 確認 >= 20", "npm install -g vercel", "vercel login"],
      codex: `確認我的電腦有安裝 Node.js >= 20，並安裝 Vercel CLI（npm install -g vercel），然後執行 vercel login 登入帳號。`,
      claude: `請幫我確認開發環境：1) node --version 確認版本，2) npm install -g vercel，3) vercel login。`,
    },
    {
      icon: "📦", title: "建立遊戲專案",
      desc: "用 Next.js 建立一個新的遊戲專案資料夾",
      cmds: [
        `npx create-next-app@latest ${slug} --typescript --tailwind --app`,
        `cd ${slug}`,
        `npm install phaser`,
        `mkdir -p public/assets`,
      ],
      codex: `請執行：1) npx create-next-app@latest ${slug} --typescript --tailwind --app，2) cd ${slug}，3) npm install phaser，4) mkdir -p public/assets。`,
      claude: `建立 Next.js 專案 ${slug}，安裝 phaser，建立 public/assets 資料夾。`,
    },
    {
      icon: "🖼️", title: "放入遊戲圖片",
      desc: "把你上傳的圖片放到正確位置",
      cmds: [
        `# 把圖片複製到專案（替換成你的檔名）`,
        `cp ~/Downloads/your-image.jpg ${slug}/public/assets/player.jpg`,
        `# 確認圖片已放好`,
        `ls ${slug}/public/assets/`,
      ],
      codex: `幫我把 public/assets/ 裡的圖片設定好，確認圖片路徑符合 YAML 設定中的 player_image 欄位。`,
      claude: `確認 public/assets/player.jpg 存在，若路徑不符 YAML 設定請自動修正。`,
    },
    {
      icon: "🤖", title: "貼 YAML 給 AI 實作遊戲",
      desc: `把下方的 Prompt 貼給 Codex 或 Claude Code，讓 AI 幫你把遊戲寫出來`,
      cmds: [
        "# 把 YAML 存到專案根目錄",
        `cp game-config.yml ${slug}/`,
        "",
        "# 然後開啟 Codex 或 Claude Code",
        "# 貼入下方的完整 Prompt",
      ],
      codex: buildAIPrompt(game, gameTitle, yaml, "codex"),
      claude: buildAIPrompt(game, gameTitle, yaml, "claude"),
      isMainStep: true,
    },
    {
      icon: "🧪", title: "本機測試遊戲",
      desc: "先在自己電腦確認遊戲可以正常遊玩",
      cmds: [`cd ${slug}`, "npm run dev", "# 開啟 http://localhost:3000/game"],
      codex: `執行 npm run dev，確認遊戲在 localhost:3000/game 可以正常遊玩。如有錯誤請自動修復。`,
      claude: `npm run dev，確認 /game 路由正常。若有 TypeScript 或執行期錯誤請直接修復。`,
    },
    {
      icon: "🚀", title: "部署到 Vercel 上線",
      desc: "發佈到網路，取得連結分享給朋友！",
      cmds: [`cd ${slug}`, "npm run build", "vercel --prod", "# 🎉 取得你的遊戲網址！"],
      codex: `執行 npm run build 確認無誤，再執行 vercel --prod 部署。project name 設為 ${slug}，其他按 Enter 預設。`,
      claude: `npm run build 然後 vercel --prod，project name = ${slug}。部署完成後顯示 vercel.app 網址。`,
    },
  ];

  const s = steps[activeStep];
  const copy = (t) => navigator.clipboard.writeText(t).catch(() => {});

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Step pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {steps.map((st, i) => (
          <button key={i} onClick={() => setActiveStep(i)} style={{
            padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer",
            background: activeStep === i ? game.color : (isDark ? "#13132a" : "#e8eaff"),
            color: activeStep === i ? "#fff" : (isDark ? "#666" : "#888"),
            fontSize: 11, fontFamily: "inherit",
            outline: activeStep === i ? `2px solid ${game.color}` : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            {st.icon} {i + 1}. {st.title}
          </button>
        ))}
      </div>

      <div style={{ background: isDark ? "#080816" : "#f0f2ff", borderRadius: 14, border: `1px solid ${game.color}44`, overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${game.color}22, transparent)`, padding: "14px 18px", borderBottom: `1px solid ${game.color}22` }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{s.icon} 步驟 {activeStep + 1}：{s.title}</div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 3 }}>{s.desc}</div>
        </div>

        <div style={{ padding: 16 }}>
          {/* Terminal */}
          <div style={{ background: bg0, borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
              {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              <button onClick={() => copy(s.cmds.join("\n"))} style={{ marginLeft: "auto", background: "#1a1a1a", border: "1px solid #333", color: "#777", padding: "2px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: "inherit" }}>複製</button>
            </div>
            <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.8, whiteSpace: "pre-wrap", overflowX: "auto" }}>
              {s.cmds.map((cmd, i) => (
                <div key={i} style={{ color: cmd.startsWith("#") ? "#444" : cmd === "" ? "transparent" : "#a8e6cf" }}>
                  {cmd.startsWith("#") ? cmd : cmd === "" ? "‎" : `$ ${cmd}`}
                </div>
              ))}
            </pre>
          </div>

          {/* AI Prompts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "ChatGPT / Codex", icon: "🤖", key: "codex", color: "#10a37f" },
              { label: "Claude Code", icon: "⚡", key: "claude", color: "#d97706" },
            ].map(({ label, icon, key, color }) => (
              <div key={key} style={{ background: promptBg, border: `1px solid ${color}33`, borderRadius: 10, padding: 12 }}>
                <div style={{ color, fontSize: 11, fontWeight: 700, marginBottom: 7 }}>{icon} 貼給 {label}</div>
                <div style={{ fontSize: 11, lineHeight: 1.6, marginBottom: 8, maxHeight: s.isMainStep ? 200 : 80, overflow: "auto", opacity: 0.85 }}>{s[key]}</div>
                <button onClick={() => copy(s[key])} style={{ width: "100%", background: `${color}18`, border: `1px solid ${color}44`, color, padding: "5px 0", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
                  複製{s.isMainStep ? "完整 Prompt" : " Prompt"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${isDark ? "#222" : "#ddd"}`, background: activeStep === 0 ? (isDark ? "#0d0d1e" : "#f5f6ff") : btnBg, color: activeStep === 0 ? (isDark ? "#333" : "#bbb") : btnTxt, cursor: activeStep === 0 ? "not-allowed" : "pointer", fontSize: 13, fontFamily: "inherit" }}>← 上一步</button>
        <span style={{ fontSize: 11, opacity: 0.4, alignSelf: "center" }}>{activeStep + 1} / {steps.length}</span>
        <button onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))} disabled={activeStep === steps.length - 1} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: activeStep === steps.length - 1 ? (isDark ? "#0d0d1e" : "#f5f6ff") : game.color, color: activeStep === steps.length - 1 ? (isDark ? "#333" : "#bbb") : "#fff", cursor: activeStep === steps.length - 1 ? "not-allowed" : "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 700 }}>下一步 →</button>
      </div>
    </div>
  );
}

// ── Game Type Card ────────────────────────────────────────────────────────────
function GameCard({ g, selected, onSelect, isDark }) {
  const cardBg = selected ? `${g.color}18` : (isDark ? "#0e0e20" : "#fff");
  const cardBorder = selected ? g.color : (isDark ? "#1a1a3e" : "#d4d8f0");
  const titleColor = selected ? g.color : (isDark ? "#fff" : "#1a1a3e");
  const descColor = isDark ? "#aaa" : "#555";
  const metaColor = isDark ? "#555" : "#aaa";

  return (
    <div onClick={() => onSelect(g)} style={{ background: cardBg, border: `2px solid ${cardBorder}`, borderRadius: 14, padding: 16, cursor: "pointer", transition: "all 0.2s", position: "relative" }}>
      {selected && <div style={{ position: "absolute", top: 10, right: 10, background: g.color, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>✓</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 28 }}>{g.emoji}</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 14, color: titleColor }}>{g.name}</div>
          <div style={{ fontSize: 10, padding: "1px 7px", borderRadius: 10, display: "inline-block", marginTop: 2, background: `${g.diffColor}22`, color: g.diffColor, border: `1px solid ${g.diffColor}44` }}>{g.difficulty}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: isDark ? "#a0a0c0" : "#6666aa", lineHeight: 1.5, marginBottom: 6, fontStyle: "italic" }}>「{g.tagline}」</div>
      <div style={{ fontSize: 12, color: descColor, lineHeight: 1.5, marginBottom: 8 }}>{g.desc}</div>
      <div style={{ fontSize: 11, color: metaColor, marginBottom: 3 }}>🎮 {g.controls}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
        {g.features.map(f => (
          <span key={f} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: `${g.color}18`, color: g.color, border: `1px solid ${g.color}33` }}>{f}</span>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 10, color: metaColor, fontFamily: "'JetBrains Mono', monospace" }}>📸 圖片用途：{g.playerImageUse}</div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("input");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [gameContent, setGameContent] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [yaml, setYaml] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [activeTab, setActiveTab] = useState("yaml");
  const [isDark, setIsDark] = useState(true);
  const fileRef = useRef();
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_KEY || "";

  // Theme
  const bg      = isDark ? "#060612"  : "#f0f2ff";
  const card    = isDark ? "#0e0e20"  : "#ffffff";
  const border  = isDark ? "#1a1a3e"  : "#d4d8f0";
  const text    = isDark ? "#e2e8f0"  : "#1a1a3e";
  const subtext = isDark ? "#6b7280"  : "#5a5f80";
  const inputBg = isDark ? "#080814"  : "#f5f6ff";
  const gridLine= isDark ? "#1a1a3e0d": "#6b7aff0d";

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage({ url: URL.createObjectURL(file), name: file.name });
    const r = new FileReader();
    r.onload = (ev) => setImageBase64(ev.target.result.split(",")[1]);
    r.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedGame) return alert("請先選擇遊戲類型");
    if (!gameContent.trim()) return alert("請描述你的遊戲內容");
    setLoading(true);
    const title = gameTitle || "我的遊戲";

    try {
      let suggestions = {};
      let analysis = "";

      setLoadingMsg("Gemini 分析遊戲主題中...");

      if (geminiKey) {
        const prompt = `你是遊戲設計師助手，請根據以下資訊，用繁體中文回應一個 JSON，用來填入遊戲設定模板。

遊戲標題：${title}
遊戲類型：${selectedGame.name}
遊戲描述：${gameContent}
${image ? "玩家有上傳圖片（將用作：" + selectedGame.playerImageUse + "）" : ""}

請回傳純 JSON，格式如下（根據遊戲描述填入最符合主題的中文內容）：
{
  "analysis": "3-4句的遊戲企劃白話描述",
  "theme": "整體主題",
  "colors": ["主色", "副色", "強調色"],
  "level1": "第一關名稱",
  "level2": "第二關名稱",
  "enemy": "敵人名稱",
  "enemy1": "小怪名稱",
  "enemy2": "速度怪名稱",
  "enemy3": "大頭目名稱",
  "boss": "Boss 名稱",
  "item": "收集物名稱",
  "collectible": "跑酷收集物",
  "worldTheme": "世界主題",
  "mapTheme": "地圖主題",
  "tower1": "基礎塔名稱",
  "tower2": "狙擊塔名稱",
  "tower3": "火焰塔名稱",
  "setting": "遊戲世界背景",
  "defend": "要守護的目標",
  "food1": "蛇遊戲食物1",
  "food2": "蛇遊戲食物2",
  "winMsg": "過關訊息",
  "msg1": "里程碑訊息1",
  "msg2": "里程碑訊息2"
}`;

        const parts = [];
        if (imageBase64) parts.push({ inline_data: { mime_type: "image/jpeg", data: imageBase64 } });
        parts.push({ text: prompt });

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts }] }) }
        );

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const clean = raw.replace(/```json|```/g, "").trim();
          try {
            const parsed = JSON.parse(clean);
            suggestions = parsed;
            analysis = parsed.analysis || "";
          } catch (_) { analysis = raw.slice(0, 200); }
        }
      }

      if (!analysis) {
        analysis = `「${title}」是一款${selectedGame.name}類型的網頁遊戲。${gameContent.slice(0, 50)}。使用 ${selectedGame.stack} 技術實作，玩家透過 ${selectedGame.controls} 操控，目標是「${selectedGame.winCondition}」。完成部署後即可用瀏覽器直接遊玩並分享！`;
      }

      setLoadingMsg("產生遊戲規格 YAML 中...");
      await new Promise(r => setTimeout(r, 300));

      const generatedYAML = buildYAML(selectedGame, title, gameContent, image?.name, suggestions);
      setYaml(generatedYAML);
      setAiAnalysis(analysis);
      setPhase("result");
    } finally {
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const downloadYAML = () => {
    const blob = new Blob([yaml], { type: "text/yaml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(gameTitle || "game").toLowerCase().replace(/\s+/g, "-")}-game-config.yml`;
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Syne', system-ui, sans-serif", position: "relative", transition: "background 0.3s, color 0.3s" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${gridLine} 1px, transparent 1px), linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "36px 20px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36, position: "relative" }}>
          {/* Theme toggle */}
          <button onClick={() => setIsDark(!isDark)} title={isDark ? "切換亮色" : "切換暗色"} style={{ position: "absolute", top: 0, right: 0, width: 48, height: 28, background: isDark ? "#1a1a3e" : "#e0e4ff", border: `2px solid ${isDark ? "#3a3a6e" : "#b0b8f0"}`, borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", padding: "0 4px", transition: "all 0.3s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: isDark ? "#4f46e5" : "#f59e0b", transform: isDark ? "translateX(0)" : "translateX(18px)", transition: "transform 0.3s, background 0.3s", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
              {isDark ? "🌙" : "☀️"}
            </div>
          </button>

          <div style={{ display: "inline-block", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: 10, padding: "5px 14px", fontSize: 10, letterSpacing: 3, fontWeight: 700, color: "#c4b5fd", marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
            ◈ GEMINI × GAME GENERATOR
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 900, margin: "0 0 8px", background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1 }}>
            網頁遊戲設計工坊
          </h1>
          <p style={{ color: subtext, fontSize: 13, margin: 0 }}>
            填寫資料 → 選遊戲類型 → Gemini 產出完整 YAML → 貼給 AI 幫你把遊戲做出來 → 部署到 Vercel
          </p>
        </div>

        {phase === "input" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Upload + Content */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 16 }}>
              <div onClick={() => fileRef.current.click()} style={{ background: card, border: `2px dashed ${image ? "#4f46e5" : border}`, borderRadius: 14, padding: 20, cursor: "pointer", textAlign: "center", minHeight: 190, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.3s" }}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
                {image ? (
                  <>
                    <img src={image.url} alt="" style={{ width: "100%", maxHeight: 100, objectFit: "cover", borderRadius: 8 }} />
                    <div style={{ fontSize: 11, color: "#4f46e5", fontWeight: 600 }}>✓ {image.name}</div>
                    <div style={{ fontSize: 10, color: subtext }}>點擊重新上傳</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 34 }}>🖼️</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: text }}>上傳遊戲圖片</div>
                    <div style={{ fontSize: 11, color: subtext, lineHeight: 1.5 }}>主角、場景、素材<br />JPG / PNG / WebP</div>
                    <div style={{ fontSize: 10, color: isDark ? "#333" : "#bbb", marginTop: 4, fontStyle: "italic" }}>AI 會決定圖片在遊戲中的用途</div>
                  </>
                )}
              </div>
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12, transition: "background 0.3s" }}>
                <div>
                  <label style={{ fontSize: 11, color: subtext, display: "block", marginBottom: 4 }}>遊戲標題</label>
                  <input value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} placeholder="例：星際守護者 / 魔法森林大冒險" style={{ width: "100%", background: inputBg, border: `1px solid ${border}`, borderRadius: 8, padding: "8px 12px", color: text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "background 0.3s" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: subtext, display: "block", marginBottom: 4 }}>遊戲內容描述 <span style={{ color: isDark ? "#333" : "#bbb", fontSize: 10 }}>（Gemini 會根據這段描述填入遊戲設定）</span></label>
                  <textarea value={gameContent} onChange={(e) => setGameContent(e.target.value)} placeholder="描述你的遊戲主題、角色、故事背景、氛圍...&#10;&#10;例：這是一個太空探索主題的遊戲，主角是一位太空人在外星球探險，敵人是外星怪物，收集能量水晶來升級飛船..." style={{ width: "100%", height: 140, background: inputBg, border: `1px solid ${border}`, borderRadius: 8, padding: "8px 12px", color: text, fontSize: 13, lineHeight: 1.6, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "background 0.3s" }} />
                </div>
              </div>
            </div>

            {/* Game Type Selection */}
            <div>
              <div style={{ fontSize: 13, color: subtext, fontWeight: 700, marginBottom: 12 }}>
                選擇遊戲類型
                <span style={{ color: isDark ? "#333" : "#bbb", fontWeight: 400, fontSize: 11, marginLeft: 8 }}>（選好後，YAML 會包含完整的遊戲規格讓 AI 實作）</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {GAME_TYPES.map(g => (
                  <GameCard key={g.id} g={g} selected={selectedGame?.id === g.id} onSelect={setSelectedGame} isDark={isDark} />
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate} disabled={loading || !selectedGame || !gameContent.trim()} style={{
              width: "100%", padding: "14px 24px", border: "none", borderRadius: 12,
              background: loading || !selectedGame || !gameContent.trim()
                ? (isDark ? "#13132a" : "#e8eaff")
                : "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: loading || !selectedGame || !gameContent.trim()
                ? (isDark ? "#333" : "#aaa") : "#fff",
              fontSize: 15, fontWeight: 800, cursor: loading || !selectedGame || !gameContent.trim() ? "not-allowed" : "pointer",
              fontFamily: "inherit", transition: "all 0.3s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid #555", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  {loadingMsg || "處理中..."}
                </>
              ) : "✨ 用 Gemini 產出遊戲規格 YAML"}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>

        ) : (
          /* ── Result Phase ──────────────────────────────────────────────── */
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Back */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setPhase("input")} style={{ background: isDark ? "#13132a" : "#e8eaff", border: `1px solid ${border}`, color: isDark ? "#aaa" : "#5555aa", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>← 返回</button>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{selectedGame.emoji} {gameTitle || "我的遊戲"} <span style={{ fontSize: 12, color: subtext, fontWeight: 400 }}>— {selectedGame.name}</span></div>
                <div style={{ fontSize: 11, color: subtext }}>{selectedGame.stack} · Vercel 部署</div>
              </div>
            </div>

            {/* AI Analysis */}
            {aiAnalysis && (
              <div style={{ background: "#4f46e514", border: "1px solid #4f46e533", borderRadius: 12, padding: 16 }}>
                <div style={{ color: "#a78bfa", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>✨ Gemini 遊戲企劃分析</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: isDark ? "#c4b5fd" : "#5b3fd4" }}>{aiAnalysis}</p>
              </div>
            )}

            {/* Tabs */}
            <div style={{ display: "flex", gap: 3, background: isDark ? "#080814" : "#e8eaff", padding: 4, borderRadius: 10, border: `1px solid ${border}` }}>
              {[
                { id: "yaml", label: "📄 遊戲規格 YAML" },
                { id: "deploy", label: "🤖 AI 實作 + 部署引導" },
              ].map(({ id, label }) => (
                <button key={id} onClick={() => setActiveTab(id)} style={{
                  flex: 1, padding: "9px 14px", borderRadius: 8, border: "none",
                  background: activeTab === id ? selectedGame.color : "transparent",
                  color: activeTab === id ? "#fff" : subtext,
                  cursor: "pointer", fontSize: 13, fontWeight: activeTab === id ? 700 : 400,
                  fontFamily: "inherit", transition: "all 0.2s",
                }}>{label}</button>
              ))}
            </div>

            {activeTab === "yaml" && (
              <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "12px 18px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: text }}>📄 game-config.yml</span>
                    <span style={{ marginLeft: 10, fontSize: 11, color: subtext }}>包含完整遊戲規格，貼給 Codex 或 Claude Code 即可實作</span>
                  </div>
                  <button onClick={downloadYAML} style={{ background: selectedGame.color, border: "none", color: "#fff", padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap" }}>
                    ⬇ 下載 YML
                  </button>
                </div>
                <pre style={{ margin: 0, padding: 16, fontSize: 11.5, lineHeight: 1.9, overflowX: "auto", fontFamily: "'JetBrains Mono', monospace", background: isDark ? "#000" : "#1a1a2e", maxHeight: 520 }}>
                  {yaml.split("\n").map((line, i) => {
                    let color = "#a8e6cf";
                    if (line.trim().startsWith("#")) color = "#3a3a5c";
                    else if (/^[a-z_]+:/.test(line.trim())) color = "#7ec8e3";
                    else if (line.trim().startsWith("-")) color = "#f9c74f";
                    else if (line.includes('"')) color = "#ffd166";
                    return <div key={i} style={{ color }}>{line || " "}</div>;
                  })}
                </pre>
              </div>
            )}

            {activeTab === "deploy" && (
              <DeployGuide game={selectedGame} gameTitle={gameTitle || "我的遊戲"} yaml={yaml} isDark={isDark} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
