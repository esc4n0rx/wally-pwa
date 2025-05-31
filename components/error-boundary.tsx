'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Algo deu errado</h2>
          <p className="text-muted-foreground mb-6">
            Ocorreu um erro inesperado. Nossa equipe foi notificada.
          </p>
          <Button onClick={() => window.location.reload()}>
            Recarregar página
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}