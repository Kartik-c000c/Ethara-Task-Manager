import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { getActiveTheme, applyTheme } from './utils/theme';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import TasksBoard from './pages/TasksBoard';
import Team from './pages/Team';
import Activity from './pages/Activity';
import Profile from './pages/Profile';

// Shared Private Dashboard Shell Layout
const DashboardLayout = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-bg-darker text-gray-100 flex">
      {/* SaaS mesh glow */}
      <div className="bg-mesh" />

      {/* Sidebar Panel Left */}
      <Sidebar />

      {/* Primary Contents Pane Right */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Navbar Header top */}
        <Navbar />

        {/* Dynamic page container (offsets navbar height) */}
        <main className="flex-1 pt-20 px-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    // Apply user's selected neon theme on startup
    applyTheme(getActiveTheme().id);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          {/* Custom Toast alerts with SaaS dark design */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: 'rgba(13, 20, 35, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f3f4f6',
                fontSize: '13px',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#05070c',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#05070c',
                },
              },
            }}
          />

          <Routes>
            {/* Public Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected SaaS Layout routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Projects />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <TasksBoard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Team />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/activity"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Activity />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
