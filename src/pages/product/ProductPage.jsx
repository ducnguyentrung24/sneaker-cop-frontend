import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getProducts } from "../../services/product.service";

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
                const res = await getProducts({
                    limit: 10,
                    sort: "sold_desc",
                });

                setRecommend(res.data.data);
            } catch(error) {
                console.error("Fetch recommend products error: ", error);
            }
        };

        fetchRecommend();
    }, []);

    // Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await getProducts(filters);

                setProducts(res.data.data);
                setPagination(res.pagination);
            } catch(error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    useEffect(() => {
        if (location.state?.filter) {
            setFilters((prev) => ({
                ...prev,
                filter: location.state.filter,
            }));
        }
    }, [location.state]);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            {/* Recommend Section */}
            <div className="bg-[#FFEDD5] border border-orange-500 rounded-2xl p-6 mb-12">
                {/* Title */}
                <div className="flex items-center gap-2 mb-2 mx-5">
                    <FontAwesomeIcon icon={faStar } className="text-orange-500 text-xl" />
                    <p className="text-orange-500 font-bold text-xl">
                        DÀNH RIÊNG CHO BẠN
                    </p>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 mx-13">
                    KHÁM PHÁ NHỮNG MẪU GIÀY ĐƯỢC TUYỂN CHỌN RIÊNG CHO PHONG CÁCH CỦA BẠN.
                </p>

                <ProductSlider products={recommend} />
            </div>

            {/* Main Content */}
            <div className="flex gap-8">
                {/* Sidebar */}
                <SidebarFilter
                    filters={filters}
                    setFilters={setFilters}
                />

                {/* Content */}
                <div className="flex-1 py-5">
                    <h2 className="text-lg font-bold mb-4">DANH SÁCH SẢN PHẨM</h2>

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