import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ✅ FIXED PATHS:
export const getTasks = () => API.get('/api/tasks');
export const createTask = (data) => API.post('/api/tasks', data);
export const updateTask = (id, data) => API.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/api/tasks/${id}`);
export const loginWithOAuth = (data) => API.post('/api/auth/oauth', data);
export const shareTask = (data) => API.post('/api/shared', data);
export const getSharedTasks = (email) => API.get(`/api/shared/${email}`);
