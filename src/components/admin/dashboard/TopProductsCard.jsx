function TopProductCard({ topProducts = [] }) {
    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString("vi-VN");
    };

    const getName = (item) => {
        return item.product_name || item.name || "Không xác định";
    };

    const getCount = (item) => {
        return Number(item.sold_quantity || item.sold || 0);
    };

    return (
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="font-bold">Sản phẩm hot</h2>
            <p className="text-xs text-gray-500 mt-1 mb-5">Những sản phẩm bán chạy nhất</p>

            <div className="space-y-4">
                {topProducts.length > 0 ? (
                    topProducts.map((product, index) => (
                        <div
                            key={product.product_id || product.id || index}
                            className="flex items-center gap-3"
                        >
                            <img
                                src={product.thumbnail || product.image}
                                alt={getName(product)}
                                className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm line-clamp-1">{getName(product)}</p>
                                <p className="text-xs text-gray-400">{formatNumber(getCount(product))} lượt bán</p>
                            </div>

                            <span className="text-xs font-bold text-green-500">
                                #{index + 1}
                            </span>
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
};

export default TopProductCard;