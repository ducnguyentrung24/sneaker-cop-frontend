import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";

function RevenueCategoryCard({
    categories = [],
    formatCurrency,
    formatNumber,
}) {
    const totalRevenue = categories.reduce(
        (sum, item) => sum + Number(item.revenue || 0),
        0
    );

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                        <FontAwesomeIcon icon={faLayerGroup} />
                    </div>

                    <div>
                        <h2 className="font-bold">Doanh thu theo danh mục</h2>
                        <p className="text-xs text-gray-400 mt-1">Dữ liệu thay đổi theo thời gian đã chọn</p>
                    </div>
                </div>

                <span className="text-xs font-bold text-gray-400 shrink-0">
                    {categories.length} danh mục
                </span>
            </div>

            <div className="space-y-3 max-h-105 overflow-y-auto pr-1">
                {categories.length > 0 ? (
                    categories.map((category, index) => {
                        const revenue = Number(category.revenue || 0);
                        const quantity = Number(category.sold_quantity || 0);
                        const percent = category.percent !== undefined 
                            ? Number(category.percent || 0) 
                            : totalRevenue
                                ? Math.round((revenue / totalRevenue) * 100)
                                : 0;

                        return (
                            <div
                                key={category.category_id || index}
                                className="rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-black shrink-0">
                                                {index + 1}
                                            </span>

                                            <p className="font-bold line-clamp-1">{category.category_name || "Không xác định"}</p>
                                        </div>

                                        <p className="text-xs text-gray-400 mt-2">{formatNumber(quantity)} sản phẩm đã bán</p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-orange-500">{formatCurrency(revenue)}</p>
                                        <p className="text-xs text-gray-400 mt-1">{percent}%</p>
                                    </div>
                                </div>

                                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-orange-500 rounded-full" 
                                        style={{ width: `${Math.min(percent, 100)}%`}}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-sm text-gray-400 py-8 text-center">Chưa có dữ liệu danh mục</div>
                )}
            </div>
        </div>
    );
}

export default RevenueCategoryCard;