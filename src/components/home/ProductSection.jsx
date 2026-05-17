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
        <div className="bg-gray-100 py-10 sm:py-12 md:py-14 overflow-hidden">
            <p className="text-center text-xs font-bold text-orange-500 tracking-widest mb-2">TOP TRENDING</p>

            <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold mb-8 tracking-widest">
                {title}
            </h2>

            <div className="max-w-7xl mx-auto px-6">
                <ProductSlider products={products} />
            </div>
        </div>
    );
};

export default ProductSection;