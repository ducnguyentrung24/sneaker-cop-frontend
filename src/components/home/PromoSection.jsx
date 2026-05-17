import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../../services/product.service";

import ProductSlider from "../product/ProductSlider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

function PromoSection() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const res = await getProducts({
                limit: 10,
                min_discount_percent: 50,
                sort: "newest"
            });

            setProducts(res.data.data);
        };

        fetch();
    }, []);

    return (
        <div className="py-10 sm:py-12 md:py-14 bg-linear-to-r from-[#67081d] to-[#9F1239] relative overflow-hidden">
            {/* Top label */}
            <p className="text-center text-xs text-white/60 tracking-[4px] mb-3">SPECIAL OFFER</p>

            {/* Title */}
            <h2 className="text-white text-2xl sm:text-3xl md:text-5xl font-extrabold text-center leading-tight md:leading-none">
                SIÊU KHUYẾN MÃI
            </h2>

            {/* Top deal badge */}
            <div className="absolute right-4 sm:right-10 md:right-1/2 md:translate-x-70 top-5 sm:top=7 md:top-8 bg-yellow-400 text-black text-xs font-bold px-1.5 py-1.5 sm:py-2 rounded-lg shadow-lg flex items-center gap-1 -rotate-20">
                <FontAwesomeIcon icon={faFire} />
                TOP DEAL
            </div>

            {/* Product slider */}
            <div className="max-w-7xl mx-auto mt-8 sm:mt-10 px-4 sm:px=6">
                <ProductSlider products={products} />
            </div>

            {/* Button */}
            <div className="text-center mt-8 sm:mt-10 px-4">
                <button 
                    onClick={() => navigate("/products", {
                        state: { filter: "discount" }
                    })}
                    className="inline-flex items-center gap-2 bg-yellow-400 text-[#67081d] px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide rounded shadow hover:shadow-lg hover:scale-[1.02] transition">
                        KHÁM PHÁ TOÀN BỘ ƯU ĐÃI
                        <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
            </div>
        </div>
    );
};

export default PromoSection;