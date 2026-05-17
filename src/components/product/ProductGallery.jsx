import { useEffect, useMemo, useState } from "react";

function ProductGallery({ product, selectedColor }) {
    const [selectedImg, setSelectedImg] = useState(product.thumbnail);

    useEffect(() => {
        setSelectedImg(product.thumbnail);
    }, [product]);

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
        <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6 items-center md:items-start w-full">
            {/* Images */}
            <div className="flex md:flex-col gap-3 md:gap-4 w-full md:w-auto overflow-x-auto md:overflow-visible pb-2 md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={img}
                        onClick={() => setSelectedImg(img)}
                        className={`shrink-0 w-18 h-18 sm:22 sm:h-22 md:w-25 md:h-25 object-cover border hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer rounded
                            ${selectedImg === img 
                                ? 'border-black shadow-xl' 
                                : "border-gray-300"
                            }
                        `}
                    />
                ))}
            </div>

            {/* Main image */}
            <img 
                src={selectedImg} 
                className="w-full md:w-150 max-h-115 object-cover rounded-lg" 
            />
        </div>
    );
};

export default ProductGallery;