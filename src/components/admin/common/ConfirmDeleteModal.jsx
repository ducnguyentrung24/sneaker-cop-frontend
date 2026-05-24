import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function ConfirmDeleteModal({
    open,
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
    loading = false,
    onClose,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-2xl" />
                </div>

                <h2 className="text-lg font-bold text-center uppercase">{title}</h2>
                <p className="text-sm text-gray-500 text-center mt-3 leading-relaxed">{message}</p>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                        disabled={loading}
                        onClick={onClose}
                        className="h-11 rounded-lg border border-gray-300 text-sm font-bold hover:bg-gray-100 disabled:opacity-60 transition"
                    >
                        Hủy
                    </button>

                    <button
                        disabled={loading}
                        onClick={onConfirm}
                        className="h-11 rounded-lg bg-red-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;