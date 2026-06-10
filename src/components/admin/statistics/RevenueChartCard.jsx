import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

function RevenueChartCard({
    data = [],
    formatCurrency,
}) {
    const chartData = Array.isArray(data) ? data : [];

    const maxRevenue = Math.max(
        ...chartData.map((item) => Number(item.revenue || 0)),
        1
    );

    const getLabelStep = () => {
        if (chartData.length <= 10) return 1;
        if (chartData.length <= 16) return 2;
        if (chartData.length <= 31) return 4;

        return Math.ceil(chartData.length / 10);
    };

    const labelStep = getLabelStep();

    const shouldShowLabel = (index) => {
        return (
            index === 0 ||
            index === chartData.length - 1 ||
            index % labelStep === 0
        );
    };

    const minChartWidth = Math.max(560, chartData.length * 56);

    const formatShortMoney = (value) => {
        const number = Number(value || 0);

        if (number >= 1000000000) return `${(number / 1000000000).toFixed(1)} tỷ`;
        if (number >= 1000000) return `${Math.round(number / 1000000)} tr`;
        if (number >= 1000) return `${Math.round(number / 1000)}k`;
        return `${number}`;
    };

    return (
        <div className="xl:col-span-2 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                    <FontAwesomeIcon icon={faChartLine} />
                </div>

                <div>
                    <h2 className="font-bold">Biểu đồ doanh thu</h2>
                    <p className="text-xs text-gray-400 mt-1">Doanh thu theo từng mốc thời gian trong kỳ</p>
                </div>
            </div>

            {chartData.length > 0 ? (
                <div className="overflow-x-auto pb-2">
                    <div style={{ minWidth: `${minChartWidth}px` }}>
                        <div className="h-64 flex items-end gap-3 border-b border-gray-100 pb-4">
                            {chartData.map((item, index) => {
                                const revenue = Number(item.revenue || 0);

                                const height = revenue > 0
                                    ? Math.max(14, (revenue / maxRevenue) * 100)
                                    : 0;

                                const isMax = revenue === maxRevenue && revenue > 0;
                                const label = item.label || "";

                                return (
                                    <div
                                        key={index}
                                        className="flex-1 h-full flex flex-col items-center justify-end gap-2 min-w-0"
                                    >
                                        <div className="w-full flex-1 flex items-end justify-center">
                                            <div
                                                title={`${label} - ${formatCurrency(revenue)} - ${Number(item.orders || 0)} đơn`}
                                                style={{ height: `${height}%` }}
                                                className={`relative w-full max-w-10 rounded-t-xl transition 
                                                    ${revenue > 0
                                                        ? isMax ? "bg-orange-500" : "bg-orange-200"
                                                        : "bg-gray-100"
                                                }`}
                                            >
                                                {revenue > 0 && (
                                                    <span className="absolute inset-x-0 top-2 text-center text-[9px] font-bold text-white">
                                                        {formatShortMoney(revenue)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <span
                                            title={label}
                                            className="h-4 text-[10px] text-gray-500 font-bold text-center whitespace-nowrap"
                                        >
                                            {shouldShowLabel(index) ? label : ""}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-3 flex gap-3">
                            {chartData.map((item, index) => (
                                <div key={index} className="flex-1 text-center">
                                    <p className="text-[10px] text-gray-400">
                                        {shouldShowLabel(index) ? `${Number(item.orders || 0)} đơn` : ""}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-64 flex items-center justify-center text-sm text-gray-400">
                    Chưa có dữ liệu doanh thu
                </div>
            )}
        </div>
    );
}

export default RevenueChartCard;