import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function PostDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  const load = () => api.getPost(id).then(setData);
  useEffect(() => { load(); }, [id]);

  const react = async (type) => { await api.react(id, type); load(); };
  const addComment = async () => { if (!comment) return; await api.addComment(id, comment); setComment(""); load(); };

  if (!data) return <div className="p-6">Cargando</div>;
  const { post, comments } = data;
  const canEdit = user && (user.role === "admin" || user.id === post.author?._id);
  return (
    <div className="p-6 space-y-4">
      <div className="border rounded p-4">
        <div className="text-2xl font-semibold">{post.title}</div>
        <div className="text-sm text-gray-500">{post.author?.name}</div>
        <div className="mt-2">{post.content}</div>
        <div className="mt-2 flex gap-2 items-center">
          <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={()=>react("like")}>👍 {post.likes?.length||0}</button>
          <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>react("dislike")}>👎 {post.dislikes?.length||0}</button>
        </div>
      </div>
      <div className="border rounded p-4">
        <div className="text-lg font-semibold">Comentarios</div>
        {user && (
          <div className="mt-2 flex gap-2">
            <input className="flex-1 border rounded p-2" placeholder="Escribe un comentario" value={comment} onChange={(e)=>setComment(e.target.value)} />
            <button className="bg-blue-600 text-white rounded px-3" onClick={addComment}>Enviar</button>
          </div>
        )}
        <div className="mt-4 space-y-3">
          {comments.map((c)=>(
            <div key={c._id} className="border rounded p-2">
              <div className="text-sm text-gray-500">{c.author?.name}</div>
              <div>{c.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
