---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: '7ec7c0de-dd00-4a6a-987f-15aab7a94f8a'
  PropagateID: '7ec7c0de-dd00-4a6a-987f-15aab7a94f8a'
  ReservedCode1: '877bf6a8-d036-40d8-b658-bea1f449aa66'
  ReservedCode2: '877bf6a8-d036-40d8-b658-bea1f449aa66'
---

# 领域模型：情侣互动小游戏合集「心动回合战」

> 阶段 3 产出 · 全栈开发大师流程
> 日期：2026-09-08

## 1. 领域概览

本项目为纯前端情侣互动游戏，领域围绕"游戏对局"展开。核心领域概念分四组：
1. **游戏核心**：Player, GameSession, GameMode, Turn
2. **卡牌系统**：Card, CardType, CardLibrary, ContentLevel
3. **玩法专属实体**：心动回合战(DiceResult/HeartScore/Combo) · 大转盘(WheelSegment/WheelEvent) · 默契问答(QuizQuestion/AnswerMatch)
4. **外观音频**：Theme, SoundEffect, BackgroundMusic

## 2. 实体关系图

```
┌─────────────────────────────────────────────────────────────┐
│                        GameSession                           │
│  (一次完整游玩会话，绑定一个 GameMode)                          │
├─────────────────────────────────────────────────────────────┤
│  - mode: GameMode                                            │
│  - players: Player[2]                                        │
│  - currentPlayer: Player                                     │
│  - turnCount: int                                            │
│  - state: 'playing' | 'finished'                             │
│  - result: GameResult                                        │
└──────┬──────────┬──────────┬────────────────────────────────┘
       │          │          │
       ▼          ▼          ▼
  ┌─────────┐ ┌─────────┐ ┌──────────────────────────┐
  │ Player  │ │ GameMode│ │    GameResult             │
  │         │ │         │ │  (结算信息)                │
  │ nickname│ │ id      │ │  - winner: Player         │
  │ score   │ │ name    │ │  - scores: {playerId: int}│
  │ combo   │ │ init()  │ │  - summary: string        │
  │ comboCnt│ │ start() │ └──────────────────────────┘
  │         │ │ reset() │
  │         │ │ end()   │
  └─────────┘ └────┬────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│ 心动回合战 │ │ 命运转盘  │ │  默契问答     │
│ (Dice)   │ │ (Wheel)  │ │  (Quiz)      │
├──────────┤ ├──────────┤ ├──────────────┤
│ diceResult│ │ segments │ │ questions[]  │
│ challenge│ │ events[] │ │ currentIdx   │
│ cardDrawn│ │ spinning │ │ answers{}    │
└────┬─────┘ └────┬─────┘ └──────┬───────┘
     │            │              │
     └────────────┴──────────────┘
                  │
                  ▼
          ┌───────────────┐
          │    Card       │
          │  (卡牌系统)    │
          ├───────────────┤
          │ id            │
          │ type: CardType│
          │ content       │
          │ level: ContentLevel │
          └───────┬───────┘
                  │
         ┌────────┴────────┐
         ▼                 ▼
   ┌───────────┐    ┌──────────────┐
   │ CardType  │    │ ContentLevel │
   │ task      │    │ sweet        │
   │ truth     │    │ hot          │
   │ punishment│    │ wild         │
   │ bonus     │    └──────────────┘
   └───────────┘
```

## 3. 核心实体定义

### 3.1 游戏核心

#### Player (玩家)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 玩家标识（'p1' / 'p2'） |
| nickname | string | 昵称，默认 'TA' / '宝贝' |
| heartScore | int | 心动值，初始 0 |
| comboCount | int | 连续完成挑战次数，初始 0 |

**行为**:
- `addScore(points)`: 增加心动值，触发连击检查
- `incrementCombo()`: 连击+1，达 3 次额外加 5 分
- `resetCombo()`: 连击归零
- `reset()`: 重置玩家状态

#### GameSession (游戏对局)
| 字段 | 类型 | 说明 |
|------|------|------|
| mode | GameMode | 当前玩法模式 |
| players | Player[2] | 两名玩家 |
| currentPlayerIdx | int | 当前玩家索引 |
| turnCount | int | 总回合数 |
| state | enum | 'playing' / 'finished' |
| result | GameResult | 结算结果 |

**行为**:
- `switchPlayer()`: 切换当前玩家
- `nextTurn()`: 推进下一回合，检测结束条件
- `finish()`: 结束对局，生成结算
- `reset()`: 重置整局

#### GameMode (玩法模式)
统一的玩法接口规范（所有玩法模块必须实现）:
| 方法 | 说明 |
|------|------|
| `init(session)` | 初始化玩法状态 |
| `start()` | 开始玩法 |
| `reset()` | 重置玩法状态 |
| `end()` | 结束玩法，返回 GameResult |

**已知实现**: HeartBeatMode（心动回合战）, WheelMode（命运大转盘）, QuizMode（默契问答）

### 3.2 卡牌系统

#### Card (卡牌)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识，如 'task-001' |
| type | CardType | 卡牌类型 |
| content | string | 内容文本 |
| level | ContentLevel | 内容等级 |

#### CardType (卡牌类型)
```
enum CardType {
  TASK       // 任务卡 → 10 分
  TRUTH      // 真心话 → 8 分
  PUNISHMENT // 惩罚卡 → 12 分
  BONUS      // 奖励卡 → 15 分
}
```

#### CardLibrary (卡牌库)
| 字段 | 类型 | 说明 |
|------|------|------|
| type | CardType | 库的类型 |
| cards | Card[] | 卡牌列表 |
| recentDraws | string[] | 最近抽取的卡牌 ID（防重复，保留最近 10 张） |

**行为**:
- `draw()`: 随机抽一张卡，排除 recentDraws 中的 ID，抽后将 ID 加入 recentDraws
- `shuffle()`: 打乱顺序
- `getById(id)`: 按 ID 获取

#### ContentLevel (内容等级)
```
enum ContentLevel {
  SWEET  // 甜蜜级 - 轻度亲密
  HOT    // 热恋级 - 中度亲密
  WILD   // 大胆级 - 高度亲密
}
```
> v1 不暴露分级 UI，仅数据层标注。v2 将增加分级开关。

### 3.3 心动回合战专属

#### DiceResult (骰子结果)
| 点数 | 映射挑战类型 | 得分 |
|------|-------------|------|
| 1-2 | TASK (任务卡) | 10 |
| 3-4 | TRUTH (真心话) | 8 |
| 5 | PUNISHMENT (惩罚卡) | 12 |
| 6 | BONUS (奖励卡) | 15 |

#### Combo (连击)
- 每完成一次挑战 comboCount +1
- comboCount 达 3 时额外 +5 分，并触发连击特效
- 未完成挑战或跳过时 comboCount 归零

### 3.4 命运大转盘专属

#### WheelSegment (转盘扇区)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 扇区标识 |
| eventType | string | 事件类型：kiss/hug/pin/hint/quiz/punish/bonus/respin |
| label | string | 显示文字 |
| color | string | 扇区颜色 |

**8 个扇区**：亲吻、拥抱、壁咚、撒娇、提问、小惩罚、奖励、再转一次

#### WheelEvent → Card 映射
转盘停止后，根据 eventType 弹出对应的事件描述卡片（非标准 CardType，而是转盘专属事件描述）。

### 3.5 默契问答专属

#### QuizQuestion (默契题目)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 题目标识 |
| question | string | 题目文本 |
| category | string | 分类（如'爱好''习惯''回忆'） |

#### AnswerMatch (答案对比)
| 字段 | 类型 | 说明 |
|------|------|------|
| questionId | string | 题目 ID |
| answer1 | string | 玩家1的回答 |
| answer2 | string | 玩家2的回答 |
| matched | bool | 答案是否一致 |
| penaltyCard | Card | 答案不一致时的惩罚卡 |

**规则**:
- 玩家1先回答 → 玩家2回答 → 系统对比
- 一致：双方各 +10 分，显示"心有灵犀"
- 不一致：触发一张随机惩罚卡，不扣分

### 3.6 外观与音频

#### Theme (主题)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 主题标识 |
| name | string | 主题名称 |
| colors | object | 配色方案（primary/secondary/bg/card/text） |
| background | string | 背景样式 |
| cardStyle | string | 卡片样式 |

**内置主题**：
| ID | 名称 | 风格 |
|----|------|------|
| sweet | 甜蜜粉嫩风 | 粉红/玫红，圆润可爱 |
| midnight | 深夜浪漫风 | 深紫/暗红，轻奢质感 |
| rainbow | 活力多彩风 | 多彩渐变，派对感 |

#### AudioPref (音频偏好)
| 字段 | 类型 | 说明 |
|------|------|------|
| effectEnabled | bool | 音效开关 |
| effectVolume | float | 音效音量 0-1 |
| musicEnabled | bool | 背景音乐开关 |
| musicVolume | float | 音乐音量 0-1 |
| musicSrc | string | 自定义音乐文件名 |

## 4. 聚合根与边界

```
GameSession (聚合根)
  ├── Player[2]
  ├── GameMode (玩法策略)
  │     ├── CardLibrary (卡牌库，共享/只读)
  │     └── 玩法状态 (Dice/Wheel/Quiz 各自持有)
  └── GameResult
  
ThemeRegistry (独立服务)
  └── Theme[]

AudioManager (独立服务)
  ├── SoundEffect players
  └── BackgroundMusic player

PreferenceStore (独立服务)
  └── localStorage 读写
```

## 5. 关键领域规则

1. **对局生命周期**：init → playing → finished → (可选 reset 重新 init)
2. **卡牌抽取防重复**：CardLibrary 维护 recentDraws（最近 10 张 ID），抽取时排除
3. **连击机制**：连续 3 次完成挑战触发 +5 分奖励，未完成/跳过时归零
4. **默契问答流程**：P1答 → P2答 → 对比 → 得分/惩罚 → 下一题 → 10题后结算默契度
5. **转盘事件**：落点"再转一次"不触发卡片，其余落点弹出对应事件卡
6. **偏好持久化**：Theme 选择、音频偏好存 localStorage，下次打开自动恢复

## 6. ADR 记录

需创建以下架构决策记录（见 docs/adr/）：

- ADR-0001: 纯前端 SPA 架构（无后端依赖）
- ADR-0002: 玩法模块统一接口规范（支持动态注册扩展）

> ADR 将在阶段 4 架构设计中正式记录