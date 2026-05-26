import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    forgotPassword,
    resetPassword,
} from "../../services/auth.service";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye,
    faEyeSlash,
    faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import toast from "react-hot-toast";

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(location.state?.resend_after_seconds || 0);
        
    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    const handleResendOtp = async () => {
        if (countdown > 0) return;

        if (!email.trim()) {
            toast.error("Vui lòng nhập email để gửi lại OTP");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            toast.error("Email không hợp lệ");
            return;
        }

        try {
            setResending(true);

            await forgotPassword(email.trim());
            toast.success("Đã gửi lại mã OTP");
            setCountdown(60);
        } catch(error) {
            console.error("Resend OTP error:", error);
            toast.error("Gửi lại OTP thất bại. Vui lòng thử lại sau.");
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Vui lòng nhập email");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            toast.error("Email không hợp lệ");
            return;
        }

        if (!otp.trim()) {
            toast.error("Vui lòng nhập mã OTP");
            return;
        }

        if (!newPassword.trim()) {
            toast.error("Vui lòng nhập mật khẩu mới");
            return;
        }

        if (newPassword.trim().length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            toast.error("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            setLoading(true);

            await resetPassword({
                email: email.trim(),
                otp: otp.trim(),
                new_password: newPassword.trim(),
            });
            toast.success("Đặt lại mật khẩu thành công.");
            navigate("/login");
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error(
                error.response?.data?.message ||
                error.response?.error ||
                "Đặt lại mật khẩu thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f3f3f3]">
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-sm bg-white px-8 py-10 shadow-sm">
                    <h1 className="text-2xl font-bold uppercase text-center">Đặt lại mật khẩu</h1>
                    <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
                        Vui lòng nhập OTP và mật khẩu mới của bạn.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                        {/* New password */}
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Mật khẩu mới</label>
                            <div className="relative mt-2">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full h-11 bg-[#eeeeee] px-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Nhập lại mật khẩu</label>
                            <div className="relative mt-2">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full h-11 bg-[#eeeeee] px-4 pr-10 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Email</label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@gmail.com"
                                className="mt-2 w-full h-11 bg-[#eeeeee] px-4 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>

                        {/* OTP */}
                        <div>
                            <label className="text-xs font-bold uppercase text-gray-500">Mã OTP</label>
                            <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Nhập mã OTP"
                                maxLength={6}
                                className="mt-6 w-full h-11 bg-[#eeeeee] px-4 text-sm outline-none focus:ring-1 focus:ring-orange-500"
                            />

                            {/* Resend button */}
                            <button
                                type="button"
                                disabled={countdown > 0 || resending}
                                onClick={handleResendOtp}
                                className={`text-sm font-semibold mt-2 transition
                                    ${countdown > 0 || resending
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-orange-500 hover:underline"
                                    }    
                                `}
                            >
                                {countdown > 0
                                    ? `Gửi lại sau (${countdown}s)`
                                    : resending
                                        ? "Đang gửi..."
                                        : "Gửi lại OTP"
                                }
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-orange-500 text-white text-sm font-bold uppercase hover:opacity-60 transition"
                        >
                            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
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

export default ResetPassword;