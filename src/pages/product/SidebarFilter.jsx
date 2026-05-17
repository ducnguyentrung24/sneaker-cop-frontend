import { useState, useEffect } from "react";

import { getCategories } from "../../services/category.service";
import { getBrands } from "../../services/brand.service";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronDown, faChevronUp, faFilter } from "@fortawesome/free-solid-svg-icons";

function SidebarFilter({ filters, setFilters }) {
    const [categories, setCategories] = useState([]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [brands, setBrands] = useState([]);
    const [showAllBrands, setShowAllBrands] = useState(false);

    const [open, setOpen] = useState(false);

    const [local, setLocal] = useState({
        categories: [],
        brands: [],
        min_price: null,
        max_price: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    getCategories(),
                    getBrands(),
                ]);

                setCategories(catRes.data.data || []);
                setBrands(brandRes.data.data || []);
            } catch(error) {
                console.log("Fetch filter data error: ", error);
            }
        };

        fetchData();
    }, []);

    // Sync local state with filters
    useEffect(() => {
        setLocal({
            categories: filters.category_id || [],
            brands: filters.brand_id || [],
            min_price: filters.min_price,
            max_price: filters.max_price,
        });
    }, [filters]);

    const priceRanges = [
        { label: "Dưới 1tr", min: null, max: 1000000 },
        { label: "1tr - 2tr", min: 1000000, max: 2000000 },
        { label: "2tr - 5tr", min: 2000000, max: 5000000 },
        { label: "Trên 5tr", min: 5000000, max: null },
    ];

    // Toggle checkbox
    const toggleArray = (arr, value) => {
        if (arr.includes(value)) return arr.filter((v) => v !== value);
        return [...arr, value];
    }

    // Apply
    const applyFilter = () => {
        setFilters((prev) => ({
            ...prev,
            category_id: local.categories,
            brand_id: local.brands,
            min_price: local.min_price,
            max_price: local.max_price,
            page: 1,
        }));

        setOpen(false);
    };

    // Clear
    const clearFilter = () => {
        setLocal({
            categories: [],
            brands: [],
            min_price: null,
            max_price: null,
        });
        
        setFilters((prev) => ({
            ...prev,
            category_id: [],
            brand_id: [],
            min_price: null,
            max_price: null,
            page: 1,
        }));
    };

    return (
        <div className="relative w-auto lg:w-64 lg:shrink-0">

            {/* Mobile */}
            <button
                onClick={() => setOpen(!open)}
                className="lg:hidden inline-flex items-center gap-2 px-2 py-1.5 rounded-lg border border-black bg-white text-black text-xs font-bold whitespace-nowrap"
            >
                <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faFilter} />
                    Bộ lọc
                </span>

                <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </button>

            {/* Filter content */}
            <div className={`${open ? "block" : "hidden"} lg:block absolute lg:static right-0 z-40 mt-2 lg:mt-0 w-50 lg:w-auto bg-white border border-gray-200 rounded-xl shadow-sm p-4 lg:p-5 max-h-60 lg:max-h-none overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
                {/* Desktop */}
                <div className="hidden lg:block mb-5">
                    <h2 className="text-lg font-bold mb-1">BỘ LỌC</h2>
                    <p className="text-sm text-gray-400">Tối ưu tìm kiếm của bạn</p>
                </div>  

                {/* Category */}
                <div className="mb-6">
                    <p className="text-xs font-semibold mb-2">DANH MỤC</p>
                    
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {(showAllCategories ? categories : categories.slice(0,5)).map((c) => (
                            <label key={c.id} className="flex items-center gap-2 text-sm mb-1">
                                <input 
                                    type="checkbox"
                                    checked={local.categories.includes(c.id)}
                                    onChange={() =>
                                        setLocal({
                                            ...local,
                                            categories: toggleArray(local.categories, c.id),
                                        })
                                    }
                                />
                                {c.name}
                            </label>
                        ))}
                    </div>

                    {categories.length > 5 && (
                        <button
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="text-xs text-gray-600 mt-1"
                        >
                            {showAllCategories ? "Thu gọn" : "Xem thêm"}
                            <FontAwesomeIcon icon={showAllCategories ? faChevronUp : faChevronDown} />
                        </button>
                    )}
                </div>

                {/* Brands */}
                <div className="mb-6">
                    <p className="text-xs font-semibold mb-2">THƯƠNG HIỆU</p>

                    <div className="max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                        {(showAllBrands ? brands : brands.slice(0,5)).map((b) => (
                            <label key={b.id} className="flex items-center gap-2 text-sm mb-1">
                                <input 
                                    type="checkbox"
                                    checked={local.brands.includes(b.id)}
                                    onChange={() =>
                                        setLocal({
                                            ...local,
                                            brands: toggleArray(local.brands, b.id),
                                        })
                                    }
                                />
                                {b.name}
                            </label>
                        ))}
                    </div>

                    {brands.length > 5 && (
                        <button
                            onClick={() => setShowAllBrands(!showAllBrands)}
                            className="text-xs text-gray-600 mt-1"
                        >
                            {showAllBrands ? "Thu gọn" : "Xem thêm"}
                            <FontAwesomeIcon icon={showAllBrands ? faChevronUp : faChevronDown} />
                        </button>
                    )}
                </div>

                {/* Price */}
                <div className="mb-6">
                    <p className="text-xs font-semibold mb-2">KHOẢNG GIÁ</p>
                    {priceRanges.map((p, i) => (
                        <label key={i} className="flex items-center gap-2 text-sm mb-1">
                            <input
                                type="radio"
                                name="price"
                                checked={local.min_price === p.min && local.max_price === p.max}
                                onChange={() => 
                                    setLocal({
                                        ...local,
                                        min_price: p.min,
                                        max_price: p.max,
                                    })
                                }
                            />
                            {p.label}
                        </label>
                    ))}
                </div>

                {/* Clear */}
                <button
                    onClick={clearFilter}
                    className="w-full text-xs text-gray-600 mb-4 flex items-center justify-center gap-1"
                >
                    <FontAwesomeIcon icon={faXmark} />
                    XÓA BỘ LỌC
                </button>

                {/* Apply */}
                <button
                    onClick={applyFilter}
                    className="w-full text-sm font-medium bg-black text-white py-2 rounded-lg"
                >
                    ÁP DỤNG BỘ LỌC
                </button>
            </div>

            



            
        </div>
    );    
};

export default SidebarFilter;