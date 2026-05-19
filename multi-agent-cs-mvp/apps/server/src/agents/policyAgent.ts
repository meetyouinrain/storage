import { policies } from "../data/demoData.js";
import type { OrchestratorContext } from "../types.js";

export function runPolicyAgent(context: OrchestratorContext): OrchestratorContext {
  const hints =
    context.intent === "refund"
      ? policies.refund
      : context.intent === "logistics"
        ? policies.logistics
        : context.intent === "invoice"
          ? policies.invoice
          : context.intent === "complaint"
            ? policies.complaint
            : [];

  context.policyHints = hints;
  context.steps.push({
    agent: "PolicyAgent",
    summary: `检索到 ${hints.length} 条服务策略`,
    details: hints.length ? hints : ["当前诉求未匹配到明确政策，需结合知识库补充回复"]
  });

  return context;
}
