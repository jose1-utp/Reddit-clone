import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const p = await api.createPost({ title, content, imageUrl, link });
    nav(`/posts/${p._id}`);
  };
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Nueva publicación</h1>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <input className="w-full border rounded p-2" placeholder="Título" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="w-full border rounded p-2" rows={6} placeholder="Contenido" value={content} onChange={(e)=>setContent(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Imagen URL" value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Link" value={link} onChange={(e)=>setLink(e.target.value)} />
        <button className="bg-blue-600 text-white rounded px-3 py-2">Publicar</button>
      </form>
    </div>
  );
}
