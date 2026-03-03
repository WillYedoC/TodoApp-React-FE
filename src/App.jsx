import { useEffect, useState } from 'react';
import { tareaService } from './services/task.service';
import CategoryList from './components/CategoryList';
import Login from './components/Login';
import Navbar from './components/Navbar';
import './App.css';
import { Routes, Route } from "react-router-dom";


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
      await fetchTasks();
    } catch (err) {
      setError('Error al autorizar o cargar las tareas');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
    <Navbar/>
    <Routes>
      <Route 
      path="/Login"
      element={<Login />}
      />
      <Route 
      path='/CategoryList'
      element={<CategoryList />}
      />
    </Routes>

  </div>
);
}

export default App;