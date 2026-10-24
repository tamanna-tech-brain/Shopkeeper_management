import React from "react";

const GlassCard = ({ children, className = "", onClick = null }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
