const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Task = require('../src/models/Task');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow_test');
});

afterEach(async () => {
  await Task.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /api/tasks', () => {
  it('should create a task with a valid title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test task', description: 'A test' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test task');
    expect(res.body.data.status).toBe('pending');
  });

  it('should return 400 when title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 when title is empty string', async () => {
    const res = await request(app).post('/api/tasks').send({ title: '   ' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/tasks', () => {
  it('should return all tasks', async () => {
    await Task.create({ title: 'Task 1' });
    await Task.create({ title: 'Task 2' });
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('should filter tasks by status', async () => {
    await Task.create({ title: 'Pending task', status: 'pending' });
    await Task.create({ title: 'Completed task', status: 'completed' });
    const res = await request(app).get('/api/tasks?status=pending');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].status).toBe('pending');
  });
});

describe('PATCH /api/tasks/:id/toggle', () => {
  it('should toggle task status from pending to completed', async () => {
    const task = await Task.create({ title: 'Toggle me', status: 'pending' });
    const res = await request(app).patch(`/api/tasks/${task._id}/toggle`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('completed');
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('should delete an existing task', async () => {
    const task = await Task.create({ title: 'Delete me' });
    const res = await request(app).delete(`/api/tasks/${task._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 for non-existent task', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/tasks/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
