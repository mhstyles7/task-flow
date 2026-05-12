# ✅ Task-Flow — Personal Task Manager

A full-stack personal task management web application built with **React**, **Express**, and **MongoDB**.

> Built as part of the Acme AI Fellowship Programme C7 Technical Assessment.

---

## 🚀 Live Demo

> _Deploy to Render/Railway and paste URL here_
> Example: `https://task-flow-yourname.onrender.com`

---

## 🛠 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, custom CSS (no framework) |
| Backend  | Node.js, Express 4                |
| Database | MongoDB (Mongoose ODM)            |
| Testing  | Jest, Supertest                   |

---

## ✨ Features

### Required
- ✅ View all tasks (title, description, status, creation date)
- ✅ Add a task with title (required) and optional description
- ✅ Mark task complete / incomplete (toggle checkbox)
- ✅ Delete a task with confirmation prompt
- ✅ Edit a task inline (title, description, priority, due date)
- ✅ Input validation — frontend error message + backend 400 rejection
- ✅ Persistent storage via MongoDB

### Bonus
- ⭐ Filter tasks by status: All / Pending / Completed
- ⭐ Due date field with overdue highlighting
- ⭐ Priority field (Low / Medium / High) with colour indicators
- ⭐ Backend unit tests (Jest + Supertest)
- ⭐ Mobile-responsive UI

---

## 📋 Prerequisites

Make sure you have the following installed:

| Tool    | Version  | Check             |
|---------|----------|-------------------|
| Node.js | ≥ 18.x   | `node -v`         |
| npm     | ≥ 9.x    | `npm -v`          |
| MongoDB | ≥ 6.x    | `mongod --version`|

> **MongoDB** must be running locally, **OR** you can use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster.

---

## ⚙️ Local Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/task-flow.git
cd task-flow
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Open `.env` and set your values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
```

> If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskflow`

Start the backend server:

```bash
# Development (auto-restarts on file changes)
npm run dev

# OR Production
npm start
```

You should see:
```
Connected to MongoDB
Server running on http://localhost:5000
```

---

### 3. Set up the Frontend

Open a **new terminal tab/window**:

```bash
cd frontend
npm install
npm start
```

The React app will open automatically at **http://localhost:3000**

> The frontend proxies API calls to `http://localhost:5000` via the `"proxy"` field in `frontend/package.json` — no CORS configuration needed during development.

---

### 4. Database Initialisation

MongoDB creates the `taskflow` database and `tasks` collection **automatically** on first use — no manual seeding or migrations required.

If you want to verify your connection:

```bash
# In a terminal
mongosh
use taskflow
db.tasks.find()
```

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests use a **separate test database** (`taskflow_test`) and clean up after each run. Covers:
- `POST /api/tasks` — create with valid title, reject empty title
- `GET /api/tasks` — fetch all, filter by status
- `PATCH /api/tasks/:id/toggle` — toggle status
- `DELETE /api/tasks/:id` — delete existing, 404 for non-existent

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint              | Description                        | Status Codes     |
|--------|-----------------------|------------------------------------|------------------|
| GET    | `/tasks`              | Get all tasks (filter: `?status=`) | 200, 500         |
| POST   | `/tasks`              | Create a new task                  | 201, 400, 500    |
| PUT    | `/tasks/:id`          | Update task fields                 | 200, 400, 404    |
| PATCH  | `/tasks/:id/toggle`   | Toggle pending ↔ completed         | 200, 404         |
| DELETE | `/tasks/:id`          | Delete a task                      | 200, 404         |
| GET    | `/health`             | Health check                       | 200              |

### Request / Response Examples

**Create a task**
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Finish the assignment",
  "description": "Submit before deadline",
  "priority": "high",
  "due_date": "2026-05-14"
}
```
```json
{
  "success": true,
  "data": {
    "_id": "664f...",
    "title": "Finish the assignment",
    "description": "Submit before deadline",
    "status": "pending",
    "priority": "high",
    "due_date": "2026-05-14T00:00:00.000Z",
    "created_at": "2026-05-12T10:00:00.000Z",
    "updated_at": "2026-05-12T10:00:00.000Z"
  }
}
```

**Validation error**
```json
{
  "success": false,
  "error": "Title is required"
}
```

---

## 🗄️ Database Schema

Collection: `tasks`

| Field         | Type     | Notes                          |
|---------------|----------|--------------------------------|
| `_id`         | ObjectId | Auto-generated primary key     |
| `title`       | String   | Required, max 255 chars        |
| `description` | String   | Optional, default `""`         |
| `status`      | String   | `"pending"` \| `"completed"`   |
| `priority`    | String   | `"low"` \| `"medium"` \| `"high"` |
| `due_date`    | Date     | Optional, nullable             |
| `created_at`  | Date     | Auto-set on insert             |
| `updated_at`  | Date     | Auto-updated on every change   |

---

## 📁 Project Structure

```
task-flow/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── tasks.js          # Route definitions
│   │   ├── controllers/
│   │   │   └── taskController.js # Request handlers & business logic
│   │   ├── models/
│   │   │   └── Task.js           # Mongoose schema & model
│   │   └── app.js                # Express app & MongoDB connection
│   ├── tests/
│   │   └── tasks.test.js         # Jest + Supertest unit tests
│   ├── .env.example              # Environment variable template
│   ├── jest.config.json
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.js       # New task creation form
│   │   │   ├── TaskItem.js       # Individual task card (edit/delete/toggle)
│   │   │   ├── TaskList.js       # Task list renderer
│   │   │   └── FilterBar.js      # Status filter (All/Pending/Completed)
│   │   ├── services/
│   │   │   └── taskService.js    # Axios API call functions
│   │   ├── App.js                # Root component, state management
│   │   ├── App.css               # All custom styles (no CSS framework)
│   │   └── index.js              # React entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🤖 AI Assistance Disclosure

This project was built with the assistance of Claude (Anthropic) as a coding aid. All code has been reviewed, understood, and is fully explainable by the author. I am prepared to walk through any part of the implementation in a technical interview.

---

## 📬 Submission

- **GitHub Repository**: https://github.com/YOUR_USERNAME/task-flow
- **Live Demo**: _(URL if deployed)_
- **Loom Walkthrough**: _(URL if recorded)_
