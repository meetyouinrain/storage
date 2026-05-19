import type { CustomerIntent } from "@mvp/shared";
import type { OrchestratorContext } from "../types.js";

export function runIntentAgent(context: OrchestratorContext): OrchestratorContext {
  const text = context.userMessage.toLowerCase();

  let intent: CustomerIntent = "unknown";
  if (/(退款|退货|退钱|refund)/.test(text)) intent = "refund";
  else if (/(物流|快递|发货|没收到|tracking)/.test(text)) intent = "logistics";
  else if (/(发票|开票|invoice)/.test(text)) intent = "invoice";
  else if (/(质量|坏了|故障|问题|不能用|product)/.test(text)) intent = "product";
  else if (/(投诉|差评|生气|愤怒|complaint)/.test(text)) intent = "complaint";

  const sentiment = /(投诉|生气|差评|太慢|垃圾|投诉你们)/.test(text)
    ? "negative"
    : /(尽快|马上|急|催一下)/.test(text)
      ? "urgent"
      : "calm";

  context.intent = intent;
  context.sentiment = sentiment;
  context.steps.push({
    agent: "IntentAgent",
    summary: `识别用户诉求为 ${intent}，情绪为 ${sentiment}`,
    details: [
      "基于关键词规则识别问题类型",
      "基于强情绪词判断是否需要更谨慎的服务策略"
    ]
  });

  return context;
}
