import { useState, useEffect } from "react";

import {
    getDashboardSummary,
    getRevenueStatistics,
    getTopProducts,
    getCategoryStatistics,
    getBrandStatistics,
} from "../../services/dashboard.service";

import { getAllOrders } from "../../services/order.service";

import StatsCard from "../../components/admin/dashboard/StatsCard";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import TopProductCard from "../../components/admin/dashboard/TopProductsCard";
import DistributionCard from "../../components/admin/dashboard/DistributionCard";
import RecentOrdersTable from "../../components/admin/dashboard/RecentOrdersTable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBillWave,
    faCartShopping,
    faBox,
    faClock,
    faUser,
    faTriangleExclamation,
    faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("today");

    const [summary, setSummary] = useState({
        current_period: null,
        total_revenue: 0,
        total_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        cancel_rate: 0,
        average_order_value: 0,
        new_customers: 0,

        overview: {
            total_users: 0,
            total_products: 0,
            pending_orders: 0,
            low_stock_count: 0,
        },
    });

    const [revenueStats, setRevenueStats] = useState([]);
    const [topProducts, setTopProducts] = useState([]);

    const [categoryStats, setCategoryStats] = useState({
        total_categories: 0,
        total_products: 0,
        categories: [],
    });
    const [brandStats, setBrandStats] = useState({
        total_brands: 0,
        total_products: 0,
        brands: [],
    });

    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        fetchDashboard();
    }, [period]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const [
                summaryRes,
                revenueRes,
                topProductsRes,
                categoryRes,
                brandRes,
                ordersRes,
            ] = await Promise.all([
                getDashboardSummary({ period }),
                getRevenueStatistics(),
                getTopProducts({ limit: 5, period }),
                getCategoryStatistics(),
                getBrandStatistics(),
                getAllOrders({
                    page: 1,
                    limit: 5,
                    sort: "created_at:desc",
                }),
            ]);

            setSummary(summaryRes.data || {});

            setRevenueStats(
                Array.isArray(revenueRes?.data?.data)
                    ? revenueRes.data.data
                    : []
            );

            setTopProducts(
                Array.isArray(topProductsRes?.data?.data)
                    ? topProductsRes.data.data
                    : []
            );

            setCategoryStats(categoryRes.data || {
                total_categories: 0,
                total_products: 0,
                categories: [],
            });
            setBrandStats(brandRes.data || {
                total_brands: 0,
                total_products: 0,
                brands: [],
            });
            
            setRecentOrders(ordersRes.data?.data || []);
        } catch(error) {
            console.error("Failed to fetch dashboard data:", error);
            console.error("Error response:", error.response?.data);

            toast.error("Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return Math.round(Number(value || 0)).toLocaleString("vi-VN") + "đ";
    };

    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString("vi-VN");
    };

    const stats = [
        {
            title: "Tổng doanh thu",
            value: formatCurrency(summary.total_revenue),
            icon: faMoneyBillWave,
            color: "text-green-500 bg-green-50",
        },
        {
            title: "Tổng đơn hàng",
            value: formatNumber(summary.total_orders),
            icon: faCartShopping,
            color: "text-orange-500 bg-orange-50",
        },
        {
            title: "Đơn hàng hoàn thành",
            value: formatNumber(summary.completed_orders),
            icon: faCircleCheck,
            color: "text-green-500 bg-green-50",
        },
        {
            title: "Tổng sản phẩm",
            value: formatNumber(summary.overview?.total_products),
            icon: faBox,
            color: "text-blue-500 bg-blue-50",
        },
        {
            title: "Sản phẩm sắp hết",
            value: formatNumber(summary.overview?.low_stock_count),
            icon: faTriangleExclamation,
            color: "text-red-500 bg-red-50",
        },
        {
            title: "Đơn chờ xử lý",
            value: formatNumber(summary.overview?.pending_orders),
            icon: faClock,
            color: "text-yellow-500 bg-yellow-50",
        },
        {
            title: "Tổng người dùng",
            value: formatNumber(summary.overview?.total_users),
            icon: faUser,
            color: "text-purple-500 bg-purple-50",
        },
    ];

    if (loading) {
        return (
            <div className="min-h-100 flex items-center justify-center text-gray-400">
                Đang tải dữ liệu dashboard...
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black">Tổng quan</h1>
                    <p className="text-sm text-gray-500 mt-1">Thống kê nhanh các chỉ số chính của cửa hàng</p>
                </div>

                <div className="flex bg-white border border-gray-200 round-xl p-1 shadow-sm w-fit">
                    <button
                        onClick={() => setPeriod("today")}
                        className={`h-10 px-5 rounded-lg text-sm font-bold transition
                            ${period === "today"
                                ? "bg-black text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }
                        `}
                    >
                        Hôm nay
                    </button>

                    <button
                        onClick={() => setPeriod("week")}
                        className={`h-10 px-5 rounded-lg text-sm font-bold transition
                            ${period === "week"
                                ? "bg-black text-white"
                                : "text-gray-500 hover:bg-gray-100"
                            }
                        `}
                    >
                        Tuần này
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCard stats={stats} />

            {/* Revenue chart + top products */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <RevenueChart revenueStats={revenueStats} />

                <TopProductCard topProducts={topProducts} />
            </div>

            {/* Category + Brand */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <DistributionCard
                    title="Phân bố theo danh mục"
                    description="Tỉ lệ sản phẩm theo danh mục"
                    data={categoryStats.categories || []}
                    emptyText="Chưa có danh mục nào"
                    idKey="category_id"
                    centerValue={categoryStats?.total_categories || 0}
                    centerLabel="Danh mục"
                />

                <DistributionCard
                    title="Phân bố theo thương hiệu"
                    description="Tỉ lệ sản phẩm theo thương hiệu"
                    data={brandStats.brands || []}
                    emptyText="Chưa có thương hiệu nào"
                    idKey="brand_id"
                    centerValue={brandStats?.total_brands || 0}
                    centerLabel="Thương hiệu"
                />
            </div>

            {/* Recent orders */}
            <RecentOrdersTable orders={recentOrders} />
        </div>
    );
};

export default AdminDashboard;