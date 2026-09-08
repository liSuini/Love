---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: 'fda64b6e-e939-40ce-bdff-1f19183ed59c'
  PropagateID: 'fda64b6e-e939-40ce-bdff-1f19183ed59c'
  ReservedCode1: '3ea4b767-e45f-4861-919e-2488cc781971'
  ReservedCode2: '3ea4b767-e45f-4861-919e-2488cc781971'
---

# 技术规格：情侣互动小游戏合集「心动回合战」

> 阶段 5 产出 · 全栈开发大师流程
> 日期：2026-09-08

## Problem Statement

情侣希望在轻松愉快的游戏氛围中增加互动和亲密感，但市面上缺少面向情侣的、内容健康且玩法多样的单设备互动游戏应用。现有应用要么功能单一（只有真心话或只有任务卡），要么需要注册登录和联机，要么内容尺度不合适。

## Solution

一款纯前端单页应用「心动回合战」，打开即玩，无需注册。内置 3 种玩法模式（心动回合战、命运大转盘、默契问答），多套视觉主题自由切换，内置音效并支持自定义背景音乐。玩法模块遵循统一接口规范，后续可持续扩展更多互动玩法。

## User Stories

### 首页与导航

1. 作为一对情侣，我打开应用即看到游戏首页，显示应用名称和 3 个玩法模式入口卡片，无需注册登录。
2. 作为用户，我点击任一模式卡片后直接进入对应玩法，不经过任何中间设置步骤。
3. 作为用户，我在首页可以打开"主题切换"浮窗，选择不同的视觉风格。
4. 作为用户，我在首页可以打开"音频设置"面板，调整音效开关、音量和背景音乐。
5. 作为用户，我在游戏中可以随时返回首页选择其他玩法。
6. 作为用户，我切换主题后立即生效，不需要刷新页面。
7. 作为用户，我下次打开应用时，上次选择的主题和音频设置自动恢复。

### 心动回合战模式

8. 作为玩家1，我进入心动回合战后看到两个玩家区域（默认昵称"TA"和"宝贝"），当前回合玩家高亮显示。
9. 作为当前玩家，我点击"掷骰子"按钮后看到骰子滚动动画，停止后显示点数（1-6）。
10. 作为当前玩家，骰子点数 1-2 时我抽到一张任务卡，3-4 时抽到真心话，5 时抽到惩罚卡，6 时抽到奖励卡。
11. 作为当前玩家，抽到卡牌后看到全屏卡片展示（翻转/淡入动画），显示卡牌内容文本。
12. 作为当前玩家，我完成挑战后点击"完成"按钮，获得对应心动值（任务10/真心话8/惩罚12/奖励15）。
13. 作为玩家，我连续完成 3 次挑战后看到"连击"特效，额外获得 5 分。
14. 作为玩家，如果我跳过挑战，连击计数归零。
15. 作为玩家，每玩家 5 回合后游戏结束，展示双方心动值排行与浪漫结算文案。
16. 作为玩家，结算页我可以点击"再来一局"重新开始，或点击"返回首页"切换玩法。
17. 作为玩家，我在游戏中能看到双方当前分数、回合计数和连击状态。

### 命运大转盘模式

18. 作为玩家，我进入命运大转盘后看到一个 8 扇区的大转盘，每个扇区标注事件类型。
19. 作为玩家，我点击"转动"按钮后转盘旋转动画启动，逐渐减速停在随机扇区。
20. 作为玩家，转盘停止后弹出对应事件的任务描述卡片。
21. 作为玩家，我执行事件后点击"完成"关闭卡片，可以继续转动。
22. 作为玩家，如果转盘停在"再转一次"，不弹出卡片，直接可再次转动。
23. 作为玩家，转盘扇区内容每次进入该模式时随机打乱顺序。

### 默契问答模式

24. 作为玩家1，默契问答开始后我看到一道关于对方的问题，我先输入我的回答。
25. 作为玩家1，我提交回答后切换到玩家2回答界面，玩家2对同一道题输入回答。
26. 作为玩家，两人都回答后系统对比答案一致性。
27. 作为玩家，答案一致时显示"心有灵犀"特效，双方各得 10 分。
28. 作为玩家，答案不一致时显示"默契不足"，触发一张随机惩罚卡作为惩罚。
29. 作为玩家，每局 10 道题，结束后展示默契度百分比与评价文案。
30. 作为玩家，我可以在结算页选择"再来一局"或"返回首页"。

### 音频系统

31. 作为用户，我掷骰子时听到骰子滚动音效。
32. 作为用户，我抽到卡牌时听到卡牌翻转音效。
33. 作为用户，我得分时听到得分提示音效。
34. 作为用户，我触发连击时听到连击特效音效。
35. 作为用户，转盘停止时听到转盘停止音效。
36. 作为用户，我可以开关音效，调节音效音量。
37. 作为用户，我可以开启背景音乐并上传本地音乐文件循环播放。
38. 作为用户，背景音乐有独立于音效的音量控制。
39. 作为用户，我的音频偏好设置持久化，下次打开自动恢复。

### 主题与外观

40. 作为用户，我可以在至少 3 套主题间切换：甜蜜粉嫩风、深夜浪漫风、活力多彩风。
41. 作为用户，主题切换即时生效，包含配色、背景、卡片样式、字体色调的整体变化。
42. 作为用户，主题选择持久化到 localStorage，下次打开保持上次选择。

### 卡牌库与内容

43. 作为系统，任务卡库 ≥40 条，真心话库 ≥40 条，惩罚卡库 ≥20 条，奖励卡库 ≥15 条。
44. 作为系统，默契问答题库 ≥30 条，转盘事件描述 ≥8 条。
45. 作为系统，卡牌抽取有防短期重复机制（最近 10 张不重复抽取）。
46. 作为系统，所有卡牌内容标注内容等级字段（sweet/hot/wild），为 v2 分级开关预留。
47. 作为系统，卡牌库数据结构统一，存储在独立 JSON 文件中。

### 扩展性

48. 作为开发者，每种玩法封装为独立模块，遵循统一 GameMode 接口规范。
49. 作为开发者，首页模式列表从注册表动态渲染，新增玩法只需注册不需改首页。
50. 作为开发者，文档中记录玩法接口规范便于后续参照。

## Implementation Decisions

### 1. 技术栈

- Vue 3 (Composition API) + Vite + Vue Router 4
- JavaScript (ES2020+)，不使用 TypeScript
- 状态管理用 Vue 3 reactive + 组合式函数，不引入 Pinia
- 音频用 Web Audio API + HTMLAudioElement
- 偏好持久化用 localStorage
- 卡牌库为静态 JSON，按需 import

### 2. 卡牌数据模型

所有卡牌 JSON 文件遵循统一结构：

```json
[
  {
    "id": "task-001",
    "type": "task",
    "content": "给对方一个持续的额吻，坚持10秒",
    "level": "hot"
  }
]
```

字段说明：
- `id`: 唯一标识，格式 `{type}-{序号}`
- `type`: 卡牌类型 — task/truth/punishment/bonus
- `content`: 中文内容文本
- `level`: 内容等级 — sweet/hot/wild

### 3. 主题数据模型

```json
[
  {
    "id": "sweet",
    "name": "甜蜜粉嫩风",
    "vars": {
      "--color-primary": "#ff6b9d",
      "--color-secondary": "#ffd93d",
      "--color-bg": "#fff5f7",
      "--color-card": "#ffffff",
      "--color-text": "#4a3340",
      "--radius": "16px",
      "--shadow": "0 4px 20px rgba(255,107,157,0.15)"
    }
  }
]
```

主题切换通过修改 `document.documentElement` 的 `data-theme` 属性 + 注入 CSS 变量实现即时换肤。

### 4. 默契问答数据模型

```json
[
  {
    "id": "quiz-001",
    "question": "TA最喜欢的食物是什么？",
    "category": "爱好"
  }
]
```

答案对比为字符串去空格小写后比较一致性。不要求精确匹配，鼓励开放式回答。

### 5. 转盘事件数据模型

```json
[
  {
    "id": "wheel-001",
    "eventType": "kiss",
    "label": "亲吻",
    "color": "#ff6b9d",
    "description": "给对方一个甜甜的吻"
  }
]
```

8 个事件类型：kiss（亲吻）/ hug（拥抱）/ pin（壁咚）/ hint（撒娇）/ quiz（提问）/ punish（小惩罚）/ bonus（奖励）/ respin（再转一次）。

### 6. CardLibrary 接口

```
class CardLibrary {
  constructor(type: CardType, cards: Card[])
  draw(): Card          // 随机抽取一张，排除 recentDraws 中的 ID
  reset(): void         // 清空 recentDraws
}
```

防重复机制：维护 recentDraws 数组（最大长度 10），抽卡时过滤已包含的 ID，抽后推入。当库中可用卡数 ≤10 时，recentDraws 自动清空。

### 7. GameMode 接口规范

```javascript
// 每个玩法模块通过 config.js 导出
export default {
  id: 'heartbeat',           // 唯一标识
  name: '心动回合战',         // 显示名称
  icon: '💖',               // 图标 emoji
  description: '骰子决定命运，挑战升温感情',
  component: () => import('./HeartbeatMode.vue')  // 懒加载组件
}
```

### 8. 模式注册表

```javascript
// src/modes/registry.js
import heartbeat from './heartbeat/config'
import wheel from './wheel/config'
import quiz from './quiz/config'

export const modes = [heartbeat, wheel, quiz]
export const getMode = (id) => modes.find(m => m.id === id)
```

首页遍历 `modes` 渲染 ModeCard，新增玩法只需在此数组添加一行。

### 9. useGameSession 组合式函数

```javascript
const {
  session,              // reactive: { mode, players, currentPlayerIdx, turnCount, state, result }
  startMode(modeId),    // 初始化指定模式的新对局
  switchPlayer(),       // 切换当前玩家
  addScore(playerId, points),  // 给指定玩家加分
  checkCombo(playerId),        // 检查并触发连击
  finishGame(),         // 结束对局，生成结算
  reset()               // 重置对局
} = useGameSession()
```

### 10. AudioManager 接口

```javascript
const audio = new AudioManager()
audio.playEffect('dice')           // 播放音效（预加载的 Audio 元素）
audio.playMusic(url)               // 播放/切换背景音乐
audio.stopMusic()
audio.setEffectVolume(0.5)         // 0-1
audio.setMusicVolume(0.3)
audio.toggleEffect(true/false)
audio.toggleMusic(true/false)
audio.loadUserMusic(file)          // 用户上传本地文件 → ObjectURL
```

### 11. 骰子点数映射规则

| 骰子点数 | 挑战类型 | 卡牌类型 | 完成得分 |
|---------|---------|---------|---------|
| 1-2 | 任务 | task | 10 |
| 3-4 | 真心话 | truth | 8 |
| 5 | 惩罚 | punishment | 12 |
| 6 | 奖励 | bonus | 15 |

### 12. 连击规则

- 每完成一次挑战，comboCount +1
- comboCount 达 3 时，额外 +5 分，显示连击特效，comboCount 重置为 0
- 跳过挑战时 comboCount 归零

### 13. 默契问答流程状态机

```
[题目展示] → [P1回答] → [P2回答] → [答案对比]
     ↑                                    ↓
     └────── 下一题 ← [得分/惩罚] ←────────┘
                    (10题后 → 结算)
```

### 14. 路由设计

```
/                → HomeView（首页模式选择）
/game/:modeId    → GameView（根据 modeId 加载玩法组件）
*                → NotFoundView
```

## Testing Decisions

### 测试 seam 选择

采用**组合式函数 + 服务层**作为主要测试 seam，不测试组件内部实现细节：

1. **CardLibrary** — 测试 `draw()` 返回有效卡牌、防重复机制（连续抽 N 次不重复）、`reset()` 清空历史
2. **useGameSession** — 测试计分逻辑、连击触发与重置、玩家切换、结束条件检测
3. **ThemeRegistry** — 测试主题切换后 CSS 变量更新、持久化到 localStorage
4. **组件测试** — 测试关键交互（掷骰按钮触发回调、卡牌展示/关闭、主题切换 UI）

### 测试原则

- 只测试外部行为（接口输出），不测试内部实现细节
- 不依赖 DOM 结构的 CSS 选择器，用 Vue Test Utils 的 role/文本查找
- 卡牌抽取用固定数据集测试，不依赖随机性
- 响应式状态变更用 `flushPromises` 确保更新

### 测试工具

- Vitest（单元 + 组件测试）
- @vue/test-utils（组件挂载与交互）
- 手动浏览器验证（视觉/动画/音频/移动端）

## Out of Scope

- 用户注册登录系统
- 后端服务器与数据库
- 异地联机对战（v3 预留）
- 用户自定义卡牌编辑（v2 预留）
- 内容分级开关 UI（v2 预留，v1 仅数据层标注）
- 社交分享功能
- 排行榜系统
- 多语言支持（v1 仅中文）

## Further Notes

- 音效素材采用免费音效库（如 freesound.org 的 CC0 音效）或程序化生成简单波形
- 背景音乐默认无内置音乐，用户自行上传
- 移动端优先设计：大按钮（≥48px）、竖屏最优、触摸友好
- 所有动画优先用 CSS transform + opacity（GPU 加速）
- Vite 构建配置 base 路径需适配 GitHub Pages 部署（`base: './'`）
- 卡牌内容文案需人工审阅确保"大胆热恋风"但不越界、不含不良引导