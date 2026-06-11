import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Send, Paperclip } from 'lucide-react';

/**
 * Chat Input Component
 * Auto-expanding textarea with send and resume attachment options
 */
const ChatInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
  agentType = 'general',
  onFileSelect = null
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Clear value to allow selecting same file again
    e.target.value = '';
  };

  return (
    <div className="flex gap-3 items-end">
      {/* PDF upload option contextually shown for Resume review agent */}
      {agentType === 'resume' && onFileSelect && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={clsx(
              'p-3 rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white transition-all',
              'disabled:opacity-50 disabled:cursor-not-allowed h-[46px] flex items-center justify-center'
            )}
            title="Upload PDF resume for automated review"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </>
      )}

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
          'font-medium text-sm h-[46px]'
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
