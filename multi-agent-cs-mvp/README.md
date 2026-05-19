# Multi-Agent Customer Service MVP

一个可直接运行的多 Agent 协同自动化客户服务系统 MVP。

## 功能

- React 前端聊天工作台
- Node.js + Express 后端 API
- 多 Agent 编排流程
  - `IntentAgent`：识别用户诉求
  - `PolicyAgent`：匹配售后/物流/退款规则
  - `KnowledgeAgent`：检索商品、订单、FAQ 知识
  - `ResolutionAgent`：生成客服回复与处理建议
  - `SupervisorAgent`：决定自动回复或转人工
- 会话历史与 Agent 执行轨迹展示
- 内置演示订单、知识库和服务策略

## 快速开始

```bash
npm install
npm run dev
```

启动后：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:3001`

## 打包

```bash
npm run zip
```

会在项目根目录生成 `multi-agent-cs-mvp.zip`。
