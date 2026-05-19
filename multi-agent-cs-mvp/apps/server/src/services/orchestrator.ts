import { nanoid } from "nanoid";
import type { ChatMessage, ChatRequest, ChatResponse } from "@mvp/shared";
import { runIntentAgent } from "../agents/intentAgent.js";
import { runKnowledgeAgent } from "../agents/knowledgeAgent.js";
import { runPolicyAgent } from "../agents/policyAgent.js";
import { runResolutionAgent } from "../agents/resolutionAgent.js";
import { runSupervisorAgent } from "../agents/supervisorAgent.js";
import { appendMessages, createSession, getSession } from "./sessionStore.js";
import type { OrchestratorContext } from "../types.js";

function now() {
  return new Date().toISOString();
}

export function handleCustomerMessage(input: ChatRequest): ChatResponse {
  const sessionId = input.sessionId ?? nanoid(10);
  const session = getSession(sessionId) ?? createSession(sessionId);

  const userMessage: ChatMessage = {
    id: nanoid(),
    role: "user",
    content: input.message,
    timestamp: now()
  };

  let context: OrchestratorContext = {
    sessionId,
    userMessage: input.message,
    history: session.messages,
    intent: "unknown",
    policyHints: [],
    knowledgeHits: [],
    sentiment: "calm",
    escalation: "auto_resolve",
    nextAction: "",
    reply: "",
    steps: []
  };

  context = runIntentAgent(context);
  context = runPolicyAgent(context);
  context = runKnowledgeAgent(context);
  context = runResolutionAgent(context);
  context = runSupervisorAgent(context);

  const assistantMessage: ChatMessage = {
    id: nanoid(),
    role: "assistant",
    content: context.reply,
    timestamp: now()
  };

  appendMessages(sessionId, [userMessage, assistantMessage]);
  const updatedSession = getSession(sessionId)!;

  return {
    sessionId,
    reply: context.reply,
    intent: context.intent,
    escalation: context.escalation,
    nextAction: context.nextAction,
    orderMatch: context.orderMatch,
    steps: context.steps,
    messages: updatedSession.messages
  };
}
