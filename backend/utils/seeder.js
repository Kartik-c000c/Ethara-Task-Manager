require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager');
    console.log('MongoDB Connected for seeding...');
  } catch (err) {
    console.error(`Database connection failed: ${err.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // 1. Clear database
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Comment.deleteMany({});
    await Activity.deleteMany({});

    console.log('DB wiped successfully.');

    // 2. Create Users
    const users = await User.create([
      {
        name: 'Neo Thorne',
        email: 'admin@team.com',
        password: 'password123',
        role: 'Admin',
        avatarColor: '#f43f5e', // Neon Rose
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@team.com',
        password: 'password123',
        role: 'Member',
        avatarColor: '#8b5cf6', // Indigo
      },
      {
        name: 'John Miller',
        email: 'john@team.com',
        password: 'password123',
        role: 'Member',
        avatarColor: '#06b6d4', // Cyan
      },
      {
        name: 'Alex Mercer',
        email: 'alex@team.com',
        password: 'password123',
        role: 'Member',
        avatarColor: '#10b981', // Emerald
      },
    ]);

    const admin = users[0];
    const sarah = users[1];
    const john = users[2];
    const alex = users[3];

    console.log(`${users.length} Users seeded.`);

    // 3. Create Projects
    const deadLine14Days = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const deadLine5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const deadLine30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const projects = await Project.create([
      {
        title: 'Project Quantum API',
        description: 'Building a high-throughput GraphQL Gateway and hyper-fast microservices backend on WebAssembly environments.',
        deadline: deadLine14Days,
        status: 'Active',
        createdBy: admin._id,
        members: [admin._id, sarah._id, john._id],
      },
      {
        title: 'Nova SaaS Glassmorphic UI',
        description: 'Redesigning the primary core client layout with reactive neon shaders, dynamic layouts, and Glassmorphic cards.',
        deadline: deadLine5Days,
        status: 'Active',
        createdBy: admin._id,
        members: [admin._id, sarah._id, alex._id],
      },
      {
        title: 'Titan database architecture',
        description: 'Migrating primary production nodes to distributed multi-model clustered clusters for instant globally distributed caching.',
        deadline: deadLine30Days,
        status: 'On Hold',
        createdBy: admin._id,
        members: [admin._id, john._id, alex._id],
      },
    ]);

    const quantumProj = projects[0];
    const novaProj = projects[1];
    const titanProj = projects[2];

    console.log(`${projects.length} Projects seeded.`);

    // 4. Create Tasks (including completed, in-progress, and OVERDUE tasks)
    const datePast3Days = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    const datePast1Day = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);  // 1 day ago
    const dateFuture4Days = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // 4 days later
    const dateFuture7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days later

    const tasks = await Task.create([
      // Quantum API Tasks
      {
        title: 'Configure GraphQL Apollo gateway structures',
        description: 'Set up microservices mappings, schemas compilation pipeline, and custom dynamic routing triggers.',
        status: 'Completed',
        priority: 'High',
        dueDate: datePast1Day, // Ended yesterday, but successfully completed!
        assignedTo: sarah._id,
        project: quantumProj._id,
        createdBy: admin._id,
      },
      {
        title: 'Optimize Redis distributed nodes memory cache',
        description: 'Fine-tune cache TTL properties, define keys hashes policies, and set up fallback indices mapping algorithms.',
        status: 'In Progress',
        priority: 'Medium',
        dueDate: dateFuture4Days,
        assignedTo: john._id,
        project: quantumProj._id,
        createdBy: admin._id,
      },
      {
        title: 'Draft gRPC backend communication layers protocols',
        description: 'Complete protobuf models compilation scripts and design payload buffers structures validations.',
        status: 'Todo',
        priority: 'Low',
        dueDate: dateFuture7Days,
        assignedTo: sarah._id,
        project: quantumProj._id,
        createdBy: admin._id,
      },
      // Nova SaaS UI Tasks
      {
        title: 'Implement Tailwind glassmorphism global design tokens',
        description: 'Configure standard index.css variables mapping neon glass gradients and pulsing glows states animations.',
        status: 'Completed',
        priority: 'High',
        dueDate: datePast3Days,
        assignedTo: sarah._id,
        project: novaProj._id,
        createdBy: admin._id,
      },
      {
        title: 'Refactor Kanban drag-and-drop dashboard views',
        description: 'Integrate lucide icons packs, write custom pointer collision algorithms for dnd-kit columns, and handle APIs triggers.',
        status: 'In Progress',
        priority: 'High',
        dueDate: dateFuture4Days,
        assignedTo: alex._id,
        project: novaProj._id,
        createdBy: admin._id,
      },
      {
        title: 'Integrate charts widgets panel dashboard grids',
        description: 'Set up Recharts Area and Radar charts representing weekly workflows status metrics with smooth framer animations.',
        status: 'Todo',
        priority: 'Medium',
        dueDate: datePast3Days, // OVERDUE TASK 1! (Todo & dueDate is in the past)
        assignedTo: alex._id,
        project: novaProj._id,
        createdBy: admin._id,
      },
      // Overdue Task 2 (Assigned to John)
      {
        title: 'Audit legacy API headers and payload injections security',
        description: 'Scan endpoints parameters configurations, test rate-limiting thresholds triggers, and replace vulnerable libraries.',
        status: 'In Progress',
        priority: 'High',
        dueDate: datePast1Day, // OVERDUE TASK 2! (In Progress & dueDate in the past)
        assignedTo: john._id,
        project: quantumProj._id,
        createdBy: admin._id,
      },
      // Titan database Tasks
      {
        title: 'Write automated database sharding scripts',
        description: 'Create multi-nodes replica sets definitions and draft failovers automated switching mechanisms structures.',
        status: 'Todo',
        priority: 'Medium',
        dueDate: dateFuture7Days,
        assignedTo: alex._id,
        project: titanProj._id,
        createdBy: admin._id,
      },
    ]);

    console.log(`${tasks.length} Tasks seeded.`);

    // 5. Seed comments for overdue task 1
    const overdueTaskIndex = tasks.findIndex((t) => t.title.startsWith('Integrate charts widgets'));
    const overdueTaskObj = tasks[overdueTaskIndex];

    const comments = await Comment.create([
      {
        task: overdueTaskObj._id,
        user: sarah._id,
        text: 'The Recharts gradient colors are breaking when wrapped inside standard absolute absolute cards. Need support.',
      },
      {
        task: overdueTaskObj._id,
        user: admin._id,
        text: 'I will look into this. Ensure you declared the linearGradient definitions inside `<defs>` components correctly.',
      },
      {
        task: overdueTaskObj._id,
        user: alex._id,
        text: 'Perfect! I am updating the index.css variables now, should resolve the SVG styles rendering issues.',
      },
    ]);
    console.log(`${comments.length} Comments seeded.`);

    // 6. Seed activity events logs
    await Activity.create([
      {
        type: 'PROJECT_CREATE',
        project: quantumProj._id,
        user: admin._id,
        details: 'created project "Project Quantum API"',
      },
      {
        type: 'PROJECT_CREATE',
        project: novaProj._id,
        user: admin._id,
        details: 'created project "Nova SaaS Glassmorphic UI"',
      },
      {
        type: 'TASK_CREATE',
        project: quantumProj._id,
        task: tasks[0]._id,
        user: admin._id,
        details: 'created task "Configure GraphQL Apollo gateway structures"',
      },
      {
        type: 'MEMBER_ADD',
        project: quantumProj._id,
        user: admin._id,
        details: 'added Sarah Connor to "Project Quantum API"',
      },
      {
        type: 'TASK_STATUS',
        project: quantumProj._id,
        task: tasks[0]._id,
        user: sarah._id,
        details: 'updated status of "Configure GraphQL Apollo gateway structures" from "Todo" to "Completed"',
      },
      {
        type: 'MEMBER_ADD',
        project: novaProj._id,
        user: admin._id,
        details: 'added Alex Mercer to "Nova SaaS Glassmorphic UI"',
      },
      {
        type: 'TASK_STATUS',
        project: novaProj._id,
        task: tasks[3]._id,
        user: sarah._id,
        details: 'updated status of "Implement Tailwind glassmorphism global design tokens" from "Todo" to "Completed"',
      },
      {
        type: 'TASK_STATUS',
        project: quantumProj._id,
        task: tasks[6]._id,
        user: john._id,
        details: 'updated status of "Audit legacy API headers and payload injections security" from "Todo" to "In Progress"',
      },
    ]);

    console.log('Activity history logs seeded.');
    console.log('All mock seed dataset successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding operations: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(seedData);
