import React from 'react';

export class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 text-red-500">
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
                </div>
            );
        }
        return this.props.children;
    }
}