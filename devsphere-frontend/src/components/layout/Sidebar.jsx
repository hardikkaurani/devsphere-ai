import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Zap, Code, FileText, MessageSquare } from 'lucide-react';

/**
 * Sidebar Component
 * Agent selection and navigation
 */

const Sidebar = ({
  selectedAgent = 'general',
  onAgentChange,
  isOpen = true
}) => {
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
      <div className="space-y-3 flex-1">
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

      {/* Footer Info */}
      <div className="border-t border-slate-700/30 pt-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          💡 Tip: Switch between agents to change the AI's behavior and capabilities.
        </p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
