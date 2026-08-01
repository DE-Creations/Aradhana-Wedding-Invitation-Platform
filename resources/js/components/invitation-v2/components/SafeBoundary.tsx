import { Component, type ErrorInfo, type ReactNode } from 'react';

interface SafeBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface SafeBoundaryState {
  hasError: boolean;
}

/**
 * Minimal error boundary. Renders nothing (or a provided fallback) if a child
 * throws — used to isolate non-essential enhancements (e.g. the particle
 * engine) so they can never break the invitation itself.
 */
export default class SafeBoundary extends Component<SafeBoundaryProps, SafeBoundaryState> {
  state: SafeBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SafeBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.warn('SafeBoundary caught an error:', error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
