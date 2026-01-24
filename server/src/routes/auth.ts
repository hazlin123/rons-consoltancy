import express from "express";

const router = express.Router();

// Simple env-driven credential check for starter projects only
router.post("/login", (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  const envUser = process.env.ADMIN_USER || "admin";
  const envPass = process.env.ADMIN_PASS || "password";

  if (username === envUser && password === envPass) {
    // In a real app return a signed JWT. Here we return a simple session token.
    return res.json({ token: "dev-token", user: { username, role: "admin" } });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;
