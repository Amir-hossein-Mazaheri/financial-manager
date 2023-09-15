import React from "react";

// project imports
import clsxm from "../utils/mergeClass";
import { IconChevronLeft } from "@tabler/icons-react";

interface PaginationProps {
  page: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  count,
  onPrev,
  onNext,
  onChange,
}) => {
  return (
    <div className="flex flex-row-reverse text-white gap-3 items-center justify-center">
      <div
        onClick={onPrev}
        className="flex items-center cursor-pointer rounded-full justify-center w-9 h-9 border border-white border-solid text-white"
      >
        <IconChevronLeft size={18} />
      </div>

      {Array.from(Array(count)).map((_, index) => (
        <button
          key={index}
          onClick={() => onChange(index + 1)}
          className={clsxm(
            "outline-none text-sm w-10 h-10 cursor-pointer flex items-center justify-center rounded-full bg-gray-700 text-white border border-gray-700 font-semibold",
            page === index + 1 && "bg-blue-500  border-blue-500"
          )}
        >
          {index + 1}
        </button>
      ))}

      <div
        onClick={onNext}
        className="flex items-center cursor-pointer justify-center rounded-full w-9 h-9 border border-white border-solid text-white rotate-180"
      >
        <IconChevronLeft size={18} />
      </div>
    </div>
  );
};

export default Pagination;
