import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Send } from 'lucide-react';

/**
 * Chat Input Component
 * Auto-expanding textarea with send button
 */

const ChatInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Type your message...'
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex gap-3 items-end">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={clsx(
          'flex-1 px-4 py-3 rounded-xl',
          'bg-slate-800/50 border border-slate-700/50',
          'text-slate-100 placeholder-slate-500',
          'backdrop-blur-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          'focus:border-transparent focus:bg-slate-800/80',
          'resize-none max-h-32',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'text-sm sm:text-base'
        )}
        rows={1}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className={clsx(
          'px-4 py-3 rounded-xl',
          'bg-gradient-to-r from-blue-500 to-indigo-600',
          'text-white transition-all duration-200',
          'hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-95',
          'flex items-center justify-center gap-2',
          'font-medium text-sm'
        )}
        aria-label={disabled ? "Sending message" : "Send message"}
      >
        <Send className="w-4 h-4" />
        {disabled && <span className="hidden sm:inline">Sending...</span>}
      </button>
    </div>
  );
};

export default ChatInput;
