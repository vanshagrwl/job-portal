import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console - can be replaced with remote logging
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="max-w-xl text-center">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-300 mb-4">An unexpected error occurred while rendering this page. Check the console for details.</p>
            <pre className="text-xs text-left bg-black/30 p-3 rounded overflow-x-auto">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
