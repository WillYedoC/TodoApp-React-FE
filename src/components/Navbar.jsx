import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { authService } from '../services/auth.service';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/categories" className="text-white text-xl font-bold">
              TodoList App
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/categories"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Categorías
              </Link>
              <Link
                to="/tags"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Etiquetas
              </Link>
              <Link
                to="/tasks"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Tareas
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-gray-300 text-sm">
                Bienvenido, {user.name || user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;