import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Zap, Code, FileText, MessageSquare, Trash2, Edit2, Check, X, User, LogOut, BarChart2 } from 'lucide-react';
import { getSessions, renameSession, deleteSession } from '../../services/api';

// Helper: map session types to icon
const getAgentIcon = (agentType) => {
  switch (agentType) {
    case 'coding': return Code;
    case 'resume': return FileText;
    default: return MessageSquare;
  }
};

/**
 * Sidebar Component
 * Agent selection and session history management
 */
const Sidebar = ({
  selectedAgent = 'general',
  onAgentChange,
  currentSessionId = null,
  onSessionSelect = null,
  isOpen = true,
  refreshTrigger = 0,
  showAnalytics = false,
  setShowAnalytics = null
}) => {
  const [sessions, setSessions] = useState([]);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const agents = [
    {
      id: 'general',
      name: 'General',
      description: 'General purpose AI assistant',
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'coding',
      name: 'Coding',
      description: 'Expert programming assistant',
      icon: Code,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'resume',
      name: 'Resume',
      description: 'Resume and career advisor',
      icon: FileText,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  // Load sessions on mount and when refreshTrigger changes
  useEffect(() => {
    loadSessions();
  }, [refreshTrigger]);

  const loadSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await getSessions();
      if (response.success && response.sessions) {
        setSessions(response.sessions);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleAgentClick = (agentId) => {
    onAgentChange(agentId);
    if (setShowAnalytics) {
      setShowAnalytics(false);
    }
  };

  const handleSessionClick = (sessionId) => {
    if (onSessionSelect) {
      onSessionSelect(sessionId);
    }
    if (setShowAnalytics) {
      setShowAnalytics(false);
    }
  };

  const handleRenameStart = (session) => {
    setEditingSessionId(session._id);
    setEditTitle(session.title);
  };

  const handleRenameSave = async (sessionId) => {
    if (!editTitle.trim()) return;

    try {
      const response = await renameSession(sessionId, editTitle);
      if (response.success) {
        setSessions(sessions.map(s =>
          s._id === sessionId ? { ...s, title: editTitle } : s
        ));
        setEditingSessionId(null);
      }
    } catch (error) {
      console.error('Failed to rename session:', error);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Delete this session? This action cannot be undone.')) return;

    try {
      const response = await deleteSession(sessionId);
      if (response.success) {
        setSessions(sessions.filter(s => s._id !== sessionId));
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{
        x: isOpen ? 0 : -300,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        'fixed left-0 top-0 h-screen w-72 z-20',
        'bg-gradient-to-b from-slate-900 to-slate-950',
        'border-r border-slate-800/50',
        'backdrop-blur-xl shadow-2xl',
        'flex flex-col',
        'p-6',
        !isOpen && 'hidden sm:flex'
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">DevSphere AI</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Production Ready</p>
          </div>
        </motion.div>
      </div>

      {/* Agents List */}
      <div className="space-y-2 mb-6">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Select Agent
        </p>
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id && !showAnalytics;

          return (
            <motion.button
              key={agent.id}
              onClick={() => handleAgentClick(agent.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isSelected}
              className={clsx(
                'w-full text-left p-3 rounded-xl transition-all duration-200',
                'flex items-center gap-3',
                isSelected
                  ? `bg-gradient-to-r ${agent.color} text-white shadow-lg shadow-blue-500/20`
                  : 'bg-slate-800/40 text-slate-300 hover:bg-slate-800 border border-slate-700/30'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs">{agent.name}</p>
                <p className="text-[10px] opacity-75 truncate">
                  {agent.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Session History */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-slate-800/50 pt-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
          Chat History
        </p>

        {isLoadingSessions ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-xs text-slate-500">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex items-center justify-center flex-1 px-4 text-center">
            <p className="text-xs text-slate-500">
              No conversations yet. Start chatting to create one!
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            <AnimatePresence mode="popLayout">
              {sessions.map((session) => {
                const isSelected = currentSessionId === session._id && !showAnalytics;
                const Icon = getAgentIcon(session.agentType);

                return (
                  <motion.div
                    key={session._id}
                    layoutId={session._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={clsx(
                      'group rounded-xl p-2 transition-all duration-200 border text-left flex items-center justify-between',
                      isSelected
                        ? 'bg-slate-800 border-slate-700 text-white shadow-lg'
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                    )}
                  >
                    {editingSessionId === session._id ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white flex-1 focus:outline-none focus:border-blue-500"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleRenameSave(session._id)}
                        />
                        <button
                          onClick={() => handleRenameSave(session._id)}
                          className="p-1 text-green-400 hover:bg-slate-700 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingSessionId(null)}
                          className="p-1 text-red-400 hover:bg-slate-700 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full min-w-0">
                        <button
                          onClick={() => handleSessionClick(session._id)}
                          className="flex items-center gap-2 flex-1 min-w-0 text-left"
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                          <span className="text-xs truncate font-medium">
                            {session.title || 'Untitled Chat'}
                          </span>
                        </button>

                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleRenameStart(session)}
                            className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(session._id)}
                            className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-800/60 pt-3 mt-3 space-y-2.5">
        {/* Analytics Toggle Button */}
        {setShowAnalytics && (
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border shadow-sm",
              showAnalytics
                ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/40 hover:bg-indigo-600/30"
                : "bg-slate-800/40 text-slate-300 border-slate-700/30 hover:bg-slate-800 hover:text-white"
            )}
          >
            <BarChart2 className="w-4 h-4" />
            {showAnalytics ? "Return to Chat" : "Usage Analytics"}
          </button>
        )}

        {/* User Menu */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-850/50">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-200 truncate leading-none mb-0.5">My Profile</p>
            <p className="text-[9px] text-slate-500 truncate leading-none">Manage details</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to="/profile"
            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors border border-blue-500/20"
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/auth';
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 text-xs font-semibold transition-colors border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};


export default Sidebar;
