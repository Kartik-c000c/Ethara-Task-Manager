# Ethara Team Task Manager 🚀

A production-ready, full-stack collaborative application featuring a modern futuristic SaaS-style UI using deep dark themes, glowing borders, glassmorphism, responsive dashboard grids, and interactive Kanban boards.

---

## 🛠️ Architecture & Tech Stack

### Tech Stack Summary
- **Frontend Client**: React.js, Vite, Tailwind CSS v4, React Router DOM v6, Axios, Framer Motion, Recharts, `react-hot-toast`, `@dnd-kit/core` (Drag and Drop sensors), `lucide-react`.
- **Backend API Server**: Node.js, Express.js, JWT, `bcryptjs`.
- **Database Layer**: MongoDB (Mongoose Schema relationships).
- **Security Suite**: Helmet headers, express-rate-limit, express-mongo-sanitize, input validation schemas (`express-validator`), and custom payload sanitizers.

### Directory Mapping
```text
Ethara AI project/
├── backend/                  # Node.js + Express API Server
│   ├── config/               # Database connection wrappers
│   ├── controllers/          # Business logic controllers
│   ├── middleware/           # Security, Auth Guards, Error handlers
│   ├── models/               # Mongoose Schema Definitions
│   ├── routes/               # Express Routes binding
│   └── utils/                # DB Seeder utilities
├── frontend/                 # React.js + Vite Client
│   ├── src/
│   │   ├── components/       # Sidebars, Navbars, protected shells
│   │   ├── context/          # React Auth Context session persistence
│   │   ├── pages/            # Dashboards, boards, rosters, activity stream
│   │   └── utils/            # Axios API wrappers
│   └── index.html            # Primary HTML + Google Fonts bindings
└── README.md                 # Primary documentation
```

---

## ⚡ Setup & Launch Instructions

### Prerequisites
- Node.js installed (v18.0.0 or later recommended).
- MongoDB installed locally and active, or a MongoDB Atlas URI string.

---

### Step 1: Backend Setup
1. Open a terminal panel inside the `/backend` directory.
2. Initialize environment configs (default is set to local `mongodb://127.0.0.1:27017/taskmanager`):
   ```bash
   cp .env.example .env
   ```
3. Load dependencies:
   ```bash
   npm install
   ```
4. **Seed the database** to load dummy users, active projects, and boards (highly recommended to see complete charts instantly):
   ```bash
   npm run seed
   ```
5. Spin up the API server node:
   ```bash
   npm run dev
   ```
   *The server will boot successfully at `http://localhost:5000`.*

---

### Step 2: Frontend Setup
1. Open a terminal panel inside the `/frontend` directory.
2. Initialize environment configs:
   ```bash
   cp .env.example .env
   ```
3. Load dependencies:
   ```bash
   npm install
   ```
4. Spin up the client development server:
   ```bash
   npm run dev
   ```
   *The Vite compiler will boot the dashboard successfully at `http://localhost:5173`.*

---

## 🔑 Pre-Seeded Authentication Logins

The `npm run seed` command automatically loads the database with realistic SaaS collaborators so you don't have to register from scratch:

| Username / Name | Email | Password | Role Privileges | Primary Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Neo Thorne** | `admin@team.com` | `password123` | **Admin** | Full system controls & creation |
| **Sarah Connor** | `sarah@team.com` | `password123` | **Member** | Assigned tasks management |
| **John Miller** | `john@team.com` | `password123` | **Member** | Assigned tasks management |
| **Alex Mercer** | `alex@team.com` | `password123` | **Member** | Assigned tasks management |

---

## 🚀 Key Feature Spotlights

### 1. Advanced Role-Based Access Control (RBAC)
- **Admin Privilege**: Full CRUD capabilities. Only Admins can initialize/edit/delete projects, link collaborators, publish tasks, and swap user access roles.
- **Member Restrictions**: Members can view project metrics and board columns but are restricted from modifications. On the Kanban board, members can **only** drag-and-drop or status-update tasks that are explicitly assigned to their user ID. Unassigned tasks or tasks assigned to other members will trigger access warnings.

### 2. Automated Overdue Detection & Dashboards
- Any task that has a `dueDate` in the past and is not marked as `Completed` is dynamically identified by the backend query engines as **Overdue**.
- Overdue tasks render in active column lists with a pulsing neon red border and warning indicator.
- The Dashboard Hub has an explicit "Overdue Limits" counter, and the Kanban filter has an "Overdue Only" fast filter.

### 3. Chronological Organizational Activity Logs
- Creating, editing, or deleting projects and tasks, shifting columns, and altering member configurations log an automated activity block.
- The chronological activity stream `/activity` dynamically lists these operations with customized event icons and time markers.

### 4. Interactive Task Discussion comments
- Clicking on a Kanban task card slides open a glassmorphism context drawer.
- The right panel contains a real-time discussion feed mapping user avatars and text bubbles.
- Any collaborator assigned to the task's project space can instantly contribute comments using the bottom discussion text deck.
