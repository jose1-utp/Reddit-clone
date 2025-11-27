const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token") || "";

const req = async (path, options = {}) => {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
};

export const api = {
  health: () => req("/health"),
  register: (body) => req("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => req("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => req("/auth/me"),
  listPosts: () => req("/posts"),
  getPost: (id) => req(`/posts/${id}`),
  createPost: (body) => req("/posts", { method: "POST", body: JSON.stringify(body) }),
  updatePost: (id, body) => req(`/posts/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deletePost: (id) => req(`/posts/${id}`, { method: "DELETE" }),
  react: (id, type) => req(`/posts/${id}/react`, { method: "POST", body: JSON.stringify({ type }) }),
  addComment: (postId, content) => req(`/comments/${postId}/comments`, { method: "POST", body: JSON.stringify({ content }) }),
  updateComment: (id, content) => req(`/comments/${id}`, { method: "PUT", body: JSON.stringify({ content }) }),
  deleteComment: (id) => req(`/comments/${id}`, { method: "DELETE" }),
  adminUsers: () => req("/admin/users"),
  adminToggleUser: (id) => req(`/admin/users/${id}/toggle`, { method: "PATCH" })
};
