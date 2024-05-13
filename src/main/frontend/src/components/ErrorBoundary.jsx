// components/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state to render the fallback UI in case of an error
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error and additional information for debugging
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can customize the fallback UI as per your application's theme
            return <h1>Something went wrong. Please try again later.</h1>;
        }

        // Render children components if there's no error
        return this.props.children;
    }
}

export default ErrorBoundary;
