import  API_URL  from './index';
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  console.log('🔑 Token en interceptor:', token);
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      console.log('Token inválido o expirado');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('No autorizado');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
};

export const get = (endpoint) => {
  return fetchWithAuth(endpoint, { method: 'GET' });
};

export const post = (endpoint, data) => {
  return fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const put = (endpoint, data) => {
  return fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const del = (endpoint) => {
  return fetchWithAuth(endpoint, { method: 'DELETE' });
};