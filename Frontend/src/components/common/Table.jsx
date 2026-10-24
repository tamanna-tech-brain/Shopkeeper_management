import React from "react";

const Table = ({ headers = [], children, className = "" }) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl ${className}`}>
      <table className="w-full text-left text-sm">
        {headers.length > 0 && (
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/40">
              {headers.map((h, i) => (
                <th key={i} className="py-3.5 px-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-800/60">{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
