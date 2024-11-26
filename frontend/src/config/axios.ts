import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('auth-storage') || '{}');
  if (user?.state?.user?.token) {
    config.headers.Authorization = `Bearer ${user.state.user.token}`;
  }
  return config;
});

export default api;