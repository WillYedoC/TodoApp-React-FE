import API_URL from "./index";

export const categoryService = {

  async getAll(page = 1, perPage = 10) {
    try {
      const response = await fetch(`${API_URL}/categories?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },
  async create(categoryData) {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      throw new Error("Error al crear un nueva categoria");
    }
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
  },
  async getOne(id) {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });
    if(!response.ok){
      throw new Error("Error al obtener la categoría");
    }
    return await response.json();
  }
};