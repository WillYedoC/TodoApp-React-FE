import API_URL from "./index";

export const tagService = {
  async getAll() {
    const response = await fetch(`${API_URL}/tags`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener las etiquetas");
    }
    return await response.json();
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
