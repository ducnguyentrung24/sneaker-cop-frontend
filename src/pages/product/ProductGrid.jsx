import { useState, useEffect } from "react";
import ProductCard from "../../components/product/ProductCard";
import Pagination from "../../components/common/Pagination";

function ProductGrid({ products = [], pagination = {}, filters, setFilters }) {
    const [search, setSearch] = useState(filters.search || "");

    useEffect(() => {
        setSearch(filters.search || "");
    }, [filters.search]);
    
    const handleSearchSubmit = (e) => {
        const next = search.trim();
        if (next === (filters.search || "")) return;

        setFilters((prev) => ({
            ...prev,
            search: next,
            page: 1,
        }));
    };

    const activeTab = 
        filters.filter === "best_seller"
            ? "best_seller"
            : filters.filter === "discount"
                ? "sale"
                : "all";

    const handleSort = (value) => {
        setFilters((prev) => ({
            ...prev,
            sort: value,
            filter: null,
            page: 1,
        }));
    };

    const handleTab = (type) => {
        let newFilters = {
            page: 1,
            sort: "newest",
            filter: null,
        };

        if (type === "best_seller") newFilters.filter = "best_seller";
        if (type === "sale") newFilters.filter = "discount";

        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            page: 1,
        }));
    };

    return (
        <div className="flex-1">
            {/* Search */}
            <div className="mb-4 flex gap-2">
                <input 
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearchSubmit();
                    }}
                    className="flex-1 border px-4 py-2 rounded-md text-sm  focus:outline-none focus:ring-1 focus:ring-black"
                />

                <button
                    onClick={handleSearchSubmit}
                    className="bg-black text-white px-4 py-2 rounded-md text-sm"
                >
                    Tìm kiếm
                </button>
            </div>

            <div className="flex justify-between items-center mb-4">
                {/* TabS */}
                <div className="flex gap-4">
                    {[
                        { key: "all", label: "Tất cả" },
                        { key: "best_seller", label: "Bán chạy" },
                        { key: "sale", label: "Giảm giá" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => handleTab(tab.key)}
                            className={`px-3 py-1 text-sm  rounded-lg border transition
                                ${
                                    activeTab === tab.key
                                        ? 'bg-black text-white border-black'
                                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <select
                    value={filters.sort || "newest"}
                    onChange={(e) => handleSort(e.target.value)}
                    className="border px-3 py-1.5 text-sm rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá: Thấp đến Cao</option>
                    <option value="price_desc">Giá: Cao đến Thấp</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-x-6 gap-y-8">
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

            {/* Empty */}
            {products.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                    Không có sản phẩm
                </div>
            )}

            {/* Pagination */}
            <Pagination 
                pagination={pagination} 
                onPageChange={(newPage) => 
                        setFilters((prev) => ({
                            ...prev,
                            page: newPage,
                        }))
                    } 
            />
        </div>
    );
};

export default ProductGrid;