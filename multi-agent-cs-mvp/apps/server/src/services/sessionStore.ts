import type { ChatMessage, SessionState } from "@mvp/shared";

const sessions = new Map<string, SessionState>();

export function getSession(sessionId: string): SessionState | undefined {
  return sessions.get(sessionId);
}

export function createSession(sessionId: string): SessionState {
  const session: SessionState = { sessionId, messages: [] };
  sessions.set(sessionId, session);
  return session;
}

export function appendMessages(sessionId: string, messages: ChatMessage[]) {
  const session = sessions.get(sessionId) ?? createSession(sessionId);
  session.messages.push(...messages);
}
