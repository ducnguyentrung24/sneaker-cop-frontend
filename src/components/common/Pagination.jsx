import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function Pagination({ pagination = {}, onPageChange }) {
    const {
        page = 1,
        total_pages = 1,
        hasPrev,
        hasNext,
    } = pagination;

    if (total_pages <= 1) return null;

    return (
        <div className="flex justify-center mt-8 gap-2 text-sm items-center">
            {/* Prev */}
            <button
                disabled={!hasPrev}
                onClick={() => onPageChange(page-1)}
                className="px-2 py-1 border rounded disabled:opacity-30"
            >
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: total_pages }).map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i+1)}
                    className={`px-3 py-1 border rounded
                        ${
                            page === i + 1
                                ? 'bg-black text-white'
                                : "hover:bg-gray-100"
                        }
                    `}
                >
                    {i + 1}
                </button>
            ))}

            {/* Next */}
            <button
                disabled={!hasNext}
                onClick={() => onPageChange(page+1)}
                className="px-2 py-1 border rounded disabled:opacity-30"
            >
                <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};

export default Pagination;