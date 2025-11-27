import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { setAuth } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const r = await api.register({ name, email, password });
      setAuth(r.token, r.user);
      nav("/");
    } catch (e) {
      setError("Datos inválidos o email existente");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Registro</h1>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <input className="w-full border rounded p-2" placeholder="Nombre" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Contraseña" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full bg-blue-600 text-white rounded p-2">Crear cuenta</button>
      </form>
      <div className="mt-2 text-sm">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600">Entrar</Link></div>
    </div>
  );
}
