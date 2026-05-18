# Task-Flow

A full-stack personal task management application built with the MERN stack.

**Live Demo**: https://task-flow-gray-zeta.vercel.app  
**API**: https://task-flow-s4uk.onrender.com/api/health

---

## Tech Stack

| Layer | Technology |
|---|---|
| Database | MongoDB Atlas (Mongoose ODM) |
| Backend | Node.js 20, Express 4 |
| Frontend | React 18, custom CSS |
| Testing | Jest, Supertest |

---

## Features

**Required**
- View all tasks with title, description, status, and creation date
- Create a task with a required title and an optional description
- Toggle task status between Pending and Completed
- Delete a task with an inline confirmation step
- Edit a task inline — title, description, priority, and due date
- Input validation on both frontend and backend (returns 400 on empty title)
- All data persisted in MongoDB Atlas

**Bonus**
- Filter tasks by All / Pending / Completed
- Due date field with overdue highlighting
- Priority field (Low / Medium / High) with colour indicators
- Backend unit tests — Jest and Supertest, 8 tests passing
- Mobile-responsive UI

---

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | >= 18.x | `node -v` |
| npm | >= 9.x | `npm -v` |
| MongoDB | Atlas cluster or local >= 6.x | `mongod --version` |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/mhstyles7/task-flow.git
cd task-flow
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
NODE_ENV=development
```

Start the backend:

```bash
npm run dev    # development mode with nodemon
npm start      # production
```

Expected output:
```
Connected to MongoDB
Server running on http://localhost:5000
```

### 3. Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`. API calls are proxied to port 5000 via the `proxy` field in `frontend/package.json` — no extra CORS setup needed locally.

### 4. Database

MongoDB creates the `taskflow` database and `tasks` collection automatically on first use. No seeding or migrations are required.

To verify the connection manually:

```bash
mongosh
use taskflow
db.tasks.find()
```

---

## Running Tests

```bash
cd backend
npm test
```

Tests run against a separate `taskflow_test` database and clean up after each run.

Coverage:
- `POST /api/tasks` — valid creation, reject empty title, reject whitespace title
- `GET /api/tasks` — fetch all, filter by status
- `PATCH /api/tasks/:id/toggle` — toggle status
- `DELETE /api/tasks/:id` — delete existing, 404 for non-existent

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| GET | `/tasks` | Get all tasks. Filter with `?status=pending` or `?status=completed` | 200, 500 |
| POST | `/tasks` | Create a new task | 201, 400, 500 |
| PUT | `/tasks/:id` | Update task fields | 200, 400, 404 |
| PATCH | `/tasks/:id/toggle` | Toggle status between pending and completed | 200, 404 |
| DELETE | `/tasks/:id` | Delete a task | 200, 404 |
| GET | `/health` | Health check | 200 |

### Create a task

Request:
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

Response:
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

### Validation error

```json
{
  "success": false,
  "error": "Title is required"
}
```

---

## Database Schema

Collection: `tasks`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated primary key |
| `title` | String | Required, max 255 characters |
| `description` | String | Optional |
| `status` | String | `pending` or `completed` |
| `priority` | String | `low`, `medium`, or `high` |
| `due_date` | Date | Optional |
| `created_at` | Date | Auto-set on insert |
| `updated_at` | Date | Auto-updated on every change |

---

## Project Structure

```
task-flow/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── tasks.js
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   ├── models/
│   │   │   └── Task.js
│   │   └── app.js
│   ├── tests/
│   │   └── tasks.test.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.js
│   │   │   ├── TaskForm.js
│   │   │   ├── TaskItem.js
│   │   │   └── TaskList.js
│   │   ├── services/
│   │   │   └── taskService.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── .gitignore
└── README.md
```

## Development Note (AI Assistance)

In accordance with the assignment guidelines, I would like to transparently disclose that AI coding assistants (such as GitHub Copilot) were used during the development of this project. 

The AI was utilized primarily for:
- Scaffolding boilerplate code (e.g., standard Mongoose schemas, basic Express server setup)
- Auto-completing repetitive CSS blocks and prop-types
- Generating the initial structure for unit tests

However, all architectural decisions, database schema designs, state management logic, RESTful API structures, and final debugging were actively directed, reviewed, and fully understood by me. I am fully prepared to explain and discuss every line of code in this repository during a technical interview.

---

## Submission

- **GitHub**: https://github.com/mhstyles7/task-flow
- **Live Demo**: https://task-flow-gray-zeta.vercel.app
- **API**: https://task-flow-s4uk.onrender.com
- **Loom Walkthrough**: https://drive.google.com/file/d/1rnVgiTOozrrEOFitDkDiFdypGMkRz08m/view?usp=drive_link
