import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getProducts } from "../../services/product.service";
import { getRecommendations } from "../../services/recommendation.service";

import SidebarFilter from "./SidebarFilter";
import ProductGrid from "./ProductGrid";
import ProductSlider from "../../components/product/ProductSlider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar  } from "@fortawesome/free-solid-svg-icons";

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [recommend, setRecommend] = useState([]);

    const location = useLocation();

    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: "",
        categories: [],
        brands: [],
        min_price: null,
        max_price: null,
        sort: "newest",
        filter: null,
    });

    const [loading, setLoading] = useState(false);

    // Recommend products
    useEffect(() => {
        const fetchRecommend = async () => {
            try {
                const res = await getRecommendations({ limit: 10 });

                const recommendations = res.data || [];

                if (recommendations.length === 0) {
                    const fallBackRes = await getProducts({
                        limit: 10,
                        sort: "sold_desc",
                    });

                    setRecommend(fallBackRes.data.data || []);
                    return;
                }

                setRecommend(recommendations);
            } catch(error) {
                try {
                    const fallBackRes = await getProducts({
                        limit: 10,
                        sort: "sold_desc",
                    });

                    setRecommend(fallBackRes.data.data || []);
                } catch(fallbackError) {
                    console.error("Fetch fallback recommend product render: ", fallbackError);
                }
            }
        };

        fetchRecommend();
    }, []);

    // Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const query = { ...filters };

                if (filters.filter === "best_seller") query.sort = "sold_desc";
                if (filters.filter === "discount") query.min_discount_percent = filters.min_discount_percent || 1;
                if (filters.filter !== "discount") delete query.min_discount_percent;
                delete query.filter;

                const res = await getProducts(query);
                
                setProducts(res.data.data || []);
                setPagination(res.data.pagination || {});
            } catch(error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    useEffect(() => {
        if (!location.state) return;

        setFilters((prev) => ({
            ...prev,
            page: 1,
            filter: location.state.filter ?? null,
            sort: location.state.sort ?? "newest",
            min_discount_percent: location.state.filter === "discount"
                ? location.state.min_discount_percent || 1
                : null,
        }));
    }, [location.state]);

    return (
        <div className="max-w-7xl mx-auto sm:px-6 py-10">
            {/* Recommend Section */}
            <div className="bg-[#FFEDD5] border border-orange-500 rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12 overflow-hidden">
                {/* Title */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mx-5">
                    <FontAwesomeIcon icon={faStar } className="text-orange-500 text-lg sm:text-xl" />
                    <p className="text-orange-500 font-bold text-lg sm:text-xl">
                        DÀNH RIÊNG CHO BẠN
                    </p>
                </div>
                
                <p className="text-[12px] sm:text-sm text-gray-500 text-center sm:text-left mb-4 sm:mx-13 leading-relaxed">
                    KHÁM PHÁ NHỮNG MẪU GIÀY ĐƯỢC TUYỂN CHỌN RIÊNG CHO PHONG CÁCH CỦA BẠN.
                </p>

                <ProductSlider products={recommend} />
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row p-6 sm:p-0 gap-6">
                {/* Desktop filter */}
                <div className="hidden lg:block shrink-0">
                    <SidebarFilter
                        filters={filters}
                        setFilters={setFilters}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-3 lg:py-5">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <h2 className="text-base sm:text-lg font-bold">DANH SÁCH SẢN PHẨM</h2>

                        <div className="lg:hidden">
                            <SidebarFilter
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-400">
                            Đang tải sản phẩm...
                        </div>
                    ) : (
                        <ProductGrid
                            products={products}
                            pagination={pagination}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;