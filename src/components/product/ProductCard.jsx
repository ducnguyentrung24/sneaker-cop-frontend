import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
    const navigate = useNavigate();
    
    const {
        id,
        name,
        thumbnail,
        base_price,
        final_price,
        discount_percent,
    } = product;
    
    const hasDiscount = discount_percent > 0;


    return (
        <div
            onClick={() => navigate(`/products/${id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
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
                    {Math.round(final_price).toLocaleString('vi-VN')}đ
                </span>

                {hasDiscount && (
                    <span className="text-gray-400 text-sm line-through">
                        {Math.round(base_price).toLocaleString('vi-VN')}đ
                    </span>
                )}
            </div>
        </div>
    );
};

export default ProductCard;