---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: 'af1493ed-ba8e-47b0-a1d0-ee61496dcfc5'
  PropagateID: 'af1493ed-ba8e-47b0-a1d0-ee61496dcfc5'
  ReservedCode1: '5b39a06b-3181-4239-98e0-5f03db5bb028'
  ReservedCode2: '5b39a06b-3181-4239-98e0-5f03db5bb028'
---

# 架构设计：情侣互动小游戏合集「心动回合战」

> 阶段 4 产出 · 全栈开发大师流程
> 日期：2026-09-08

## 1. 技术选型

| 层面 | 选型 | 理由 |
|------|------|------|
| 框架 | Vue 3 (Composition API) | 用户熟悉，组件化好，动画生态完善 |
| 构建 | Vite | 极速 HMR，开箱即用 |
| 语言 | JavaScript (ES2020+) | 纯前端游戏无需 TS 类型系统复杂度，保持轻快 |
| 状态管理 | Vue 3 reactive (无 Pinia) | 应用状态简单，用组合式函数 + reactive 即可，减少依赖 |
| 路由 | Vue Router 4 | 首页 ↔ 各玩法模式间的页面切换 |
| 动画 | CSSAnimations + Vue Transition | 轻量动效足够，骰子/转盘用 CSS+JS 驱动 |
| 音频 | Web Audio API | 音效 + 背景音乐统一管理 |
| 数据存储 | localStorage | 偏好持久化，卡牌库为静态 JSON |
| 部署 | GitHub Pages / 静态托管 | 纯前端，无后端 |

## 2. 目录结构

```
Love/
├── index.html                  # Vite 入口 HTML
├── package.json
├── vite.config.js
├── CONTEXT.md                  # 领域词汇表
├── docs/                       # 各阶段文档
│   ├── adr/
│   ├── brainstorm.md
│   ├── prd.md
│   ├── domain.md
│   ├── architecture.md         # ← 本文件
│   ├── spec.md
│   ├── prototype/
│   ├── plan.md
│   └── tickets.md
├── public/
│   ├── sounds/                 # 音效文件
│   │   ├── dice.mp3
│   │   ├── card.mp3
│   │   ├── score.mp3
│   │   ├── combo.mp3
│   │   └── wheel.mp3
│   └── favicon.ico
└── src/
    ├── main.js                 # 应用入口
    ├── App.vue                 # 根组件
    ├── router/
    │   └── index.js            # 路由配置
    ├── composables/            # 组合式函数（可复用逻辑）
    │   ├── useGameSession.js   # 游戏对局状态管理
    │   ├── useTheme.js         # 主题切换
    │   ├── useAudio.js         # 音效/音乐管理
    │   └── usePreference.js    # localStorage 偏好持久化
    ├── data/                   # 卡牌库（静态 JSON）
    │   ├── tasks.json          # 任务卡 ≥40 条
    │   ├── truths.json         # 真心话 ≥40 条
    │   ├── punishments.json    # 惩罚卡 ≥20 条
    │   ├── bonuses.json        # 奖励卡 ≥15 条
    │   ├── quiz.json           # 默契问答 ≥30 条
    │   ├── wheel-events.json   # 转盘事件 ≥8 条
    │   └── themes.json         # 主题配置
    ├── modes/                  # 玩法模块（每个独立）
    │   ├── registry.js         # 模式注册表（动态注册）
    │   ├── heartbeat/          # 心动回合战
    │   │   ├── HeartbeatMode.vue
    │   │   ├── Dice.vue        # 骰子组件
    │   │   └── config.js       # 玩法配置
    │   ├── wheel/              # 命运大转盘
    │   │   ├── WheelMode.vue
    │   │   ├── Wheel.vue       # 转盘组件
    │   │   └── config.js
    │   └── quiz/               # 默契问答
    │       ├── QuizMode.vue
    │       └── config.js
    ├── services/               # 独立服务
    │   ├── CardLibrary.js      # 卡牌库（抽取/防重复）
    │   ├── ThemeRegistry.js    # 主题注册与切换
    │   └── AudioManager.js     # 音效与音乐管理
    ├── components/             # 通用组件
    │   ├── PlayerCard.vue      # 玩家信息卡
    │   ├── CardModal.vue       # 卡牌展示弹窗
    │   ├── ScoreBoard.vue      # 计分板
    │   ├── ResultScreen.vue    # 结算页
    │   ├── ThemeSwitcher.vue   # 主题切换浮窗
    │   ├── AudioPanel.vue      # 音频设置面板
    │   └── ModeCard.vue        # 首页模式入口卡
    ├── views/                  # 页面视图
    │   ├── HomeView.vue        # 首页
    │   ├── GameView.vue        # 游戏容器（加载对应 Mode）
    │   └── NotFoundView.vue    # 404
    └── styles/                 # 全局样式
        ├── base.css            # 基础重置
        ├── themes.css          # 主题 CSS 变量
        └── animations.css      # 通用动画
```

## 3. 模块设计（Deep Module 视角）

### 3.1 CardLibrary — 卡牌库服务

**Interface（小表面）**:
```
CardLibrary(type: CardType)
  .draw(): Card                    // 抽一张卡（防短期重复）
  .reset(): void                   // 重置抽取历史
```

**Implementation（深实现）**: 内部管理 JSON 数据加载、recentDraws 队列（≤10）、随机洗牌逻辑。调用者只需 `draw()`，完全不需要知道防重复机制。

**Seam 位置**: `src/services/CardLibrary.js`，通过构造函数注入 CardType。

**深度分析**: 接口仅 2 个方法，但隐藏了数据加载、防重复、洗牌等复杂逻辑。符合深度模块原则。

### 3.2 AudioManager — 音频管理服务

**Interface**:
```
AudioManager
  .playEffect(name: string): void        // 播放音效
  .playMusic(src?: string): void         // 播放/切换背景音乐
  .stopMusic(): void                     // 停止音乐
  .setEffectVolume(v: number): void      // 音效音量
  .setMusicVolume(v: number): void       // 音乐音量
  .toggleEffect(on: boolean): void       // 音效开关
  .toggleMusic(on: boolean): void        // 音乐开关
```

**Implementation**: 内部管理 Web Audio API 上下文、Audio 元素池、音量增益节点。音效预加载、音乐文件 URL 管理。

### 3.3 ThemeRegistry — 主题注册服务

**Interface**:
```
ThemeRegistry
  .getThemes(): Theme[]                  // 获取所有主题
  .getCurrent(): Theme                   // 当前主题
  .setTheme(id: string): void            // 切换主题
```

**Implementation**: 内部从 themes.json 加载主题列表，通过切换 `document.documentElement` 上的 CSS 变量实现即时换肤，持久化到 localStorage。

### 3.4 GameMode 接口 — 玩法模块统一规范

**Interface**:
```
GameMode {
  id: string                             // 模式标识
  name: string                           // 显示名称
  icon: string                           // 图标 emoji
  description: string                    // 简介
  component: VueComponent                // 该模式的 Vue 组件
  init(session): void                    // 初始化
  reset(): void                          // 重置
}
```

**Seam 位置**: `src/modes/registry.js` — 模式注册表。首页从注册表读取列表渲染 ModeCard，新增玩法只需在 registry.js 添加注册行。

### 3.5 useGameSession — 对局状态组合式函数

**Interface**:
```
useGameSession()
  .session: reactive(GameSession)
  .startMode(modeId): void
  .switchPlayer(): void
  .addScore(playerId, points): void
  .checkCombo(playerId): boolean
  .finishGame(): GameResult
  .reset(): void
```

**Implementation**: 管理 GameSession 响应式状态，协调 Player、CardLibrary、玩法模块。

## 4. 数据流

```
用户操作
  │
  ▼
Vue 组件 (View/Mode)
  │
  ▼
useGameSession (组合式函数)
  │           │           │
  ▼           ▼           ▼
CardLibrary  AudioManager  ThemeRegistry
  │           │           │
  ▼           ▼           ▼
JSON 数据   Web Audio API  CSS 变量
  │           │           │
  └───────────┴───────────┘
              │
              ▼
        localStorage (偏好持久化)
```

**数据流原则**:
- 单向数据流：组件 → composable → service → 底层
- 组件不直接操作 service，通过 composable 间接调用
- 响应式状态集中在 composable 层，组件只做渲染

## 5. 主题系统设计

通过 CSS 变量实现主题切换，所有颜色/样式引用变量名而非硬编码值：

```css
:root {
  --color-primary: #ff6b9d;
  --color-secondary: #ffd93d;
  --color-bg: #fff5f7;
  --color-card: #ffffff;
  --color-text: #4a3340;
  --radius: 16px;
  --shadow: 0 4px 20px rgba(255,107,157,0.15);
}

/* 深夜浪漫风 */
[data-theme="midnight"] {
  --color-primary: #c44b6e;
  --color-secondary: #6b2c5f;
  --color-bg: #1a0e1a;
  --color-card: #2d1b2d;
  --color-text: #f0e0e8;
  --radius: 12px;
  --shadow: 0 4px 20px rgba(0,0,0,0.4);
}
```

切换主题 = 修改 `document.documentElement.dataset.theme`，即时生效无刷新。

## 6. 路由设计

```
/              → HomeView (首页，选择玩法模式)
/game/:modeId  → GameView (根据 modeId 加载对应玩法组件)
/about         → 关于页面（可选）
*              → NotFoundView
```

GameView 内部根据 `$route.params.modeId` 从注册表查找对应 mode，动态加载其 component。

## 7. 测试策略

| 层级 | 工具 | 关注点 |
|------|------|--------|
| 单元测试 | Vitest | CardLibrary 抽取防重复、useGameSession 计分/连击逻辑、ThemeRegistry 切换 |
| 组件测试 | Vitest + @vue/test-utils | 组件渲染、交互事件、props/emits |
| E2E | 手动验证 | 各玩法完整流程、主题切换、音效控制、移动端适配 |

测试文件放在 `tests/` 目录，镜像 `src/` 结构。

## 8. 性能考量

- 卡牌 JSON 文件按需加载（进入玩法模式时 import 对应 JSON）
- 音效预加载（首次交互后缓存 Audio 元素）
- 转盘/骰子动画用 CSS transform + requestAnimationFrame，不用重型动画库
- Vite 构建自动 code-split，各玩法组件懒加载
- 图片资源极少（纯 CSS 装饰为主），首屏 <3s

## 9. 扩展性设计

### 新增玩法模式
1. 在 `src/modes/<新玩法>/` 创建组件和 config.js
2. 在 `src/modes/registry.js` 添加一行注册
3. 首页自动出现新模式入口，无需改首页代码

### 新增卡牌内容
1. 编辑对应 JSON 文件添加条目
2. 每条标注 `level` 字段（sweet/hot/wild）
3. v2 增加分级开关时只需过滤 level

### 新增主题
1. 在 `src/data/themes.json` 添加主题配置
2. 在 `styles/themes.css` 添加对应 `[data-theme="xxx"]` 变量块
3. 主题切换浮窗自动显示新主题