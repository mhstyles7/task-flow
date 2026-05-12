const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && ['pending', 'completed'].includes(status)) {
      filter.status = status;
    }

    const tasks = await Task.find(filter).sort({ created_at: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      due_date: due_date || null,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ success: false, error: 'Title cannot be empty' });
    }

    if (status && !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (due_date !== undefined) updates.due_date = due_date;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to update task' });
  }
};

const toggleTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    res.status(200).json({ success: true, data: task });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to toggle task' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(500).json({ success: false, error: 'Failed to delete task' });
  }
};

module.exports = { getAllTasks, createTask, updateTask, toggleTask, deleteTask };
