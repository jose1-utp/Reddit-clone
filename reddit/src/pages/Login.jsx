import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { setAuth } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const r = await api.login({ email, password });
      setAuth(r.token, r.user);
      nav("/");
    } catch (e) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Contraseña" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full bg-blue-600 text-white rounded p-2">Entrar</button>
      </form>
      <div className="mt-2 text-sm">¿No tienes cuenta? <Link to="/register" className="text-blue-600">Regístrate</Link></div>
    </div>
  );
}
