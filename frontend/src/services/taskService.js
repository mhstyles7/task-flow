import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api/tasks` : '/api/tasks';

const api = axios.create({
  baseURL: BASE,
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

