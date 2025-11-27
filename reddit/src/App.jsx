import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-full">
      <nav className="flex items-center justify-between px-6 py-3 border-b">
        <Link to="/" className="font-bold">RedBlog</Link>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm">Inicio</Link>
          {user && <Link to="/create" className="text-sm">Nueva</Link>}
          {user && <Link to="/profile" className="text-sm">Perfil</Link>}
          {user?.role === "admin" && <Link to="/admin" className="text-sm">Admin</Link>}
          {!user && <Link to="/login" className="text-sm">Entrar</Link>}
          {!user && <Link to="/register" className="text-sm">Registro</Link>}
          {user && <button className="text-sm" onClick={()=>{logout(); nav("/");}}>Salir</button>}
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}
