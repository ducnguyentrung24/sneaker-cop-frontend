import { useAuth } from "../../context/AuthContext";

import { NavLink, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faBox,
    faTags,
    faLayerGroup,
    faUsers,
    faArrowLeft,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

function AdminLayout({ children }) {
    const { logoutUser } = useAuth();

    const navigate = useNavigate();

    const menuItems = [
        {
            path: "/admin",
            label: "Tổng quan",
            icon: faChartLine,
            end: true,
        },
        {
            path: "/admin/orders",
            label: "Đơn hàng",
            icon: faBox,
        },
        {
            path: "/admin/categories",
            label: "Danh mục",
            icon: faLayerGroup,
        },
        {
            path: "/admin/brands",
            label: "Thương hiệu",
            icon: faTags,
        },
        {
            path: "/admin/products",
            label: "Sản phẩm",
            icon: faBox,
        },
        {
            path: "/admin/users",
            label: "Người dùng",
            icon: faUsers,
        },
    ];

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition
        ${
            isActive
                ? "bg-orange-50 text-orange-500 font-bold"
                : "text-gray-500 hover:bg-gray-100 hover:text-black"
        }`;

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#F5F6FA] flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 bg-white border-r border-gray-100 px-5 py-6 flex-col justify-between">
                {/* Top */}
                <div>
                    {/* Logo */}
                    <div className="mb-8">
                        <h1 className="text-lg font-black">
                            Sneaker<span className="text-orange-500">Cop</span>
                        </h1>

                        <p className="text-[11px] text-gray-400 font-semibold tracking-widest">
                            ADMIN CONSOLE
                        </p>
                    </div>

                    {/* Menu */}
                    <nav className="space-y-2">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={linkClass}
                            >
                                <FontAwesomeIcon icon={item.icon} className="w-4" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-500 rounded-xl hover:bg-gray-100 hover:text-black transition"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="w-4" />
                        Về trang chủ
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 rounded-xl hover:bg-red-50 transition"
                    >
                        <FontAwesomeIcon icon={faRightFromBracket} className="w-4" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="font-black">
                                Sneaker<span className="text-orange-500">Cop</span>
                            </h1>

                            <p className="text-[10px] text-gray-400 font-semibold tracking-widest">
                                ADMIN CONSOLE
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/")}
                                className="text-xs font-bold text-gray-500"
                            >
                                Về shop
                            </button>

                            <button
                                onClick={handleLogout}
                                className="text-xs font-bold text-red-500"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>

                    <nav className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `shrink-0 px-4 py-2 rounded-full text-xs font-bold transition
                                    ${
                                        isActive
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-600"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;