import { useEffect, useState } from "react";
import type { AgentStep, ChatMessage, ChatResponse, OrderRecord } from "@mvp/shared";

const API_BASE = "http://localhost:3001";

export function App() {
  const [input, setInput] = useState("帮我查一下订单 CS20260501001 的物流，怎么一直没到？");
  const [sessionId, setSessionId] = useState<string>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [intent, setIntent] = useState<string>("-");
  const [escalation, setEscalation] = useState<string>("-");
  const [nextAction, setNextAction] = useState<string>("-");
  const [orderMatch, setOrderMatch] = useState<OrderRecord | undefined>();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data.items ?? []))
      .catch(() => setOrders([]));
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: input })
      });
      const data: ChatResponse = await res.json();
      setSessionId(data.sessionId);
      setMessages(data.messages);
      setSteps(data.steps);
      setIntent(data.intent);
      setEscalation(data.escalation);
      setNextAction(data.nextAction);
      setOrderMatch(data.orderMatch);
      setInput("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="brand">
          <p className="eyebrow">Multi-Agent MVP</p>
          <h1>自动化客户服务系统</h1>
          <p className="subtle">可直接运行的多 Agent 协同客服演示项目</p>
        </div>

        <section className="panel">
          <h2>会话状态</h2>
          <div className="stat-grid">
            <Stat label="Session" value={sessionId ?? "未开始"} />
            <Stat label="Intent" value={intent} />
            <Stat label="Escalation" value={escalation} />
            <Stat label="Next Action" value={nextAction} />
          </div>
        </section>

        <section className="panel">
          <h2>匹配订单</h2>
          {orderMatch ? (
            <div className="order-card">
              <div>{orderMatch.orderNo}</div>
              <div>{orderMatch.productName}</div>
              <div>状态：{orderMatch.status}</div>
              <div>金额：¥{orderMatch.amount}</div>
              <div>{orderMatch.trackingNo ? `物流：${orderMatch.trackingNo}` : "暂无物流单号"}</div>
            </div>
          ) : (
            <p className="subtle">当前会话暂未命中具体订单</p>
          )}
        </section>

        <section className="panel">
          <h2>演示订单</h2>
          <div className="sample-list">
            {orders.map((order) => (
              <button
                key={order.orderNo}
                className="sample-item"
                onClick={() => setInput(`请帮我处理订单 ${order.orderNo}，我想咨询${order.status === "refund_pending" ? "退款进度" : "当前物流状态"}。`)}
              >
                <strong>{order.orderNo}</strong>
                <span>{order.productName}</span>
              </button>
            ))}
          </div>
        </section>
      </aside>

      <main className="main">
        <section className="chat-panel panel">
          <div className="panel-header">
            <h2>客服工作台</h2>
            <p className="subtle">支持物流、退款、发票、商品问题、投诉等场景</p>
          </div>

          <div className="messages">
            {messages.length === 0 ? (
              <div className="empty">
                <p>输入用户问题后，系统会依次调用多个 Agent 完成判断、检索、生成与分流。</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`message ${message.role}`}>
                  <div className="role">{message.role === "user" ? "用户" : "系统"}</div>
                  <div className="bubble">{message.content}</div>
                </div>
              ))
            )}
          </div>

          <div className="composer">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入客户问题，例如：我想退货、订单为什么还没发货、能开发票吗？"
            />
            <button onClick={sendMessage} disabled={loading}>
              {loading ? "处理中..." : "发送"}
            </button>
          </div>
        </section>

        <section className="trace-panel panel">
          <div className="panel-header">
            <h2>Agent 协同轨迹</h2>
            <p className="subtle">展示每个 Agent 的判断结果，方便演示与答辩</p>
          </div>
          <div className="steps">
            {steps.length === 0 ? (
              <div className="empty">
                <p>尚未开始会话</p>
              </div>
            ) : (
              steps.map((step) => (
                <div key={step.agent} className="step-card">
                  <div className="step-title">{step.agent}</div>
                  <div className="step-summary">{step.summary}</div>
                  <ul>
                    {step.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
