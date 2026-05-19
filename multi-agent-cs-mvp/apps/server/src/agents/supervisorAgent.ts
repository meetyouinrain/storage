import type { OrchestratorContext } from "../types.js";

export function runSupervisorAgent(context: OrchestratorContext): OrchestratorContext {
  const needsHuman =
    context.intent === "complaint" ||
    context.sentiment === "negative" ||
    (context.intent === "refund" && !context.orderMatch);

  const needsReview =
    context.sentiment === "urgent" ||
    (context.intent === "product" && !context.orderMatch);

  context.escalation = needsHuman
    ? "handoff_human"
    : needsReview
      ? "needs_review"
      : "auto_resolve";

  context.steps.push({
    agent: "SupervisorAgent",
    summary: `最终分流策略：${context.escalation}`,
    details: [
      needsHuman
        ? "存在负面情绪、投诉诉求或退款信息不完整，建议转人工"
        : needsReview
          ? "可先自动回复，但建议人工复核"
          : "可自动完成首轮响应"
    ]
  });

  return context;
}
