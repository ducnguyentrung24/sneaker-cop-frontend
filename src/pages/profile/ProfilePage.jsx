import { useState, useEffect } from "react";

import ProfileSidebar from "../../components/profile/ProfileSidebar";

import { getProfile, updateProfile } from "../../services/user.service";

import toast from "react-hot-toast";

function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [user, setUser] = useState(null);

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
    });

    const fetchUser = async () => {
        try {
            const res = await getProfile();
            setUser(res.data);
            setForm({
                full_name: res.data.full_name || "",
                email: res.data.email || "",
                phone: res.data.phone || "",
            });
        } catch(error) {
            toast.error("Không thể tải thông tin người dùng!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            await updateProfile({
                full_name: form.full_name,
                phone: form.phone,
            });

            toast.success("Cập nhật thông tin thành công!");

            await fetchUser();
        } catch (error){
            toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Đang tải...</div>;

    return (
        <div className="min-h-screen bg-[#F3F3F4] px-4 sm:px-6 py-8 sm:py-10">
            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 lg:gap-8">
                <ProfileSidebar />

                {/* Content */}
                <div className="col-span-12 lg:col-span-9">
                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Thông tin cá nhân</h1>

                        <p className="text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8">
                            Cập nhật chi tiết hồ sơ của bạn để có trải nghiệm mua sắm tốt nhất.
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl p-5 sm:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full max-w-2xl">
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-6 sm:mb-8">
                            <div className="w-18 h-18 sm:w-20 sm:h-20 bg-black text-white flex items-center justify-center rounded-xl text-2xl font-bold shadow">
                                {form.full_name?.charAt(0).toUpperCase()}
                            </div>

                            <p className="mt-4 font-semibold text-base sm:text-lg text-center">
                                {form.full_name}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                                Thành viên từ{" "}
                                {user?.created_at
                                    ? new Date(user.created_at).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                    : ""
                                }
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <label className="text-xs uppercase tracking-wide font-semibold text-gray-400">
                                    Họ và tên
                                </label>

                                <input
                                    name="full_name"
                                    value={form.full_name}
                                    onChange={handleChange}
                                    className="w-full mt-2 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:black"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide font-semibold text-gray-400">
                                    EMAIL
                                </label>

                                <input
                                    name="email"
                                    value={form.email}
                                    disabled
                                    className="w-full mt-2 border border-gray-200 rounded-lg p-3 text-sm bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide font-semibold text-gray-400">
                                    Số điện thoại
                                </label>

                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className="w-full mt-2 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:black"
                                />
                            </div>

                            <div className="pt-3 sm:pt-4 flex justify-center">
                                <button
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold shadow hover:opacity-90 trasition disabled:opacity-60"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;