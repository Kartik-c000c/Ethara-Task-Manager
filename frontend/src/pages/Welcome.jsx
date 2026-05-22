import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight, Kanban, BarChart3, Palette, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-bg-darker flex flex-col items-center justify-between p-6 relative overflow-hidden text-gray-100">
      {/* Background Mesh layout */}
      <div className="bg-mesh" />

      {/* Decorative neon blobs floating */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-cyan/5 blur-[100px] animate-pulse" />

      {/* Top Header */}
      <header className="w-full max-w-6xl flex justify-between items-center z-10 py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-neon-cyan to-neon-purple shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-white/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold tracking-wider uppercase font-display bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Ethara AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-xs font-semibold text-gray-400 hover:text-white transition-all uppercase tracking-wider px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="text-xs font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-xl transition-all uppercase tracking-wider"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-4xl text-center z-10 my-auto flex flex-col items-center gap-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-[10px] font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Shield className="w-3 h-3 text-neon-cyan" />
            <span>Futuristic Sprint Operations</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight uppercase font-display leading-[1.1] max-w-3xl">
            Orchestrate Sprints with{' '}
            <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Neon Precision
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Collaborate instantly, manage tasks on translucent Kanban boards, track live Recharts analytics, and personalize your workspace glow.
          </p>
        </motion.div>

        {/* CTA Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md"
        >
          <Link
            to="/login"
            className="flex-1 py-4 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 shadow-lg shadow-cyan-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <span>Enter Workspace</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </motion.div>

        {/* Key Showcase Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12 text-left"
        >
          <div className="glass-panel border border-white/5 rounded-2xl p-6 bg-gray-900/20 backdrop-blur-xl hover:border-white/10 transition-all group">
            <div className="p-2.5 w-fit rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 mb-4 group-hover:scale-110 transition-all">
              <Kanban className="w-5 h-5 text-neon-cyan" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Kanban Boards
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Drag-and-drop sprints with dedicated columns, touch sensor inputs, and pulsing neon overdue alerts.
            </p>
          </div>

          <div className="glass-panel border border-white/5 rounded-2xl p-6 bg-gray-900/20 backdrop-blur-xl hover:border-white/10 transition-all group">
            <div className="p-2.5 w-fit rounded-xl bg-neon-purple/10 border border-neon-purple/20 mb-4 group-hover:scale-110 transition-all">
              <BarChart3 className="w-5 h-5 text-neon-purple" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Visual Analytics
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Monitor team focus with premium Area and Pie charts mapped dynamically from live MongoDB databases.
            </p>
          </div>

          <div className="glass-panel border border-white/5 rounded-2xl p-6 bg-gray-900/20 backdrop-blur-xl hover:border-white/10 transition-all group">
            <div className="p-2.5 w-fit rounded-xl bg-neon-rose/10 border border-neon-rose/20 mb-4 group-hover:scale-110 transition-all">
              <Palette className="w-5 h-5 text-neon-rose" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Workspace Glows
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Select between four premium neon accents. Re-color your entire UI environment with a single click.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full text-center z-10 text-[10px] text-gray-500 uppercase tracking-widest py-4 border-t border-white/5 mt-auto">
        <span>© {new Date().getFullYear()} Ethara AI Corporation. All Rights Reserved.</span>
      </footer>
    </div>
  );
};

export default Welcome;
