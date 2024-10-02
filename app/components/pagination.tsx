import { ChevronLeftIcon } from "@/app/components/icons/chevron-left-icon";
import { ChevronRightIcon } from "@/app/components/icons/chevron-right-icon";
import { ChevronDoubleRightIcon } from "./icons/chevron-double-right-icon";
import { ChevronDoubleLeftIcon } from "./icons/chevron-double-left-icon";

export default function Pagination({
  handlePageChange,
  currentPage,
  totalResults,
  pageSize,
}: {
  handlePageChange: (page: number) => void;
  currentPage: number;
  totalResults: number;
  pageSize: number;
}) {
  const numberOfPages = totalResults ? Math.ceil(totalResults / pageSize) : 0;
  const existsNext = currentPage !== numberOfPages;
  const existsPrevious = currentPage > 1;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white py-3">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!existsPrevious}
          className={`${
            !existsPrevious
              ? "opacity-40 text-gray-400"
              : "hover:bg-gray-50 text-gray-700"
          }  relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium `}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!existsNext}
          className={`${
            !existsNext
              ? "opacity-40 text-gray-400"
              : "hover:bg-gray-50 text-gray-700"
          } relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium `}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to <span className="font-medium">{Math.min(totalResults, currentPage * pageSize)}</span> of{" "}
            <span className="font-medium">{totalResults}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <button
              onClick={() => handlePageChange(1)}
              disabled={!existsPrevious}
              className={`${
                !existsPrevious
                  ? "opacity-40 text-gray-400"
                  : "hover:bg-gray-50 text-gray-900"
              } relative inline-flex items-center rounded-l-md px-2 py-2  ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
            >
              <span className="sr-only">First page</span>
              <ChevronDoubleLeftIcon aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!existsPrevious}
              className={`${
                !existsPrevious
                  ? "opacity-40 text-gray-400"
                  : "hover:bg-gray-50 text-gray-900"
              } relative inline-flex items-center px-2 py-2 font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
            </button>
            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
            <button
              aria-current="page"
              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              {currentPage}
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!existsNext}
              className={`${
                !existsNext
                  ? "opacity-40 text-gray-400"
                  : "hover:bg-gray-50 text-gray-900"
              } relative inline-flex items-center px-2 py-2 font-semibold  ring-1 ring-inset ring-gray-300  focus:z-20 focus:outline-offset-0`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(numberOfPages)}
              disabled={!existsNext}
              className={`${
                !existsNext
                  ? "opacity-40 text-gray-400"
                  : "hover:bg-gray-50 text-gray-900"
              } relative inline-flex items-center rounded-r-md px-2 py-2  ring-1 ring-inset ring-gray-300  focus:z-20 focus:outline-offset-0`}
            >
              <span className="sr-only">Last page</span>
              <ChevronDoubleRightIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
