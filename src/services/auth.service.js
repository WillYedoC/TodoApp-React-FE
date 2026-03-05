import  API_URL  from "./index"; 

export const authService = {

  async login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al iniciar sesión");
    }

    localStorage.setItem("authToken", data.access_token);

    return data;
  },

  logout() {
    localStorage.removeItem("authToken");
  },

  getToken() {
    return localStorage.getItem("authToken");
  },

  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  }
};