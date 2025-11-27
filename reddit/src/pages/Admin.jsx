import { useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const load = () => api.adminUsers().then(setUsers);
  useEffect(() => { if (user?.role === "admin") load(); }, [user]);
  if (!user || user.role !== "admin") return <div className="p-6">Acceso restringido</div>;
  return (
    <div className="p-6">
      <div className="text-2xl font-bold">Usuarios</div>
      <div className="mt-4 space-y-2">
        {users.map((u)=>(
          <div key={u._id} className="flex items-center justify-between border rounded p-2">
            <div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={u.active?"text-green-600":"text-red-600"}>{u.active?"Activo":"Inactivo"}</span>
              <button className="px-2 py-1 bg-gray-800 text-white rounded" onClick={async()=>{await api.adminToggleUser(u._id); load();}}>Alternar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
