import React, { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import { fetchTasks, createTask, toggleTask, deleteTask, updateTask } from './services/taskService';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setGlobalError('');
      const res = await fetchTasks(filter);
      setTasks(res.data.data);
    } catch {
      setGlobalError('Could not connect to the server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreate = async (data) => {
    const res = await createTask(data);
    setTasks((prev) => [res.data.data, ...prev]);
  };

  const handleToggle = async (id) => {
    const res = await toggleTask(id);
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? res.data.data : t))
        .filter((t) => !filter || t.status === filter)
    );
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleUpdate = async (id, data) => {
    const res = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
  };

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const displayCounts = filter
    ? { all: '-', pending: '-', completed: '-', [filter]: tasks.length }
    : counts;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <svg className="logo-icon" width="30" height="30" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="7" fill="#6366f1" />
              <polyline points="8,17 13,22 24,11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="logo-text">Task<span className="logo-accent">Flow</span></span>
          </div>
          <p className="header-sub">Stay organised, stay productive.</p>
        </div>
      </header>

      <main className="app-main">
        <TaskForm onTaskCreated={handleCreate} />

        <div className="list-section">
          <div className="list-header">
            <h2 className="list-title">Your Tasks</h2>
            <FilterBar active={filter} onChange={setFilter} counts={displayCounts} />
          </div>

          {globalError && (
            <div className="global-error" role="alert">
              {globalError}
            </div>
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Loading tasks...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              filter={filter}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Task-Flow — Built with React + Express + MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
