---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: 'beb82073-0e89-4da5-a135-f2dccc0d8c01'
  PropagateID: 'beb82073-0e89-4da5-a135-f2dccc0d8c01'
  ReservedCode1: '16c51940-21be-4e0a-a321-64a5a0cd3b99'
  ReservedCode2: '16c51940-21be-4e0a-a321-64a5a0cd3b99'
---

# 心动回合战 (Love Game)

一款面向情侣的单设备轮流互动小游戏合集，通过多种玩法模式促进感情升温。纯前端应用，无后端依赖。

## Language

### 游戏核心

**Player (玩家)**:
对局中的参与者，一局游戏固定两人，默认昵称"TA"和"宝贝"。
_Avoid_: 用户(user)、角色(role)

**GameSession (游戏对局)**:
从开始到结算的一次完整游玩过程，绑定一个玩法模式。
_Avoid_: 游戏(game)、比赛(match)

**GameMode (玩法模式)**:
一个独立的游戏类型单元，如心动回合战、命运大转盘、默契问答。每种模式遵循统一的玩法接口规范，可动态注册到模式列表。
_Avoid_: 小游戏(minigame)、模块(module)

**Turn (回合)**:
单个玩家的一次操作轮次。心动回合战中每玩家 5 回合，回合内玩家执行掷骰→抽卡→完成挑战的完整流程。
_Avoid_: 轮次(round)、步骤(step)

### 卡牌系统

**Card (卡牌)**:
一条可抽取的互动内容，属于特定类型（任务/真心话/惩罚/奖励）。每张卡牌有唯一 ID、内容文本、所属类型、内容等级。
_Avoid_: 题目(question)、任务(task，task 是 Card 的一种类型而非同义词)

**CardType (卡牌类型)**:
卡牌的分类，包括四种：任务卡(task)、真心话(truth)、惩罚卡(punishment)、奖励卡(bonus)。
_Avoid_: 类别(category)

**CardLibrary (卡牌库)**:
某一类型的卡牌集合，存储为静态 JSON 文件。抽取时有防短期重复机制（最近 10 张不重复）。
_Avoid_: 卡池(pool)、题库(bank)

**ContentLevel (内容等级)**:
卡牌的分级标注，取值为 sweet(甜蜜) / hot(热恋) / wild(大胆)。v1 不暴露分级 UI，仅在数据层标注，为 v2 分级开关预留。
_Avoid_: 难度(difficulty)、尺度(scale)

### 心动回合战专属

**DiceResult (骰子结果)**:
掷骰子得到的点数（1-6），映射到挑战类型：1-2=任务卡，3-4=真心话，5=惩罚卡，6=奖励卡。
_Avoid_: 点数(number)、骰值(value)

**ChallengeType (挑战类型)**:
骰子结果映射后的挑战分类，与 CardType 一一对应。
_Avoid_: 事件类型

**HeartScore (心动值)**:
玩家的得分，完成任务得 10 分、真心话 8 分、惩罚 12 分、奖励 15 分。
_Avoid_: 分数(score)、积分(points)

**Combo (连击)**:
连续完成 3 次挑战的状态，触发后额外加 5 分。连击中断时重置计数。
_Avoid_: 连胜(streak)

### 命运大转盘专属

**WheelSegment (转盘扇区)**:
大转盘上的一个分割区域，标注事件类型（亲吻/拥抱/壁咚/撒娇/提问/小惩罚/奖励/再转一次）。共 8 个扇区。
_Avoid_: 格子(slot)

**WheelEvent (转盘事件)**:
转盘停止后落点对应的事件，触发后弹出任务描述卡片。
_Avoid_: 奖品(prize)、结果(result)

### 默契问答专属

**QuizQuestion (默契题目)**:
一道测试双方默契的问题，如"TA最喜欢的食物是什么"。每局 10 题。
_Avoid_: 题目(question，泛指时可用)

**AnswerMatch (答案对比)**:
两人分别回答同一题目后，系统对比答案一致性。一致得双方各 10 分，不一致触发惩罚卡。
_Avoid_: 对比结果(comparison)

### 外观与音频

**Theme (主题)**:
视觉风格预设，包含配色、背景、卡片样式、字体色调的整体方案。v1 内置 3 套：甜蜜粉嫩风、深夜浪漫风、活力多彩风。
_Avoid_: 皮肤(skin)、样式(style)

**SoundEffect (音效)**:
关键操作的声音反馈，如骰子滚动、卡牌翻转、得分提示。有独立开关和音量控制。
_Avoid_: 音频(audio)

**BackgroundMusic (背景音乐)**:
用户可自定义的循环音乐，支持本地文件上传。默认关闭。
_Avoid_: BGM(可用作简称)、音乐(music)

## Rules

- 一局游戏固定两名玩家，轮流操作
- 玩家昵称使用默认值，v1 不提供设置入口
- 卡牌库为静态 JSON 文件，不依赖后端
- 所有偏好设置（主题、音量）持久化到 localStorage
- 玩法模块遵循统一接口规范，新增玩法只需注册不需改首页