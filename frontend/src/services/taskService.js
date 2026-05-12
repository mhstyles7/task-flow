import axios from 'axios';

const API_BASE = '/api/tasks';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const fetchTasks = (status = '') => {
  const params = status ? { status } : {};
  return api.get('/', { params });
};

export const createTask = (data) => api.post('/', data);

export const updateTask = (id, data) => api.put(`/${id}`, data);

export const toggleTask = (id) => api.patch(`/${id}/toggle`);

export const deleteTask = (id) => api.delete(`/${id}`);
