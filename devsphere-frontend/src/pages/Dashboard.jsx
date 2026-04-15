import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { Menu, X } from 'lucide-react';
import { sendMessage, getMessages } from '../services/api';

/**
 * Dashboard Page
 * Main chat interface with agent selection and session management
 */

function Dashboard() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [refreshSessionsTrigger, setRefreshSessionsTrigger] = useState(0);

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [sidebarOpen]);

  // Load session messages when clicking on a session in sidebar
  const handleSessionSelect = async (sessionId) => {
    try {
      setCurrentSessionId(sessionId);
      const response = await getMessages(sessionId);
      if (response.success && response.messages) {
        // Convert messages to the format our UI expects
        const formattedMessages = response.messages.map(msg => ({
          id: msg._id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt)
        }));
        setMessages(formattedMessages);
        setInput('');
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  // Handle sending messages - Optimized version
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    // Add user message immediately with functional update to avoid closure issues
    // This single update is better than multiple setMessages calls
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: Date.now(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }
    ]);

    try {
      // Call backend API
      const response = await sendMessage({
        agentType: selectedAgent,
        message: userMessage,
        sessionId: currentSessionId
      });

      // Add assistant message in one update
      const assistantContent = response.success 
        ? response.reply 
        : 'Sorry, something went wrong. Please try again.';

      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date()
        }
      ]);

      // Update session ID if this was a new session
      if (!currentSessionId && response.sessionId) {
        setCurrentSessionId(response.sessionId);
      }

      // Trigger sidebar refresh to show updated session list and title
      setRefreshSessionsTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Error: Unable to connect to the server.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setCurrentSessionId(null);
    setSelectedAgent('general');
  };

  return (
    <MainLayout showBg={true}>
      <div className="flex h-screen relative">
        {/* Sidebar with Session Management */}
        <Sidebar
          selectedAgent={selectedAgent}
          onAgentChange={setSelectedAgent}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          isOpen={sidebarOpen}
          refreshTrigger={refreshSessionsTrigger}
        />

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 sm:hidden bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col sm:ml-72">
          {/* Header */}
          <div className="border-b border-slate-700/30 bg-slate-950/50 backdrop-blur-sm px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors sm:hidden"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} Agent
                </h1>
                <p className="text-sm text-slate-400">Chat with AI</p>
              </div>
            </div>

            {/* Agent Badge & Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 text-xs font-medium text-blue-300">
                {selectedAgent.toUpperCase()}
              </div>
              <div className="px-2 py-1 rounded-full bg-slate-700/50 text-xs text-slate-400">
                {messages.length} messages
              </div>
              <button
                onClick={handleNewChat}
                className="px-3 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-xs text-slate-300 hover:text-white transition-colors font-medium"
                title="Start a new conversation"
              >
                New Chat
              </button>
            </motion.div>
          </div>

          {/* Chat Window */}
          <ChatWindow
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 sm:hidden bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col sm:ml-72">
          {/* Header */}
          <div className="border-b border-slate-700/30 bg-slate-950/50 backdrop-blur-sm px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors sm:hidden"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} Agent
                </h1>
                <p className="text-sm text-slate-400">Chat with AI</p>
              </div>
            </div>

            {/* Agent Badge & Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 text-xs font-medium text-blue-300">
                {selectedAgent.toUpperCase()}
              </div>
              <div className="px-2 py-1 rounded-full bg-slate-700/50 text-xs text-slate-400">
                {messages.length} messages
              </div>
              <button
                onClick={() => {
                  setMessages([]);
                  setInput('');
                }}
                className="px-3 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-600 text-xs text-slate-300 hover:text-white transition-colors font-medium"
                title="Clear chat history"
              >
                New Chat
              </button>
            </motion.div>
          </div>

          {/* Chat Window */}
          <ChatWindow
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;