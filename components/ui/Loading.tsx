import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function Loading({
  message = "Loading...",
  fullScreen = false,
  className = "",
}: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-slate-50/50 ${className}`}
      >
        {content}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      {content}
    </div>
  );
}
