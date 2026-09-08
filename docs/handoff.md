---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: 'c3b6cdb2-046e-4af1-89c9-bdb28da2d2b6'
  PropagateID: 'c3b6cdb2-046e-4af1-89c9-bdb28da2d2b6'
  ReservedCode1: '212f8c89-d91f-4bd8-9e23-204e5b3d3355'
  ReservedCode2: '212f8c89-d91f-4bd8-9e23-204e5b3d3355'
---

# Handoff: 心动回合战（Love）项目交接文档

> 生成时间：2026-09-08
> 仓库：git@github.com:liSuini/Love.git
> 工作目录：D:\CODES\AICodeStudy\Love
> 最新 commit：`0a650f7`（main 分支）
> GitHub Pages gh-pages 分支已部署

---

## 项目概述

「心动回合战」是一款纯前端情侣单设备轮流互动游戏合集，内置 3 种玩法（心动回合战/命运大转盘/默契问答），3 套视觉主题（甜蜜粉嫩/深夜浪漫/活力多彩），Web Audio API 程序化音效，支持自定义背景音乐。内容为大胆热恋风，含蓄不露骨。

技术栈：Vue 3 (Composition API) + Vite + Vue Router 4 (Hash 模式) + Web Audio API + localStorage + Vitest。纯 JavaScript（无 TypeScript）。

## 当前进度

全栈开发大师 10 阶段流程中，**阶段 1-9 全部完成**，阶段 10（交接移交）即本文档。

| 阶段 | 状态 | 产出 |
|------|------|------|
| 1 头脑风暴 | ✅ | docs/brainstorm.md |
| 2 PRD | ✅ | docs/prd.md |
| 3 领域建模 | ✅ | docs/domain.md + CONTEXT.md + 2条ADR |
| 4 架构设计 | ✅ | docs/architecture.md |
| 5 技术规格 | ✅ | docs/spec.md |
| 6 原型验证 | ✅ | docs/prototype/index.html |
| 7 开发计划 | ✅ | docs/plan.md |
| 8 任务拆分 | ✅ | docs/tickets.md |
| 9 编码开发 | ✅ | 12个Ticket全部完成 |
| 10 交接移交 | 🔄 | 本文档 |

## Ticket 完成情况（阶段9编码）

| Ticket | 内容 | Commit |
|--------|------|--------|
| 01 脚手架 | 项目初始化、路由、全局样式 | f282909 |
| 02 卡牌数据 | 7个JSON数据文件 + CardLibrary服务 | cb315ea |
| 03 主题数据 | themes.json + ThemeRegistry服务 | cb315ea |
| 04 AudioManager | 程序化音效 + 背景音乐管理 | cb315ea |
| 05 组合式函数 | useGameSession/useTheme/useAudio + 3个测试文件 | 02f330a |
| 06 通用组件 | 7个Vue组件全部完成 | 02f330a |
| 07 注册表+首页 | registry.js + HomeView + GameView | 02f330a |
| 08 心动回合战 | HeartbeatMode.vue 完整玩法 | 02f330a |
| 09 命运大转盘 | WheelMode.vue 完整玩法 | 02f330a |
| 10 默契问答 | QuizMode.vue 完整玩法 | 02f330a |
| 11 集成验证 | 14测试通过 + 构建通过 + 浏览器实测3玩法+主题+移动端 | 0a650f7 |
| 12 构建部署 | 生产构建通过 + GitHub Pages 部署成功 | gh-pages 分支 |

## 测试状态

- 4 个测试文件，14 个测试用例，全部通过
- 生产构建（vite build）72 模块，0 错误，681ms
- 浏览器实测：首页/心动回合战（掷骰→抽卡→计分→回合切换）/大转盘（渲染+旋转）/默契问答（问答界面）/主题切换（即时生效）/移动端 390×844 适配 — 全部通过

## 已修复的问题

1. **GameView 异步组件加载**：`mode.component` 是返回 Promise 的函数，直接用 `<component :is>` 渲染为 `[object Promise]`。修复：用 `defineAsyncComponent(mode.value.component)` 包装（commit 0a650f7）

## 项目文件结构

```
src/
├── main.js                          # 入口
├── App.vue                          # 根组件（router-view）
├── router/index.js                  # Hash路由 / → Home, /game/:modeId → Game
├── styles/                          # base.css, themes.css, animations.css
├── data/                            # 7个JSON（tasks/truths/punishments/bonuses/quiz/wheel-events/themes）
├── services/                        # CardLibrary.js, ThemeRegistry.js, AudioManager.js
├── composables/                     # useGameSession.js, useTheme.js, useAudio.js
├── components/                      # 7个组件（PlayerCard/CardModal/ScoreBoard/ResultScreen/ThemeSwitcher/AudioPanel/ModeCard）
├── modes/
│   ├── registry.js                  # 模式注册表（modes数组 + getMode函数）
│   ├── heartbeat/                   # config.js + HeartbeatMode.vue
│   ├── wheel/                       # config.js + WheelMode.vue
│   └── quiz/                        # config.js + QuizMode.vue
└── views/                           # HomeView.vue, GameView.vue, NotFoundView.vue

tests/
├── services/                        # CardLibrary.test.js, ThemeRegistry.test.js, AudioManager.test.js
└── composables/                     # useGameSession.test.js
```

## 核心设计决策（参考 docs/adr/）

- **ADR-0001**：纯前端 SPA，无后端，无注册登录
- **ADR-0002**：玩法模块统一 GameMode 接口，registry.js 动态注册，新增玩法只需加一行
- Vite base 设为 `'./'` 适配 GitHub Pages
- 路由用 `createWebHashHistory` 避免 GitHub Pages 刷新 404
- 音效用 Web Audio API 程序化生成（无需外部音频文件）

## 待办 / 后续可改进项

1. **GitHub Pages 生效**：gh-pages 分支已推送，需在 GitHub 仓库 Settings → Pages 确认 Source 为 gh-pages 分支，等待几分钟生效后访问 `https://lisuini.github.io/Love/`
2. **jsdom 警告**：AudioManager 测试中 `HTMLMediaElement.prototype.pause` 在 jsdom 中未实现，输出 stderr 警告但不影响测试通过。可后续在测试中 mock `HTMLAudioElement.prototype.pause` 消除
3. **卡牌分级 UI**：数据已标注 level (sweet/hot/wild)，v1 不暴露分级 UI，为 v2 分级开关预留
4. **玩法扩展**：新增玩法只需在 `src/modes/` 下创建目录，添加 config.js（含 id/name/icon/description/component），然后在 registry.js import 并加入 modes 数组
5. **favicon**：当前 404，可后续添加

## 关键运行命令

```bash
# 开发服务器
npx vite --port 5174 --host

# 运行测试
npx vitest run

# 生产构建
npx vite build

# 部署到 GitHub Pages
npm run deploy          # = vite build && gh-pages -d dist
```

## Git 配置

- user.name: "liSuini"
- user.email: "liSuini@users.noreply.github.com"
- 远程: origin → git@github.com:liSuini/Love.git
- 分支: main（开发）, gh-pages（部署产物）

## Suggested Skills

下一个 agent 如需继续工作，建议加载以下技能：

- **handoff**：生成本交接文档的技能
- **fullstack-dev-master**：全栈开发大师流程编排（本项目使用的核心技能，阶段10交接后流程结束）
- **vibe-coding**：如需添加新功能或修复 bug，使用此技能进行编码
- **systematic-debugging**：如遇 bug 或异常行为，按此技能流程排查
- **memory-manager**：如需将项目状态写入长期记忆供后续会话参考