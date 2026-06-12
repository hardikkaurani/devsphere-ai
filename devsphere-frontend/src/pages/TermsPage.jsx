import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';

function TermsPage() {
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
            <h1 className="mb-3 text-3xl font-bold text-white">Terms of Use</h1>
            <p className="mb-8 text-sm text-slate-400">Last updated: June 12, 2026</p>

            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Use of DevSphere AI</h2>
                <p>
                  DevSphere AI is provided as an AI productivity tool for coding help, resume review,
                  and general assistance. Use the application responsibly and lawfully.
                </p>
              </section>

              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">AI Output</h2>
                <p>
                  AI responses may be incomplete or incorrect. Review outputs before relying on them,
                  especially for code, career, legal, financial, or safety-sensitive decisions.
                </p>
              </section>

              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Accounts</h2>
                <p>
                  You are responsible for keeping your login credentials secure and for activity that
                  happens through your account.
                </p>
              </section>

              <section>
                <h2 className="mb-2 text-lg font-semibold text-white">Project Repository</h2>
                <p>
                  Source and project updates are available on{' '}
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

export default TermsPage;
