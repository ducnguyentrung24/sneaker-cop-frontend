import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faLocationDot,
    faLock,
} from "@fortawesome/free-solid-svg-icons";

import { NavLink } from "react-router-dom";

function ProfileSidebar() {
    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm transition
        ${isActive
            ? "text-orange-500 font-semibold border-l-4 border-orange-500"
            : "text-gray-600 rounded-lg hover:bg-orange-500 hover:text-white"
        }`;

    return (
        <div className="col-span-3">
            {/* Header */}
            <div className="mb-6">
                <p className="text-md font-bold mb-1">Cài đặt tài khoản</p>
                <p className="text-sm text-gray-500">Quản lý hồ sơ và bảo mật</p>
            </div>

            {/* Menu */}
            <nav className="flex flex-col gap-1">
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