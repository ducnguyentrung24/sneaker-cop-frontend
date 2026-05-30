import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBillWave,
    faCartShopping,
    faBox,
    faClock,
    faUser,
    faTriangleExclamation,
    faCircleCheck,
    faBan,
} from "@fortawesome/free-solid-svg-icons";

function StatsCards({ summary = {}, period = "today" }) {
    const formatCurrency = (value) => {
        return Math.round(Number(value || 0)).toLocaleString("vi-VN") + "đ";
    };

    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString("vi-VN");
    };

    const periodText = period === "today" ? "hôm nay" : "tuần này";

    const stats = [
        {
            title: `Doanh thu ${periodText}`,
            value: formatCurrency(summary.total_revenue),
            icon: faMoneyBillWave,
            color: "text-green-500 bg-green-50",
        },
        {
            title: `Đơn hàng ${periodText}`,
            value: formatNumber(summary.total_orders),
            icon: faCartShopping,
            color: "text-orange-500 bg-orange-50",
        },
        {
            title: `Đơn hoàn thành ${periodText}`,
            value: formatNumber(summary.completed_orders),
            icon: faCircleCheck,
            color: "text-green-500 bg-green-50",
        },
        {
            title: "Đơn chờ xử lý",
            value: formatNumber(summary.overview?.pending_orders),
            icon: faClock,
            color: "text-yellow-500 bg-yellow-50",
        },
        {
            title: "Sắp hết hàng",
            value: formatNumber(summary.overview?.low_stock_count),
            icon: faTriangleExclamation,
            color: "text-red-500 bg-red-50",
        },
        {
            title: "Tỷ lệ hủy đơn",
            value: Number(summary.overview?.cancel_rate || 0).toFixed(1).replace(".0", "") + "%",
            icon: faBan,
            color: "text-red-500 bg-red-50",
        },
        {
            title: "Tổng sản phẩm",
            value: formatNumber(summary.overview?.total_products),
            icon: faBox,
            color: "text-blue-500 bg-blue-50",
        },
        {
            title: "Tổng người dùng",
            value: formatNumber(summary.overview?.total_users),
            icon: faUser,
            color: "text-purple-500 bg-purple-50",
        },
    ];

    return (
        <div className="mb-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 min-w-max">
                {stats.map((item) => (
                    <div
                        key={item.title}
                        className="w-64 sm:w-70 bg-white rounded-2xl p-5 shadow-sm shrink-0"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                <FontAwesomeIcon icon={item.icon} />
                            </div>
                        </div>

                        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold truncate">
                            {item.title}
                        </p>

                        <h2 className="text-xl font-bold mt-1 truncate whitespace-nowrap">
                            {item.value}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsCards;