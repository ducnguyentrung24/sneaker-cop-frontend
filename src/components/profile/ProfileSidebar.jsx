import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faLocationDot,
    faLock,
    faGear
} from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router-dom";

function ProfileSidebar() {
    const linkClass = ({ isActive }) =>
        `flex items-center gap-2 sm:gap-3 px-4 py-3 text-xs sm:text-sm rounded-md whitespace-nowrap transition
        ${isActive
            ? "bg-orange-500 text-white font-semibold lg:bg-transparent lg:text-orange-500 lg:border-l-4 lg:border-orange-500"
            : "text-gray-600 rounded-lg hover:bg-orange-500 hover:text-white"
        }`;

    return (
        <div className="col-span-12 lg:col-span-3">
            {/* Header */}
            <div className="mb-4 lg:mb-6 flex items-center gap-3 bg-white lg:bg-transparent rounded-2xl lg:rounded-none p-4 py-3 lg:p-0 shadow-sm lg:shadow-none">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faGear} />
                </div>

                <div className="min-w-0">
                    <p className="text-base lg:text-md font-bold mb-1">Cài đặt tài khoản</p>
                    <p className="text-xs sm:text-sm text-gray-500">Quản lý hồ sơ và bảo mật</p>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex lg:flex-col gap-2 lg:gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <NavLink to="/profile" end className={linkClass}>
                    <FontAwesomeIcon icon={faUser} />
                    Thông tin cá nhân
                </NavLink>

                <NavLink to="/profile/addresses" className={linkClass}>
                    <FontAwesomeIcon icon={faLocationDot} />
                    Địa chỉ nhận hàng
                </NavLink>

                <NavLink to="/profile/change-password" className={linkClass}>
                    <FontAwesomeIcon icon={faLock} />
                    Đổi mật khẩu
                </NavLink>
            </nav>
        </div>
    );
};

export default ProfileSidebar;