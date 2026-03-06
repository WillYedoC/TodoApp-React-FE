import API_URL from "./index";

export const tagService = {
  async getAll(page = 1, perPage = 10) {
    try{
      const response = await fetch(`${API_URL}/tags/?page=${page}&per_page=${perPage}`, {
        method: "GET",
        headers:{
          'Content-Type': 'application/json',
        }
      })
      if (!response.ok) {
        throw new Error("Error al obtener las etiquetas");
      }
      return await response.json();
    } catch(error){
      console.error('Error en getAll:',error);
      throw error
    }
  },

  async getOne(id) {
    const response = await fetch(`${API_URL}/tags/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener la etiqueta");
    }
    return await response.json();
  },

  async create(tagData) {
    const response = await fetch(`${API_URL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tagData),
    });
    if (!response.ok) {
      throw new Error("Error al crear la etiqueta");
    }
    return await response.json();
  },

  async update(id, tagData) {
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tagData),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar la etiqueta");
    }
    return await response.json();
  },

  async delete(id) {
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al eliminar la etiqueta");
    }
  },
};
