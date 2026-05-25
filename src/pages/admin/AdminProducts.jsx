import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getProducts,
    deleteProduct,
} from '../../services/product.service';

import { getCategories } from '../../services/category.service';
import { getBrands } from '../../services/brand.service';

import Pagination from '../../components/common/Pagination';
import ConfirmDeleteModal from '../../components/admin/common/ConfirmDeleteModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faPlus,
    faPen,
    faTrash,
    faRotateRight,
} from '@fortawesome/free-solid-svg-icons';

import toast from 'react-hot-toast';

const AdminProducts = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    const [keyword, setKeyword] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    const [categoryId, setCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [sort, setSort] = useState('newest');

    const [deleteItem, setDeleteItem] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [page, searchKeyword, categoryId, brandId, sort]);

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const [categoryRes, brandRes] = await Promise.all([
                getCategories({ page: 1, limit: 100 }),
                getBrands({ page: 1, limit: 100 }),
            ]);

            setCategories(categoryRes.data?.data || []);
            setBrands(brandRes.data?.data || []);
        } catch (error) {
            console.error('Error fetching options:', error);
            toast.error('Không thể tải danh sách');  
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await getProducts({
                limit: 10,
                search: searchKeyword,
                category_id: categoryId || undefined,
                brand_id: brandId || undefined,
                page,
                sort,
            });

            setProducts(res.data?.data || []);
            setPagination({
                ...res.data?.pagination,
                total_pages: res.data?.pagination.total_pages || 1,
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            console.error('Error response:', error.response);
            toast.error('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        setSearchKeyword(keyword.trim());
    };

    const handleReset = () => {
        setKeyword('');
        setSearchKeyword('');
        setCategoryId('');
        setBrandId('');
        setSort('newest');
        setPage(1);
    };

    const handleConfirmDelete = async () => {
        if (!deleteItem) return;

        try {
            setDeleting(true);

            await deleteProduct(deleteItem.id);

            toast.success("Xóa sản phẩm thành công");
            setDeleteItem(null);

            if (products.length === 1 && page > 1) setPage(page - 1);
            else fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Không thể xóa sản phẩm");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className='mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                <div>
                    <h1 className='text-2xl sm:text-3xl font-bold uppercase'>Quản lý sản phẩm</h1>
                    <p className='text-sm text-gray-500 mt-1'>Danh sách sản phẩm và quản lý kho hàng</p>
                </div>

                <button
                    onClick={() => navigate('/admin/products/new')}
                    className='h-11 px-5 bg-orange-500 text-white rounded-lg text-sm font-bold hover:opacity-90 transition shrink-0'
                >
                    <FontAwesomeIcon icon={faPlus} className='mr-2' />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Filters */}
            <div className='bg-white rounded-2xl p-4 sm:p-5 shadow-sm mb-5'>
                <div className='grid grid-cols-1 lg:grid-cols-[1fr_120px_160px_160px_140px_100px] gap-3 lg:items-end'>
                    {/* Search */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Tìm kiếm</label>
                        <div className='mt-2 relative'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm' />
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                                placeholder='Tìm theo tên sản phẩm...'
                                className='w-full h-11 rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-orange-500'
                            />
                        </div>
                    </div>

                    {/* Button search */}
                    <button
                        onClick={handleSearch}
                        className='h-11 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition'
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-2' />
                        Tìm kiếm
                    </button>

                    {/* Category */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Danh mục</label>
                        <select
                            value={categoryId}
                            onChange={(e) => {
                                setPage(1);
                                setCategoryId(e.target.value);
                            }}
                            className='mt-2 w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-orange-500'
                        >
                            <option value="">Tất cả</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Thương hiệu</label>
                        <select
                            value={brandId}
                            onChange={(e) => {
                                setPage(1);
                                setBrandId(e.target.value);
                            }}
                            className='mt-2 w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-orange-500'
                        >
                            <option value="">Tất cả</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Sắp xếp</label>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setPage(1);
                                setSort(e.target.value);
                            }}
                            className='mt-2 w-full h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-orange-500'
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price_asc">Giá: Thấp đến cao</option>
                            <option value="price_desc">Giá: Cao đến thấp</option>
                            <option value="sold_desc">Bán chạy</option>  
                        </select>
                    </div>

                    {/* Button reset */}
                    <button
                        onClick={handleReset}
                        className='h-11 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition'
                    >
                        <FontAwesomeIcon icon={faRotateRight} className='mr-2' />
                        Đặt lại
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
                <div className='overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block'>
                    <table className='w-full min-w-300 text-sm table-fixed'>
                        <thead className='bg-gray-50 text-gray-400 uppercase text-xs'>
                            <tr>
                                <th className="text-left px-6 py-4 w-15">STT</th>
                                <th className="text-left px-6 py-4 w-25">Ảnh</th>
                                <th className="text-left px-6 py-4 w-40">Tên sản phẩm</th>
                                <th className="text-left px-6 py-4 w-35">Danh mục</th>
                                <th className="text-left px-6 py-4 w-35">Thương hiệu</th>
                                <th className="text-left px-6 py-4 w-35">Khuyến mãi</th>
                                <th className="text-left px-6 py-4 w-35">Giá bán</th>
                                <th className='text-left px-6 py-4 w-25'>Đã bán</th>
                                <th className="text-left px-6 py-4 w-30">Tồn kho</th>
                                <th className="text-left px-6 py-4 w-30">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className='px-6 py-12 text-center text-gray-400 '>
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : products.length > 0 ? (
                                products.map((product, index) => {
                                    const discount = Number(product.discount_percent || 0);
                                    const stock = Number(product.total_stock || product.stock || 0);

                                    let stockLabel = 'Còn hàng';
                                    let stockClass = 'bg-green-50 text-green-600';

                                    if (stock <= 0) {
                                        stockLabel = 'Hết hàng';
                                        stockClass = 'bg-red-50 text-red-600';
                                    } else if (stock <= 10) {
                                        stockLabel = 'Sắp hết';
                                        stockClass = 'bg-orange-50 text-orange-600';
                                    }

                                    return (
                                        <tr
                                            key={product.id}
                                            className='border-t border-gray-100 hover:bg-gray-50 transition'
                                        >
                                            <td className="px-6 py-5 font-semibold">{(page - 1) * 10 + index + 1}</td>
                                            <td className="px-6 py-5">
                                                <img 
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    className='w-15 h-15 rounded-lg object-cover bg-gray-100 border border-gray-200'
                                                />
                                            </td>
                                            <td className="px-6 py-5 font-semibold">
                                                <p className='line-clamp-2'>{product.name}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className='line-clamp-2 font-semibold'>{product.category_name || "N/A"}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className='line-clamp-2 font-semibold'>{product.brand_name || "N/A"}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`font-semibold ${discount > 0 ? "text-orange-500" : "text-gray-400"}`}>
                                                    -{discount}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 font-semibold">{Math.round(Number(product.final_price || 0)).toLocaleString("vi-VN")}đ</td>
                                            <td className="px-6 py-5 font-semibold">{product.sold || 0}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${stockClass}`}>
                                                    {stockLabel} ({stock})
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className='flex items-center justify-center gap-3'>
                                                    <button
                                                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                                                        className='w-9 h-9 rounded-lg text-blue-500 hover:bg-blue-50 transition'
                                                        title="Cập nhật sản phẩm"
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>

                                                    <button
                                                        onClick={() => setDeleteItem(product)}
                                                        className='w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition'
                                                        title="Xóa sản phẩm"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={9} className='px-6 py-12 text-center text-gray-400'>
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Pagination */}
            <Pagination
                pagination={pagination}
                onPageChange={setPage}
            />

            {/* Confirm delete */}
            <ConfirmDeleteModal
                open={!!deleteItem}
                title="Xóa sản phẩm"
                message={`Bạn có chắc muốn xóa sản phẩm "${deleteItem?.name}"?`}
                loading={deleting}
                onClose={() => setDeleteItem(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default AdminProducts;