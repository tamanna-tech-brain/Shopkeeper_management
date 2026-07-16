const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-3 rounded-xl font-semibold
        transition-all duration-300
        disabled:opacity-50
        bg-gradient-to-r from-pink-500 to-purple-500
        hover:scale-105 text-white
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;