import { useState, useEffect } from "react";

import { getProducts } from "../../services/product.service";

import ProductSlider from "../product/ProductSlider";

function ProductSection({ title }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getProducts({
                    limit: 10,
                    sort: "sold_desc"
                });

                setProducts(res.data.data);
            } catch(error) {
                console.error(error);
            }
        };

        fetch();
    }, []);

    return (
        <div className="bg-gray-100 py-14">
            {/* Label */}
            <p className="text-center text-xs font-bold text-orange-500 tracking-widest mb-2">
                TOP TRENDING
            </p>

            {/* Title */}
            <h2 className="text-center text-xl font-bold mb-8 tracking-widest">
                {title}
            </h2>

            {/* Slider */}
            <div className="max-w-7xl mx-auto px-6">
                <ProductSlider products={products} />
            </div>
        </div>
    );
};

export default ProductSection;