import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.listPosts().then(setPosts).finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="p-6">Cargando</div>;
  return (
    <div className="p-6 space-y-4">
      {posts.map((p) => (
        <div key={p._id} className="border rounded p-4">
          <Link to={`/posts/${p._id}`} className="text-xl font-semibold">{p.title}</Link>
          <div className="text-sm text-gray-500">{p.author?.name}</div>
          <div className="mt-2 text-gray-800">{p.content.slice(0, 200)}{p.content.length>200?"...":""}</div>
          <div className="mt-2 text-sm">👍 {p.likes?.length||0} · 👎 {p.dislikes?.length||0}</div>
        </div>
      ))}
    </div>
  );
}
