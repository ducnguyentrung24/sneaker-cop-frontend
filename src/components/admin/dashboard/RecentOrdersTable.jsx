import { useNavigate } from "react-router-dom";

function RecentOrdersTable({ orders = [] }) {
    const navigate = useNavigate();

    const paymentStatusMap = {
        PAID: {
            label: "Đã thanh toán",
            class: "bg-green-50 text-green-600",
        },
        UNPAID: {
            label: "Chưa thanh toán",
            class: "bg-orange-50 text-orange-600",
        },
        FAILED: {
            label: "Thất bại",
            class: "bg-red-50 text-red-600",
        },
    };

    const orderStatusMap = {
        PENDING: {
            label: "Chờ xử lý",
            class: "bg-orange-50 text-orange-600",
        },
        PROCESSING: {
            label: "Đang xử lý",
            class: "bg-blue-50 text-blue-600",
        },
        SHIPPING: {
            label: "Đang giao hàng",
            class: "bg-purple-50 text-purple-600",
        },
        COMPLETED: {
            label: "Hoàn thành",
            class: "bg-green-50 text-green-600",
        },
        CANCELLED: {
            label: "Đã hủy",
            class: "bg-red-50 text-red-600",
        },
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-bold">Đơn hàng gần đây</h2>
                    <p className="text-xs text-gray-500 mt-1">Quản lý các đơn hàng mới nhất trên hệ thống</p>
                </div>

                <button
                    onClick={() => navigate("/admin/orders")}
                    className="text-xs font-bold hover:text-orange-500 shrink-0"
                >
                    Xem tất cả
                </button>
            </div>

            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block">
                <table className="w-full min-w-260 text-sm">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="text-left px-6 py-4">Mã đơn hàng</th>
                            <th className="text-left px-6 py-4">Khách hàng</th>
                            <th className="text-left px-6 py-4">Ngày đặt</th>
                            <th className="text-left px-6 py-4">Tổng tiền</th>
                            <th className="text-left px-6 py-4">Thanh toán</th>
                            <th className="text-left px-6 py-4">Trạng thái</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                    const payment = paymentStatusMap[order.payment_status] || {
                                    label: order.payment_status || "N/A",
                                    className: "bg-gray-50 text-gray-500",
                                };

                                const status = orderStatusMap[order.status] || {
                                    label: order.status || "N/A",
                                    className: "bg-gray-50 text-gray-500",
                                };

                                return (
                                    <tr
                                        key={order.id}
                                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 font-bold">#{order.order_code}</td>
                                        <td className="px-6 py-4 font-semibold">{order.receiver_name}</td>
                                        <td className="px-6 py-4 text-gray-500 font-semibold">
                                            {order.order_date ? new Date(order.order_date).toLocaleDateString("vi-VN") : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 font-bold">
                                            {Math.round(order.total_price || 0).toLocaleString("vi-VN")}đ
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${payment.class}`}>
                                                {payment.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${status.class}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-10 text-center text-gray-400"
                                >
                                    Chưa có đơn hàng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;