import React from 'react';
import { Button } from './button';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 这里可以添加错误日志上报逻辑
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="relative">
          <this.props.FallbackComponent 
            error={this.state.error} 
            resetErrorBoundary={this.resetErrorBoundary} 
          />
          <div className="absolute bottom-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-300"
              onClick={() => {
                console.log('Error details:', this.state.error);
              }}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              查看详情
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}