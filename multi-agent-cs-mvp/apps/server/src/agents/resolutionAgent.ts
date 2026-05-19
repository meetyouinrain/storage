import type { OrchestratorContext } from "../types.js";

function buildOrderLine(context: OrchestratorContext): string {
  if (!context.orderMatch) return "当前我还没有识别到具体订单号，你可以补充订单号或下单姓名。";

  const order = context.orderMatch;
  const tracking = order.trackingNo ? `，物流单号为 ${order.trackingNo}` : "";
  return `我查到订单 ${order.orderNo}，商品是“${order.productName}”，当前状态为 ${order.status}${tracking}。`;
}

export function runResolutionAgent(context: OrchestratorContext): OrchestratorContext {
  const opening =
    context.sentiment === "negative"
      ? "抱歉让你遇到这个问题，我先帮你快速梳理一下。"
      : context.sentiment === "urgent"
        ? "我先帮你快速确认关键信息。"
        : "我来帮你处理这个问题。";

  const policyLine = context.policyHints[0] ?? "我会结合订单信息和常见处理规则给你建议。";
  const knowledgeLine = context.knowledgeHits[0] ?? "如果你愿意，我也可以继续补充更具体的处理步骤。";

  let nextAction = "继续澄清需求";
  if (context.intent === "refund") nextAction = "收集退款原因并触发售后工单";
  if (context.intent === "logistics") nextAction = "同步物流进度并判断是否超时";
  if (context.intent === "invoice") nextAction = "收集开票信息";
  if (context.intent === "complaint") nextAction = "优先安抚并准备升级人工";

  context.nextAction = nextAction;
  context.reply = [opening, buildOrderLine(context), policyLine, knowledgeLine, `建议下一步：${nextAction}。`].join(" ");

  context.steps.push({
    agent: "ResolutionAgent",
    summary: "生成客服回复与建议动作",
    details: [
      `回复策略基于 intent=${context.intent}`,
      `建议动作：${nextAction}`
    ]
  });

  return context;
}
