import React, { useState } from 'react';

const PRIORITIES = ['low', 'medium', 'high'];

const priorityColors = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

function isOverdue(due_date, status) {
  if (!due_date || status === 'completed') return false;
  return new Date(due_date) < new Date(new Date().toDateString());
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(
    task.due_date ? task.due_date.split('T')[0] : ''
  );
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const overdue = isOverdue(task.due_date, task.status);
  const completed = task.status === 'completed';

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setEditError('Title cannot be empty.');
      return;
    }
    setSaving(true);
    setEditError('');
    try {
      await onUpdate(task._id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        priority: editPriority,
        due_date: editDueDate || null,
      });
      setEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditPriority(task.priority || 'medium');
    setEditDueDate(task.due_date ? task.due_date.split('T')[0] : '');
    setEditError('');
    setEditing(false);
  };

  return (
    <div className={`task-card ${completed ? 'task-card--completed' : ''} ${overdue ? 'task-card--overdue' : ''}`}>
      {/* Left: checkbox */}
      <div className="task-check">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(task._id)}
          aria-label={`Mark "${task.title}" as ${completed ? 'pending' : 'completed'}`}
          className="checkbox"
        />
      </div>

      {/* Middle: content */}
      <div className="task-body">
        {editing ? (
          <div className="edit-form">
            <input
              className={`input-title ${editError ? 'input-error' : ''}`}
              value={editTitle}
              onChange={(e) => { setEditTitle(e.target.value); setEditError(''); }}
              placeholder="Task title"
              autoFocus
            />
            {editError && <p className="error-message">{editError}</p>}
            <textarea
              className="input-description"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
            />
            <div className="row-fields">
              <div className="field-group">
                <label>Priority</label>
                <select
                  className="select-input"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="field-group">
                <label>Due Date</label>
                <input
                  type="date"
                  className="select-input"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="edit-actions">
              <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className={`task-title ${completed ? 'task-title--done' : ''}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              <span className="priority-badge" style={{ color: priorityColors[task.priority] }}>
                {task.priority}
              </span>
              <span className="meta-date">
                Created: {formatDate(task.created_at)}
              </span>
              {task.due_date && (
                <span className={`meta-date ${overdue ? 'meta-date--overdue' : ''}`}>
                  {overdue ? 'Overdue: ' : 'Due: '}
                  {formatDate(task.due_date)}
                </span>
              )}
              <span className={`status-badge status-badge--${task.status}`}>
                {completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Right: action buttons */}
      {!editing && (
        <div className="task-actions">
          <button
            className="btn btn-icon"
            onClick={() => setEditing(true)}
            aria-label="Edit task"
            title="Edit"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          {showConfirm ? (
            <div className="confirm-delete">
              <span>Delete?</span>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>Yes</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowConfirm(false)}>No</button>
            </div>
          ) : (
            <button
              className="btn btn-icon btn-icon--danger"
              onClick={() => setShowConfirm(true)}
              aria-label="Delete task"
              title="Delete"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskItem;
