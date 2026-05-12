import React, { useState } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required. Please enter a task title.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onTaskCreated({
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate || null,
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setExpanded(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-card">
      <h2 className="form-heading">Add New Task</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="input-row">
          <input
            type="text"
            className={`input-title ${error ? 'input-error' : ''}`}
            placeholder="Task title (required)"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
            aria-label="Task title"
          />
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setExpanded((p) => !p)}
            aria-expanded={expanded}
          >
            {expanded ? '▲ Less' : '▼ More'}
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        {expanded && (
          <div className="expanded-fields">
            <textarea
              className="input-description"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              aria-label="Task description"
            />
            <div className="row-fields">
              <div className="field-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="select-input"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  className="select-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default TaskForm;
