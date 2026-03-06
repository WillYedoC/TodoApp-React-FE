import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from './components/authContext';
import { setUnauthorizedCallback } from './services/api.interceptor';

import Login from './components/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import CategoryList from './components/CategoryList';
import TagList from './components/TagList';
import TaskList from './components/TaskList';

import './App.css';

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setUnauthorizedCallback(() => {
      logout();
      navigate('/login', { replace: true });
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    });
  }, [logout, navigate]);

  return (
    <div className="App min-h-screen bg-gray-900">
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route 
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/categories" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoryList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tags"
          element={
            <ProtectedRoute>
              <TagList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/categories" : "/login"} replace />
          } 
        />

        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400">Página no encontrada</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;