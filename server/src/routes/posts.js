import { Router } from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).populate("author", "name role");
  res.json(posts);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name role");
  if (!post) return res.status(404).json({ error: "not_found" });
  const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 }).populate("author", "name role");
  res.json({ post, comments });
});

router.post("/", authRequired, async (req, res) => {
  const { title, content, imageUrl, link } = req.body;
  if (!title || !content) return res.status(400).json({ error: "invalid" });
  const post = await Post.create({ title, content, imageUrl, link, author: req.user._id });
  res.status(201).json(post);
});

router.put("/:id", authRequired, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "not_found" });
  const isOwner = String(post.author) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ error: "forbidden" });
  const { title, content, imageUrl, link } = req.body;
  post.title = title ?? post.title;
  post.content = content ?? post.content;
  post.imageUrl = imageUrl ?? post.imageUrl;
  post.link = link ?? post.link;
  await post.save();
  res.json(post);
});

router.delete("/:id", authRequired, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "not_found" });
  const isOwner = String(post.author) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) return res.status(403).json({ error: "forbidden" });
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ ok: true });
});

router.post("/:id/react", authRequired, async (req, res) => {
  const { type } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: "not_found" });
  const uid = req.user._id;
  post.likes = post.likes.filter((x) => String(x) !== String(uid));
  post.dislikes = post.dislikes.filter((x) => String(x) !== String(uid));
  if (type === "like") post.likes.push(uid);
  if (type === "dislike") post.dislikes.push(uid);
  await post.save();
  res.json({ likes: post.likes.length, dislikes: post.dislikes.length });
});

export default router;
