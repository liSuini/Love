---
AIGC:
  ContentProducer: '001191110102MAD55U9H0F10002'
  ContentPropagator: '001191110102MAD55U9H0F10002'
  Label: '1'
  ProduceID: '1280916b-11ab-401e-bcbe-39fb91481e63'
  PropagateID: '1280916b-11ab-401e-bcbe-39fb91481e63'
  ReservedCode1: '3a7d3c3b-2d4a-440f-99ea-752e285d5590'
  ReservedCode2: '3a7d3c3b-2d4a-440f-99ea-752e285d5590'
---

# ADR-0001: 纯前端 SPA 架构，无后端依赖

## Status: accepted

## Context

情侣互动游戏需要快速打开即玩，避免注册登录等摩擦。游戏数据（卡牌库、题目）为静态内容，玩家偏好只需本地存储。引入后端会显著增加部署复杂度和维护成本，而 v1 的功能需求不依赖任何服务端能力。

## Decision

采用纯前端单页应用（SPA）架构，无后端服务器、无数据库。卡牌库以静态 JSON 文件形式打包，玩家偏好存储在 localStorage。

## Consequences

- 优点：部署简单（静态托管即可）、打开即玩、无运维成本、隐私友好（数据不离开设备）
- 限制：无法异地联机（v3 需要时再加后端）、无跨设备数据同步、卡牌库更新需重新部署
- 未来异地联机需求出现时，需新增后端服务，但前端架构可保持不变