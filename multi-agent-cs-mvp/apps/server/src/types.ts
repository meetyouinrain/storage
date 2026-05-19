import type { AgentStep, ChatMessage, CustomerIntent, EscalationLevel, OrderRecord } from "@mvp/shared";

export interface OrchestratorContext {
  sessionId: string;
  userMessage: string;
  history: ChatMessage[];
  intent: CustomerIntent;
  policyHints: string[];
  knowledgeHits: string[];
  orderMatch?: OrderRecord;
  sentiment: "calm" | "urgent" | "negative";
  escalation: EscalationLevel;
  nextAction: string;
  reply: string;
  steps: AgentStep[];
}
