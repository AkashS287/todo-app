import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const getTasks = () => API.get('/tasks');
export const createTask = (data) => API.post('/tasks', data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const loginWithOAuth = (data) => API.post('/auth/oauth', data);
export const shareTask = (data) => API.post('/shared', data);
export const getSharedTasks = (email) => API.get(`/shared/${email}`);
