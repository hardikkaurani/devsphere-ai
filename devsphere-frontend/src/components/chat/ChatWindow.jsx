import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import TypingIndicator from '../animations/TypingIndicator';
import SkeletonLoader from '../animations/SkeletonLoader';
import ChatInput from './ChatInput';

/**
 * Modern Chat Window Component
 * Displays chat messages with smooth animations
 */

const ChatWindow = ({
  messages,
  input,
  setInput,
  onSend,
  isLoading = false
}) => {
  const scrollRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isLoading, autoScroll]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 100);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Chat Messages Area */}
      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(100, 116, 139, 0.5) transparent'
        }}
      >
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center py-20"
          >
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-2">
              Welcome to DevSphere AI
            </h2>
            <p className="text-slate-400 max-w-md">
              Start a conversation with our AI assistant. Ask for coding help, resume feedback, or general assistance.
            </p>
          </motion.div>
        )}

        {messages.length === 0 && isLoading && <SkeletonLoader />}

        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <MessageBubble
              key={`${msg.id || idx}-${msg.timestamp}`}
              content={msg.content}
              role={msg.role}
              showTimestamp={true}
              timestamp={msg.timestamp}
            />
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-700/40 rounded-2xl rounded-bl-none">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700/30 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent backdrop-blur-sm px-4 py-6">
        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSend={onSend}
          disabled={isLoading}
          placeholder="Ask me anything..."
        />
        <p className="text-xs text-slate-500 mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
