function ProductCard({ product }) {
    const {
        name,
        thumbnail,
        base_price,
        discount_percent,
    } = product;

    const finalPrice = base_price * (1 - discount_percent / 100);

    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
            {/* Image */}
            <div className="relative bg-gray-100 rounded-xl p-3">
                <img src={thumbnail} className="w-full h-45 object-cover rounded-md" />

                {/* Sale badge */}
                {discount_percent > 0 && (
                    <span className="absolute top-2 left-1 bg-red-500 text-white text-xs px-1.5 py-1 rounded-full font-bold">
                        -{discount_percent}% OFF
                    </span>
                )}
            </div>

            {/* Name */}
            <h3 className="text-md mt-3 font-bold line-clamp-1">
                {name}
            </h3>

            {/* Price */}
            <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-red-500 font-bold text-md">
                    {Math.round(finalPrice).toLocaleString()}đ
                </span>

                <span className="text-gray-400 text-sm line-through">
                    {Math.round(base_price).toLocaleString()}đ
                </span>
            </div>
        </div>
    );
};

export default ProductCard;