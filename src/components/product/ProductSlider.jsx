import { useState } from "react";

import ProductCard from "./ProductCard";
import ArrowButton from "../common/ArrowButton";

function ProductSlider({ products = [] }) {
    const [index, setIndex] = useState(0);

    const visibleCount = Math.min(5, products.length);

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">
                Không có sản phẩm
            </div>
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
            <div className="flex gap-4 px-8">
                {visibleProducts.map((p,i) => (
                    <div key={i} className="w-1/5">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
            
            {/* Button arrow left */}
            <ArrowButton direction="left" onClick={prev} />

            {/* Button arrow right */}
            <ArrowButton direction="right" onClick={next} />
            

        </div>
    );
};

export default ProductSlider;