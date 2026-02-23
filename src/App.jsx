import { useEffect, useState } from 'react';
import { tareaService } from './services/task.service';
import './App.css';

const API_URL = 'http://localhost:8000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      await login();
      await fetchTasks();
    } catch (err) {
      setError('Error al autorizar o cargar las tareas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: 'juan@example.com',
        password: 'password123',
      }),
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();

    localStorage.setItem('token', data.data.access_token);
  };

const fetchTasks = async () => {
  try {
    const data = await tareaService.getAll();
    const taskList = Array.isArray(data) ? data : data.data || [];

    console.log('📋 Tareas obtenidas:', taskList);
    setError(null);
  } catch (err) {
    console.error('Error al cargar las tareas', err);
    setError('Error al cargar las tareas');
  }
};

  if (loading) return <div>Cargando...</div>;
if (error) return <div>{error}</div>;

return (
  <div className="App">
    <p>Revisa la consola para ver las tareas</p>
  </div>
);
}

export default App;