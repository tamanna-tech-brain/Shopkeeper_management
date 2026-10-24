import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Button from "./Button";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = null,
}) => {
  if (totalPages <= 1 && !totalItems) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-800/80">
      {totalItems !== null && (
        <p className="text-xs text-slate-400">
          Showing page <span className="text-slate-200 font-semibold">{currentPage}</span> of{" "}
          <span className="text-slate-200 font-semibold">{totalPages}</span> ({totalItems} total records)
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          icon={<FaChevronLeft className="w-3 h-3" />}
        >
          Previous
        </Button>

        <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
          {currentPage} / {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          icon={<FaChevronRight className="w-3 h-3" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;