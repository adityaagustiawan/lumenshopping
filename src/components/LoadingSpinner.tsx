export function LoadingSpinner({ 
  size = "md", 
  className = "" 
}: { 
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-4 border-muted border-t-accent rounded-full animate-spin`} 
      />
    </div>
  );
}

// Loading page component for full page loading
export function LoadingPage({ message }: { message?: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <LoadingSpinner size="lg" />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}