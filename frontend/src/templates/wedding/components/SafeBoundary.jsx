import { Component } from 'react'

/**
 * Minimal error boundary. Renders nothing (or a provided fallback) if a child
 * throws — used to isolate non-essential enhancements (e.g. the particle
 * engine) so they can never break the invitation itself.
 */
export default class SafeBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('SafeBoundary caught an error:', error)
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
