import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Sparkles, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setLoading(true);
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-darker flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Mesh layout */}
      <div className="bg-mesh" />

      {/* Decorative neon blobs floating */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-neon-purple/5 blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-neon-cyan/5 blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel border border-white/10 rounded-3xl p-8 shadow-2xl relative bg-gray-900/50 backdrop-blur-2xl">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-neon-cyan to-neon-purple shadow-[0_0_20px_rgba(6,182,212,0.25)] mb-4 border border-white/10">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight uppercase font-display">
              Ethara Task Manager
            </h2>
            <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
              Login with organizational credentials to access dashboard workspaces.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Secret password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Quick Seed login aids */}
            <div className="p-3.5 rounded-2xl border border-white/5 bg-white/5 space-y-1.5 text-xs text-gray-400 leading-relaxed shadow-inner">
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-neon-cyan flex items-center gap-1">
                <Shield className="w-3 h-3 text-neon-cyan animate-pulse" />
                <span>Seed Access Credentials</span>
              </span>
              <p>Admin privilege: <strong className="text-white hover:underline cursor-pointer" onClick={() => { setEmail('admin@team.com'); setPassword('password123'); }}>admin@team.com</strong> (PW: password123)</p>
              <p>Member privilege: <strong className="text-white hover:underline cursor-pointer" onClick={() => { setEmail('sarah@team.com'); setPassword('password123'); }}>sarah@team.com</strong> (PW: password123)</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 shadow-lg shadow-cyan-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span>Verifying Nodes...</span>
              ) : (
                <>
                  <span>Unlock Workspace</span>
                  <Sparkles className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="text-center mt-6 pt-6 border-t border-white/5 text-xs text-gray-500">
            <span>First time using the platform? </span>
            <Link to="/register" className="text-neon-cyan hover:underline font-bold transition-all">
              Initialize Org Node
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
