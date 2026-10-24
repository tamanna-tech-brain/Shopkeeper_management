import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

const ErrorMessage = ({ message, onRetry = null }) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm my-3">
      <div className="flex items-center gap-2.5">
        <FaExclamationCircle className="w-4 h-4 text-rose-400 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-rose-400 hover:text-rose-200 underline ml-4"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
