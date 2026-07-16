const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        rounded-3xl
        shadow-2xl
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;