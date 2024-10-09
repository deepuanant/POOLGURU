import React, { Component } from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error or send it to an error reporting service
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Redirect to the custom 500 error page
      return <Navigate to="/500error" />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
