import { faqEntries, orders } from "../data/demoData.js";
import type { OrchestratorContext } from "../types.js";

function pickOrder(raw: string) {
  const orderNo = raw.match(/CS\d{11}/i)?.[0];
  if (orderNo) return orders.find((item) => item.orderNo.toLowerCase() === orderNo.toLowerCase());
  return orders.find((item) => raw.includes(item.customerName) || raw.includes(item.productName));
}

export function runKnowledgeAgent(context: OrchestratorContext): OrchestratorContext {
  const raw = context.userMessage;
  const hits = faqEntries
    .filter((entry) => entry.keywords.some((keyword) => raw.includes(keyword)))
    .map((entry) => `${entry.title}：${entry.answer}`);

  const orderMatch = pickOrder(raw);

  context.knowledgeHits = hits;
  context.orderMatch = orderMatch;
  context.steps.push({
    agent: "KnowledgeAgent",
    summary: `命中 ${hits.length} 条 FAQ，${orderMatch ? "找到订单信息" : "未找到明确订单"}`,
    details: [
      ...hits,
      orderMatch
        ? `订单 ${orderMatch.orderNo}，商品 ${orderMatch.productName}，状态 ${orderMatch.status}`
        : "用户消息中未包含可精确定位的订单标识"
    ]
  });

  return context;
}
