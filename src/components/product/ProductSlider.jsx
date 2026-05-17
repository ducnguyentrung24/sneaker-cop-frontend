import { useState } from "react";

import ProductCard from "./ProductCard";
import ArrowButton from "../common/ArrowButton";

function ProductSlider({ products = [] }) {
    const [index, setIndex] = useState(0);

    const visibleCount = Math.min(5, products.length);

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">Không có sản phẩm</div>
        );
    }

    const next = () => {
        setIndex((prev) => (prev + 1) % products.length);
    };

    const prev = () => {
        setIndex((prev) => (prev - 1 + products.length) % products.length);
    };

    const visibleProducts = [];

    for (let i = 0; i < visibleCount; i++) {
        visibleProducts.push(products[(index + i) % products.length]);
    }

    return (
        <div className="relative">
            {/* List */}
            <div className="flex gap-4 px-4 md:px-8 overflow-x-auto md:overflow-visible pb-3 md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {visibleProducts.map((product, i) => (
                    <div
                        key={`${product.id}-${i}`}
                        className="shrink-0 w-[50%] sm:w-[45%] md:w-1/5"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Arrow button */}
            <div className="hidden md:block">
                <ArrowButton direction="left" onClick={prev} />
                <ArrowButton direction="right" onClick={next} />
            </div>
        </div>
    );
}

export default ProductSlider;