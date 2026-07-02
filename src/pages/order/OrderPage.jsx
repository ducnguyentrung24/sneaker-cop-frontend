import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import OrderCard from "../../components/order/OrderCard";
import Pagination from "../../components/common/Pagination";

import { getMyOrders, cancelOrder } from "../../services/order.service";

import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function OrderPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("");

    const [keyword, setKeyword] = useState("");

    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelLoading, setCancelLoading] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const tabs = [
        { key: "", label: "Tất cả" },
        { key: "PENDING", label: "Chờ xử lý" },
        { key: "PROCESSING", label: "Đang xử lý" },
        { key: "SHIPPING", label: "Đang giao hàng" },
        { key: "COMPLETED", label: "Hoàn thành" },
        { key: "CANCELLED", label: "Đã hủy" },
    ];

    // Reset page to 1 when changing tab
    useEffect(() => {
        setPage(1);
    }, [activeTab, keyword]);

    useEffect(() => {
        fetchOrders();
    }, [activeTab, page, keyword]);


    const fetchOrders = async () => {
        try {
            setLoading(true);

            const res = await getMyOrders({
                status: activeTab || undefined,
                keyword,
                page,
                limit: 10,
            });

            setOrders(res.data.data);

            const paginationData = res.data.pagination;
            setPagination({
                ...paginationData,
                total_pages: paginationData.totalPages,
                hasPrev: paginationData.page > 1,
                hasNext: paginationData.page < paginationData.totalPages,
            });
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setShowCancelModal(true);
        setCancelReason("");
    };

    const handleConfirmCancelOrder = async () => {
        if (!cancelReason.trim()) {
            toast.error("Vui lòng nhập lý do hủy đơn hàng.");
            return;
        }

        try {
            setCancelLoading(true);

            await cancelOrder(selectedOrderId, cancelReason);

            setOrders(prev =>
                prev.map(order =>
                    order.id === selectedOrderId
                        ? { ...order, status: "CANCELLED" }
                        : order
                )
            );
            
            toast.success("Hủy đơn hàng thành công!");

            setShowCancelModal(false);
            setCancelReason("");
            setSelectedOrderId(null);
        } catch(error) {
            toast.error(error.response?.data?.message || "Hủy đơn hàng thất bại.");
        } finally {
            setCancelLoading(false);
        }
    };

    const handleBuyAgain = (order) => {
        const checkoutItems = order.items.map(item => ({
            variant_id: item.variant_id,

            product: {
                name: item.product_name,
                thumbnail: item.image,
            },
            variant: {
                color: item.color,
                size: item.size,
            },

            quantity: item.quantity,
            total: Number(item.price) * Number(item.quantity),
        }));

        sessionStorage.setItem(
            "pending_checkout",
            JSON.stringify(checkoutItems)
        );

        navigate("/checkout", {
            state: {
                type: "REORDER",
                items: checkoutItems,
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#F3F3F4] pt-10 pb-12 px-4 sm:px-6 py-8 sm:py-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 sm:mb-10 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight">Đơn hàng của tôi</h1>
                    <p className="text-gray-500 mt-2">Theo dõi trạng thái đơn hàng của bạn</p>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <input 
                        type="text"
                        placeholder="Tìm kiếm theo mã đơn hàng..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full h-12 bg-white border border-gray-300 rounded-xl pl-12 pr-4 text-sm outline-none focus:border-black transition"
                    />

                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 pb-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition
                                ${activeTab === tab.key
                                    ? "bg-black text-white"
                                    : "bg-white text-black hover:bg-gray-100"
                                }   
                        `}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-white rounded-2xl p-8 sm:p-10 text-center shadow-sm">Đang tải đơn hàng</div>
                )}

                {/* Empty */}
                {!loading && orders.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 sm:p-14 text-center shadow-sm">
                        <h2 className="text-lg sm:text-lg font-bold">Không có đơn hàng nào</h2>
                        <p className="text-sm text-gray-500 mt-2">Đơn hàng của ban sẽ hiển thị tại đây</p>
                    </div>
                )}

                {/* List */}
                <div className="space-y-4 sm:space-y-6">
                    {!loading && orders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order}
                            onCancel={handleOpenCancelModal}
                            onBuyAgain={handleBuyAgain}
                        />
                    ))}
                </div>

                {/* Pagination */}
                {!loading && orders.length > 0 && (
                    <Pagination
                        pagination={pagination}
                        onPageChange={setPage}
                    />    
                )}
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
                                disabled={cancelLoading}
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason("");
                                }}
                                className="flex-1 h-11 px-5 rounded-lg border border-gray-500 text-sm font-bold hover:bg-gray-100 disabled:opacity-60 transition"
                            >
                                Đóng
                            </button>

                            <button
                                disabled={cancelLoading}
                                onClick={handleConfirmCancelOrder}
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

export default OrderPage;