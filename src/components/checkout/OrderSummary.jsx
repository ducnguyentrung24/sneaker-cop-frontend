import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function OrderSummary({ items, total, loading, onSubmit }) { 
    return (
        <div className="col-span-12 lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Title */}
                <div className="bg-black text-white text-center py-3 sm:py-4 font-bold tracking-widest">ĐƠN HÀNG</div>

                {/* Items */}
                <div className="p-4 sm:p-6 space-y-4 max-h-70 sm:max-h-80 overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block">
                    {items.map((item, index) => (
                        <div 
                            key={`${item.variant_id || item.id}-${index}`} 
                            className="flex gap-3 sm:gap-4"
                        >
                            <img
                                src={item.product?.thumbnail}
                                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold line-clamp-2">
                                    {item.product.name}
                                </p>

                                <p className="text-xs text-gray-500 mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                    Màu: {item.variant?.color} | Size: {item.variant.size}
                                </p>

                                <p className="text-xs text-gray-500 mt-0.5">
                                    Số lượng: {item.quantity}
                                </p>
                            </div>

                            <p className="text-sm font-bold whitespace-nowrap shrink-0 text-right">
                                {Math.round(item.total).toLocaleString("vi-VN")}đ
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tmp price */}
                <div className="border-t border-gray-300 px-4 sm:px-6 py-4 text-sm">
                    <div className="flex justify-between">
                        <span>Tạm tính</span>
                        <span className="font-semibold whitespace-nowrap">
                            {Math.round(total).toLocaleString("vi-VN")}đ
                        </span>
                    </div>

                    <div className="flex justify-between mt-2">
                        <span>Phí vận chuyển</span>
                        <span className="text-orange-500 font-semibold">Miễn phí</span>
                    </div>
                </div>

                {/* Total price */}
                <div className="border-t border-gray-300 px-4 sm:px-6 py-4 flex justify-between items-center">
                    <span className="font-bold uppercase text-sm sm:text-base">Tổng cộng</span>
                    <span className="text-orange-500 font-bold text-xl sm:text-3xl whitespace-nowrap">
                        {Math.round(total).toLocaleString("vi-VN")}đ
                    </span>
                </div>

                {/* Button */}
                <div className="p-4 sm:p-6">
                    <button
                        disabled={loading}
                        onClick={onSubmit}
                        className="w-full bg-black text-white py-3 sm:py-4 rounded-lg font-bold uppercase tracking-wide hover:opacity-90 disabled:opacity-60"
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