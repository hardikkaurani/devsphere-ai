import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Global Error Boundary Component
 * Catches uncaught runtime exceptions in the component tree and displays a premium recovery screen.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an uncaught crash:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans">
          <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/5">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Something went wrong</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                An unexpected application error occurred in this view. We have recorded the diagnostic logs.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left bg-slate-950/80 p-4 border border-slate-850 rounded-xl text-[10px] text-red-400 overflow-x-auto max-h-36 font-mono leading-relaxed select-text">
                {this.state.error.stack || this.state.error.toString()}
              </pre>
            )}

            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
