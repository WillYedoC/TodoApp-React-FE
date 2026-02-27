import API_URL from "./index";

export const categoryService = {
  async getAll() {
    const response = await fetch(`${API_URL}/categories`);

    if (!response.ok) {
      throw new Error('Error al obtener las categorias');
    }
    return await response.json();
  },
  async create(categoryData) {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoryData)
    });
    return await response.json();
  },
  async update(id, categoryData) {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoryData)
    });
    return await response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al eliminar la categoría");
    }
    return await response.json();
  }
};