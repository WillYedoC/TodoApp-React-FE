import API_URL from "./index";

let onUnauthorizedCallback = null;

export const setUnauthorizedCallback = (callback) => {
  onUnauthorizedCallback = callback;
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  if (response.ok) {
    return await response.json();
  }

  if (response.status === 401) {
    console.warn('⚠️ Token expirado o inválido (401)');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (onUnauthorizedCallback) {
      onUnauthorizedCallback();
    }
    
    throw new Error('Sesión expirada');
  }

  if (response.status === 403) {
    throw new Error('No tienes permisos');
  }

  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || `Error: ${response.status}`);
};

export const fetchWithAuth = async (endpoint, options = {}) => {
  try {
    const config = {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers
      }
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en petición:', error);
    throw error;
  }
};

export const get = (endpoint) => fetchWithAuth(endpoint, { method: 'GET' });
export const post = (endpoint, data) => fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(data) });
export const put = (endpoint, data) => fetchWithAuth(endpoint, { method: 'PUT', body: JSON.stringify(data) });
export const del = (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' });
