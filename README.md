# Ethara Team Task Manager 🚀

A production-ready, full-stack collaborative application featuring a modern futuristic SaaS-style UI using deep dark themes, glowing borders, glassmorphism, responsive dashboard grids, and interactive Kanban boards.

🌐 **Live API Backend**: `https://ethara-task-manager-production-298a.up.railway.app/api`


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

### 1. Advanced Role-Based Access Control (RBAC) & Smart Sign-up
- **Dynamic First-User Admin**: The very first user registering on the platform automatically gets the **Admin** role, securing the initial deployment boot phase.
- **Default Member Registration**: All subsequent user signups default to **Member** privileges. Members cannot self-promote; only an active **Admin** can toggle roles to promote a Member.
- **Admin Privileges**: Full CRUD capabilities (create/edit projects, assign team members, delete tasks, change user roles, and clear audit history logs).
- **Member Space**: Focused read-only view of projects. Members can track progress, update task statuses using drag-and-drop, and post comments on their cards, keeping execution clean and simplified.

### 2. Futuristic Landing Screen & Neon Theme Customizer
- **Translucent Welcome Hub**: Guests hit a stunning glassmorphic welcome splash page at the `/` route with glowing neon product features showcase cards, routing authenticated sessions automatically to the main dashboard.
- **Accent Glow Theme Customizer**: Users can toggle the entire application's branding accent color dynamically between 4 cyberpunk-themed variants: *Cyber Cyan*, *Hot Rose-Violet*, *Emerald-Teal*, and *Cyberpunk Gold*. Settings coordinate CSS and JavaScript variables and are persistently cached inside `localStorage`.

### 3. Automated Overdue Detection & Alerts
- Any task that is past its due date and remains uncompleted is dynamically flagged by the database query pipeline as **Overdue**.
- These cards are rendered on the Kanban board with a custom **pulsing neon-red border and warning icon** to immediately capture team attention.
- The interactive dashboard features live overdue meters linked to explicit filter shortcuts.

### 4. Chronological Audit Activity Trails
- Complete transparency: every major organizational change—such as creating projects, updating tasks, shifting board columns, or changing team configurations—logs a secure, chronological history entry.
- The `/activity` route showcases a beautiful scroll feed of logs with customized icons and dynamic timestamps.

### 5. Collaborative Discussion Comments & Progress Sliders
- Clicking on a Kanban task slides open a glassmorphic details pane.
- **Interactive Progress Slider**: Users or Admins can log completion rates dynamically from 0% to 100% (dragging it to 100% automatically updates the task status to Completed).
- **Real-Time Task Chat**: Collaborative comment feed with profile bubbles allows assigned team members to share instant feedback.

