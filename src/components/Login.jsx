import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";
import { authService } from "../services/auth.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login(email, password);
      
      login(data.user, data.access_token);
      
      navigate("/categories");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 text-white rounded-2xl shadow-xl p-8 border border-gray-700">
        
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-white"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition text-white"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition transform duration-150 shadow-md disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;