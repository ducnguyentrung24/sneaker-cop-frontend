import { useEffect, useState } from "react";

import {
    getRevenueSummary,
    getRevenueByProduct,
    getRevenueByBrand,
    getRevenueByCategory,
    getRevenueOrders,
    exportRevenueExcel,
} from "../../services/report.service";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileExcel,
    faRotateRight,
    faMagnifyingGlass,
    faMoneyBillWave,
    faCartShopping,
    faReceipt,
    faArrowTrendUp,
    faArrowTrendDown,
    faMinus,
    faTag,
    faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

function AdminReports() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;

    const defaultFilters = {
        period: "month",
        month: currentMonth,
        quarter: currentQuarter,
        year: currentYear,
    };

    const [filters, setFilters] = useState(defaultFilters);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [summaryReport, setSummaryReport] = useState({
        period: "",
        current_period: null,
        previous_period: null,
        summary: {
            total_revenue: 0,
            total_orders: 0,
            average_order_value: 0,
        },
        comparison: {
            previous_revenue: 0,
            previous_orders: 0,
            revenue_difference: 0,
            orders_difference: 0,
            revenue_growth_rate: 0,
            order_growth_rate: 0,
            revenue_trend: "stable",
            order_trend: "stable",
        },
    });

    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const getQueryParams = () => {
        const params = {
            period: filters.period,
            year: filters.year,
        };

        if (filters.period === "month") {
            params.month = filters.month;
        }

        if (filters.period === "quarter") {
            params.quarter = filters.quarter;
        }

        return params;
    };

    const getPayload = (res) => {
        return res?.data || {};
    };

    const getListData = (res) => {
        const payload = getPayload(res);

        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.products)) return payload.products;
        if (Array.isArray(payload?.brands)) return payload.brands;
        if (Array.isArray(payload?.categories)) return payload.categories;
        if (Array.isArray(payload?.orders)) return payload.orders;

        return [];
    };

    const fetchReports = async () => {
        try {
            setLoading(true);

            const params = getQueryParams();

            const [
                summaryRes,
                productRes,
                brandRes,
                categoryRes,
                orderRes,
            ] = await Promise.all([
                getRevenueSummary(params),
                getRevenueByProduct({ ...params, limit: 10 }),
                getRevenueByBrand(params),
                getRevenueByCategory(params),
                getRevenueOrders(params),
            ]);

            setSummaryReport(getPayload(summaryRes));
            setProducts(getListData(productRes));
            setBrands(getListData(brandRes));
            setCategories(getListData(categoryRes));
            setOrders(getListData(orderRes));
        } catch (error) {
            console.error("Fetch reports failed:", error);
            console.error("Error response:", error.response?.data);
            toast.error("Không thể tải dữ liệu báo cáo");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchReports();
    };

    const handleReset = () => {
        setFilters(defaultFilters);
    };

    const handleExportExcel = async () => {
        try {
            setExporting(true);

            const res = await exportRevenueExcel(getQueryParams());

            const blobData = res instanceof Blob ? res : res?.data;

            if (!blobData) {
                toast.error("Không nhận được dữ liệu file Excel");
                return;
            }

            if (blobData.type?.includes("application/json")) {
                const text = await blobData.text();
                const errorData = JSON.parse(text);

                toast.error(errorData.message || "Xuất Excel thất bại");
                return;
            }

            const excelBlob = new Blob([blobData], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(excelBlob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `bao-cao-doanh-thu-${filters.period}-${Date.now()}.xlsx`;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Xuất Excel thành công");
        } catch (error) {
            console.error("Export report failed:", error);
            console.error("Error response:", error.response?.data);

            if (error.response?.data instanceof Blob) {
                try {
                    const text = await error.response.data.text();
                    const errorData = JSON.parse(text);

                    toast.error(errorData.message || "Xuất Excel thất bại");
                    return;
                } catch {
                    toast.error("Xuất Excel thất bại");
                    return;
                }
            }

            toast.error(
                error.response?.data?.message ||
                "Xuất Excel thất bại"
            );
        } finally {
            setExporting(false);
        }
    };

    const formatCurrency = (value) => {
        return Math.round(Number(value || 0)).toLocaleString("vi-VN") + "đ";
    };

    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString("vi-VN");
    };

    const formatPercent = (value) => {
        return Number(value || 0).toFixed(2).replace(".00", "") + "%";
    };

    const formatDateTime = (value) => {
        if (!value) return "N/A";

        return new Date(value).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getPeriodText = () => {
        if (filters.period === "month") {
            return `Tháng ${filters.month}/${filters.year}`;
        }

        if (filters.period === "quarter") {
            return `Quý ${filters.quarter}/${filters.year}`;
        }

        return `Năm ${filters.year}`;
    };

    const getPreviousPeriodText = () => {
        const previous = summaryReport?.previous_period;
        if (!previous) return "Kỳ trước";

        return `${previous.from_date} - ${previous.to_date}`;
    };

    const getSummary = () => {
        return summaryReport?.summary || {};
    };

    const getComparison = () => {
        return summaryReport?.comparison || summaryReport?.camparison || {};
    };

    const getTrendIcon = (trend) => {
        if (trend === "increase") return faArrowTrendUp;
        if (trend === "decrease") return faArrowTrendDown;
        return faMinus;
    };

    const getTrendClass = (trend) => {
        if (trend === "increase") return "bg-green-50 text-green-600";
        if (trend === "decrease") return "bg-red-50 text-red-600";
        return "bg-gray-100 text-gray-500";
    };

    const getTrendText = (trend, growth) => {
        if (trend === "increase") return `Tăng ${formatPercent(growth)}`;
        if (trend === "decrease") return `Giảm ${formatPercent(growth)}`;
        return "Không đổi";
    };

    const getName = (item, ...keys) => {
        for (const key of keys) {
            if (item?.[key]) return item[key];
        }

        return "Không xác định";
    };

    const getRevenue = (item) => {
        return Number(
            item.revenue ||
            item.total_revenue ||
            item.final_price ||
            0
        );
    };

    const getQuantity = (item) => {
        return Number(
            item.sold_quantity ||
            item.quantity ||
            item.total_quantity ||
            0
        );
    };

    const summary = getSummary();
    const comparison = getComparison();

    const years = Array.from({ length: 6 }, (_, index) => currentYear - index);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const quarters = [1, 2, 3, 4];

    const reportCards = [
        {
            title: "Tổng doanh thu",
            value: formatCurrency(summary.total_revenue),
            subValue: `Kỳ trước: ${formatCurrency(comparison.previous_revenue)}`,
            icon: faMoneyBillWave,
            color: "bg-green-50 text-green-600",
            trend: comparison.revenue_trend,
            growth: comparison.revenue_growth_rate,
        },
        {
            title: "Tổng đơn hàng",
            value: formatNumber(summary.total_orders),
            subValue: `Kỳ trước: ${formatNumber(comparison.previous_orders)} đơn`,
            icon: faCartShopping,
            color: "bg-orange-50 text-orange-600",
            trend: comparison.order_trend,
            growth: comparison.order_growth_rate,
        },
        {
            title: "Giá trị đơn TB",
            value: formatCurrency(summary.average_order_value),
            subValue: "Trung bình trên đơn hoàn thành",
            icon: faReceipt,
            color: "bg-purple-50 text-purple-600",
            trend: "stable",
            growth: 0,
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black">
                        Báo cáo doanh thu
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Theo dõi doanh thu theo tháng, quý và năm
                    </p>

                    {summaryReport?.current_period && (
                        <p className="text-xs text-gray-400 mt-2">
                            Kỳ hiện tại: {summaryReport.current_period.from_date} - {summaryReport.current_period.to_date}
                            <span className="mx-2">•</span>
                            So với: {getPreviousPeriodText()}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleExportExcel}
                    disabled={exporting}
                    className="h-11 px-5 rounded-xl bg-green-600 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition w-full sm:w-fit"
                >
                    <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
                    {exporting ? "Đang xuất..." : "Xuất Excel"}
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">
                            Loại báo cáo
                        </label>

                        <select
                            value={filters.period}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    period: e.target.value,
                                }))
                            }
                            className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                        >
                            <option value="month">Theo tháng</option>
                            <option value="quarter">Theo quý</option>
                            <option value="year">Theo năm</option>
                        </select>
                    </div>

                    {filters.period === "month" && (
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">
                                Tháng
                            </label>

                            <select
                                value={filters.month}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        month: Number(e.target.value),
                                    }))
                                }
                                className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                            >
                                {months.map((month) => (
                                    <option key={month} value={month}>
                                        Tháng {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {filters.period === "quarter" && (
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">
                                Quý
                            </label>

                            <select
                                value={filters.quarter}
                                onChange={(e) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        quarter: Number(e.target.value),
                                    }))
                                }
                                className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                            >
                                {quarters.map((quarter) => (
                                    <option key={quarter} value={quarter}>
                                        Quý {quarter}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">
                            Năm
                        </label>

                        <select
                            value={filters.year}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    year: Number(e.target.value),
                                }))
                            }
                            className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end gap-2 xl:col-span-2">
                        <button
                            onClick={handleSearch}
                            className="flex-1 h-11 rounded-lg bg-black text-white text-sm font-bold hover:opacity-90 transition"
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
                            Xem báo cáo
                        </button>

                        <button
                            onClick={handleReset}
                            className="h-11 px-4 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                        >
                            <FontAwesomeIcon icon={faRotateRight} />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow-sm">
                    Đang tải báo cáo...
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {reportCards.map((item) => (
                            <div
                                key={item.title}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}
                                    >
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getTrendClass(item.trend)}`}>
                                        <FontAwesomeIcon icon={getTrendIcon(item.trend)} className="mr-1" />
                                        {getTrendText(item.trend, item.growth)}
                                    </span>
                                </div>

                                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                                    {item.title}
                                </p>

                                <h2 className="text-2xl font-black mt-1 truncate">
                                    {item.value}
                                </h2>

                                <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                                    {item.subValue}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Product + Orders */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                        <ProductRevenueTable
                            products={products}
                            getName={getName}
                            getRevenue={getRevenue}
                            getQuantity={getQuantity}
                            formatCurrency={formatCurrency}
                            formatNumber={formatNumber}
                            getPeriodText={getPeriodText}
                        />

                        <RevenueOrdersCard
                            orders={orders}
                            formatCurrency={formatCurrency}
                            formatDateTime={formatDateTime}
                        />
                    </div>

                    {/* Brand + Category */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RevenueMiniTable
                            title="Doanh thu theo thương hiệu"
                            icon={faTag}
                            data={brands}
                            nameKeys={["brand_name", "name"]}
                            emptyText="Chưa có dữ liệu thương hiệu"
                            formatCurrency={formatCurrency}
                            formatNumber={formatNumber}
                            getName={getName}
                            getRevenue={getRevenue}
                            getQuantity={getQuantity}
                        />

                        <RevenueMiniTable
                            title="Doanh thu theo danh mục"
                            icon={faLayerGroup}
                            data={categories}
                            nameKeys={["category_name", "name"]}
                            emptyText="Chưa có dữ liệu danh mục"
                            formatCurrency={formatCurrency}
                            formatNumber={formatNumber}
                            getName={getName}
                            getRevenue={getRevenue}
                            getQuantity={getQuantity}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

function ProductRevenueTable({
    products = [],
    getName,
    getRevenue,
    getQuantity,
    formatCurrency,
    formatNumber,
    getPeriodText,
}) {
    return (
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="font-bold">Doanh thu theo sản phẩm</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Top sản phẩm bán tốt trong {getPeriodText()}
                    </p>
                </div>

                <span className="text-xs font-bold text-gray-400">
                    Top {products.length}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-150 text-sm">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="text-left px-5 py-4 w-16">#</th>
                            <th className="text-left px-5 py-4">Sản phẩm</th>
                            <th className="text-left px-5 py-4 w-32">Đã bán</th>
                            <th className="text-left px-5 py-4 w-44">Doanh thu</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <tr
                                    key={product.product_id || index}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <td className="px-5 py-4 font-black text-gray-400">
                                        {index + 1}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.thumbnail}
                                                alt={getName(product, "product_name", "name")}
                                                className="w-11 h-11 rounded-lg object-cover bg-gray-100"
                                            />

                                            <p className="font-bold line-clamp-1">
                                                {getName(product, "product_name", "name")}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-gray-500">
                                        {formatNumber(getQuantity(product))}
                                    </td>

                                    <td className="px-5 py-4 font-bold text-orange-500">
                                        {formatCurrency(getRevenue(product))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-gray-400"
                                >
                                    Chưa có dữ liệu sản phẩm
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function RevenueOrdersCard({
    orders = [],
    formatCurrency,
    formatDateTime,
}) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2 mb-5">
                <div>
                    <h2 className="font-bold">Đơn hàng doanh thu</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Đơn hoàn thành trong kỳ
                    </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[11px] font-bold">
                    {orders.length} đơn
                </span>
            </div>

            <div className="space-y-3 max-h-108 overflow-y-auto pr-1">
                {orders.length > 0 ? (
                    orders.slice(0, 8).map((order, index) => (
                        <div
                            key={order.id || index}
                            className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-bold text-sm line-clamp-1">
                                        {order.order_code}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                        {order.receiver_name} - {order.phone}
                                    </p>
                                </div>

                                <span className="text-xs font-bold text-green-600 shrink-0">
                                    {formatCurrency(order.final_price)}
                                </span>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-[11px] text-gray-400">
                                    Hoàn thành
                                </p>

                                <p className="text-[11px] font-bold text-gray-500">
                                    {formatDateTime(order.completed_at)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-400 py-8 text-center">
                        Chưa có đơn hàng trong kỳ báo cáo
                    </div>
                )}
            </div>
        </div>
    );
}

function RevenueMiniTable({
    title,
    icon,
    data = [],
    nameKeys = [],
    emptyText,
    formatCurrency,
    formatNumber,
    getName,
    getRevenue,
    getQuantity,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <FontAwesomeIcon icon={icon} className="text-orange-500" />

                <div>
                    <h2 className="font-bold">{title}</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Thống kê doanh thu trong kỳ báo cáo
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-130 text-sm">
                    <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="text-left px-5 py-4 w-16">#</th>
                            <th className="text-left px-5 py-4">Tên</th>
                            <th className="text-left px-5 py-4 w-32">SL bán</th>
                            <th className="text-left px-5 py-4 w-40">Doanh thu</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr
                                    key={item.brand_id || item.category_id || index}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <td className="px-5 py-4 font-black text-gray-400">
                                        {index + 1}
                                    </td>

                                    <td className="px-5 py-4 font-bold">
                                        {getName(item, ...nameKeys)}
                                    </td>

                                    <td className="px-5 py-4 text-gray-500">
                                        {formatNumber(getQuantity(item))}
                                    </td>

                                    <td className="px-5 py-4 font-bold text-orange-500">
                                        {formatCurrency(getRevenue(item))}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-gray-400"
                                >
                                    {emptyText}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminReports;