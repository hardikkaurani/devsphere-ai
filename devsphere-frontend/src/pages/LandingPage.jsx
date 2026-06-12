import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import MainLayout from '../components/layout/MainLayout';
import AnimatedBackground from '../components/animations/AnimatedBackground';
import {
  Zap,
  Code,
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Github,
  ExternalLink,
  X
} from 'lucide-react';

/**
 * Landing Page
 * Product marketing and showcase
 */

function LandingPage() {
  const [modalType, setModalType] = useState(null); // 'privacy' | 'terms' | null

  const features = [
    {
      icon: Brain,
      title: 'Multi-Agent AI',
      description: 'Switch between specialized AI agents optimized for coding, resume review, and general assistance.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Code,
      title: 'Expert Coding Help',
      description: 'Get professional-grade coding assistance with best practices, debugging, and architecture guidance.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Sparkles,
      title: 'Lightning Fast',
      description: 'Powered by optimized AI models with minimal latency for seamless real-time conversations.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Zap,
      title: 'Always Learning',
      description: 'Our AI continuously improves with conversations, learning your preferences and style.',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const steps = [
    { number: '1', title: 'Sign In', description: 'Create your account in seconds' },
    { number: '2', title: 'Choose Agent', description: 'Select the AI specialized for your needs' },
    { number: '3', title: 'Start Chat', description: 'Begin instant conversation with AI' },
    { number: '4', title: 'Get Results', description: 'Receive expert assistance immediately' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <MainLayout showBg={true}>
      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative min-h-screen flex items-center justify-center px-4 py-20"
        >
          <div className="max-w-4xl mx-auto text-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-cyan-400/25 blur-3xl" />
                <img
                  src="/devsphere-logo.jpg"
                  alt="DevSphere AI"
                  className="relative h-20 w-20 rounded-2xl object-cover shadow-2xl shadow-blue-500/30 md:h-24 md:w-24"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-500/30">
                <p className="text-sm font-semibold text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered Intelligence Platform
                </p>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent"
            >
              Meet Your AI Experts
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              DevSphere AI brings specialized artificial intelligence agents to your fingertips.
              Get expert help with coding, career guidance, or general knowledge—all in one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/dashboard">
                <Button size="lg" className="group">
                  Start Chatting Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="https://github.com/hardikkaurani/devsphere-ai" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  <Github className="w-4 h-4" />
                  View on GitHub
                </Button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-4 mt-16 text-center"
            >
              {[
                { number: '3', label: 'AI Agents' },
                { number: '24/7', label: 'Availability' },
                { number: '100%', label: 'Free' }
              ].map((stat, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <p className="text-3xl md:text-4xl font-bold text-white">{stat.number}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="relative py-20 px-4 z-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Powerful Features
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Everything you need to harness the power of specialized AI agents
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={i} variants={itemVariants}>
                    <Card className="p-6">
                      <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-20 px-4 z-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How It Works
              </h2>
              <p className="text-slate-400 text-lg">
                Get started in just 4 simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-blue-500 to-transparent" />
                  )}
                  <Card className="p-6 h-full text-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4"
                    >
                      <span className="text-xl font-bold text-white">
                        {step.number}
                      </span>
                    </motion.div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {step.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 z-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-12 text-center bg-gradient-to-br from-blue-500/10 to-indigo-600/10">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-slate-300 text-lg mb-8">
                  Join thousands of users leveraging AI expertise for productivity and growth.
                </p>
                <Link to="/dashboard">
                  <Button size="lg" className="inline-flex">
                    Launch DevSphere AI
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-slate-700/30 py-8 px-4 z-20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
            <p>&copy; 2024 DevSphere AI. All rights reserved.</p>
            <div className="flex gap-6">
              <button onClick={() => setModalType('privacy')} className="hover:text-white transition bg-transparent border-none cursor-pointer">Privacy</button>
              <button onClick={() => setModalType('terms')} className="hover:text-white transition bg-transparent border-none cursor-pointer">Terms</button>
              <a href="https://github.com/hardikkaurani/devsphere-ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Terms & Privacy Modal */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl text-left z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              {modalType === 'privacy' ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                      <img src="/devsphere-logo.jpg" alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
                      <p className="text-xs text-slate-500">Last updated: June 12, 2026</p>
                    </div>
                  </div>
                  <div className="space-y-6 text-slate-300">
                    <section>
                      <h3 className="mb-2 text-lg font-semibold text-white">Information We Store</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        DevSphere AI stores account details such as your name, email, profile information,
                        and chat sessions needed to provide the app experience.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold text-white">How We Use Data</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        Your data is used for authentication, profile management, chat history, and improving
                        the reliability of the application. We do not sell your personal data.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold text-white">Security</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        Passwords are hashed before storage, and protected API routes require authentication.
                        You should still avoid sharing sensitive personal, financial, or confidential data in chats.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold text-white">Contact</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        For privacy questions, use the project repository at{' '}
                        <a
                          href="https://github.com/hardikkaurani/devsphere-ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 underline"
                        >
                          GitHub
                        </a>
                        .
                      </p>
                    </section>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg shadow-blue-500/20 overflow-hidden">
                      <img src="/devsphere-logo.jpg" alt="" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Terms of Use</h2>
                      <p className="text-xs text-slate-500">Last updated: June 12, 2026</p>
                    </div>
                  </div>
                  <div className="space-y-6 text-slate-300">
                    <section>
                      <h3 className="mb-2 text-lg font-semibold text-white">Use of DevSphere AI</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        DevSphere AI is provided as an AI productivity tool for coding help, resume review,
                        and general assistance. Use the application responsibly and lawfully.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold text-white">AI Output</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        AI responses may be incomplete or incorrect. Review outputs before relying on them,
                        especially for code, career, legal, financial, or safety-sensitive decisions.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold text-white">Accounts</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        You are responsible for keeping your login credentials secure and for activity that
                        happens through your account.
                      </p>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold text-white">Project Repository</h3>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        Source and project updates are available on{' '}
                        <a
                          href="https://github.com/hardikkaurani/devsphere-ai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 underline"
                        >
                          GitHub
                        </a>
                        .
                      </p>
                    </section>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}

export default LandingPage;
