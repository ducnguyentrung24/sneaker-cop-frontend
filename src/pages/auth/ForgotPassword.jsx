import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { forgotPassword } from "../../services/auth.service";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        if (!email.trim()) {
            toast.error("Vui lòng nhập email tài khoản đã đăng ký tài khoản của bạn");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            toast.error("Email không hợp lệ");
            return;
        }

        try {
            setLoading(true);

            const res = await forgotPassword(email.trim());
            toast.success("Mã OTP đã được gửi đến email cửa bạn");

            navigate("/reset-password", {
                state: { 
                    email: email.trim(),
                    resend_after_seconds: res.data?.send_after_seconds || 0,
                },
            });
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error(
                error.response?.error ||
                error.response?.data?.message ||
                "Gửi OTP thất bại. Vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f3f3f3]">
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-sm bg-white px-8 py-10 shadow-sm">
                    <h1 className="text-2xl font-bold uppercase text-center">Quên mật khẩu</h1>
                    <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
                        Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7">
                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                            <input 
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="mt-2 w-full h-11 bg-[#eeeeee] px-4 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full h-12 bg-orange-500 text-white text-sm font-bold uppercase hover:opacity-60 transition"
                        >
                            {loading ? "Đang gửi..." : "Gửi OTP"}
                        </button>
                    </form>

                    {/* Back */}
                    <div className="text-center mt-5">
                        <Link to="/login" className="text-xs text-gray-500 hover:text-orange-500 transition">
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;