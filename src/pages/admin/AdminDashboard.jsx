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
} from "@fortawesome/free-solid-svg-icons";

function AdminDashboard() {
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState({
        total_revenue: 0,
        total_orders: 0,
        total_products: 0,
        total_users: 0,
        pending_orders: 0,
        low_stock_count: 0,
    });

    const [revenueStats, setRevenueStats] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [brandStats, setBrandStats] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    const [revenueType, setRevenueType] = useState("week");

    useEffect(() => {
        fetchDashboard();
    }, []);

    useEffect(() => {
        fetchRevenueStatistics();
    }, [revenueType]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const [
                summaryRes,
                topProductsRes,
                categoryRes,
                brandRes,
                ordersRes,
            ] = await Promise.all([
                getDashboardSummary(),
                getTopProducts({ limit: 5 }),
                getCategoryStatistics(),
                getBrandStatistics(),
                getAllOrders({
                    page: 1,
                    limit: 5,
                    sort: "created_at:desc",
                }),
            ]);

            setSummary(summaryRes.data || {});
            setTopProducts(topProductsRes.data || []);
            setCategoryStats(categoryRes.data?.categories || []);
            setBrandStats(brandRes.data?.brands || []);
            setRecentOrders(ordersRes.data?.data || []);
        } catch(error) {
            console.error("Failed to fetch dashboard data:", error);
            console.error("Error response:", error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenueStatistics = async () => {
        try {
            const res = await getRevenueStatistics({
                type: revenueType,
            });

            setRevenueStats(res.data || []);
        } catch (error) {
            console.error("Failed to fetch revenue statistics:", error);
            console.error("Error response:", error.response?.data);
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
            title: "Tổng sản phẩm",
            value: formatNumber(summary.total_products),
            icon: faBox,
            color: "text-blue-500 bg-blue-50",
        },
        {
            title: "Sản phẩm sắp hết",
            value: formatNumber(summary.low_stock_count),
            icon: faTriangleExclamation,
            color: "text-red-500 bg-red-50",
        },
        {
            title: "Đơn chờ xử lý",
            value: formatNumber(summary.pending_orders),
            icon: faClock,
            color: "text-yellow-500 bg-yellow-50",
        },
        {
            title: "Tổng người dùng",
            value: formatNumber(summary.total_users),
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
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black">Tổng quan</h1>
                <p className="text-sm text-gray-500 mt-1">Thống kê nhanh các chỉ số chính của cửa hàn</p>
            </div>

            {/* Stats Cards */}
            <StatsCard stats={stats} />

            {/* Revenue chart + top products */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <RevenueChart
                    revenueStats={revenueStats}
                    revenueType={revenueType}
                    setRevenueType={setRevenueType}
                />

                <TopProductCard topProducts={topProducts} />
            </div>

            {/* Category + Brand */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <DistributionCard
                    title="Phân bố theo danh mục"
                    description="Tỉ lệ sản phẩm theo danh mục"
                    data={categoryStats}
                    emptyText="Chưa có danh mục nào"
                    idKey="category_id"
                />

                <DistributionCard
                    title="Phân bố theo thương hiệu"
                    description="Tỉ lệ sản phẩm theo thương hiệu"
                    data={brandStats}
                    emptyText="Chưa có thương hiệu nào"
                    idKey="brand_id"
                />
            </div>

            {/* Recent orders */}
            <RecentOrdersTable orders={recentOrders} />
        </div>
    );
};

export default AdminDashboard;