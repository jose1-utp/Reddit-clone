import { Router } from "express";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

router.post("/:postId/comments", authRequired, async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).json({ error: "not_found" });
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "invalid" });
  const c = await Comment.create({ post: post._id, author: req.user._id, content });
  res.status(201).json(c);
});

router.put("/:id", authRequired, async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ error: "not_found" });
  const isOwner = String(c.author) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ error: "forbidden" });
  c.content = req.body.content ?? c.content;
  await c.save();
  res.json(c);
});

router.delete("/:id", authRequired, async (req, res) => {
  const c = await Comment.findById(req.params.id);
  if (!c) return res.status(404).json({ error: "not_found" });
  const isOwner = String(c.author) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ error: "forbidden" });
  await c.deleteOne();
  res.json({ ok: true });
});

export default router;
