import React from 'react';

class ErrorBoundary extends React.Component {
    state = {
        hasError: false
    }
    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }
    render() {
        return this.state.hasError ? null : this.props.children;
    }
}

export default ErrorBoundary;
