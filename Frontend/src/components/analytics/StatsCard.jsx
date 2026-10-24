import React from "react";

const StatsCard = ({
  title,
  value,
  icon,
  trend = null,
  trendLabel = "vs last month",
  color = "indigo",
}) => {
  const colorSchemes = {
    indigo: {
      border: "hover:border-indigo-500/40",
      iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      glow: "hover:shadow-indigo-500/10",
    },
    pink: {
      border: "hover:border-pink-500/40",
      iconBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      glow: "hover:shadow-pink-500/10",
    },
    yellow: {
      border: "hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      glow: "hover:shadow-amber-500/10",
    },
    green: {
      border: "hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      glow: "hover:shadow-emerald-500/10",
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;

  return (
    <div
      className={`glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 shadow-xl transition-all duration-300 ${scheme.border} ${scheme.glow}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
            {value}
          </h2>

          {trend !== null && (
            <div className="flex items-center gap-1.5 mt-3 text-xs">
              <span
                className={`font-semibold ${
                  trend >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {trend >= 0 ? `+${trend}%` : `${trend}%`}
              </span>
              <span className="text-slate-500">{trendLabel}</span>
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center border text-xl shrink-0 shadow-sm ${scheme.iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;