const Modal = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/50
        flex items-center justify-center
        z-50
      "
    >
      <div
        className="
          bg-gray-900
          p-6
          rounded-2xl
          w-full
          max-w-md
        "
      >
        {children}

        <button
          onClick={onClose}
          className="
            mt-4
            bg-red-500
            text-white
            px-4 py-2
            rounded-xl
          "
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;