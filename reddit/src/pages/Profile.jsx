import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return <div className="p-6">No autenticado</div>;
  return (
    <div className="p-6">
      <div className="text-2xl font-bold">Perfil</div>
      <div className="mt-2">Nombre: {user.name}</div>
      <div>Email: {user.email}</div>
      <div>Rol: {user.role}</div>
    </div>
  );
}
