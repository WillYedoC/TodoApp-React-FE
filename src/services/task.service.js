import API_URL from './index'

export const tareaService = {
  async getAll(page = 1, perPage = 9, filter = 'all') {
    try {
      const response = await fetch(
        `${API_URL}/tasks?page=${page}&per_page=${perPage}&filter=${filter}`);

      if (!response.ok) {
        throw new Error('Error al obtener las tareas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
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
export default tareaService;