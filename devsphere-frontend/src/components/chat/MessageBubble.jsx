import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

/**
 * Animated Message Bubble Component
 * Smooth entrance and exit animations with copy functionality
 */

const MessageBubble = ({ 
  content, 
  role = 'user', 
  isLoading = false,
  showTimestamp = false,
  timestamp = null
}) => {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const bubbleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.8
    }
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={clsx(
        'flex',
        isUser ? 'justify-end' : 'justify-start',
        'mb-4 group'
      )}
    >
      <div
        className={clsx(
          'max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl',
          'backdrop-blur-sm relative',
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none shadow-lg shadow-blue-500/20'
            : 'bg-slate-700/40 text-slate-100 rounded-bl-none border border-slate-600/30 shadow-lg shadow-black/20'
        )}
      >
        {isLoading ? (
          <div className="flex gap-1.5 py-2">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="w-2 h-2 bg-current rounded-full"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
              className="w-2 h-2 bg-current rounded-full"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-current rounded-full"
            />
          </div>
        ) : (
          <>
            <div className="leading-relaxed break-words pr-8">
              <p className="text-sm sm:text-base">{content}</p>
              {showTimestamp && timestamp && (
                <p className="text-xs opacity-60 mt-1">
                  {new Date(timestamp).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Copy Button - Hidden by default, shows on hover */}
            <button
              onClick={handleCopy}
              className={clsx(
                'absolute top-2 right-2 p-1.5 rounded-md',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                'hover:bg-white/10 active:bg-white/20',
                copied ? 'text-green-400' : 'text-current'
              )}
              title={copied ? 'Copied!' : 'Copy message'}
              aria-label="Copy message"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
