import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onDelete, onUpdate, filter }) {
  if (tasks.length === 0) {
    const messages = {
      '': 'No tasks yet. Add your first task above!',
      pending: 'No pending tasks. Great job!',
      completed: 'No completed tasks yet. Keep going!',
    };
    return (
      <div className="empty-state">
        <p>{messages[filter] || 'No tasks found.'}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;
