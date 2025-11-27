import { Router } from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const router = Router();

router.get("/users", authRequired, requireRole("admin"), async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select("name email role active createdAt");
  res.json(users);
});

router.patch("/users/:id/toggle", authRequired, requireRole("admin"), async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ error: "not_found" });
  u.active = !u.active;
  await u.save();
  res.json({ id: u._id, active: u.active });
});

router.delete("/posts/:id", authRequired, requireRole("admin"), async (req, res) => {
  const p = await Post.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "not_found" });
  await Comment.deleteMany({ post: p._id });
  await p.deleteOne();
  res.json({ ok: true });
});

router.delete("/comments/:id", authRequired, requireRole("admin"), async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ error: "not_found" });
  await c.deleteOne();
  res.json({ ok: true });
});

export default router;
