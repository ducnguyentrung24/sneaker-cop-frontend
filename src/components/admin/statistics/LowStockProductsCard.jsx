import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

function LowStockProductsCard({
    products = [],
    formatNumber,
    formatCurrency,
}) {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                    <FontAwesomeIcon icon={faTriangleExclamation} />
                </div>

                <div>
                    <h2 className="font-bold">Sản phẩm sắp hết hàng</h2>
                    <p className="text-xs text-gray-400 mt-1">Không phụ thuộc thời gian</p>
                </div>
            </div>

            <div className="space-y-3 max-h-105 overflow-y-auto pr-1">
                {products.length > 0 ? (
                    products.map((item, index) => {
                        const stock = Number(item.stock || 0);

                        return (
                            <div
                                key={item.variant_id || index}
                                className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition"
                            >
                                <img
                                    src={item.image || item.thumbnail}
                                    alt={item.product_name || "Không xác định"}
                                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold line-clamp-1">
                                        {item.product_name || "Không xác định"}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {item.color || "N/A"} - Size {item.size || "N/A"}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {formatCurrency(item.price || 0)}
                                    </p>
                                </div>

                                <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold shrink-0">
                                    Còn {formatNumber(stock)}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-sm text-gray-400 py-8 text-center">Không có sản phẩm sắp hết hàng</div>
                )}
            </div>
        </div>
    );
}

export default LowStockProductsCard;