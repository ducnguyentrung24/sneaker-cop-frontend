import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

function ArrowButton({ direction = 'left', onClick, className="" }) {
    const isLeft = direction === 'left';

    return (
        <button
            onClick={onClick}
            className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 z-50 flex items-center justify-center bg-white/10
                backdrop-blur text-black rounded hover:bg-white/20 transition
                ${isLeft ? 'left-5' : 'right-5'} 
                ${className}
                `}
        >
            <FontAwesomeIcon icon={isLeft ? faChevronLeft : faChevronRight} />
        </button>
    );
};

export default ArrowButton;