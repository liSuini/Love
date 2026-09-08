---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: '92b4d544-8f05-4017-92dd-fad3eb32afdf'
  PropagateID: '92b4d544-8f05-4017-92dd-fad3eb32afdf'
  ReservedCode1: 'a00524aa-70aa-4b4f-91fc-e59fee3c3d07'
  ReservedCode2: 'a00524aa-70aa-4b4f-91fc-e59fee3c3d07'
---

# 任务拆分：心动回合战

> 阶段 8 产出 · 全栈开发大师流程
> 日期：2026-09-08
> 12 个 tracer-bullet 纵切片，按依赖顺序排列

## 依赖关系图

```
01 脚手架
├── 02 卡牌+CardLibrary
├── 03 主题+ThemeRegistry
└── 04 音频+AudioManager
      └── 05 组合式函数
            └── 06 通用组件
                  └── 07 注册表+首页
                        ├── 08 心动回合战
                        ├── 09 大转盘
                        └── 10 默契问答
                              └── 11 移动端适配
                                    └── 12 构建部署
```

---

## 01: 项目脚手架与基础配置

**What to build:** 一个可运行的 Vue 3 + Vite 项目，含路由配置（首页/游戏页/404）、全局样式（base/themes/animations CSS）、三个临时占位 View。`npm run dev` 后浏览器能看到首页。

**Blocked by:** 无（可立即开始）

**Status:** ready-for-agent

- [ ] Vite + Vue 3 项目初始化，安装 vue-router@4, vitest, @vue/test-utils
- [ ] vite.config.js 配置 base: './' 和 vitest 环境
- [ ] 全局样式 base.css / themes.css（3套CSS变量） / animations.css
- [ ] 路由配置：/ → HomeView, /game/:modeId → GameView, * → NotFoundView
- [ ] `npm run dev` 启动成功，首页占位内容可访问

---

## 02: 卡牌数据文件 + CardLibrary 服务

**What to build:** 6 个卡牌 JSON 文件（任务≥40 / 真心话≥40 / 惩罚≥20 / 奖励≥15 / 默契问答≥30 / 转盘事件≥8），以及 CardLibrary 服务类（draw 抽取防短期重复、reset 清空历史）。TDD 验证防重复机制。

**Blocked by:** 01（脚手架）

**Status:** ready-for-agent

- [ ] 6 个 JSON 文件创建，条目数量达标，每条含 id/type/content/level
- [ ] CardLibrary.test.js 测试通过（抽取有效卡、连续抽取不重复、reset 功能）
- [ ] 卡牌内容大胆热恋风不露骨，中文

---

## 03: 主题数据文件 + ThemeRegistry 服务

**What to build:** themes.json 含 3 套主题配置，ThemeRegistry 服务类可切换主题（修改 data-theme + 注入 CSS 变量）、持久化到 localStorage、下次打开恢复上次主题。TDD 验证。

**Blocked by:** 01（脚手架）

**Status:** ready-for-agent

- [ ] themes.json 含甜蜜粉嫩/深夜浪漫/活力多彩 3 套主题
- [ ] ThemeRegistry.test.js 测试通过（getThemes、setTheme、持久化、恢复）
- [ ] 主题切换即时生效不刷新

---

## 04: AudioManager 服务

**What to build:** AudioManager 服务类，含音效播放（Web Audio API 程序化生成波形）、背景音乐播放（HTMLAudioElement）、音量控制、开关、用户上传本地音乐文件。偏好持久化到 localStorage。TDD 验证。

**Blocked by:** 01（脚手架）

**Status:** ready-for-agent

- [ ] AudioManager 实现 playEffect/playMusic/stopMusic/setVolume/toggle/loadUserMusic
- [ ] AudioManager.test.js 测试通过（开关、音量、持久化）
- [ ] 音效用 Web Audio API 程序化生成，无需外部音频文件

---

## 05: 组合式函数层

**What to build:** useGameSession（游戏对局 reactive 状态：startMode/switchPlayer/addScore/checkCombo/resetCombo/finishGame/reset）、useTheme（封装 ThemeRegistry）、useAudio（封装 AudioManager）。useGameSession TDD 验证计分和连击逻辑。

**Blocked by:** 02（CardLibrary）, 03（ThemeRegistry）, 04（AudioManager）

**Status:** ready-for-agent

- [ ] useGameSession.test.js 测试通过（初始化、加分、连击+5、切换玩家）
- [ ] useTheme 封装 ThemeRegistry，提供 reactive state + setTheme
- [ ] useAudio 封装 AudioManager，提供 reactive state + 所有音频操作

---

## 06: 通用组件库

**What to build:** 7 个可复用 Vue 组件：PlayerCard（玩家信息卡+连击徽章）、CardModal（卡牌弹窗+翻转动画）、ScoreBoard（顶部计分回合栏）、ResultScreen（结算页+浪漫文案）、ThemeSwitcher（主题切换浮窗）、AudioPanel（音频设置面板+上传音乐）、ModeCard（首页模式入口卡）。所有组件使用 CSS 变量适配多主题。

**Blocked by:** 05（组合式函数）

**Status:** ready-for-agent

- [ ] 7 个组件创建，props/emits 定义清晰
- [ ] 组件内样式使用 var(--c-xxx) 变量，3套主题下视觉正确
- [ ] `npm run dev` 无组件编译错误

---

## 07: 模式注册表 + 首页 HomeView

**What to build:** 模式注册表 registry.js（导出 modes 数组和 getMode 函数）、3 个模式 config.js（含 id/name/icon/description/懒加载组件）、首页 HomeView 从注册表渲染 ModeCard 列表，点击跳转 /game/:modeId。首页含主题切换和音频设置入口浮窗。

**Blocked by:** 06（通用组件）

**Status:** ready-for-agent

- [ ] 3 个 config.js 创建（heartbeat/wheel/quiz）
- [ ] registry.js 导出 modes 数组 + getMode
- [ ] HomeView 从注册表遍历渲染，点击可跳转路由
- [ ] 首页有主题切换和音频设置浮窗入口
- [ ] 新增玩法只需在 registry.js 加一行注册

---

## 08: 心动回合战模式

**What to build:** HeartbeatMode.vue 完整实现心动回合战玩法：双人轮流→掷骰子(动画)→按点数抽卡(task/truth/punishment/bonus)→展示卡牌(翻转动画)→完成计分/跳过清零连击→连击3次+5→每人5回合→结算页。GameView.vue 根据路由 modeId 动态加载对应玩法组件。

**Blocked by:** 07（注册表+首页）

**Status:** ready-for-agent

- [ ] GameView.vue 根据路由参数动态加载玩法组件
- [ ] HeartbeatMode 完整流程可玩：掷骰→抽卡→计分→连击→结算
- [ ] 骰子点数正确映射卡牌类型（1-2任务/3-4真心话/5惩罚/6奖励）
- [ ] 得分正确（任务10/真心话8/惩罚12/奖励15/连击+5）
- [ ] 连击3次显示特效并重置
- [ ] 结算页显示双方分数+浪漫文案+再来一局/返回首页
- [ ] 浏览器实测完整流程无报错

---

## 09: 命运大转盘模式

**What to build:** WheelMode.vue 完整实现命运大转盘玩法：8扇区 conic-gradient 渲染+文字标注、点击旋转动画、随机停止、弹出事件卡片、"再转一次"不弹卡可继续转、可反复游玩。

**Blocked by:** 07（注册表+首页）

**Status:** ready-for-agent

- [ ] 转盘 8 扇区渲染，每次进入随机打乱顺序
- [ ] 转盘旋转动画，逐渐减速停在随机扇区
- [ ] 停止后弹出事件描述卡（除"再转一次"外）
- [ ] "再转一次"直接可再次转动
- [ ] 浏览器实测完整流程无报错

---

## 10: 默契问答模式

**What to build:** QuizMode.vue 完整实现默契问答玩法：10题随机抽取→P1回答→P2回答→系统对比答案一致性→一致显示"心有灵犀"各+10分→不一致显示"默契不足"弹出惩罚卡→10题后结算默契度百分比+评价文案。

**Blocked by:** 07（注册表+首页）

**Status:** ready-for-agent

- [ ] 从 quiz.json 随机抽取 10 题
- [ ] 两人轮流回答同一题（P1先→P2后）
- [ ] 答案去空格小写后对比
- [ ] 一致显示"心有灵犀"+各+10分，不一致显示"默契不足"+弹惩罚卡
- [ ] 结算显示默契度百分比+评价文案+再来一局/返回首页
- [ ] 浏览器实测完整流程无报错

---

## 11: 移动端适配 + 集成验证

**What to build:** 补充全局响应式样式，确保 3 种玩法在手机竖屏（≤480px）下布局正确、按钮触摸友好（≥48px）、文字可读。在浏览器 DevTools 移动端模拟器中验证 3 种玩法全流程。

**Blocked by:** 08（心动回合战）, 09（大转盘）, 10（默契问答）

**Status:** ready-for-agent

- [ ] @media (max-width: 480px) 响应式样式补充
- [ ] 手机端 3 种玩法全流程验证通过
- [ ] 按钮触摸区域 ≥48px
- [ ] 3套主题在手机端视觉正确
- [ ] 竖屏横屏切换无布局错乱

---

## 12: 构建部署验证

**What to build:** 运行 `npm run build` 生成 dist 产物，本地预览验证功能正常。配置 GitHub Pages 部署脚本，确认可部署到 GitHub Pages。

**Blocked by:** 11（移动端适配）

**Status:** ready-for-agent

- [ ] `npm run build` 无报错，dist/ 生成
- [ ] `npx serve dist` 本地预览功能正常
- [ ] package.json 添加 deploy 脚本
- [ ] vite base 路径适配 GitHub Pages（'./'相对路径）