import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function OrderSummary({ items, total, loading, onSubmit }) { 
    return (
        <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                {/* HEADER */}
                <div className="bg-black text-white text-center py-4 font-bold tracking-widest">
                    ĐƠN HÀNG
                </div>

                {/* ITEMS */}
                <div className="p-6 space-y-4 max-h-80 overflow-y-auto scroll-smooth scrollbar-hide">
                    {items.map((item) => (
                        <div 
                            key={item.variant_id || item.id} 
                            className="flex gap-4"
                        >
                            <img
                                src={item.product?.thumbnail}
                                className="w-16 h-16 object-cover rounded"
                            />

                            <div className="flex-1">
                                <p className="text-sm font-semibold">
                                    {item.product.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Màu: {item.variant?.color} | Size: {item.variant.size}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Số lượng: {item.quantity}
                                </p>
                            </div>

                            <p className="text-sm font-bold">
                                {Math.round(item.total).toLocaleString("vi-VN")}đ
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tmp price */}
                <div className="border-t border-gray-300 px-6 py-4 text-sm">
                    <div className="flex justify-between">
                        <span>Tạm tính</span>
                        <span className="font-semibold">
                            {Math.round(total).toLocaleString("vi-VN")}đ
                        </span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <span>Phí vận chuyển</span>
                        <span className="text-orange-500 font-semibold">Miễn phí</span>
                    </div>
                </div>

                {/* Total price */}
                <div className="border-t border-gray-300 px-6 py-4 flex justify-between items-center">
                    <span className="font-bold uppercase">Tổng cộng</span>
                    <span className="text-orange-500 font-bold text-3xl">
                        {Math.round(total).toLocaleString("vi-VN")}đ
                    </span>
                </div>

                {/* BUTTON */}
                <div className="p-6">
                    <button
                        disabled={loading}
                        onClick={onSubmit}
                        className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase tracking-wide hover:opacity-90 disabled:opacity-60"
                    >
                        {loading ? "Đang xử lý..." : "Đặt hàng ngay"}{" "}
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;