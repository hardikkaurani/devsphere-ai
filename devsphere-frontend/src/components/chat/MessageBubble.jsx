import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

/**
 * Copy Code Helper Component
 */
const CopyCodeButton = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
      title={copied ? 'Copied!' : 'Copy Code'}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[10px] text-green-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span className="text-[10px]">Copy</span>
        </>
      )}
    </button>
  );
};

/**
 * Animated Message Bubble Component
 * Supports Markdown and Code Highlighting
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
      console.error('Failed to copy message:', err);
    }
  };

  const bubbleVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 14 }
    },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={clsx(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start',
        'mb-4 group'
      )}
    >
      <div
        className={clsx(
          'max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl relative shadow-md',
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-none'
            : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/60'
        )}
      >
        {isLoading ? (
          <div className="flex gap-1.5 py-2">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="w-2 h-2 bg-current rounded-full"
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
              className="w-2 h-2 bg-current rounded-full"
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-current rounded-full"
            />
          </div>
        ) : (
          <>
            <div className="leading-relaxed break-words pr-4 text-sm sm:text-base">
              {isUser ? (
                <p className="whitespace-pre-wrap">{content}</p>
              ) : (
                <div className="prose prose-invert max-w-none text-slate-100 select-text">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {children}
                        </a>
                      ),
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeString = String(children).replace(/\n$/, '');

                        return !inline && match ? (
                          <div className="my-3 rounded-lg overflow-hidden border border-slate-700 bg-slate-900/80">
                            <div className="flex items-center justify-between px-3 py-1 bg-slate-800 text-[10px] text-slate-400 font-mono">
                              <span>{match[1].toUpperCase()}</span>
                              <CopyCodeButton code={codeString} />
                            </div>
                            <pre className="p-3 overflow-x-auto text-xs font-mono leading-relaxed text-slate-300">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        ) : (
                          <code className="bg-slate-700/60 px-1 py-0.5 rounded text-xs font-mono text-pink-400" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              )}
              {showTimestamp && timestamp && (
                <p className="text-[10px] opacity-40 mt-1">
                  {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>

            {/* General Message Copy Button (shows on hover) */}
            <button
              onClick={handleCopy}
              className={clsx(
                'absolute top-2 right-2 p-1 rounded-md text-slate-400 hover:text-slate-200',
                'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                'hover:bg-slate-700/50',
                copied && 'text-green-400'
              )}
              title="Copy message text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(MessageBubble);
