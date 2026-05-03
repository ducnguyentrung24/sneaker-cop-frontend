import { useMemo, useState } from "react";

import { useCart } from "../../context/CartContext";

import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faCartShopping, 
    faBolt, 
    faMinus, 
    faPlus, 
    faStar
} from "@fortawesome/free-solid-svg-icons";

function ProductInfo({ product, selectedColor, setSelectedColor, reviewStats }) {
    const { addToCart } = useCart();

    const [ selectedSize, setSelectedSize ] = useState(null);
    const [ quantity, setQuantity ] = useState(1);
    const [loading, setLoading] = useState(false);

    const variants = product.variants || [];

    const colors = useMemo(() => {
        const set = new Set();
        variants.forEach(v => {
            if (v.color) set.add(v.color)
        });
        return Array.from(set);
    }, [variants]);

    const sizes = useMemo(() => {
        if (!selectedColor) return [];
        return variants.filter(v => v.color === selectedColor);
    }, [selectedColor, variants]);

    const selectedVariant = useMemo(() => {
        if (!selectedColor || !selectedSize) return null;
        return variants.find(v =>
            v.color === selectedColor && v.size === selectedSize
        );
    }, [selectedColor, selectedSize, variants]);

    const price = selectedVariant?.price
        ? Number(selectedVariant.price)
        : product.base_price;

    const final_price = price !== null
        ? Math.round(price * (1 - product.discount_percent / 100))
        : product.final_price;

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            toast.error("Vui lòng chọn màu và size");
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            await addToCart(selectedVariant.id, quantity);
            toast.success(`Đã thêm vào giỏ hàng`);
        } catch (error) {
            toast.error("Thêm vào giỏ hàng thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Badge */}
            {product.discount_percent > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm bg-orange-600 text-white font-semibold px-2 rounded-xl">
                        Khuyến mãi
                    </span>
                    <span className="text-sm text-orange-700 font-semibold">
                        -{product.discount_percent}%
                    </span>
                </div>

            )}

            {/* Name */}
            <h1 className="text-2xl font-bold uppercase">
                {product.name}
            </h1>

            {/* Rate and Sold */}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <div className="flex text-orange-500">
                    {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={i < Math.round(reviewStats.average_rating || 0)
                                ? 'text-orange-500'
                                : 'text-gray-300'
                            }
                        />
                    ))}
                </div>

                <span className="font-semibold text-black">
                    ({reviewStats.average_rating?.toFixed(1) || "0.0"})
                </span>

                <span>
                    | {reviewStats.total_reviews || 0} đánh giá
                </span>

                <span>
                    | {product.sold} đã bán
                </span>
            </div>

            {/* Price */}
            <div className="mt-3 flex gap-3 items-center">
                <span className="text-orange-500 text-2xl font-bold">
                    {Math.round(final_price).toLocaleString('vi-VN')}đ
                </span>

                {product.discount_percent > 0 && (
                    <span className="line-through text-gray-400 text-md">
                        {Math.round(price).toLocaleString('vi-VN')}đ
                    </span>
                )}
            </div>

            {/* Color */}
            <div className="mt-5">
                <p className="text-sm mb-2">Màu sắc</p>

                <div className="flex gap-2">
                    {colors.map((c, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setSelectedColor(c);

                                const firstVariant = variants.find(
                                    v => v.color === c && v.stock > 0
                                );

                                if (firstVariant) setSelectedSize(firstVariant.size);
                                else setSelectedSize(null);
                            }}
                            className={`w-8 h-8 rounded-full border-2
                                ${selectedColor === c ? 'border-black' : 'border-gray-300'}
                            `}
                            style={{ backgroundColor: c }}  
                        />
                    ))}
                </div>
            </div>

            {/* Size */}
            <div className="mt-5">
                <p className="text-sm mb-2">Chọn size</p>

                <div className="flex gap-2 flex-wrap">
                    {sizes.map(v => (
                        <button
                            key={v.id}
                            disabled={v.stock === 0}
                            title={v.stock === 0 ? "Hết hàng" : ""}
                            onClick={() => setSelectedSize(v.size)}
                            className={`border px-10 py-2 text-sm rounded
                                ${v.stock === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : selectedSize === v.size 
                                        ? 'bg-black text-white' 
                                        : 'hover:border-black'
                                }    
                            `}
                        >
                            {v.size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity */}
            <div className="mt-5">
                <p className="text-sm mb-2">Số lượng</p>

                <div className="flex border border-gray-400 rounded-md w-fit">
                    <button 
                        onClick={() => {
                            if (quantity <= 1) {
                                toast.error("Số lượng phải lớn hơn 0");
                                return;
                            }
                            setQuantity(q => Math.max(1, q - 1))
                        }}
                        className="p-2 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                    </button>

                    <span className="px-4 py-2">{quantity}</span>

                    <button
                        onClick={() => {
                            if (!selectedVariant) {
                                toast.error("Vui lòng chọn màu và size");
                                return;
                            }

                            if (quantity >= selectedVariant.stock) {
                                toast.error("Số lượng vượt quá tồn kho");
                                return;
                            }

                            setQuantity(q => q + 1)
                        }}
                        className="p-2 hover:bg-gray-200"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                    </button>
                </div>
            </div>

            {/* Button */}
            <div className="mt-6 flex flex-col gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    className={`bg-black text-white font-bold py-3 rounded flex items-center justify-center gap-1 hover:bg-gray-800 transition
                        ${loading ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                >
                    <FontAwesomeIcon icon={faCartShopping} />
                    Thêm vào giỏ hàng
                </button>

                <button className="font-bold border py-3 rounded flex items-center justify-center gap-1 hover:bg-gray-100 transition">
                    <FontAwesomeIcon icon={faBolt} />
                    Mua ngay
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;