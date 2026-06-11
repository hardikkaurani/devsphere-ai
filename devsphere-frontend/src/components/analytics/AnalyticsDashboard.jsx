import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, MessageSquare, Code, FileText, Calendar, Activity, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { getChatStats } from '../../services/api';
import toast from 'react-hot-toast';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getChatStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      } else {
        toast.error("Failed to load statistics: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching stats.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="relative w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px] text-slate-400">
        No stats data available.
      </div>
    );
  }

  // Curated color palette
  const COLORS = ['#3b82f6', '#10b981', '#a855f7']; // General, Coding, Resume
  const pieData = [
    { name: 'General', value: stats.agentUsage.general },
    { name: 'Coding', value: stats.agentUsage.coding },
    { name: 'Resume Review', value: stats.agentUsage.resume }
  ].filter(item => item.value > 0);

  const totalAgentSessions = stats.agentUsage.general + stats.agentUsage.coding + stats.agentUsage.resume;

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-indigo-500" />
          Usage Analytics
        </h2>
        <p className="text-sm text-slate-400">Monitor your AI assistant activity and agent statistics</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sessions Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Conversations</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.totalSessions}</h3>
          </div>
        </motion.div>

        {/* Total Messages Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Messages Exchanged</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stats.totalMessages}</h3>
          </div>
        </motion.div>

        {/* Active Agent Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Favorite Agent</p>
            <h3 className="text-lg font-bold text-white mt-1">
              {stats.agentUsage.coding >= stats.agentUsage.resume && stats.agentUsage.coding >= stats.agentUsage.general
                ? 'Coding Specialist'
                : stats.agentUsage.resume >= stats.agentUsage.general
                ? 'Resume Reviewer'
                : 'General Assistant'}
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex flex-col h-[320px]">
          <h4 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Activity History (Last 7 Days)
          </h4>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }}
                />
                <Area type="monotone" dataKey="messages" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorMessages)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Share Pie */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 rounded-2xl flex flex-col h-[320px]">
          <h4 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-1.5">
            <Code className="w-4 h-4 text-indigo-400" />
            Agent Distribution
          </h4>
          {pieData.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              No conversational data recorded yet.
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#f8fafc'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Custom Legend */}
              <div className="flex gap-4 mt-2 justify-center text-[10px]">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-slate-300 font-medium">
                      {entry.name}: {Math.round((entry.value / totalAgentSessions) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
