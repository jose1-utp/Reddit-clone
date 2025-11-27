import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authRequired = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "unauthorized" });
    if (!user.active) return res.status(403).json({ error: "inactive" });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: "unauthorized" });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "unauthorized" });
  if (req.user.role !== role) return res.status(403).json({ error: "forbidden" });
  next();
};
