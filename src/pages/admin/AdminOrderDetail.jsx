import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { 
    getAdminOrderDetail,
    updateOrderStatus, 
} from "../../services/order.service";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faArrowLeft,
    faLocationDot,
    faCreditCard,
    faClock,
    faBox,
    faTruck,
    faCircleCheck,
    faXmark,
    faUser,
    faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

function AdminOrderDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        fetchAdminOrderDetail();
    }, [id]);

    const fetchAdminOrderDetail = async () => {
        try {
            setLoading(true);

            const res = await getAdminOrderDetail(id);
            setOrder(res.data);
        } catch(error) {
            console.error("Fetch order detail error: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            toast.error("Vui lòng nhập lý do hủy đơn hàng.");
            return;
        }

        try {
            setUpdating(true);
            
            await updateOrderStatus(
                order.id, 
                "CANCELLED", 
                cancelReason.trim()
            );

            await fetchAdminOrderDetail();

            setShowCancelModal(false);
            setCancelReason("");

            toast.success("Đã hủy đơn hàng.");
        } catch (error) {
            console.error(error.response?.data?.message || "Hủy đơn hàng thất bại");
            toast.error("Hủy đơn hàng thất bại.");
        } finally {
            setUpdating(false);
        }
    };

    const handleNextStatus = async () => {
        const nextStatusMap = {
            PENDING: "PROCESSING",
            PROCESSING: "SHIPPING",
            SHIPPING: "COMPLETED",
        };

        const nextStatus = nextStatusMap[order.status];
        if (!nextStatus) return;

        try {
            setUpdating(true);

            await updateOrderStatus(order.id, nextStatus);
            await fetchAdminOrderDetail();
            toast.success("Chuyển trạng thái thành công.");
        } catch (error) {
            console.error(error.response?.data?.message || "Chuyển trạng thái thất bại");
            toast.error("Chuyển trạng thái thất bại. Vui lòng thử lại.");
        } finally {
            setUpdating(false);
        }
    };

    const statusSteps = [
        { key: "PENDING", label: "Chờ xử lý", icon: faClock },
        { key: "PROCESSING", label: "Đang xử lý", icon: faBox },
        { key: "SHIPPING", label: "Đang giao hàng", icon: faTruck },
        { key: "COMPLETED", label: "Hoàn thành", icon: faCircleCheck },
        { key: "CANCELLED", label: "Đã hủy", icon: faXmark },
    ];

    const statusIndex = statusSteps.findIndex(
        (step) => step.key === order?.status
    );

    const statusMap = {
        PENDING: {
            label: "CHỜ XỬ LÝ",
            className: "bg-orange-100 text-orange-500",
        },
        PROCESSING: {
            label: "ĐANG XỬ LÝ",
            className: "bg-blue-100 text-blue-500",
        },
        SHIPPING: {
            label: "ĐANG GIAO HÀNG",
            className: "bg-purple-100 text-purple-500",
        },
        COMPLETED: {
            label: "HOÀN THÀNH",
            className: "bg-green-100 text-green-500",
        },
        CANCELLED: {
            label: "ĐÃ HỦY",
            className: "bg-red-100 text-red-500",
        },
    };

    const paymentStatusMap = {
        PAID: {
            label: "Đã thanh toán",
            className: "bg-green-100 text-green-500",
        },
        UNPAID: {
            label: "Chưa thanh toán",
            className: "bg-orange-100 text-orange-500",
        },
        FAILED: {
            label: "Thanh toán thất bại",
            className: "bg-red-100 text-red-500",
        },
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                Đang tải chi tiết đơn hàng...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-24 flex justify-center">
                Không tìm thấy đơn hàng.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] px-4 sm:px-6 py-8 sm:py-2">
            <div className="max-w-5xl mx-auto">
                {/* Back */}
                <button
                    onClick={() => navigate("/admin/orders")}
                    className="flex items-center gap-2 text-sm font-semibold mb-6 sm:mb-8"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Quay lại
                </button>

                {/* Header */}
                <div className="flex items-start justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight leading-snug">Chi tiết đơn hàng</h1>

                        <p className="text-md sm:text-lg font-bold uppercase tracking-tight leading-snug break-all">
                            {order.order_code}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <p className="text-sm sm:text-base whitespace-nowrap">
                            Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN")}
                        </p>

                        <div className={`w-fit px-3 py-1 rounded-full text-xs font-bold
                            ${statusMap[order.status]?.className}
                        `}>
                            {statusMap[order.status]?.label}
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="mb-10 sm:mb-14 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="relative min-w-180 flex items-start justify-between gap-2">
                        <div className="absolute top-4 sm:top-5 left-8 sm:left-[10%] right-8 sm:right-[10%] h-1 bg-gray-300 z-0" />

                        {statusSteps.map((step, index) => {
                            const log = (order.status_logs).find(
                                item => item.to_status === step.key
                            );

                            const time = step.key === "PENDING" ? order.created_at : log?.created_at;

                            const changed_by = log?.changed_by_user?.full_name;

                            const active = order.status === "CANCELLED"
                                ? step.key === "CANCELLED"
                                : index <= statusIndex && step.key !== "CANCELLED";

                            return (
                                <div
                                    key={step.key}
                                    className="relative z-10 flex flex-col items-center flex-none sm:flex-1 w-22 sm:w-auto"
                                >
                                    <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center border-2
                                        ${active 
                                                ? "bg-orange-500 border-orange-500 text-white"
                                                : "bg-white border-gray-300 text-gray-400"
                                        }    
                                    `}>
                                        <FontAwesomeIcon icon={step.icon} />
                                    </div>

                                    <p className={`mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium uppercase text-center
                                        ${active ? "text-orange-500" : "text-gray-400"}
                                    `}>
                                        {step.label}
                                    </p>

                                    {time ? (
                                        <p className="text-[12px] sm:text-xs text-center mt-1 min-h-8 text-gray-600 leading-relaxed">
                                            {new Date(time).toLocaleString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "2-digit",
                                            })};

                                            {changed_by && (
                                                <>
                                                    <br />
                                                    <span className="text-gray-500 text-[12px]">{changed_by}</span>
                                                </>
                                            )}
                                        </p>
                                    ) : (
                                        <>
                                            &nbsp;
                                            <br />
                                            &nbsp;
                                        </>
                                    )
                                }
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
                    {/* Customer */}
                    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <FontAwesomeIcon icon={faUser} />
                            <h2 className="font-bold uppercase text-sm sm:text-base">Thông tin người đặt</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Họ và tên</p>
                                <p className="font-semibold">{order.user?.full_name}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-1">Số điện thoại</p>
                                <p className="font-semibold">{order.user?.phone || "N/A"}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-1">Email</p>
                                <p className="font-semibold">{order.user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Receiver */}
                    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <FontAwesomeIcon icon={faLocationDot} />
                            <h2 className="font-bold uppercase text-sm sm:text-base">Thông tin người nhận</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">Họ và tên</p>
                                <p className="font-semibold">{order.receiver_name}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">Số điện thoại</p>
                                <p className="font-semibold">{order.phone}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">Địa chỉ giao hàng</p>
                                <p className="font-semibold">{order.full_address}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <FontAwesomeIcon icon={faCreditCard} />
                            <h2 className="font-bold uppercase text-sm sm:text-base">Thanh toán</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">Phương thức thanh toán</p>
                                <p className="font-semibold">{order.payment_method}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase mb-1">Trạng thái</p>
                                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold
                                    ${order.payment_status === "PAID"
                                        ? "bg-green-100 text-green-500"
                                        : "bg-orange-100 text-orange-500"
                                    }
                                `}>
                                    {order.payment_status === "PAID" ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="my-10 sm:my-14">
                    <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold uppercase">
                            Danh sách sản phẩm ({order.items.length})
                        </h2>

                        <p className="text-sm sm:text-md text-gray-500 whitespace-nowrap">
                            {order.items.length} sản phẩm
                        </p>
                    </div>

                    <div className="space-y-3 max-h-100 overflow-y-auto pr-0 sm:pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block">
                        {order.items.map(item => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl px-3 sm:px-5 py-4 flex items-start sm:items-center justify-between gap-3 sm:gap-5 shadow-sm border border-gray-100"
                            >
                                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.product_name}
                                        className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover border border-gray-200 shrink-0"
                                    />

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-sm sm:text-base line-clamp-2 leading-5">{item.product_name}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                                Màu: {item.color}
                                            </span>

                                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                                Size: {item.size}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between shrink-0 min-w-12 sm:min-w-20">
                                    <p className="font-semibold text-sm sm:text-base mt-1">x{item.quantity}</p>
                                </div>

                                <div className="text-md sm:text-lg font-bold text-orange-500 whitespace-nowrap shrink-0 text-right">
                                    {Math.round(item.price).toLocaleString("vi-VN")}đ
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Note + Total + Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* Note */}
                    <div className="space-y-4 mb-10">
                        {/* Customer note */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-10">
                            <h2 className="text-sm font-bold uppercase text-yellow-600">Ghi chú từ khách hàng</h2>
                        
                            <p className="text-sm text-yellow-700 font-medium mt-1">
                                {order.note || "Không có ghi chú nào từ khách hàng."}
                            </p>
                        </div>

                        {/* Cancel reason */}
                        {order.status === "CANCELLED" && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                                <h2 className="text-sm font-bold uppercase text-red-600">Lý do hủy đơn hàng</h2>
                                <p className="text-sm text-red-700 font-medium mt-1">
                                    {(order.status_logs).find(log => log.to_status === "CANCELLED")?.note || "Không có lý do hủy đơn hàng."}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Total + Actions */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-md">
                            {/* Total */}
                            <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
                                <div className="space-y-4 border-b border-gray-300 pb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 uppercase text-sm">Tạm tính</span>
                                        <span className="font-bold">
                                            {Math.round(order.total_price).toLocaleString("vi-VN")}đ
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 uppercase text-sm">Phí vận chuyển</span>
                                        <span className="font-bold text-orange-500 uppercase">Miễn phí</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-start mt-6">
                                    <div>
                                        <p className="text-sm uppercase">Tổng cộng</p>
                                        <p className="text-xs text-gray-400 mt-2 uppercase">Giá đã bao gồm VAT</p>
                                    </div>
                                        
                                    <div className="text-2xl sm:text-3xl font-bold text-orange-500">
                                        {Math.round(order.final_price).toLocaleString("vi-VN")}đ
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {(order.status !== "COMPLETED" && order.status !== "CANCELLED") && (
                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <button
                                        disabled={updating}
                                        onClick={() => setShowCancelModal(true)}
                                        className="w-full sm:flex-1 h-12 border border-red-500 text-red-500 text-sm font-bold uppercase rounded-md hover:bg-red-500 hover:text-white disabled:opacity-60 transition"
                                    >
                                        Hủy đơn hàng
                                    </button>

                                    <button
                                        disabled={updating}
                                        onClick={handleNextStatus}
                                        className="w-full sm:flex-1 h-12 bg-orange-500 text-white text-sm font-bold uppercase rounded-md hover:opacity-90 disabled:opacity-60 transition"
                                    >
                                        <FontAwesomeIcon icon={faArrowTrendUp} className="mr-2" />
                                        Chuyển trạng thái
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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
                                disabled={updating}
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason("");
                                }}
                                className="flex-1 h-11 px-5 rounded-lg border border-gray-500 text-sm font-bold hover:bg-gray-100 disabled:opacity-60 transition"
                            >
                                Đóng
                            </button>

                            <button
                                disabled={updating}
                                onClick={handleCancelOrder}
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

export default AdminOrderDetail;