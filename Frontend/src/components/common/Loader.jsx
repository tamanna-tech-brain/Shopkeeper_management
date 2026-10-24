import React from "react";

const Loader = ({ text = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-ping"></div>
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-400 animate-spin"></div>
      </div>
      {text && (
        <p className="text-sm font-medium text-slate-400 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;