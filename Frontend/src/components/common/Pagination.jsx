const Pagination = ({
  page,
  totalPages,
  handlePrev,
  handleNext,
}) => {
  return (
    <div className="flex justify-center gap-6 mt-10">
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="
          bg-gray-700
          hover:bg-gray-600
          disabled:opacity-50
          text-white
          px-6 py-3
          rounded-xl
        "
      >
        Prev
      </button>

      <span className="text-white text-xl">
        {page} / {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="
          bg-pink-500
          hover:bg-pink-600
          disabled:opacity-50
          text-white
          px-6 py-3
          rounded-xl
        "
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;