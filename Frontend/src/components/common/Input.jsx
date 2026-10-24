import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      placeholder = "",
      value,
      onChange,
      error = null,
      icon = null,
      required = false,
      className = "",
      helperText = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            {label}
            {required && <span className="text-rose-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full rounded-xl py-2.5 px-3.5 text-sm glass-input placeholder-slate-500 transition duration-200 ${
              icon ? "pl-10" : ""
            } ${
              error
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
            } ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;