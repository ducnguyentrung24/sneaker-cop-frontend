import { useEffect, useMemo, useState } from "react";

function ProductGallery({ product, selectedColor }) {
    const [selectedImg, setSelectedImg] = useState(product.thumbnail);

    const images = useMemo(() => [
        product.thumbnail,
        ...(product.images || []).map(i => i.image_url)
    ], [product]);

    useEffect(() => {
        if (!selectedColor) return;

        const variantImg = (product.variants || []).find(
            v => v.color === selectedColor
        )?.image_url;

        if (variantImg) setSelectedImg(variantImg);
    }, [selectedColor, product]);

    return (
        <div className="flex gap-6 imtes-start">
            {/* Images */}
            <div className="flex flex-col gap-4">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        onClick={() => setSelectedImg(img)}
                        className={`w-25 h-25 object-cover border hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer rounded
                            ${selectedImg === img ? 'border-black shadow-xl -translate-y-1 scale-[1.02]' : "border-gray-300"}
                        `}
                    />
                ))}
            </div>

            {/* Main image */}
            <img 
                src={selectedImg} 
                className="w-150 max-h-115 object-cover rounded-lg" 
            />
        </div>
    );
};

export default ProductGallery;