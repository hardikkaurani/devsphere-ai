import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Zap, Code, FileText, MessageSquare, Trash2, Edit2, Check, X, User, LogOut } from 'lucide-react';
import { getSessions, renameSession, deleteSession } from '../../services/api';

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
  refreshTrigger = 0
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

  const getAgentIcon = (agentType) => {
    const agent = agents.find(a => a.id === agentType);
    return agent ? agent.icon : MessageSquare;
  };

  const getAgentLabel = (agentType) => {
    const agent = agents.find(a => a.id === agentType);
    return agent ? agent.name : 'General';
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
        'hidden sm:flex flex-col',
        'p-6'
      )}
    >
      {/* Header */}
      <div className="mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">DevSphere</h1>
            <p className="text-xs text-slate-400">AI Platform</p>
          </div>
        </motion.div>
      </div>

      {/* Agents List */}
      <div className="space-y-3 mb-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Select Agent
        </p>
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isSelected = selectedAgent === agent.id;

          return (
            <motion.button
              key={agent.id}
              onClick={() => onAgentChange(agent.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={isSelected}
              aria-label={`${agent.name} agent - ${agent.description}`}
              className={clsx(
                'w-full text-left p-4 rounded-lg transition-all duration-200',
                'flex items-start gap-3',
                isSelected
                  ? `bg-gradient-to-r ${agent.color} text-white shadow-lg shadow-blue-500/20`
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/30'
              )}
            >
              <Icon className="w-5 h-5 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{agent.name}</p>
                <p className="text-xs opacity-75 truncate">
                  {agent.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Session History */}
      <div className="flex-1 flex flex-col min-h-0 border-t border-slate-700/30 pt-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Chat History
        </p>

        {isLoadingSessions ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-xs text-slate-500">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex items-center justify-center flex-1">
            <p className="text-xs text-slate-500 text-center">
              No conversations yet. Start chatting to create one!
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              className="space-y-2 overflow-y-auto flex-1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {sessions.map((session) => {
                const AgentIcon = getAgentIcon(session.agentType);
                const isCurrentSession = currentSessionId === session._id;
                const isEditing = editingSessionId === session._id;

                return (
                  <motion.div
                    key={session._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={clsx(
                      'group rounded-lg p-3 transition-all duration-200',
                      'border border-slate-700/30',
                      isCurrentSession
                        ? 'bg-slate-700/50 border-slate-600'
                        : 'bg-slate-800/30 hover:bg-slate-800/50'
                    )}
                  >
                    {isEditing ? (
                      // Edit Mode
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Session title..."
                          className={clsx(
                            'w-full px-2 py-1 rounded text-sm',
                            'bg-slate-700 text-white border border-slate-600',
                            'focus:outline-none focus:border-blue-500'
                          )}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameSave(session._id);
                            if (e.key === 'Escape') setEditingSessionId(null);
                          }}
                        />
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRenameSave(session._id)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs bg-green-600/80 hover:bg-green-600 text-white transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditingSessionId(null)}
                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs bg-slate-600/80 hover:bg-slate-600 text-white transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start gap-2">
                        <AgentIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => onSessionSelect && onSessionSelect(session._id)}
                        >
                          <p className="text-sm font-medium text-slate-200 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {getAgentLabel(session.agentType)} • {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRenameStart(session)}
                            className="p-1 rounded hover:bg-slate-600/50 text-slate-400 hover:text-blue-400 transition-colors"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(session._id)}
                            className="p-1 rounded hover:bg-slate-600/50 text-slate-400 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-700/30 pt-4 mt-4 space-y-3">
        {/* User Menu */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Profile</p>
            <p className="text-xs text-slate-500">Manage account</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to="/profile"
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors border border-blue-500/30"
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 text-xs font-medium transition-colors border border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tip */}
        <p className="text-xs text-slate-500 leading-relaxed">
          💡 Tip: Switch between agents to change the AI's behavior and capabilities.
        </p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
