import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

type Application = {
  id: string;
  scholarshipId: string;
  applicantName: string;
  email: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  submittedAt: string;
};

const store: Application[] = [];

router.get("/", (_req, res) => res.json(store));

router.post("/", (req, res) => {
  const data = req.body as Partial<Application>;
  const app: Application = {
    id: uuidv4(),
    scholarshipId: data.scholarshipId || "",
    applicantName: data.applicantName || "",
    email: data.email || "",
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  store.push(app);
  res.status(201).json(app);
});

router.get("/:id", (req, res) => {
  const found = store.find((a) => a.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Not found" });
  return res.json(found);
});

router.put("/:id/status", (req, res) => {
  const { status } = req.body as { status?: Application['status'] };
  const idx = store.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  if (!status) return res.status(400).json({ error: "Status required" });
  store[idx].status = status;
  return res.json(store[idx]);
});

export default router;
