import cors from "cors";
import express from "express";
import { z } from "zod";
import { handleCustomerMessage } from "./services/orchestrator.js";
import { orders } from "./data/demoData.js";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/orders", (_req, res) => {
  res.json({ items: orders });
});

app.post("/api/chat", (req, res) => {
  const schema = z.object({
    sessionId: z.string().optional(),
    message: z.string().min(1)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
    return;
  }

  const response = handleCustomerMessage(parsed.data);
  res.json(response);
});

app.listen(port, () => {
  console.log(`Multi-agent customer service server running at http://localhost:${port}`);
});
