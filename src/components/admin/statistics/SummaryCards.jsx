import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBillWave,
    faCartShopping,
    faReceipt,
    faClock,
    faCircleCheck,
    faBan,
    faPercent,
    faArrowTrendUp,
    faArrowTrendDown,
    faMinus,
} from "@fortawesome/free-solid-svg-icons";

function SummaryCards({
    summary = {},
    comparison = {},
    periodText,
    formatCurrency,
    formatNumber,
}) {
    const getSummaryValue = (...keys) => {
        for (const key of keys) {
            if (summary?.[key] !== undefined && summary?.[key] !== null)
                return summary[key];
        }

        return 0;
    };

    const getComparisonValue = (...keys) => {
        for (const key of keys) {
            if (comparison?.[key] !== undefined && comparison?.[key] !== null)
                return comparison[key];
        }

        return 0;
    };

    const formatPercent = (value) => {
        return Number(value || 0).toFixed(1).replace(".0", "") + "%";
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
        if (trend === "decrease") return `Giảm ${formatPercent(Math.abs(growth))}`;
        return "Không đổi";
    };

        const cards = [
        {
            title: "Tổng doanh thu",
            value: formatCurrency(getSummaryValue("total_revenue")),
            icon: faMoneyBillWave,
            color: "bg-green-50 text-green-600",
            previousLabel: "Doanh thu kỳ trước",
            previousValue: formatCurrency(getComparisonValue("previous_revenue")),
            differenceLabel: "Chênh lệch",
            differenceValue: formatCurrency(getComparisonValue("revenue_difference")),
            trend: getComparisonValue("revenue_trend"),
            growth: getComparisonValue("revenue_growth_rate"),
        },
        {
            title: "Tổng đơn hàng",
            value: formatNumber(getSummaryValue("total_orders")),
            icon: faCartShopping,
            color: "bg-orange-50 text-orange-600",
            previousLabel: "Đơn hàng kỳ trước",
            previousValue: `${formatNumber(getComparisonValue("previous_orders"))} đơn`,
            differenceLabel: "Chênh lệch",
            differenceValue: `${formatNumber(getComparisonValue("order_difference", "orders_difference"))} đơn`,
            trend: getComparisonValue("order_trend"),
            growth: getComparisonValue("order_growth_rate"),
        },
        {
            title: "Đơn hoàn thành",
            value: formatNumber(getSummaryValue("completed_orders")),
            icon: faCircleCheck,
            color: "bg-blue-50 text-blue-600",
            description: "Số đơn đã hoàn thành trong kỳ",
        },
        {
            title: "Đơn chờ xử lý",
            value: formatNumber(getSummaryValue("pending_orders")),
            icon: faClock,
            color: "bg-yellow-50 text-yellow-600",
            description: "Tổng đơn hàng đang chờ xử lý",
            isGlobal: true,
        },
        {
            title: "Đơn đã hủy",
            value: formatNumber(getSummaryValue("cancelled_orders")),
            icon: faBan,
            color: "bg-red-50 text-red-600",
            description: "Số đơn đã hủy trong kỳ",
        },
        {
            title: "Tỷ lệ hủy đơn",
            value: formatPercent(getSummaryValue("cancel_rate")),
            icon: faPercent,
            color: "bg-red-50 text-red-600",
            description: "Tỷ lệ đơn hủy trên tổng đơn trong kỳ",
        },
        {
            title: "Giá trị đơn TB",
            value: formatCurrency(getSummaryValue("average_order_value")),
            icon: faReceipt,
            color: "bg-purple-50 text-purple-600",
            description: "Trung bình trên mỗi đơn hoàn thành",
        },
    ];

    return (
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 min-w-max">
                {cards.map((item) => {
                    return (
                        <div
                            key={item.title}
                            className="w-72 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 shrink-0 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                                    <FontAwesomeIcon icon={item.icon} />
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase 
                                        ${item.isGlobal
                                            ? "bg-gray-100 text-gray-500"
                                            : "bg-orange-50 text-orange-500"
                                        }
                                    `}
                                >
                                    {item.isGlobal ? "Tổng thể" : periodText}
                                </span>
                            </div>

                            <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">{item.title}</p>
                            <h2 className="text-2xl font-black mt-1 truncate">{item.value}</h2>

                            {(item.previousValue !== undefined && item.trend !== undefined) ? (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-[11px] text-gray-400">{item.previousLabel}</p>

                                            <p className="text-xs font-bold text-gray-600 truncate">{item.previousValue}</p>
                                        </div>

                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${getTrendClass(item.trend)}`}>
                                            <FontAwesomeIcon icon={getTrendIcon(item.trend)} className="mr-1" />
                                            {getTrendText(item.trend, item.growth)}
                                        </span>
                                    </div>

                                    <p className="text-[11px] text-gray-400 mt-2">
                                        {item.differenceLabel}:{" "}
                                        <span className="font-bold text-gray-600">
                                            {item.differenceValue}
                                        </span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 mt-3 line-clamp-2">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SummaryCards;