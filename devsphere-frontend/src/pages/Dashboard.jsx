import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";
import {
  Menu,
  X,
  Sun,
  Moon,
  Download,
  BarChart2,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { getMessages, reviewResume } from "../services/api";
import { API_BASE_URL } from "../constants/apiEndpoints";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { io } from "socket.io-client";

/**
 * Dashboard Page
 * Main chat interface with agent selection, session management, and usage analytics
 */
function Dashboard() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("general");
  const [selectedModel, setSelectedModel] = useState("gemma:2b");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [refreshSessionsTrigger, setRefreshSessionsTrigger] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Theme management (persisted in localStorage)
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Available Models
  const models = ["gemma:2b", "mistral", "llama2"];

  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const socketUrl = API_BASE_URL.replace("/api/v1", "");
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [sidebarOpen]);

  // Load session messages when clicking on a session in sidebar
  const handleSessionSelect = async (sessionId) => {
    try {
      setCurrentSessionId(sessionId);
      const response = await getMessages(sessionId);
      if (response.success && response.messages) {
        const formattedMessages = response.messages.map((msg) => ({
          id: msg._id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt),
        }));
        setMessages(formattedMessages);
        setInput("");
      }
    } catch (error) {
      console.error("Failed to load session:", error);
      toast.error("Failed to load conversation history.");
    }
  };

  // SSE Chunk Streaming message sending
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    // Append user message immediately
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    // Append empty placeholder for assistant response stream
    setMessages((prev) => [
      ...prev,
      {
        id: "temp-assistant-stream",
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);

    try {
      const token = localStorage.getItem("token");
      const backendUrl = API_BASE_URL;

      const response = await fetch(`${backendUrl}/agent/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentType: selectedAgent,
          message: userMessage,
          sessionId: currentSessionId,
          model: selectedModel,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Server returned error");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data: ")) continue;

          try {
            const dataStr = line.substring(6); // strip 'data: '
            const parsed = JSON.parse(dataStr);

            if (parsed.chunk) {
              assistantText += parsed.chunk;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === "temp-assistant-stream"
                    ? { ...m, content: assistantText }
                    : m,
                ),
              );
            }

            if (parsed.done) {
              if (parsed.sessionId) {
                setCurrentSessionId(parsed.sessionId);
              }
            }

            if (parsed.error) {
              throw new Error(parsed.error);
            }
          } catch {
            // Ignore partial/malformed chunk parse exceptions
          }
        }
      }

      // Finalize temp stream block to permanent ID
      setMessages((prev) =>
        prev.map((m) =>
          m.id === "temp-assistant-stream" ? { ...m, id: Date.now() } : m,
        ),
      );

      setRefreshSessionsTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Streaming error:", error);
      toast.error(error.message || "Error communicating with AI agent.");

      // Update the placeholder with the error message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === "temp-assistant-stream"
            ? {
                ...m,
                id: Date.now(),
                content: `Failed to generate response. ${error.message}`,
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setCurrentSessionId(null);
    setSelectedAgent("general");
    setShowAnalytics(false);
    toast.success("Started a new chat session.");
  };

  // Export Chat to Markdown
  const handleExportMarkdown = () => {
    if (messages.length === 0) {
      toast.error("No messages to export.");
      return;
    }
    const header = `# DevSphere AI Chat Session\n- **Agent:** ${selectedAgent.toUpperCase()}\n- **Model:** ${selectedModel}\n- **Exported:** ${new Date().toLocaleString()}\n\n---\n\n`;
    const body = messages
      .map(
        (m) =>
          `### ${m.role === "user" ? "User" : "Assistant"}\n\n${m.content}\n`,
      )
      .join("\n");

    const blob = new Blob([header + body], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `chat-export-${selectedAgent}-${Date.now()}.md`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
    toast.success("Markdown file exported.");
  };

  // Export Chat to PDF
  const handleExportPDF = () => {
    if (messages.length === 0) {
      toast.error("No messages to export.");
      return;
    }
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("DevSphere AI Chat Transcript", 20, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(
        `Agent: ${selectedAgent.toUpperCase()} | Model: ${selectedModel} | Date: ${new Date().toLocaleString()}`,
        20,
        28,
      );
      doc.setLineWidth(0.3);
      doc.line(20, 32, 190, 32);

      let y = 42;
      messages.forEach((msg) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const sender = msg.role === "user" ? "User" : "Assistant";
        doc.text(`${sender}:`, 20, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        // Split text to respect margin width
        const splitText = doc.splitTextToSize(msg.content, 170);
        doc.text(splitText, 20, y + 6);
        y += splitText.length * 5 + 12;
      });

      doc.save(`chat-export-${selectedAgent}-${Date.now()}.pdf`);
      setShowExportMenu(false);
      toast.success("PDF file exported.");
    } catch (err) {
      console.error(err);
      toast.error("Could not generate PDF export.");
    }
  };

  // Handle PDF Resume Upload & Critique
  const handleResumeUpload = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF format resume");
      return;
    }

    setIsLoading(true);
    // Add file message and analyzing state
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: `Uploaded PDF Resume: ${file.name}`,
        timestamp: new Date(),
      },
      {
        id: "temp-resume-loader",
        role: "assistant",
        content:
          "Analyzing your resume layout and text. Please wait, this could take up to a minute...",
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await reviewResume(file, selectedModel);
      if (response.success && response.review) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === "temp-resume-loader"
              ? { ...m, id: Date.now(), content: response.review }
              : m,
          ),
        );
        if (response.sessionId) {
          setCurrentSessionId(response.sessionId);
        }
        setRefreshSessionsTrigger((prev) => prev + 1);
        toast.success("Resume review finished!");
      } else {
        throw new Error(response.error || "Analyzing resume failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to analyze resume.");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === "temp-resume-loader"
            ? {
                ...m,
                id: Date.now(),
                content: `Failed to review resume. ${error.message}`,
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout showBg={theme === "dark"}>
      <div
        className={
          theme === "light"
            ? "bg-slate-50 text-slate-900 min-h-screen"
            : "text-white min-h-screen"
        }
      >
        <div className="flex h-screen relative overflow-hidden">
          {/* Sidebar with Session Management */}
          <Sidebar
            selectedAgent={selectedAgent}
            onAgentChange={setSelectedAgent}
            currentSessionId={currentSessionId}
            onSessionSelect={handleSessionSelect}
            isOpen={sidebarOpen}
            refreshTrigger={refreshSessionsTrigger}
            showAnalytics={showAnalytics}
            setShowAnalytics={setShowAnalytics}
          />

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-10 sm:hidden bg-black/60 backdrop-blur-xs"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content Pane */}
          <div className="flex-1 flex flex-col sm:ml-72 h-full overflow-hidden">
            {/* Header */}
            <div
              className={`border-b ${theme === "light" ? "border-slate-200 bg-white" : "border-slate-800/40 bg-slate-950/50"} backdrop-blur-md px-4 py-3.5 flex items-center justify-between z-10`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-2 rounded-xl transition-colors sm:hidden ${theme === "light" ? "hover:bg-slate-100 text-slate-700" : "hover:bg-slate-800/50 text-slate-300"}`}
                >
                  {sidebarOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
                <div>
                  <h1
                    className={`text-base font-bold ${theme === "light" ? "text-slate-800" : "text-white"}`}
                  >
                    {showAnalytics
                      ? "Platform Analytics"
                      : `${selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} Assistant`}
                  </h1>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase flex items-center gap-1.5">
                    {showAnalytics
                      ? "Usage Metrics"
                      : "Interactive Chat Session"}
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span
                      className={`flex items-center gap-1 text-[9px] ${socketConnected ? "text-green-500" : "text-red-500"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${socketConnected ? "bg-green-500 animate-pulse" : "bg-red-500"} inline-block`}
                      ></span>
                      {socketConnected ? "Live" : "Offline"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Header Action Menu */}
              <div className="flex items-center gap-2.5">
                {/* Mode / Model Selection (Hidden in Analytics view) */}
                {!showAnalytics && (
                  <div className="relative flex items-center gap-2 bg-slate-800/35 border border-slate-700/30 rounded-xl px-2.5 py-1 text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Model:
                    </span>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="bg-transparent text-slate-300 font-semibold focus:outline-none cursor-pointer pr-1"
                    >
                      {models.map((m) => (
                        <option
                          key={m}
                          value={m}
                          className="bg-slate-900 text-slate-200"
                        >
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* View Switch Tab */}
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`p-2 rounded-xl transition-all border ${
                    showAnalytics
                      ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400"
                      : theme === "light"
                        ? "hover:bg-slate-100 border-slate-200 text-slate-600"
                        : "hover:bg-slate-800/60 border-slate-800/60 text-slate-400"
                  }`}
                  title={
                    showAnalytics
                      ? "Show Chat Window"
                      : "Show Performance Analytics"
                  }
                >
                  {showAnalytics ? (
                    <MessageSquare className="w-4 h-4" />
                  ) : (
                    <BarChart2 className="w-4 h-4" />
                  )}
                </button>

                {/* Export Options (Chat mode only) */}
                {!showAnalytics && messages.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className={`p-2 rounded-xl border flex items-center gap-1 transition-all ${
                        theme === "light"
                          ? "hover:bg-slate-100 border-slate-200 text-slate-700"
                          : "hover:bg-slate-800/60 border-slate-800/60 text-slate-300"
                      }`}
                      title="Export transcript"
                    >
                      <Download className="w-4 h-4" />
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </button>

                    {showExportMenu && (
                      <div className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1.5 z-50 text-xs">
                        <button
                          onClick={handleExportMarkdown}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          Export as MD
                        </button>
                        <button
                          onClick={handleExportPDF}
                          className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          Export as PDF
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Light/Dark Toggle */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 rounded-xl border transition-colors ${
                    theme === "light"
                      ? "hover:bg-slate-100 border-slate-200 text-slate-600"
                      : "hover:bg-slate-800/60 border-slate-850 text-slate-400 hover:text-white"
                  }`}
                  title="Toggle light/dark mode"
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </button>

                {/* New Chat Button */}
                {!showAnalytics && (
                  <button
                    onClick={handleNewChat}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                  >
                    New Chat
                  </button>
                )}
              </div>
            </div>

            {/* Content Switcher */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {showAnalytics ? (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full overflow-y-auto"
                  >
                    <AnalyticsDashboard />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <ChatWindow
                      messages={messages}
                      input={input}
                      setInput={setInput}
                      onSend={handleSend}
                      isLoading={isLoading}
                      agentType={selectedAgent}
                      onFileSelect={handleResumeUpload}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
