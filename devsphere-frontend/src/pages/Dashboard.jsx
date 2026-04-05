import { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import { Menu, X } from 'lucide-react';
import { sendMessage } from '../services/api';

/**
 * Dashboard Page
 * Main chat interface with agent selection
 */

function Dashboard() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');

    // Add user message to UI
    const newMessages = [
      ...messages,
      {
        id: Date.now(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call backend API
      const response = await sendMessage({
        agentType: selectedAgent,
        message: userMessage
      });

      if (response.success) {
        setMessages([
          ...newMessages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: response.reply,
            timestamp: new Date()
          }
        ]);
      } else {
        setMessages([
          ...newMessages,
          {
            id: Date.now() + 1,
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date()
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...newMessages,
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

  return (
    <MainLayout showBg={true}>
      <div className="flex h-screen relative">
        {/* Sidebar */}
        <Sidebar
          selectedAgent={selectedAgent}
          onAgentChange={setSelectedAgent}
          isOpen={sidebarOpen}
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

            {/* Agent Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30 text-xs font-medium text-blue-300">
                {selectedAgent.toUpperCase()}
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