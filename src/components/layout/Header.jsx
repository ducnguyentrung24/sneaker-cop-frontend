import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import logo from "../../assets/images/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCartShopping,
    faUser,
    faBox,
    faGear,
    faRightFromBracket,
    faBars,
    faXmark,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, logoutUser } = useAuth();
    const { cart } = useCart();

    const [open, setOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [mobileAccountOpen, setMobileAccountOpen] = useState(false);

    const dropdownRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    const totalQuantity =
        cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const navLinks = [
        { path: "/", label: "Trang chủ" },
        { path: "/products", label: "Sản phẩm" },
        { path: "/contact", label: "Liên hệ" },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setOpen(false);
        setMobileNavOpen(false);
        setMobileAccountOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logoutUser();

        setOpen(false);
        setMobileNavOpen(false);
        setMobileAccountOpen(false);

        navigate("/");
    };

    const handleMobileNavToggle = () => {
        setMobileNavOpen((prev) => !prev);
        setMobileAccountOpen(false);
    };

    const handleMobileAccountToggle = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setMobileAccountOpen((prev) => !prev);
        setMobileNavOpen(false);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="h-16 flex items-center justify-between gap-3">
                    {/* Left Mobile */}
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Bars */}
                        <button
                            onClick={handleMobileNavToggle}
                            className="md:hidden w-10 h-10 rounded-xl bg-transparent text-black flex items-center justify-center shrink-0 hover:bg-gray-100 transition"
                        >
                            <FontAwesomeIcon icon={mobileNavOpen ? faXmark : faBars} className="text-xl" />
                        </button>

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-1.5 min-w-0 md:gap-2">
                            <img
                                src={logo}
                                alt="Sneaker Cop"
                                className="h-5 w-auto shrink-0 sm:h-6 md:h-8"
                            />

                            <span className="font-black text-xs sm:text-sm md:text-lg tracking-tight whitespace-nowrap">
                                SNEAKER <span className="text-orange-500">COP</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex flex-1 justify-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-bold uppercase tracking-wide transition
                                    ${isActive(link.path)
                                            ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                                            : "text-gray-700 hover:text-orange-500"
                                    }
                                `}
                            >
                                {link.label.toUpperCase()}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop right */}
                    <div className="hidden md:flex items-center gap-7">
                        {/* Cart */}
                        <button
                            onClick={() => navigate(user ? "/cart" : "/login")}
                            className="relative text-lg hover:text-orange-500 transition"
                        >
                            <FontAwesomeIcon icon={faCartShopping} />

                            {totalQuantity > 0 && (
                                <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                                    {totalQuantity > 99 ? "99+" : totalQuantity}
                                </span>
                            )}
                        </button>

                        {/* User */}
                        <div className="relative" ref={dropdownRef}>
                            {user ? (
                                <>
                                    <button
                                        onClick={() => setOpen(!open)}
                                        className="flex items-center gap-3 hover:text-orange-500 transition"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                                            {user.full_name?.charAt(0).toUpperCase()}
                                        </div>

                                        <span className="text-sm font-bold max-w-40 truncate">
                                            {user.full_name}
                                        </span>
                                    </button>

                                    {open && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm">
                                                <FontAwesomeIcon icon={faUser} />
                                                Cài đặt tài khoản
                                            </Link>

                                            <Link to="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm">
                                                <FontAwesomeIcon icon={faBox} />
                                                Đơn hàng của tôi
                                            </Link>

                                            {user.role === "ADMIN" && (
                                                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm">
                                                    <FontAwesomeIcon icon={faGear} />
                                                    Quản trị
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm border-t border-gray-100"
                                            >
                                                <FontAwesomeIcon icon={faRightFromBracket} />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 text-sm font-bold hover:text-orange-500">
                                    <FontAwesomeIcon icon={faUser} />
                                    TÀI KHOẢN
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* MObile right */}
                    <div className="md:hidden flex items-center gap-2 shrink-0">
                        {/* Cart */}
                        <button
                            onClick={() => navigate(user ? "/cart" : "/login")}
                            className="relative w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-base"
                        >
                            <FontAwesomeIcon icon={faCartShopping} />

                            {totalQuantity > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                                    {totalQuantity > 99 ? "99+" : totalQuantity}
                                </span>
                            )}
                        </button>

                        {/* Avatar */}
                        <button
                            onClick={handleMobileAccountToggle}
                            className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center text-sm font-bold shrink-0"
                        >
                            {user ? (
                                user.full_name?.charAt(0).toUpperCase()
                            ) : (
                                <FontAwesomeIcon icon={faUser} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile nav menu */}
            {mobileNavOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition
                                    ${isActive(link.path)
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }
                                `}
                            >
                                <span>{link.label}</span>

                                <span className="text-xs opacity-60">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile account menu */}
            {mobileAccountOpen && user && (
                <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
                    <div className="px-4 py-4 space-y-2">

                        <Link to="/profile" className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                            <span>Tài khoản</span>

                            <span className="text-xs opacity-60">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        </Link>

                        <Link to="/orders" className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                            <span>Đơn hàng</span>

                            <span className="text-xs opacity-60">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </span>
                        </Link>

                        {user.role === "ADMIN" && (
                            <Link to="/admin" className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                                <span>Quản trị</span>

                                <span className="text-xs opacity-60">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </span>
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold bg-red-50 text-red-500 hover:bg-red-100 transition"
                        >
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;