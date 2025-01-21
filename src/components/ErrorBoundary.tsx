import React, { useState, useEffect } from 'react';

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('ErrorBoundary caught an error:', event.error, event);
      setHasError(true);
    };

    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong. Please try refreshing the page.</div>;
  }

  return <>{children}</>;
}

