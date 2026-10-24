import React from "react";

const Spinner = ({ size = "md", className = "" }) => {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  return (
    <div
      className={`rounded-full border-slate-700 border-t-indigo-500 animate-spin ${
        sizeMap[size] || sizeMap.md
      } ${className}`}
    />
  );
};

export default Spinner;
