import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllOrders,
    getAdminOrderDetail,
    updateOrderStatus,
} from "../../services/order.service";

import Pagination from "../../components/common/Pagination";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faRotateRight,
    faEye,
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

function AdminOrders() {
    const navigate = useNavigate();

    const defaultFilters = {
        limit: 10,
        status: "PENDING",
        keyword: "",
        from_date: "",
        to_date: "",
        sort: "updated_at:desc",
    };

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState(defaultFilters);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelOrderId, setCancelOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [page, filters.status]);

    const fetchOrders = async (currentFilters = filters, currentPage = page) => {
        try {
            setLoading(true);

            const res = await getAllOrders({
                ...currentFilters,
                page: currentPage,
            });

            setOrders(res.data?.data || []);

            setPagination({
                ...res.data?.pagination,
                total_pages: res.data?.pagination?.totalPages || 1,
            });
        } catch(error) {
            console.error("Fetch orders error: ", error);
            console.error("Response error data: ", error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchOrders(filters, 1);
    };

    const handleReset = () => {
        setPage(1);
        setFilters(defaultFilters);
        fetchOrders(defaultFilters, 1);
    };

    const handleStatusChange = async (orderId, newStatus, currentStatus) => {
        if (newStatus === currentStatus) return;
        if (newStatus === "CANCELLED") {
            setCancelOrderId(orderId);
            setCancelReason("");
            setShowCancelModal(true);
            return;
        }

        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success("Cập nhật trạng thái đơn hàng thành công!");

            fetchOrders();
        } catch(error) {
            console.error("Update order status error: ", error);
            toast.error("Cập nhật trạng thái đơn hàng thất bại!");
        }
    };

    const handleConfirmCancel = async () => {
        if (!cancelReason.trim()) {
            toast.error("Vui lòng nhập lý do hủy đơn hàng");
            return;
        }

        try {
            await updateOrderStatus(
                cancelOrderId,
                "CANCELLED",
                cancelReason.trim()
            );

            setShowCancelModal(false);
            setCancelReason("");
            setCancelOrderId(null);
            toast.success("Hủy đơn hàng thành công!");

            fetchOrders();
        } catch(error) {
            console.error("Cancel order error: ", error);
            toast.error("Hủy đơn hàng thất bại!");
        }
    };

    const statusTabs = [
        { key: "", label: "Tất cả" },
        { key: "PENDING", label: "Chờ xử lý" },
        { key: "PROCESSING", label: "Đang xử lý" },
        { key: "SHIPPING", label: "Đang giao hàng" },
        { key: "COMPLETED", label: "Hoàn thành" },
        { key: "CANCELLED", label: "Đã hủy" },
    ];

    const paymentStatusMap = {
        PAID: {
            label: "Đã thanh toán",
            className: "bg-green-50 text-green-600",   
        },
        UNPAID: {
            label: "Chưa thanh toán",
            className: "bg-orange-50 text-orange-600",
        },
        FAILED: {
            label: "Thanh toán thất bại",
            className: "bg-red-50 text-red-600",
        },
    };

    const orderStatusMap = {
        PENDING: {
            label: "Chờ xử lý",
            className: "bg-orange-50 text-orange-600",
        },
        PROCESSING: {
            label: "Đang xử lý",
            className: "bg-blue-50 text-blue-600",
        },
        SHIPPING: {
            label: "Đang giao hàng",
            className: "bg-purple-50 text-purple-600",
        },
        COMPLETED: {
            label: "Hoàn thành",
            className: "bg-green-50 text-green-600",
        },
        CANCELLED: {
            label: "Đã hủy",
            className: "bg-red-50 text-red-600",
        },
    };

    const orderFlow = {
        PENDING: ["PROCESSING", "CANCELLED"],
        PROCESSING: ["SHIPPING", "CANCELLED"],
        SHIPPING: ["COMPLETED"],
        COMPLETED: [],
        CANCELLED: [],
    };

    const getStatusOptions = (currentStatus) => {
        const nextStatuses = orderFlow[currentStatus] || [];

        return [currentStatus, ...nextStatuses].map((status) => ({
            value: status,
            label: orderStatusMap[status]?.label || status,
        }));
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Quản lý đơn hàng</h1>
                <p className="text-sm text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng của khách hàng</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow mb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    <div className="xl:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Tìm kiếm</label>

                        <div className="mt-2 relative">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                            <input
                                value={filters.keyword}
                                onChange={(e) => 
                                    setFilters((prev) => ({
                                        ...prev,
                                        keyword: e.target.value,
                                    }))
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSearch();
                                }}
                                placeholder="Tìm kiếm mã đơn, khách hàng..."
                                className="w-full h-11 rounded-lg border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Từ ngày</label>

                        <input 
                            type="date"
                            value={filters.from_date}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    from_date: e.target.value,
                                }))
                            }
                            className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-500"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Đến ngày</label>

                        <input 
                            type="date"
                            value={filters.to_date}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    to_date: e.target.value,
                                }))
                            }
                            className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-500"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            onClick={handleSearch}
                            className="flex-1 h-11 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition"
                        >
                            Tra cứu
                        </button>

                        <button
                            onClick={handleReset}
                            className="h-11 px-4 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition"
                        >
                            <FontAwesomeIcon icon={faRotateRight} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2 mb-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setPage(1);
                            setFilters((prev) => ({
                                ...prev,
                                status: tab.key,
                            }));
                        }}
                        className={`shrink-0 px-5 py-3 rounded-xl text-xs font-bold transition
                            ${filters.status === tab.key
                                ? "bg-black text-white"
                                : "bg-white text-gray-500 hover:bg-gray-100"
                            }
                    `}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block">
                    <table className="w-full min-w-240 text-sm">
                        <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="text-left px-6 py-4">Mã đơn</th>
                                <th className="text-left px-6 py-4">Khách hàng</th>
                                <th className="text-left px-6 py-4">Ngày đặt</th>
                                <th className="text-left px-6 py-3">Ngày cập nhật</th>
                                <th className="text-left px-6 py-4">Thanh toán</th>
                                <th className="text-left px-6 py-4">Tổng tiền</th>
                                <th className="text-left px-6 py-4">Trạng thái</th>
                                <th className="text-left px-6 py-4">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        Đang tải đơn hàng
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => {
                                    const payment = paymentStatusMap[order.payment_status] || {
                                        label: order.payment_status || "N/A",
                                        className: "bg-gray-50 text-gray-500",
                                    };

                                    const status = orderStatusMap[order.status] || {
                                        label: order.status || "N/A",
                                        className: "bg-gray-50 text-gray-500",
                                    };

                                    const isFinalStatus = order.status === "COMPLETED" || order.status === "CANCELLED";

                                    return (
                                        <tr
                                            key={order.id}
                                            className="border-t border-gray-100 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 font-bold">{order.order_code}</td>
                                            <td className="px-6 py-4 font-semibold">{order.receiver_name}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(order.order_created_at).toLocaleDateString("vi-VN") || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(order.order_updated_at).toLocaleDateString("vi-VN") || "N/A"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${payment.className}`}>
                                                    {payment.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                {Math.round(Number(order.total_price)).toLocaleString("vi-VN") + "đ"}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isFinalStatus ? (
                                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                ) : (
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value, order.status)}
                                                        className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap outline-none cursor-pointer ${status.className}`}
                                                    >
                                                        {getStatusOptions(order.status).map((item) => (
                                                            <option
                                                                key={item.value}
                                                                value={item.value}
                                                                disabled={item.disabled}
                                                            >
                                                                {item.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                    className="w-9 h-9 rounded-lg text-green-500 hover:bg-green-50 transition"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-gray-400"
                                    >
                                        Không có đơn hàng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                pagination={pagination}
                onPageChange={setPage}
            />

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <h2 className="text-lg text-center font-bold uppercase mb-2">Hủy đơn hàng</h2>
                        <p className="text-sm text-center text-gray-500 mb-5">
                            Vui lòng nhập lý do hủy đơn hàng. Lý do này sẽ được lưu vào lịch sử trạng thái.
                        </p>

                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-400 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500 resize-none"
                        />

                        <div className="flex items-center justify-between gap-3 mt-6">
                            <button
                                disabled={loading}
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason("");
                                    setCancelOrderId(null);
                                }}
                                className="flex-1 h-11 px-5 rounded-lg border border-gray-500 text-sm font-bold hover:bg-gray-100 disabled:opacity-60 transition"
                            >
                                Đóng
                            </button>

                            <button
                                disabled={loading}
                                onClick={handleConfirmCancel}
                                className="flex-1 h-11 px-5 rounded-lg bg-red-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition"
                            >
                                Xác nhận hủy
                            </button>        
                        </div>
                    </div>
                </div>    
            )}
        </div>
    );
};

export default AdminOrders;