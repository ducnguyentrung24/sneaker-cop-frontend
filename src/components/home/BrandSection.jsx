import { useState, useEffect } from "react";

import { getBrands } from "../../services/brand.service";
import { getProducts } from "../../services/product.service";

import ProductSlider from "../product/ProductSlider";

function BrandSection() {
    const [brands, setBrands] = useState([]);
    const [selected, setSelected] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await getBrands({ limit: 5 });

                setBrands(res.data.data || []);

                if (res.data.data.length > 0) setSelected(res.data.data[0]);
            } catch(error) {
                console.error(error);
            }
        };

        fetchBrands();
    }, []);

    useEffect(() => {
        if (!selected) return;

        const fetchProducts = async () => {
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

        fetchProducts();
    }, [selected]);

    return (
        <div className="bg-gray-100 py-10 sm:py-12 md:py-14 overflow-hidden">
            <p className="text-center text-xs font-bold text-orange-500 tracking-widest mb-2">BRANDS</p>
            <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold mb-6 tracking-wide">THƯƠNG HIỆU NỔI TIẾNG</h2>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 px-4 max-w-3xl mx-auto">
                {brands.map((brand) => (
                    <button
                        key={brand.id}
                        onClick={() => setSelected(brand)}
                        className={`px-4 py-1 text-xs sm:text-sm font-semibold rounded-lg border transition
                            ${
                                selected?.id === brand.id
                                    ? 'bg-black text-white'
                                    : "bg-white text-black border-gray-300 hover:bg-gray-200"
                            }`
                        }
                    >
                        {brand.name}
                    </button>
                ))}
            </div>

            {/* Slider */}
            <div className="max-w-7xl mx-auto px-6">
                <ProductSlider products={products} />
            </div>
        </div>
    );
};

export default BrandSection;