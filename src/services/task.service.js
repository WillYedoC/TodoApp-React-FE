import API_URL from './index'

export const tareaService = {
  async getAll() {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response) {
      throw new Error('Error al obtener las tareas');
    }
    return await response.json();
  },
  async create(data) {
    console.log(data);
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al crear la tarea');
    }
    return await response.json();
  },
  async update(id, data) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la tarea');
    }
    return await response.json();
  }
}
