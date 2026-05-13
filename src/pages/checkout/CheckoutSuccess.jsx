import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function CheckoutSuccess() {
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderCode = state?.orderCode || searchParams.get("orderCode") || "N/A";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3F3F4] px-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-md p-10 text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-lg bg-green-100">
                    <FontAwesomeIcon 
                        icon={faCircleCheck} 
                        className="text-green-500 text-5xl"
                    />
                </div>

                <h1 className="text-2xl font-bold mb-2">ĐẶT HÀNG THÀNH CÔNG!</h1>

                <p className="text-gray-500 text-sm">Cảm ơn bạn đã mua sắm tại Sneaker Cop.</p>
                <p className="text-gray-500 text-sm mb-6">Đơn hàng của bạn đang được xử lý.</p>

                <div className="bg-gray-100 py-4 rounded-lg mb-6">
                    <p className="text-xs text-gray-400 font-semibold tracking-widest">MÃ ĐƠN HÀNG</p>
                    <p className="font-semibold">#{orderCode}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => navigate("/products")}
                        className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-medium"
                    >
                        TIẾP TỤC MUA SẮM
                    </button>

                    <button
                        onClick={() => navigate("/orders")}
                        className="flex-1 border border-gray-300 py-3 rounded-lg text-sm font-medium"
                    >
                        THEO DÕI ĐƠN HÀNG
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutSuccess;