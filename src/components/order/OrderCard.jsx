import { useNavigate } from "react-router-dom";

function OrderCard({ order }) {
    const navigate = useNavigate();

    const statusMap = {
        PENDING: {
            label: "CHỜ XỬ LÝ",
            className: "bg-blue-50 text-blue-500",
        },
        PROCESSING: {
            label: "ĐANG XỬ LÝ",
            className: "bg-orange-50 text-orange-500",
        },
        SHIPPING: {
            label: "ĐANG GIAO HÀNG",
            className: "bg-purple-50 text-purple-500",
        },
        COMPLETED: {
            label: "HOÀN THÀNH",
            className: "bg-green-50 text-green-500",
        },
        CANCELLED: {
            label: "ĐÃ HỦY",
            className: "bg-red-50 text-red-500",
        },
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-start justify-between">
                <div>
                    <p className="text-sm uppercase tracking-widest text-gray-600 font-semibold">Mã đơn hàng</p>
                    <h2 className="text-xl font-bold tracking-tight mt-1">#{order.order_code}</h2>

                    <p className="text-sm text-gray-600 mt-1">
                        Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </p>
                </div>

                <div className={`px-3 py-1 text-xs font-bold rounded-sm tracking-wide
                    ${statusMap[order.status]?.className}
                `}>  
                    {statusMap[order.status]?.label}    
                </div>
            </div>

            {/* Items */}
            <div className="max-h-65 overflow-y-auto divide-y divide-gray-100">
                {order.items.map((item, index) => (
                    <div key={index} className="px-6 py-5 flex items-start justify-between gap-4">
                        {/* Left */}
                        <div className="flex gap-7">
                            <img
                                src={item.image}
                                alt={item.product_name}
                                className="w-20 h-20 object-cover rounded"
                            />

                            <div>
                                <h3 className="font-bold text-lg leading-5">{item.product_name}</h3>

                                <p className="text-sm text-gray-700 mt-2">
                                    Màu: {item.color} | Size: {item.size}
                                </p>

                                <p className="text-sm text-black font-semibold mt-1">
                                    x{item.quantity}
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="font-bold text-lg whitespace-nowrap">
                            {Math.round(item.price).toLocaleString("vi-VN")}đ
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-gray-200 flex items-end justify-between">
                {/* Total price */}
                <div>
                    <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">Tổng cộng</p>

                    <h3 className="text-2xl text-orange-500 font-bold mt-1 tracking-tight">
                        {Math.round(order.total_price).toLocaleString("vi-VN")}đ
                    </h3>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="h-10 px-6 border border-black text-xs font-bold uppercase rounded-sm hover:bg-black hover:text-white transition"
                    >
                        Chi tiết
                    </button>

                    {(order.status === "PENDING" || order.status === "PROCESSING") && (
                        <button
                            className=" h-10 px-6 border border-red-500 text-red-500 text-xs font-bold uppercase rounded-sm hover:bg-red-500 hover:text-white transition"
                        >
                            Hủy đơn hàng
                        </button>
                    )}

                    {order.status === "COMPLETED" && (
                        <>
                            <button
                                className="h-10 px-6 border border-orange-500 text-orange-500 text-xs font-bold uppercase rounded-sm hover:bg-orange-500 hover:text-white transition"
                            >
                                Đánh giá
                            </button>

                            <button
                                className="h-10 px-6 bg-black text-white text-xs font-bold uppercase rounded-sm hover:opacity-60 transition"
                            >
                                Mua lại
                            </button>
                        </>
                    )}

                    {order.status === "CANCELLED" && (
                        <button
                            className="h-10 px-6 bg-black text-white text-xs font-bold uppercase rounded-sm hover:opacity-90 transition"
                        >
                            Mua lại
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OrderCard;