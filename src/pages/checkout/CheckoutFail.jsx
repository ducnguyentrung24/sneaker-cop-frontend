import { useLocation, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function CheckoutFail() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const pendingItems = JSON.parse(
        sessionStorage.getItem("pending_checkout") || "[]"
    );

    const message =
        state?.message ||
        "Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán.";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F3F4] px-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-md p-10 text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-lg bg-red-100">
                    <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="text-red-500 text-5xl"
                    />
                </div>

                <h1 className="text-2xl font-bold mb-2">ĐẶT HÀNG THẤT BẠI!</h1>

                <p className="text-gray-500 text-sm">Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán.</p>
                <p className="text-gray-500 text-sm mb-6">Vui lòng kiểm tra lại phương thức thanh toán hoặc thử lại sau.</p>

                <div className="bg-gray-100 rounded-sm p-4 mb-6 text-left border-l-4 border-red-500">
                    <p className="text-xs text-gray-500 font-semibold mb-1 tracking-widest">CHI TIẾT LỖI</p>
                    <p className="text-sm text-gray-700">{message}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/checkout")}
                        className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 transition"
                    >
                        THỬ LẠI NGAY
                    </button>

                    <button
                        onClick={() => navigate("/cart", {
                            state: {
                                items: pendingItems,
                            }
                        })}
                        className="flex-1 border border-black py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                        QUAY LẠI GIỎ HÀNG
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutFail;