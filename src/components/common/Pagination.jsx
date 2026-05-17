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

    const getPage = () => {
        const pages = [];
        if (total_pages <= 5) {
            for (let i = 1; i <= total_pages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        if (page > 3) pages.push('...');

        const start = Math.max(2, page - 1);
        const end = Math.min(total_pages - 1, page + 1);

        for (let i = start; i <= end; i++) pages.push(i);

        if (page < total_pages - 2) pages.push('...');

        pages.push(total_pages);

        return pages;
    };

    const pages = getPage();

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