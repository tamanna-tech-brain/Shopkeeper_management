import React from "react";

const GradientCard = ({
  children,
  from = "from-indigo-600/20",
  to = "to-purple-600/20",
  className = "",
}) => {
  return (
    <div
      className={`rounded-2xl p-6 border border-slate-800 bg-gradient-to-br ${from} ${to} backdrop-blur-xl shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};

export default GradientCard;
