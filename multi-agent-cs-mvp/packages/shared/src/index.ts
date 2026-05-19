export type CustomerIntent =
  | "refund"
  | "logistics"
  | "product"
  | "complaint"
  | "invoice"
  | "unknown";

export type EscalationLevel = "auto_resolve" | "needs_review" | "handoff_human";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface OrderRecord {
  orderNo: string;
  customerName: string;
  productName: string;
  status: "paid" | "shipped" | "delivered" | "refund_pending";
  createdAt: string;
  trackingNo?: string;
  amount: number;
}

export interface AgentStep {
  agent: string;
  summary: string;
  details: string[];
}

export interface SessionState {
  sessionId: string;
  messages: ChatMessage[];
}

export interface ChatRequest {
  sessionId?: string;
  message: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  intent: CustomerIntent;
  escalation: EscalationLevel;
  nextAction: string;
  orderMatch?: OrderRecord;
  steps: AgentStep[];
  messages: ChatMessage[];
}
