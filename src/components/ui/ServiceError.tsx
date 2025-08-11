'use client';

interface ServiceErrorProps {
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export function ServiceError({ 
  onRetry, 
  title = "Service temporairement indisponible",
  message = "Nos serveurs sont en maintenance. Veuillez réessayer dans quelques minutes."
}: ServiceErrorProps) {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}