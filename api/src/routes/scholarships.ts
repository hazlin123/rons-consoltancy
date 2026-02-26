import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";

const router = express.Router();

const DATA_FILE = path.join(__dirname, "../../data/scholarships.json");

type Scholarship = {
  id: string;
  name: string;
  country: string;
  level: string;
  deadline?: string;
  coverage?: string;
};

// Helper to read data
const readData = async (): Promise<Scholarship[]> => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array or initial data
    return [];
  }
};

// Helper to write data
const writeData = async (data: Scholarship[]) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

router.get("/", async (_req: Request, res: Response) => {
  const store = await readData();
  res.json(store);
});

router.post("/", async (req: Request, res: Response) => {
  const store = await readData();
  const data = req.body as Partial<Scholarship>;
  const item: Scholarship = {
    id: uuidv4(),
    name: data.name || "Untitled",
    country: data.country || "",
    level: data.level || "",
    deadline: data.deadline,
    coverage: data.coverage,
  };
  store.push(item);
  await writeData(store);
  res.status(201).json(item);
});

router.get("/:id", async (req: Request, res: Response) => {
  const store = await readData();
  const found = store.find((s) => s.id === req.params.id);
  if (!found) return res.status(404).json({ error: "Not found" });
  return res.json(found);
});

router.put("/:id", async (req: Request, res: Response) => {
  const store = await readData();
  const idx = store.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  store[idx] = { ...store[idx], ...(req.body as Partial<Scholarship>) };
  await writeData(store);
  return res.json(store[idx]);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const store = await readData();
  const idx = store.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  store.splice(idx, 1);
  await writeData(store);
  return res.status(204).send();
});

export default router;
