const API_URL = 'http://localhost:8000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const tareaService = {
  async getAll() {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'GET',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener las tareas');
    }
    return await response.json();
  },
};