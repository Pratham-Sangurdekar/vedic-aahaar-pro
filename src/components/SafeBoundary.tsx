import React from 'react';

interface SafeBoundaryProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

type SafeBoundaryState = { hasError: boolean };

export default class SafeBoundary extends React.Component<SafeBoundaryProps, SafeBoundaryState> {
  constructor(props: SafeBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SafeBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // eslint-disable-next-line no-console
    console.error('SafeBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Something went wrong while loading this section.</p>
        </div>
      );
    }
    return this.props.children;
  }
}



