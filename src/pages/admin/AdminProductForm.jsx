import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProductById,
    createProduct,
    updateProduct,
} from "../../services/product.service";

import { getCategories } from "../../services/category.service";
import { getBrands } from "../../services/brand.service";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCircleInfo,
    faLink,
    faLayerGroup,
    faPlus,
    faPen,
    faTrash,
    faXmark,
    faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

const AdminProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = !!id;

    const defaultForm = {
        name: "",
        category_id: "",
        brand_id: "",
        description: "",
        thumbnail: "",
        base_price: "",
        discount_percent: "",
    };

    const defaultVariantForm = {
        color: "",
        size: "",
        price: "",
        stock: "",
        image_url: "",
    };

    const [form, setForm] = useState(defaultForm);
    const [images, setImages] = useState(["", "", "", ""]);
    const [variants, setVariants] = useState([]);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [openVariantModal, setOpenVariantModal] = useState(false);
    const [editingVariantIndex, setEditingVariantIndex] = useState(null);
    const [variantForm, setVariantForm] = useState(defaultVariantForm);

    useEffect(() => {
        fetchOptions();
        if (isEdit) fetchProductDetail();
    }, [id]);

    const fetchOptions = async () => {
        try {
            const [categoryRes, brandRes] = await Promise.all([
                getCategories({ page: 1, limit: 100 }),
                getBrands({ page: 1, limit: 100 }),
            ]);

            setCategories(categoryRes.data?.data || []);
            setBrands(brandRes.data?.data || []);
        } catch (error) {
            console.error("Error fetching options:", error);
            toast.error("Không thể tải danh sách");
        }
    };

    const fetchProductDetail = async () => {
        try {
            setLoading(true);

            const res = await getProductById(id);
            const product = res.data || {};

            setForm({
                name: product.name || "",
                category_id: product.category_id || "",
                brand_id: product.brand_id || "",
                description: product.description || "",
                thumbnail: product.thumbnail || "",
                base_price: product.base_price || "",
                discount_percent: product.discount_percent || "",
            });

            const imageUrls = (product.images || []).map((item) => item.image_url);

            setImages([
                imageUrls[0] || "",
                imageUrls[1] || "",
                imageUrls[2] || "",
                imageUrls[3] || "",
            ]);

            setVariants(
                (product.variants || []).map((variant) => ({
                    color: variant.color || "",
                    size: variant.size || "",
                    price: variant.price || "",
                    sold: variant.sold || "",
                    stock: variant.stock || "",
                    image_url: variant.image_url || "",
                }))
            );
        } catch (error) {
            console.error("Error fetching product detail:", error);
            toast.error("Không thể tải chi tiết sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeImage = (index, value) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const handleOpenAddVariant = () => {
        setEditingVariantIndex(null);
        setVariantForm(defaultVariantForm);
        setOpenVariantModal(true);
    };

    const handleOpenEditVariant = (variant, index) => {
        setEditingVariantIndex(index);

        setVariantForm({
            color: variant.color || "",
            size: variant.size || "",
            price: variant.price || 0,
            stock: variant.stock || 0,
            image_url: variant.image_url || "",
        });

        setOpenVariantModal(true);
    };

    const handleSaveVariant = () => {
        if (!variantForm.color.trim()) {
            toast.error("Vui lòng nhập màu sắc");
            return;
        }

        if (!variantForm.size.trim()) {
            toast.error("Vui lòng nhập kích cỡ");
            return;
        }

        if (!variantForm.price || Number(variantForm.price) < 0) {
            toast.error("Giá biến thể không hợp lệ");
            return;
        }

        if (variantForm.stock === "" || Number(variantForm.stock) < 0) {
            toast.error("Số lượng tồn kho không hợp lệ");
            return;
        }

        const payload = {
            color: variantForm.color.trim(),
            size: variantForm.size.trim(),
            price: Number(variantForm.price),
            stock: Number(variantForm.stock),
            image_url: variantForm.image_url.trim(),
        };

        const isDuplicate = variants.some((item, index) => {
            if (editingVariantIndex !== null && index === editingVariantIndex) return false;

            return (
                item.color.trim().toLowerCase() === payload.color.toLowerCase() &&
                item.size.trim().toLowerCase() === payload.size.toLowerCase()
            );
        });

        if (isDuplicate) {
            toast.error("Biến thể màu sắc và kích cỡ này đã tồn tại");
            return;
        }

        if (editingVariantIndex !== null) {
            const newVariants = [...variants];
            newVariants[editingVariantIndex] = payload;
            setVariants(newVariants);
        } else {
            setVariants((prev) => [...prev, payload]);
        }

        setOpenVariantModal(false);
        setEditingVariantIndex(null);
        setVariantForm(defaultVariantForm);
    };

    const handleDeleteVariant = (index) => {
        setVariants((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            toast.error("Vui lòng nhập tên sản phẩm");
            return;
        }

        if (!form.category_id) {
            toast.error("Vui lòng chọn danh mục");
            return;
        }

        if (!form.brand_id) {
            toast.error("Vui lòng chọn thương hiệu");
            return;
        }

        if (!form.thumbnail.trim()) {
            toast.error("Vui lòng nhập URL ảnh chính của sản phẩm");
            return;
        }

        if (!form.base_price || Number(form.base_price) < 0) {
            toast.error("Giá gốc không hợp lệ");
            return;
        }

        if (form.discount_percent !== "" && (Number(form.discount_percent) < 0 || Number(form.discount_percent) > 100)) {
            toast.error("Khuyến mãi phải từ 0 đến 100%");
            return;
        }

        if (variants.length === 0) {
            toast.error("Vui lòng thêm ít nhất một biến thể sản phẩm");
            return;
        }

        const imageUrls = images
            .map((item) => item.trim())
            .filter(Boolean);

        try {
            setSaving(true);

            const payload = {
                name: form.name.trim(),
                category_id: Number(form.category_id),
                brand_id: Number(form.brand_id),
                description: form.description.trim() || null,
                thumbnail: form.thumbnail.trim(),
                base_price: Number(form.base_price),
                discount_percent: Number(form.discount_percent) || 0,
                images: imageUrls,
                variants: variants.map((variant) => ({
                    color: variant.color,
                    size: variant.size,
                    stock: Number(variant.stock),
                    price: Number(variant.price),
                    image_url: variant.image_url,
                })),
            }

            if (isEdit) {
                await updateProduct(id, payload);
                toast.success("Cập nhật sản phẩm thành công");
            } else {
                await createProduct(payload);
                toast.success("Thêm sản phẩm thành công");
            }

            navigate("/admin/products");
        } catch (error) {
            console.error("Error saving product:", error);
            console.error("Error details:", error.response?.data || error.message);
            toast.error("Không thể lưu sản phẩm");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center pt-24 text-gray-500">
                Đang tải sản phẩm...
            </div>
        );
    }

    return (
        <div>
            {/* Back */}
            <button
                onClick={() => navigate("/admin/products")}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-5"
            >
                <FontAwesomeIcon icon={faArrowLeft} />
                Quay lại
            </button>

            {/* Title */}
            <div className="text-2xl sm:text-3xl font-bold text-center mb-8">
                {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
            </div>

            {/* Main form */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
                {/* General */}
                <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <FontAwesomeIcon icon={faCircleInfo} />
                        <h2 className="font-bold">Thông tin chung</h2>
                    </div>

                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Tên sản phẩm</label>
                            <input
                                value={form.name}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Ví dụ: Nike Air Force 1"
                                className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-gray-500"
                            />
                        </div>

                        {/* Category + Brand */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Category */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Danh mục</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            category_id: e.target.value,
                                        }))
                                    }
                                    className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-gray-500"
                                >
                                    <option value="">Chọn danh mục</option>
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
                                    value={form.brand_id}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            brand_id: e.target.value,
                                        }))
                                    }
                                    className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-gray-500"
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        {/* Price + discount */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Price */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Giá gốc</label>
                                <input
                                    type="number"
                                    value={Number(form.base_price)}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            base_price: e.target.value,
                                        }))
                                    }
                                    placeholder="0"
                                    className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-gray-500"
                                />
                            </div>

                            {/* Discount */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Khuyến mãi (%)</label>
                                <input
                                    type="number"
                                    value={form.discount_percent}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            discount_percent: e.target.value,
                                        }))
                                    }
                                    placeholder="0"
                                    className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-gray-500"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Mô tả sản phẩm</label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                rows={5}
                                placeholder="Nhập mô tả sản phẩm..."
                                className="mt-2 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-gray-500 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <FontAwesomeIcon icon={faLink} />
                        <h2 className="font-bold">Hình ảnh sản phẩm</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Thumbnail */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">URL ảnh chính (Thumbnail)</label>
                            <input
                                value={form.thumbnail}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        thumbnail: e.target.value,
                                    }))
                                }
                                placeholder="https://..."
                                className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-gray-500"
                            />
                        </div>

                        {/* Sub images */}
                        {images.map((img, index) => (
                            <div key={index}>
                                <label className="text-xs font-bold text-gray-400 uppercase">URL ảnh phụ {index + 1}</label>
                                <input
                                    value={img}
                                    onChange={(e) => handleChangeImage(index, e.target.value)}
                                    placeholder="https://..."
                                    className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Variants */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Title */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-5  border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faLayerGroup} />
                        <h2 className="font-bold">Biến thể sản phẩm</h2>
                    </div>

                    <button
                        onClick={handleOpenAddVariant}
                        className="text-xs text-orange-500 font-bold hover:underline"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                        Thêm biến thể
                    </button>
                </div>

                <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block">
                    <table className="w-full min-w-300">
                        <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="text-left px-6 py-4 w-25">STT</th>
                                <th className="text-left px-6 py-4">Hình ảnh</th>
                                <th className="text-left px-6 py-4 w-40">Màu sắc</th>
                                <th className="text-left px-6 py-4 w-40">Kích cỡ</th>
                                <th className="text-left px-6 py-4 w-50">Giá bán</th>
                                <th className="text-left px-6 py-4 w-30">Đã bán</th>
                                <th className="text-left px-6 py-4 w-30">Tồn</th>
                                <th className="text-left px-6 py-4 w-35">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {variants.length > 0 ? (
                                variants.map((variant, index) => {
                                    const stock = Number(variant.stock || 0);

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
                                            key={`${variant.color}-${variant.size}-${index}`}
                                            className="border-t border-gray-100 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 font-semibold">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <img
                                                    src={variant.image_url}
                                                    alt="N/A"
                                                    className="w-15 h-15 rounded-lg object-cover bg-gray-100 border border-gray-200"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-semibold">{variant.color}</td>
                                            <td className="px-6 py-4 font-semibold">{variant.size}</td>
                                            <td className="px-6 py-4 font-semibold">{Number(variant.price || 0).toLocaleString("vi-VN")}đ</td>
                                            <td className="px-6 py-4 font-semibold">{Number(variant.sold || 0)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${stockClass}`}>
                                                    {stockLabel} ({stock})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleOpenEditVariant(variant, index)}
                                                        className="w-8 h-8 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteVariant(index)}
                                                        className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 transition"
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
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                            Chưa có biến thể sản phẩm nào
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex items-center justify-end gap-3">
                <button
                    onClick={() => navigate("/admin/products")}
                    className="w-full sm:w-auto h-11 px-6 rounded-lg text-sm font-bold border border-gray-300 text-black hover:bg-gray-100 transition"
                >
                    Hủy
                </button>

                <button
                    disabled={saving}
                    onClick={handleSubmit}
                    className="w-full sm:w-auto h-11 px-6 rounded-lg bg-orange-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-60 transition"
                >
                    <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
                    Lưu sản phẩm
                </button>
            </div>

            {/* Variant modal */}
            {openVariantModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold uppercase">
                                    {editingVariantIndex !== null ? "Cập nhật biến thể" : "Thêm mới biến thể"}
                                </h2>
                                <p className="text-xs text-orange-500 uppercase font-bold mt-1">Cập nhật kho sản phẩm</p>
                            </div>

                            <button
                                onClick={() => {
                                    setOpenVariantModal(false);
                                    setEditingVariantIndex(null);
                                    setVariantForm(defaultVariantForm);
                                }}
                                className="text-gray-400 hover:text-black"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            {/* Color + Size */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Color */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Màu sắc</label>
                                    <input
                                        value={variantForm.color}
                                        onChange={(e) =>
                                            setVariantForm((prev) => ({
                                                ...prev,
                                                color: e.target.value,
                                            }))
                                        }
                                        placeholder="Ví dụ: Trắng"
                                        className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                                    />
                                </div>

                                {/* Size */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Kích cỡ</label>
                                    <input
                                        value={variantForm.size}
                                        onChange={(e) =>
                                            setVariantForm((prev) => ({
                                                ...prev,
                                                size: e.target.value,
                                            }))
                                        }
                                        placeholder="Ví dụ: 38"
                                        className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            {/* Price _ Stock */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Giá bán</label>
                                    <div className="mt-2 flex h-11 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden focus:border-orange-500">
                                        <input 
                                            type="number" 
                                            value={variantForm.price}
                                            onChange={(e) =>
                                                setVariantForm((prev) => ({
                                                    ...prev,
                                                    price: e.target.value,
                                                }))
                                            }
                                            placeholder="0"
                                            className="w-full px-3 text-sm outline-none bg-transparent"
                                        />

                                        <div className="w-12 flex items-center justify-center text-xs font-bold text-gray-500 border-l border-gray-200">VNĐ</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Tồn kho</label>
                                    <input
                                        type="number"
                                        value={variantForm.stock}
                                        onChange={(e) =>
                                            setVariantForm((prev) => ({
                                                ...prev,
                                                stock: e.target.value,
                                            }))
                                        }
                                        placeholder="0"
                                        className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">URL hình ảnh</label>
                                <input
                                    value={variantForm.image_url}
                                    onChange={(e) =>
                                        setVariantForm((prev) => ({
                                            ...prev,
                                            image_url: e.target.value,
                                        }))
                                    }
                                    placeholder="https://..."
                                    className="mt-2 w-full h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-orange-500"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end px-6 py-5 bg-gray-50 gap-3">
                            <button
                                onClick={() => {
                                    setOpenVariantModal(false);
                                    setEditingVariantIndex(null);
                                    setVariantForm(defaultVariantForm);
                                }}
                                className="w-full sm:w-auto h-11 px-6 rounded-lg text-sm font-bold border border-gray-300 text-black hover:bg-gray-100 transition"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleSaveVariant}
                                className="w-full sm:w-auto h-11 px-6 rounded-lg bg-orange-500 text-white text-sm font-bold hover:opacity-90 transition"
                            >
                                Lưu biến thể
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductForm;