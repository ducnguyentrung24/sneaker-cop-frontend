import { useState, useEffect } from "react";

import OrderCard from "../../components/order/OrderCard";
import Pagination from "../../components/common/Pagination";

import { getMyOrders, cancelOrder } from "../../services/order.service";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("");

    const [keyword, setKeyword] = useState("");

    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

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

    const handleCancelOrder = async (orderId) => {
        try {
            await cancelOrder(orderId);

            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId
                        ? { ...order, status: "CANCELLED" }
                        : order
                )
            );
            
            toast.success("Hủy đơn hàng thành công!");
        } catch(error) {
            toast.error(
                error.response?.data?.message || "Hủy đơn hàng thất bại!"
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F3F4] pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold uppercase tracking-tight">Đơn hàng của tôi</h1>
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
                <div className="flex flex-wrap gap-3 mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition
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
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm">Đang tải đơn hàng</div>
                )}

                {/* Empty */}
                {!loading && orders.length === 0 && (
                    <div className="bg-white rounded-2xl p-14 text-center shadow-sm">
                        <h2 className="text-xl font-bold">Không có đơn hàng nào</h2>
                        <p className="text-gray-500 mt-2">Đơn hàng của ban sẽ hiển thị tại đây</p>
                    </div>
                )}

                {/* List */}
                <div className="space-y-6">
                    {!loading && orders.map(order => (
                        <OrderCard 
                            key={order.id} 
                            order={order}
                            onCancel={handleCancelOrder}
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
        </div>
    );
};

export default OrderPage;