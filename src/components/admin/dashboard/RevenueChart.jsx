function RevenueChart({ revenueStats = [], revenueType, setRevenueType }) {
    const chartData = Array.isArray(revenueStats) ? revenueStats : [];
    
    const formatCurrency = (value) =>
        Math.round(Number(value || 0)).toLocaleString("vi-VN") + "đ";

    const formatShortMoney = (value) => {
        const number = Number(value || 0);

        if (number >= 1000000000) return `${(number / 1000000000).toFixed(1)}tỷ`;
        if (number >= 1000000) return `${Math.round(number / 1000000)}tr`;
        if (number >= 1000) return `${Math.round(number / 1000)}k`;

        return `${number}đ`;
    };

    const maxRevenue = Math.max(
        ...chartData.map(item => Number(item.revenue || 0)),
        1
    );

    return (
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h2 className="font-bold">Biểu đồ doanh thu 7 ngày</h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Thống kê doanh thu trong tuần này
                    </p>
                </div>
            </div>

            {chartData.length === 0 ? (
                <div className="h-56 flex items-center justify-center text-sm text-gray-400">
                    Chưa có dữ liệu doanh thu trong tuần
                </div>
            ) : (
                <>
                    {/* Chart */}
                    <div className="h-64 flex items-end gap-1 sm:gap-2 border-b border-gray-100 pb-2">
                        {chartData.map((item, index) => {
                            const revenue = Number(item.revenue || 0);;

                            const height = revenue > 0
                                ? Math.max(14, (revenue / maxRevenue) * 100)
                                : 0;

                            return (
                                <div
                                    key={index}
                                    className="flex-1 h-full flex flex-col items-center justify-end gap-2 min-w-0"
                                >
                                    <div className="w-full flex-1 flex items-end justify-center">
                                        <div
                                            title={formatCurrency(revenue)}
                                            style={{ height: `${height}%` }}
                                            className={`relative w-full max-w-20 rounded-t-xl overflow-hidden
                                                ${revenue > 0
                                                    ? "bg-orange-500"
                                                    : "bg-orange-100"
                                                }
                                            `}
                                        >
                                            {revenue > 0 && (
                                                <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white whitespace-nowrap">
                                                    {formatShortMoney(revenue)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-center w-full">
                                        <p className="text-[11px] text-gray-800 font-bold leading-tight">
                                            {item.day}
                                        </p>

                                        <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1">
                                            {item.date}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Orders */}
                    <div className="mt-3 flex gap-1 sm:gap-2">
                        {revenueStats.map((item, index) => (
                            <div
                                key={index}
                                className="flex-1 text-center min-w-0"
                            >
                                <p className="text-[10px] sm:text-xs text-gray-400">
                                    {Number(item.orders || 0)} đơn
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default RevenueChart;