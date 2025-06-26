import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';



class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#ff4444',
          color: 'white',
          fontSize: '16px'
        }}>
          <h1>Something went wrong!</h1>
          <p>Error: {String((this.state as any).error)}</p>
          <details>
            <summary>Error details:</summary>
            <pre>{JSON.stringify((this.state as any).error, null, 2)}</pre>
          </details>
        </div>
      );
    }

    return (this.props as any).children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
    