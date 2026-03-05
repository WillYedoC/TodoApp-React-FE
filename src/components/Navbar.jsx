import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative flex items-center justify-between h-16">
            
            <div className="flex space-x-4">
              <NavLink
                to="/Login"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/CategoryList"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg transition font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`
                }
              >
                Categorías
              </NavLink>
            </div>

            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold tracking-widest">
              TODOAPP
            </h1>
          </div>
        </div>
      </nav>

      <div className="h-16"></div>
    </>
  );
};

export default Navbar;