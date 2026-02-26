import API_URL from './index'

export const tareaService = {
  async getAll() {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response) {
      throw new Error('Error al obtener las tareas');
    }
    return await response.json();
  },
}
