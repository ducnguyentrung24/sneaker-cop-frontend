import { useState, useEffect } from "react";

import {
    getAllUsers,
    createUser,
    updateUser,
    updateUserStatus,
} from "../../services/user.service";

import Pagination from "../../components/common/Pagination";
import ConfirmDeleteModal from "../../components/admin/common/ConfirmDeleteModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faPlus,
    faPen,
    faLock,
    faLockOpen,
    faTrash,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

function AdminUsers() {
    const defaultForm = {
        full_name: "",
        email: "",
        phone: "",
        password: "",
        role: "CUSTOMER",
        is_active: true,
    };

    const [loading, setLoading] = useState(false); 
    const [users, setUsers] = useState([]);

    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);

    const [keyword, setKeyword] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const[editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState(defaultForm);

    const [statusUser, setStatusUser] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [page, searchKeyword]);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const res = await getAllUsers({
                page,
                limit: 5,
                keyword: searchKeyword,
                sort: "created_at:desc",
            });

            setUsers(res.data.data);
            setPagination({
                ...res.data.pagination,
                total_pages: res.data.pagination?.totalPages || 1,
            });
        } catch (error) {
            console.error("Fetch users failed:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        setSearchKeyword(keyword.trim());
    };

    const handleOpenCreate = () => {
        setEditingUser(null);
        setForm(defaultForm);
        setOpenModal(true);
    };

    const handleOpenEdit = (user) => {
        setEditingUser(user);
        setForm({
            full_name: user.full_name || "",
            email: user.email || "",
            phone: user.phone || "",
            password: "",
            role: user.role || "CUSTOMER",
            is_active: user.is_active,
        });
        setOpenModal(true);
    };

    const handleSubmit = async () => {
        if (!form.full_name.trim()) {
            toast.error("Vui lòng nhập họ tên");
            return;
        }

        if (!editingUser && !form.email.trim()) {
            toast.error("Vui lòng nhập email");
            return;
        }

        if (!editingUser && !form.password.trim()) {
            toast.error("Vui lòng nhập mật khẩu");
            return;
        }

        if (form.phone.trim() && !/^\d{10,15}$/.test(form.phone.trim())) {
            toast.error("Số điện thoại phải chứa 10-15 chữ số");
            return;
        }

        try {
            if (editingUser) {
                await updateUser(editingUser.id, {
                    full_name: form.full_name.trim(),
                    phone: form.phone.trim() || null,
                    role: form.role,
                });

                toast.success("Cập nhật người dùng thành công");
            } else {
                await createUser({
                    full_name: form.full_name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim() || null,
                    password: form.password.trim(),
                    role: form.role,
                    is_active: form.is_active,
                });

                toast.success("Tạo người dùng thành công");
            }

            setOpenModal(false);
            setEditingUser(null);
            setForm(defaultForm);
            fetchUsers();
        } catch(error) {
            console.error("Submit user failed:", error);
            toast.error("Không thể lưu người dùng");
        }
    };

    const handleOpenStatusModal = (user) => {
        setStatusUser(user);
    };

    const handleConfirmStatusChange = async () => {
        if (!statusUser) return;

        try {
            setUpdatingStatus(true);

            await updateUserStatus(statusUser.id, !statusUser.is_active);
            toast.success(statusUser.is_active ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản");

            setStatusUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Toggle user status failed:", error);
            toast.error("Không thể cập nhật trạng thái người dùng");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const roleMap = {
        ADMIN: {
            label: "Quản trị viên",
            className: "bg-blue-50 text-blue-600",
        },
        CUSTOMER: {
            label: "Người dùng",
            className: "bg-gray-50 text-gray-600",
        },
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold uppercase">Quản lý người dùng</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý danh sách thành viên và phân quyền truy cập</p>
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
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                                placeholder="Tìm kiếm tên, email, số điện thoại..."
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
                <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:[-ms-overflow-style:auto] sm:[scrollbar-width:thin] sm:[&::-webkit-scrollbar]:block">
                    <table className="w-full min-w-280 text-sm table-fixed">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="text-left px-6 py-4 w-30">STT</th>
                                <th className="text-left px-6 py-4 w-1/5">Họ và tên</th>
                                <th className="text-left px-6 py-4">Email</th>
                                <th className="text-left px-6 py-4 w-40">Số điện thoại</th>
                                <th className="text-left px-6 py-4 w-32">Vai trò</th>
                                <th className="text-left px-6 py-4 w-32">Trạng thái</th>
                                <th className="text-center px-6 py-4 w-32">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((user, index) => {
                                    const role = roleMap[user.role]

                                    return (
                                        <tr
                                            key={user.id}
                                            className="border-t border-gray-100 hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-5 font-semibold">{(page-1) *5 + index + 1 }</td>
                                            <td className="px-6 py-5 font-semibold">
                                                <p className="line-clamp-2">{user.full_name}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="line-clamp-2">{user.email}</p>
                                            </td>
                                            <td className="px-6 py-5">{user.phone}</td>
                                            <td className="px-6 py-5">
                                                <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${role.className}`}>
                                                    {role.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap
                                                    ${user.is_active
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-600"
                                                    }
                                                `}>
                                                    {user.is_active ? "Mở" : "Khóa"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleOpenEdit(user)}
                                                        className="w-9 h-9 rounded-lg text-blue-500 hover:bg-blue-50 transition"
                                                        title="Cập nhật nguời dùng"
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>

                                                    <button
                                                        disabled={updatingStatus}
                                                        onClick={() => handleOpenStatusModal(user)}
                                                        className={`w-9 h-9 rounded-lg transition disabled:opacity-60
                                                            ${user.is_active
                                                                ? "text-red-500 hover:bg-red-50"
                                                                : "text-green-500 hover:bg-green-50"
                                                            }   
                                                        `}
                                                        title={user.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                                    >
                                                        <FontAwesomeIcon icon={user.is_active ? faLock : faLockOpen} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) 
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        Không có người dùng nào
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

            {/* Create/Edit Modal */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-bold uppercase">
                                    {editingUser ? "Cập nhật người dùng" : "Thêm người dùng mới"}
                                </h2>
                                <p className="text-xs text-gray-400 uppercase mt-1">
                                    Thông tin chi tiết thành viên
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setEditingUser(null);
                                    setForm(defaultForm);
                                }}
                                className="text-gray-400 hover:text-black transition"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Họ và tên</label>
                                <input
                                    value={form.full_name}
                                    onChange={(e) => 
                                        setForm((prev) => ({
                                            ...prev,
                                            full_name: e.target.value,
                                        }))
                                    }
                                    placeholder="Nhập họ và tên..."
                                    className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                                <input
                                    value={form.email}
                                    disabled={!!editingUser}
                                    onChange={(e) => 
                                        setForm((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    placeholder="example@email.com"
                                    className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-500 disabled:bg-gray-100 disabled:text-gray-400"
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Mật khẩu</label>
                                    <input
                                        type="password"
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                password: e.target.value,
                                            }))
                                        }
                                        placeholder="Nhập mật khẩu..."
                                        className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-500"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Số điện thoại</label>
                                    <input
                                        value={form.phone}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        placeholder="Nhập số điện thoại..."
                                        className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Vai trò</label>
                                    <select 
                                        value={form.role}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                role: e.target.value,
                                            }))
                                        }
                                        className="mt-2 w-full h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-orange-500 bg-white"
                                    >
                                        <option value="CUSTOMER">Người dùng</option>
                                        <option value="ADMIN">Quản trị viên</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-5 bg-gray-50 gap-3">
                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setEditingUser(null);
                                    setForm(defaultForm);
                                }}
                                className="h-11 px-5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="h-11 px-5 rounded-lg bg-orange-500 text-white text-sm font-bold hover:opacity-90 transition"
                            >
                                Lưu người dùng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm lock/nlock modal */}
            <ConfirmDeleteModal
                open={!!statusUser}
                title={statusUser?.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                message={
                    statusUser?.is_active
                        ? `Bạn có chắc muốn khóa tài khoản ${statusUser?.full_name}?`
                        : `Bạn có chắc muốn mở khóa tài khoản ${statusUser?.full_name}?`
                }
                loading={updatingStatus}
                onClose={() => setStatusUser(null)}
                onConfirm={handleConfirmStatusChange}
            />
        </div>
    );
};

export default AdminUsers;