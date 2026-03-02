import API_URL from "./index";
export const tagService = {
    async getAll() {
        const response = await fetch(`${API_URL}/tags`);
        if (!response.ok) {
            throw new Error('Error al obtener las etiquetas');
        }
        return await response.json();
    },
}