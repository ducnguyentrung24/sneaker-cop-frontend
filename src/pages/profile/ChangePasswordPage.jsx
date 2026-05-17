import { useState } from "react";

import { changePassword } from "../../services/user.service";

import ProfileSidebar from "../../components/profile/ProfileSidebar";

import toast from "react-hot-toast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faEyeSlash,
    faLock,
} from "@fortawesome/free-solid-svg-icons";

function ChangePasswordPage() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        if (!form.old_password || !form.new_password || !form.confirm_password) 
            return "Vui lòng điền đầy đủ thông tin!";
        if (form.new_password.length < 6)
            return "Mật khẩu mới phải có ít nhất 6 ký tự!";
        if (form.new_password !== form.confirm_password)
            return "Mật khẩu xác nhận không khớp!";

        return null;
    };

    const handleSubmit = async (e) => {
        const error = validate();
        if (error) {
            toast.error(error);
            return;
        }

        try {
            setLoading(true);
            await changePassword({
                old_password: form.old_password,
                new_password: form.new_password
            })
            
            toast.success("Đổi mật khẩu thành công");

            setForm({
                old_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch(error) {
            toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-min-screen bg-[#F3F3F4] px-4 sm:px-6 py-8 sm:py-10">
            <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 lg:gap-8">
                <ProfileSidebar active="change-password" />

                <div className="col-span-12 lg:col-span-9">
                    {/* Header */}
                    <div className="mb-6 text-center lg:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Thay đổi mật khẩu</h1>

                        <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác và thường xuyên cập nhật mật khẩu mới.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl p-5 sm:p-8 shadow-sm w-full max-w-xl mx-auto lg:mx-0">
                        {/* Old password */}
                        <div className="mb-5">
                            <label className="mb-1 block text-sm text-gray-500">Mật khẩu hiện tại:</label>

                            <div className="relative">
                                <input
                                    type={showPassword.old ? "text" : "password"}
                                    name="old_password"
                                    value={form.old_password}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 px-3 py-2 pr-10 text-sm outline-none rounded-lg focus:ring-2 focus:ring-orange-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    <FontAwesomeIcon icon={showPassword.old ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {/* New password */}
                        <div className="mb-5">
                            <label className="mb-1 block text-sm text-gray-500">Mật khẩu mới:</label>

                            <div className="relative">
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    name="new_password"
                                    value={form.new_password}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 px-3 py-2 pr-10 text-sm outline-none rounded-lg focus:ring-2 focus:ring-orange-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    <FontAwesomeIcon icon={showPassword.new ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {/* Confirm passowrd */}
                        <div className="mb-5">
                            <label className="mb-1 block text-sm text-gray-500">Xác nhận mật khẩu:</label>

                            <div className="relative">
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    name="confirm_password"
                                    value={form.confirm_password}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 px-3 py-2 pr-10 text-sm outline-none rounded-lg focus:ring-2 focus:ring-orange-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    <FontAwesomeIcon icon={showPassword.confirm ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {/* Button */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
