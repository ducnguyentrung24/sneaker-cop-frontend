import { useState, useEffect } from "react";

import Pagination from "../../common/Pagination";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faPlus,
    faPen,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

const CategoryBrand = ({
    title,
    description,
    entityName,
    searchPlaceholder,
    getData,
    createData,
    updateData,
    deleteData,
}) => {
    const defaultForm = {
        name: "",
        description: "",
    };

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState(defaultForm);

    const [deleteItem, setDeleteItem] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [page, searchKeyword]);

    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await getData({
                page,
                limit: 5,
                keyword: searchKeyword,
            });

            setItems(res.data.data);
            setPagination({
                ...res.data.pagination,
                total_pages: res.data.pagination?.totalPages || 1,
                hasPrev: page > 1,
                hasNext: page < (res.data.pagination?.totalPages || 1),
            });
        } catch(error) {
            console.error("Error fetching data:", error);
            toast.error(`Không thể tải danh sách ${entityName}`);
        } finally {
            setLoading(false);
        }  
    };

    const handleSearch = () => {
        setPage(1);
        setSearchKeyword(keyword.trim());
    };

    const handleOpenCreate = () => {
        setEditingItem(null);
        setForm(defaultForm);
        setOpenModal(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setForm({
            name: item.name || "",
            description: item.description || "",
        });
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            toast.error("Tên không được để trống");
            return;
        }

        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
            }

            if (editingItem) {
                await updateData(editingItem.id, payload);
                toast.success(`Cập nhật ${entityName} thành công`);
            } else {
                await createData(payload);
                toast.success(`Thêm mới ${entityName} thành công`);
            }

            setOpenModal(false);
            setEditingItem(null);
            setForm(defaultForm);
            fetchData();
        } catch(error) {
            console.error("Error submitting data:", error);
            toast.error(`Không thể lưu ${entityName}`);
        }
    };

    const handleOpenDelete = async (item) => {
        setDeleteItem(item);
    };

    const handleConfirmDelete = async () => {
        if (!deleteItem) return;

        try {
            setDeleting(true);

            await deleteData(deleteItem.id);
            toast.success(`Xóa ${entityName} thành công`);

            setDeleteItem(null);

            if (items.length === 1 && page > 1) setPage(page - 1);
            else fetchData();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error(`Không thể xóa ${entityName}`);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
                    <p className="text-smm text-gray-500 mt-1">{description}</p>
                </div>
            </div>

            {/* Search + Add */}
            <div className="mb-5">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px_140px] gap-3 lg:items-end">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase">Tìm kiếm</label>
                        <div className="mt-2 relative">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                onKeyDown={(e) => { if(e.key === "Enter") handleSearch() }}
                                placeholder={searchPlaceholder}
                                className="w-full h-11 rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-orange-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="h-11 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 transition"
                    >
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 text-xs" />
                        Tìm kiếm
                    </button>

                    <button
                        onClick={handleOpenCreate}
                        className="h-11 bg-orange-500 text-white rounded-lg text-sm font-bold hover:opacity-90 transition"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Thêm mới
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-220 text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="text-left px-6 py-4 w-30">STT</th>
                                <th className="text-left px-6 py-4 w-1/4">Tên {entityName}</th>
                                <th className="text-left px-6 py-4">Mô tả</th>
                                <th className="text-left px-6 py-4 w-40">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : items.length > 0 ? (
                                items.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-5 font-semibold">{(page - 1) * 5 + index + 1}</td>
                                        <td className="px-6 py-5 font-semibold">
                                            <p className="line-clamp-2">{item.name}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="line-clamp-2">{item.description || "Không có mô tả nào!"}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="w-9 h-9 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                                                >
                                                    <FontAwesomeIcon icon={faPen} />
                                                </button>

                                                <button
                                                    onClick={() => handleOpenDelete(item)}
                                                    className="w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        Không có dữ liệu
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

            {/* Modal */}
            {openModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <h2 className="text-lg font-bold uppercase">
                                {editingItem
                                    ? `Chỉnh sửa ${entityName}`
                                    : `Thêm mới ${entityName}`
                                }
                            </h2>

                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setEditingItem(null);
                                    setForm(defaultForm);
                                }}
                                className="text-gray-400 hover:text-black transition"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Tên {entityName}</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => 
                                        setForm((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder={`Nhận tên ${entityName}`}                              
                                    className="w-full h-11 mt-2 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Mô tả</label>
                                <textarea 
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    rows={4}
                                    placeholder={`Nhập mô tả chi tiết ${entityName} này...`}                              
                                    className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-orange-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-5 bg-gray-50 gap-3">
                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setEditingItem(null);
                                    setForm(defaultForm);
                                }}
                                className="flex-1 h-11 px-5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
                            >
                                Hủy
                            </button>

                            <button
                                disabled={loading}
                                onClick={handleSubmit}
                                className="flex-1 h-11 px-5 bg-orange-500 text-white rounded-lg text-sm font-bold hover:opacity-90 transition"
                            >
                                Lưu {entityName}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                open={!!deleteItem}
                title={`Xác nhận xóa ${entityName}`}
                message={`Bạn có chắc chắn muốn xóa ${entityName} "${deleteItem?.name}" không?`}
                loading={deleting}
                onClose={() => setDeleteItem(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default CategoryBrand;