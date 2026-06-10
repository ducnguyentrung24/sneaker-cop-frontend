import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

function RecentOrdersTable({
    orders = [],
    formatCurrency,
}) {
    const orderStatusMap = {
        PENDING: {
            label: "Chờ xử lý",
            className: "bg-yellow-50 text-yellow-600",
        },
        PROCESSING: {
            label: "Đang xử lý",
            className: "bg-blue-50 text-blue-600",
        },
        CONFIRMED: {
            label: "Đã xác nhận",
            className: "bg-blue-50 text-blue-600",
        },
        SHIPPING: {
            label: "Đang giao",
            className: "bg-indigo-50 text-indigo-600",
        },
        DELIVERED: {
            label: "Đã giao",
            className: "bg-green-50 text-green-600",
        },
        COMPLETED: {
            label: "Hoàn thành",
            className: "bg-green-50 text-green-600",
        },
        CANCELLED: {
            label: "Đã hủy",
            className: "bg-red-50 text-red-600",
        },
        CANCELED: {
            label: "Đã hủy",
            className: "bg-red-50 text-red-600",
        },
    };

    const paymentStatusMap = {
        PAID: {
            label: "Đã thanh toán",
            className: "bg-green-50 text-green-600",
        },
        UNPAID: {
            label: "Chưa thanh toán",
            className: "bg-yellow-50 text-yellow-600",
        },
        PENDING: {
            label: "Chờ thanh toán",
            className: "bg-blue-50 text-blue-600",
        },
        FAILED: {
            label: "Thanh toán lỗi",
            className: "bg-red-50 text-red-600",
        },
    };

    const getOrderStatusInfo = (status) => {
        const key = String(status || "").toUpperCase();

        return orderStatusMap[key] || {
            label: status || "N/A",
            className: "bg-gray-100 text-gray-500",
        };
    };

    const getPaymentStatusInfo = (status) => {
        const key = String(status || "").toUpperCase();

        return paymentStatusMap[key] || {
            label: status || "N/A",
            className: "bg-gray-100 text-gray-500",
        };
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-245 text-sm">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="text-left px-5 py-4 w-16">STT</th>
                            <th className="text-left px-5 py-4 w-44">Mã đơn</th>
                            <th className="text-left px-5 py-4">Khách hàng</th>
                            <th className="text-left px-5 py-4 w-40">Tổng tiền</th>
                            <th className="text-left px-5 py-4 w-36">Trạng thái</th>
                            <th className="text-left px-5 py-4 w-40">Thanh toán</th>
                            <th className="text-left px-5 py-4 w-32">PTTT</th>
                            <th className="text-left px-5 py-4 w-44">Ngày tạo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order, index) => {
                                const orderStatusInfo = getOrderStatusInfo(order.status);
                                const paymentStatusInfo = getPaymentStatusInfo(order.payment_status);

                                return (
                                    <tr
                                        key={order.order_id || index}
                                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-5 py-4 font-black text-gray-400">{index + 1}</td>
                                        <td className="px-5 py-4 font-bold whitespace-nowrap">{order.order_code || "#N/A"}</td>

                                        <td className="px-5 py-4">
                                            <p className="font-semibold line-clamp-1">
                                                {order.receiver_name || "N/A"}
                                            </p>

                                            {order.phone && (
                                                <p className="text-xs text-gray-400 mt-1">{order.phone}</p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 font-bold text-orange-500 whitespace-nowrap">
                                            {formatCurrency(order.final_price)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${orderStatusInfo.className}`}>
                                                {orderStatusInfo.label}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${paymentStatusInfo.className}`}>
                                                {paymentStatusInfo.label}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[11px] font-bold whitespace-nowrap">
                                                {order.payment_method || "N/A"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-gray-500 font-semibold whitespace-nowrap">
                                            {new Date(order.created_at).toLocaleString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            }
                                            ) || "N/A"}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                                    Chưa có đơn hàng gần đây
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentOrdersTable;