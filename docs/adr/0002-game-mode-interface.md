---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: '345343f9-f8b2-49c0-b591-4e50b7c0757e'
  PropagateID: '345343f9-f8b2-49c0-b591-4e50b7c0757e'
  ReservedCode1: '569f7c63-8dfc-4eea-928b-cb5fcfe3bd4a'
  ReservedCode2: '569f7c63-8dfc-4eea-928b-cb5fcfe3bd4a'
---

# ADR-0002: 玩法模块统一接口规范，支持动态注册扩展

## Status: accepted

## Context

v1 包含 3 种玩法（心动回合战、命运大转盘、默契问答），但用户明确要求预留扩展接口，后续要持续添加更多更大胆的玩法。如果每种玩法与首页和游戏框架硬编码耦合，每次新增玩法都需要修改首页和多处核心逻辑。

## Decision

所有玩法模块实现统一的 GameMode 接口（init/start/reset/end），并通过模式注册表动态注册到首页列表。首页从注册表读取已注册模式渲染入口卡片，新增玩法只需创建模块并注册，不需修改首页代码。

## Consequences

- 优点：新增玩法零侵入首页、玩法模块可独立开发和测试、符合开闭原则
- 代价：引入一层接口抽象的初始复杂度、玩法模块间不能直接调用（需通过 GameSession 协调）
- 接口规范将在阶段 5 技术规格中详细定义