import React, { Component } from 'react';
import { AlertOctagon } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-darker text-gray-100 flex items-center justify-center p-6">
          <div className="glass-panel border border-neon-rose/30 p-8 rounded-2xl max-w-md w-full shadow-[0_0_20px_rgba(244,63,94,0.1)] text-center">
            <div className="p-3 bg-neon-rose/10 border border-neon-rose/20 text-neon-rose rounded-full inline-block mb-4">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Application Crash</h1>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              An unexpected client error occurred: <br />
              <code className="text-neon-rose text-xs block bg-black/40 p-2 rounded mt-2 select-all">
                {this.state.error?.message || 'Unknown react execution fault'}
              </code>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-lg font-semibold bg-neon-rose hover:bg-rose-600 transition-colors shadow-lg shadow-rose-950/20 text-sm"
            >
              Refresh Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
