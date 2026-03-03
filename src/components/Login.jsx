import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../services";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data.access_token);

      if (response.ok) {
        localStorage.setItem("authToken", data.access_token);
        navigate("/CategoryList");
      } else {
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 text-white rounded-2xl shadow-xl p-8 border border-gray-700">
        
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition transform duration-150 shadow-md"
          >
            Ingresar
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;