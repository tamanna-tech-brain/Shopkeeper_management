const SearchBar = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full max-w-md
        p-4 rounded-2xl
        outline-none
        bg-white/10
        text-white
        placeholder:text-gray-300
        border border-white/20
      "
    />
  );
};

export default SearchBar;