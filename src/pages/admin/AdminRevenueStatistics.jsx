import { useEffect, useMemo, useState } from "react";

import {
    getStatisticSummary,
    getRevenueChart,
    getTopProducts,
    getRevenueByCategory,
    getLowStockProducts,
    getRecentOrders,
} from "../../services/statistic.service";

import FilterPanel from "../../components/admin/statistics/FilterPanel";
import SummaryCards from "../../components/admin/statistics/SummaryCards";
import RevenueChartCard from "../../components/admin/statistics/RevenueChartCard";
import TopProductsCard from "../../components/admin/statistics/TopProductCard";
import RevenueCategoryCard from "../../components/admin/statistics/RevenueCategoryCard";
import LowStockProductsCard from "../../components/admin/statistics/LowStockProductsCard";
import RecentOrdersTable from "../../components/admin/statistics/RecentOrdersTable";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowTrendUp,
    faChartLine,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

function AdminRevenueStatistics() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const defaultFilters = useMemo(() => ({
        period: "week",
        month: currentMonth,
        year: currentYear,
    }), [currentMonth, currentYear]);

    const [filters, setFilters] = useState(defaultFilters);
    const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

    const [loadingTimed, setLoadingTimed] = useState(false);
    const [loadingDefault, setLoadingDefault] = useState(false);

    const [summaryReport, setSummaryReport] = useState({
        period: "",
        current_period: null,
        previous_period: null,
        summary: {},
        comparison: {},
    });

    const [revenueChart, setRevenueChart] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [revenueCategories, setRevenueCategories] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

    const months = useMemo(() => {
        return Array.from({ length: 12 }, (_, index) => index + 1);
    }, []);

    const years = useMemo(() => {
        return Array.from({ length: 6 }, (_, index) => currentYear - index);
    }, [currentYear]);

    const getQueryParams = () => {
        const params = {
            period: filters.period,
        };

        if (filters.period === "month") {
            params.month = filters.month;
            params.year = filters.year;
        }

        if (filters.period === "year")  params.year = filters.year;

        return params;
    };

    const fetchTimedStatistics = async (filterValues) => {
        try {
            setLoadingTimed(true);

            const params = getQueryParams(filterValues);

            const [
                summaryRes,
                revenueChartRes,
                topProductsRes,
                revenueCategoryRes,
            ] = await Promise.all([
                getStatisticSummary(params),
                getRevenueChart(params),
                getTopProducts({ ...params, limit: 10 }),
                getRevenueByCategory(params),
            ]);

            setSummaryReport(summaryRes.data || []);
            setRevenueChart(revenueChartRes.data.data || []);
            setTopProducts(topProductsRes.data.data || []);
            setRevenueCategories(revenueCategoryRes.data.data || []);
        } catch (error) {
            console.error("Fetch timed statistics failed:", error);
            console.error("Error response:", error.response?.data);
            toast.error("Không thể tải thống kê theo thời gian");
        } finally {
            setLoadingTimed(false);
        }
    };

    const fetchDefaultStatistics = async () => {
        try {
            setLoadingDefault(true);

            const [lowStockRes, recentOrdersRes] = await Promise.all([
                getLowStockProducts({ threshold: 10, limit: 20 }),
                getRecentOrders({ limit: 5 }),
            ]);

            setLowStockProducts(lowStockRes.data.data || []);
            setRecentOrders(recentOrdersRes.data.data || []);
        } catch (error) {
            console.error("Fetch default statistics failed:", error);
            console.error("Error response:", error.response?.data);
            toast.error("Không thể tải thống kê mặc định");
        } finally {
            setLoadingDefault(false);
        }
    };

    useEffect(() => {
        fetchTimedStatistics();
    }, [appliedFilters]);

    useEffect(() => {
        fetchDefaultStatistics();
    }, []);

    const handleSearch = () => {
        setAppliedFilters(filters);
    };

    const handleReset = () => {
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
    };

    const formatCurrency = (value) => {
        return Math.round(Number(value || 0)).toLocaleString("vi-VN") + "đ";
    };

    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString("vi-VN");
    };

    const formatPercent = (value) => {
        return Number(value || 0).toFixed(1).replace(".0", "") + "%";
    };

    const getPeriodText = (filterValues = appliedFilters) => {
        if (filterValues.period === "week") return "Tuần này";
        if (filterValues.period === "month") return `Tháng ${filterValues.month}/${filterValues.year}`;
        return `Năm ${filterValues.year}`;
    };

    const summary = summaryReport?.summary || {};
    const comparison = summaryReport?.comparison || {};

    const currentPeriodText = summaryReport?.current_period
        ? `${summaryReport.current_period.from_date} - ${summaryReport.current_period.to_date}`
        : getPeriodText(appliedFilters);

    const previousPeriodText = summaryReport?.previous_period
        ? `${summaryReport.previous_period.from_date} - ${summaryReport.previous_period.to_date}`
        : "Cùng kỳ trước";

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>

                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black">Thống kê doanh thu</h1>
                                <p className="text-sm text-gray-500 mt-1">Theo dõi doanh thu, đơn hàng, sản phẩm bán chạy và dữ liệu vận hành.</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            Kỳ hiện tại:{" "}
                            <span className="font-bold text-gray-600">{currentPeriodText}</span>
                        </p>
                    </div>

                    <div className="w-fit px-4 py-2 rounded-xl bg-orange-50 text-orange-500 text-xs font-bold">
                        <FontAwesomeIcon icon={faArrowTrendUp} className="mr-2" />
                        {getPeriodText(appliedFilters)}
                    </div>
                </div>
            </div>

            {/* Timed Section */}
            <section className="space-y-5">
                <div>
                    <h2 className="text-lg sm:text-xl font-black">Thống kê theo thời gian</h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Các số liệu doanh thu, đơn hàng, sản phẩm và danh mục thay đổi theo bộ lọc tuần, tháng, năm.
                    </p>
                </div>

                <FilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    months={months}
                    years={years}
                    onSearch={handleSearch}
                    onReset={handleReset}
                />

                {loadingTimed ? (
                    <LoadingCard text="Đang tải thống kê theo thời gian..." />
                ) : (
                    <>
                        <SummaryCards
                            summary={summary}
                            comparison={comparison}
                            periodText={getPeriodText(appliedFilters)}
                            formatCurrency={formatCurrency}
                            formatNumber={formatNumber}
                            formatPercent={formatPercent}
                        />

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                            <RevenueChartCard
                                data={revenueChart}
                                formatCurrency={formatCurrency}
                            />

                            <TopProductsCard
                                products={topProducts}
                                formatCurrency={formatCurrency}
                                formatNumber={formatNumber}
                            />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                            <RevenueCategoryCard
                                categories={revenueCategories}
                                formatCurrency={formatCurrency}
                                formatNumber={formatNumber}
                            />

                            <LowStockProductsCard
                                products={lowStockProducts}
                                formatNumber={formatNumber}
                                formatCurrency={formatCurrency}
                            />
                        </div>
                    </>
                )}
            </section>

            {/* Recent Orders */}
            <section className="space-y-5">
                <div>
                    <h2 className="text-lg sm:text-xl font-black">Đơn hàng gần đây</h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Danh sách đơn hàng mới nhất, không phụ thuộc vào bộ lọc thời gian.
                    </p>
                </div>

                {loadingDefault ? (
                    <LoadingCard text="Đang tải đơn hàng gần đây..." />
                ) : (
                    <RecentOrdersTable
                        orders={recentOrders}
                        formatCurrency={formatCurrency}
                    />
                )}
            </section>
        </div>
    );
}

function LoadingCard({ text }) {
    return (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm border border-gray-100">
            {text}
        </div>
    );
}

export default AdminRevenueStatistics;