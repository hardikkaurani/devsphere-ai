import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

function PrivacyPage() {
  return (
    <MainLayout showBg={true}>
      <main className="min-h-screen px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/70 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <img
              src="/devsphere-logo.jpg"
              alt="DevSphere AI"
              className="mb-6 h-12 w-12 rounded-2xl object-cover shadow-lg shadow-blue-500/25"
            />
            <h1 className="mb-3 text-3xl font-bold text-white">Privacy Policy</h1>
            <p className="mb-8 text-sm text-slate-400">Last updated: June 12, 2026</p>

            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Information We Store</h2>
                <p>
                  DevSphere AI stores account details such as your name, email, profile information,
                  and chat sessions needed to provide the app experience.
                </p>
              </section>

              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">How We Use Data</h2>
                <p>
                  Your data is used for authentication, profile management, chat history, and improving
                  the reliability of the application. We do not sell your personal data.
                </p>
              </section>

              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Security</h2>
                <p>
                  Passwords are hashed before storage, and protected API routes require authentication.
                  You should still avoid sharing sensitive personal, financial, or confidential data in chats.
                </p>
              </section>

              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Contact</h2>
                <p>
                  For privacy questions, use the project repository at{' '}
                  <a
                    href="https://github.com/hardikkaurani/devsphere-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200"
                  >
                    GitHub
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}

export default PrivacyPage;
