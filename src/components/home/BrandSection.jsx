import { useState, useEffect } from "react";

import { getProducts } from "../../services/product.service";

import ProductSlider from "../product/ProductSlider";

const brands = [
    { id: 1, name: "Nike" },
    { id: 2, name: "Adidas" },
    { id: 3, name: "Vans" },
    { id: 4, name: "Puma" },
    { id: 5, name: "Converse" },
];

function BrandSection() {
    const [selected, setSelected] = useState("Nike");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getProducts({
                    limit: 10,
                    brand_id: selected.id,
                    sort: "newest"
                });

                setProducts(res.data.data);
            } catch(error) {
                console.error(error);
            }
        };

        fetch();
    }, [selected]);

    return (
        <div className="bg-gray-100 py-14">
            {/* Label */}
            <p className="text-center text-xs font-bold text-orange-500 tracking-widest mb-2">
                POPULAR BRANDS
            </p>

            {/* Title */}
            <h2 className="text-center text-xl font-bold mb-6 tracking-wide">
                THƯƠNG HIỆU NỔI TIẾNG
            </h2>

            {/* Tabs */}
            <div className="flex justify-center gap-3 mb-8">
                {brands.map((brand => (
                    <button
                        key={brand.id}
                        onClick={() => setSelected(brand)}
                        className={`px-4 py-1 text-sm font-semibold rounded-lg border transition
                            ${
                                selected === brand
                                    ? 'bg-black text-white'
                                    : "bg-white text-black border-gray-300 hover:bg-gray-200"
                            }`
                        }
                    >
                        {brand.name}
                    </button>
                )))}
            </div>

            {/* Slider */}
            <div className="max-w-7xl mx-auto px-6">
                <ProductSlider products={products} />
            </div>
        </div>
    );
};

export default BrandSection;