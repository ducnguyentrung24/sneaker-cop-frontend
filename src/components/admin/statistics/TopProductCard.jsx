function TopProductsCard({
    products = [],
    formatCurrency,
    formatNumber,
}) {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between gap-2 mb-5">
                <div>
                    <h2 className="font-bold">Sản phẩm bán chạy</h2>
                    <p className="text-xs text-gray-400 mt-1">Theo doanh thu trong kỳ</p>
                </div>

                <span className="text-xs font-bold text-gray-400">Top {products.length}</span>
            </div>

            <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
                {products.length > 0 ? (
                    products.map((product, index) => (
                        <div
                            key={product.product_id || index}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-black shrink-0">
                                {index + 1}
                            </div>

                            <img
                                src={product.thumbnail || product.image}
                                alt={product.product_name || "Không xác định"}
                                className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold line-clamp-1">
                                    {product.product_name || "Không xác định"}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                    {formatNumber(Number(product.sold_quantity || 0))} đã bán
                                </p>
                            </div>

                            <p className="text-xs font-bold text-orange-500 shrink-0">
                                {formatCurrency(Number(product.revenue || 0))}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-400 py-8 text-center">
                        Chưa có sản phẩm bán chạy
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopProductsCard;