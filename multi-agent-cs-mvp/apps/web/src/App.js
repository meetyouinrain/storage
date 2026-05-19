import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
const API_BASE = "http://localhost:3001";
export function App() {
    const [input, setInput] = useState("帮我查一下订单 CS20260501001 的物流，怎么一直没到？");
    const [sessionId, setSessionId] = useState();
    const [messages, setMessages] = useState([]);
    const [steps, setSteps] = useState([]);
    const [intent, setIntent] = useState("-");
    const [escalation, setEscalation] = useState("-");
    const [nextAction, setNextAction] = useState("-");
    const [orderMatch, setOrderMatch] = useState();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetch(`${API_BASE}/api/orders`)
            .then((res) => res.json())
            .then((data) => setOrders(data.items ?? []))
            .catch(() => setOrders([]));
    }, []);
    async function sendMessage() {
        if (!input.trim())
            return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, message: input })
            });
            const data = await res.json();
            setSessionId(data.sessionId);
            setMessages(data.messages);
            setSteps(data.steps);
            setIntent(data.intent);
            setEscalation(data.escalation);
            setNextAction(data.nextAction);
            setOrderMatch(data.orderMatch);
            setInput("");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "page", children: [_jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "brand", children: [_jsx("p", { className: "eyebrow", children: "Multi-Agent MVP" }), _jsx("h1", { children: "\u81EA\u52A8\u5316\u5BA2\u6237\u670D\u52A1\u7CFB\u7EDF" }), _jsx("p", { className: "subtle", children: "\u53EF\u76F4\u63A5\u8FD0\u884C\u7684\u591A Agent \u534F\u540C\u5BA2\u670D\u6F14\u793A\u9879\u76EE" })] }), _jsxs("section", { className: "panel", children: [_jsx("h2", { children: "\u4F1A\u8BDD\u72B6\u6001" }), _jsxs("div", { className: "stat-grid", children: [_jsx(Stat, { label: "Session", value: sessionId ?? "未开始" }), _jsx(Stat, { label: "Intent", value: intent }), _jsx(Stat, { label: "Escalation", value: escalation }), _jsx(Stat, { label: "Next Action", value: nextAction })] })] }), _jsxs("section", { className: "panel", children: [_jsx("h2", { children: "\u5339\u914D\u8BA2\u5355" }), orderMatch ? (_jsxs("div", { className: "order-card", children: [_jsx("div", { children: orderMatch.orderNo }), _jsx("div", { children: orderMatch.productName }), _jsxs("div", { children: ["\u72B6\u6001\uFF1A", orderMatch.status] }), _jsxs("div", { children: ["\u91D1\u989D\uFF1A\u00A5", orderMatch.amount] }), _jsx("div", { children: orderMatch.trackingNo ? `物流：${orderMatch.trackingNo}` : "暂无物流单号" })] })) : (_jsx("p", { className: "subtle", children: "\u5F53\u524D\u4F1A\u8BDD\u6682\u672A\u547D\u4E2D\u5177\u4F53\u8BA2\u5355" }))] }), _jsxs("section", { className: "panel", children: [_jsx("h2", { children: "\u6F14\u793A\u8BA2\u5355" }), _jsx("div", { className: "sample-list", children: orders.map((order) => (_jsxs("button", { className: "sample-item", onClick: () => setInput(`请帮我处理订单 ${order.orderNo}，我想咨询${order.status === "refund_pending" ? "退款进度" : "当前物流状态"}。`), children: [_jsx("strong", { children: order.orderNo }), _jsx("span", { children: order.productName })] }, order.orderNo))) })] })] }), _jsxs("main", { className: "main", children: [_jsxs("section", { className: "chat-panel panel", children: [_jsxs("div", { className: "panel-header", children: [_jsx("h2", { children: "\u5BA2\u670D\u5DE5\u4F5C\u53F0" }), _jsx("p", { className: "subtle", children: "\u652F\u6301\u7269\u6D41\u3001\u9000\u6B3E\u3001\u53D1\u7968\u3001\u5546\u54C1\u95EE\u9898\u3001\u6295\u8BC9\u7B49\u573A\u666F" })] }), _jsx("div", { className: "messages", children: messages.length === 0 ? (_jsx("div", { className: "empty", children: _jsx("p", { children: "\u8F93\u5165\u7528\u6237\u95EE\u9898\u540E\uFF0C\u7CFB\u7EDF\u4F1A\u4F9D\u6B21\u8C03\u7528\u591A\u4E2A Agent \u5B8C\u6210\u5224\u65AD\u3001\u68C0\u7D22\u3001\u751F\u6210\u4E0E\u5206\u6D41\u3002" }) })) : (messages.map((message) => (_jsxs("div", { className: `message ${message.role}`, children: [_jsx("div", { className: "role", children: message.role === "user" ? "用户" : "系统" }), _jsx("div", { className: "bubble", children: message.content })] }, message.id)))) }), _jsxs("div", { className: "composer", children: [_jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), placeholder: "\u8F93\u5165\u5BA2\u6237\u95EE\u9898\uFF0C\u4F8B\u5982\uFF1A\u6211\u60F3\u9000\u8D27\u3001\u8BA2\u5355\u4E3A\u4EC0\u4E48\u8FD8\u6CA1\u53D1\u8D27\u3001\u80FD\u5F00\u53D1\u7968\u5417\uFF1F" }), _jsx("button", { onClick: sendMessage, disabled: loading, children: loading ? "处理中..." : "发送" })] })] }), _jsxs("section", { className: "trace-panel panel", children: [_jsxs("div", { className: "panel-header", children: [_jsx("h2", { children: "Agent \u534F\u540C\u8F68\u8FF9" }), _jsx("p", { className: "subtle", children: "\u5C55\u793A\u6BCF\u4E2A Agent \u7684\u5224\u65AD\u7ED3\u679C\uFF0C\u65B9\u4FBF\u6F14\u793A\u4E0E\u7B54\u8FA9" })] }), _jsx("div", { className: "steps", children: steps.length === 0 ? (_jsx("div", { className: "empty", children: _jsx("p", { children: "\u5C1A\u672A\u5F00\u59CB\u4F1A\u8BDD" }) })) : (steps.map((step) => (_jsxs("div", { className: "step-card", children: [_jsx("div", { className: "step-title", children: step.agent }), _jsx("div", { className: "step-summary", children: step.summary }), _jsx("ul", { children: step.details.map((detail) => (_jsx("li", { children: detail }, detail))) })] }, step.agent)))) })] })] })] }));
}
function Stat({ label, value }) {
    return (_jsxs("div", { className: "stat", children: [_jsx("span", { children: label }), _jsx("strong", { children: value })] }));
}
//# sourceMappingURL=App.js.map