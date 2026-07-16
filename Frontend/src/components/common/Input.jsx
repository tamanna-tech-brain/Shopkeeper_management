const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full p-3 rounded-xl
        bg-white/20 text-white
        placeholder-gray-300
        outline-none
        focus:ring-2 focus:ring-pink-400
      "
    />
  );
};

export default Input;