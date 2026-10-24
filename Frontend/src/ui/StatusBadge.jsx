import React from "react";

const StatusBadge = ({ status, variant = "default", size = "sm" }) => {
  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1 text-xs font-semibold",
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "danger":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "info":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "primary":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "purple":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeClasses[size] || sizeClasses.sm} ${getVariantStyles()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
