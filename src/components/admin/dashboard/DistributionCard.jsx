const chartColors = [
     "#F97316",
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
];

function DistributionCard({
    title,
    description,
    data = [],
    emptyText,
    idKey,
    centerValue,
    centerLabel = "Sản phẩm",
}) {
    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString("vi-VN");
    };

    const getName = (item) => {
        return item.category_name || item.brand_name || item.name || "Không xác định";
    };

    const getCount = (item) => {
        return Number(item.product_count || item.total_products || item.count || 0);
    };

    const getPercent = (item) => {
        return Number(item.percent || item.percentage || item.ratio || 0);
    };

    const getTotalCount = (list) => {
        return list.reduce((sum, item) => sum + getCount(item), 0);
    };

    const getCenterValue = () => {
        if (centerValue !== undefined && centerValue !== null) return centerValue;

        return getTotalCount(data);
    };

    const getConicGradient = (list) => {
        let current = 0;

        const segments = list.map((item, index) => {
            const percent = getPercent(item);
            const start = current;
            const end = current + percent;

            current = end;

            return `${chartColors[index % chartColors.length]} ${start}% ${end}%`;
        }); 

        if (segments.length === 0) return "#e5e7eb"

        return `conic-gradient(${segments.join(", ")})`;
    };

    return (
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="font-bold">{title}</h2>
            <p className="text-xs text-gray-500 mt-1 mb-6">{description}</p>

            {data.length > 0 ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                    {/* Chart */}
                    <div
                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: getConicGradient(data) }}
                    >
                        <div className="w-22 h-22 sm:w-24 sm:h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                            <p className="font-bold text-xl">
                                {formatNumber(getCenterValue())}
                            </p>

                            <p className="text-[10px] text-gray-400 font-bold uppercase">
                                {centerLabel}
                            </p>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="w-full sm:flex-1 space-y-3">
                        {data.map((item, index) => (
                            <div
                                key={item[idKey] || item.id || index}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{backgroundColor: chartColors[index % chartColors.length]}}
                                    />

                                    <span className="text-sm text-gray-600 font-medium line-clamp-1">
                                        {getName(item)}
                                    </span>
                                </div>

                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold">{getPercent(item)}%</p>
                                    <p className="text-xs text-gray-400">{formatNumber(getCount(item))} SP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-sm text-gray-400 py-8 text-center">
                    {emptyText}
                </div>
            )}
        </div>
    );
};

export default DistributionCard;