import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from "../../assets/images/logo.png";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faMagnifyingGlass, 
    faCartShopping,
    faUser, 
    faBox, 
    faGear, 
    faRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';

function Header() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const { user, logoutUser } = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className='bg-white shadow-sm sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-6 py-3 flex items-center'>

                {/* LEFT: LOGO */}
                <Link to="/" className='flex items-center gap-2'>
                    <img src={logo} alt="logo" className='h-8'/>
                    <span className='font-bold text-lg'>
                        SNEAKER <span className='text-orange-500'>COP</span>
                    </span>
                </Link>

                {/* CENTER: MENU */}
                <nav className='flex-1 flex justify-center gap-8 font-medium text-sm'>
                    <Link to="/" className={`${isActive('/') ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-700 hover:text-orange-500'}`}>
                        TRANG CHỦ
                    </Link>

                    <Link to="/products" className={`${isActive('/products') ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-700 hover:text-orange-500'}`}>
                        SẢN PHẨM
                    </Link>

                    <Link to="/contact" className={`${isActive('/contact') ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : 'text-gray-700 hover:text-orange-500'}`}>
                        LIÊN HỆ
                    </Link>
                </nav>

                {/* RIGHT */}
                <div className='flex items-center gap-4'>

                    {/* SEARCH */}
                    {/* <div className='flex items-center border rounded-md px-2 hover:border-orange-500'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-400 mr-2'/>
                        <input 
                            type="text" 
                            placeholder='Tìm kiếm sản phẩm' 
                            className='py-1 text-sm outline-none w-40'
                        />
                    </div> */}

                    {/* CART */}
                    <Link to='/cart' className='text-lg hover:text-orange-500'>
                        <FontAwesomeIcon icon={faCartShopping} />
                    </Link>

                    {/* USER */}
                    <div className='relative' ref={dropdownRef}>
                        {user ? (
                            <>
                                {/* USER INFO */}
                                <div
                                    onClick={() => setOpen(!open)}
                                    className="flex items-center gap-2 cursor-pointer hover:text-orange-500"
                                >
                                    {/* AVATAR */}
                                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                                        {user.full_name?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* NAME */}
                                    <span className="text-sm font-medium">
                                        {user.full_name}
                                    </span>
                                </div>

                                {/* DROPDOWN */}
                                {open && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white border rounded shadow-lg z-50">
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm"
                                        >
                                            <FontAwesomeIcon icon={faUser} />
                                            Thông tin tài khoản
                                        </Link>

                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm"
                                        >
                                            <FontAwesomeIcon icon={faBox} />
                                            Đơn hàng của bạn
                                        </Link>

                                        {/* ADMIN */}
                                        {user.role === "ADMIN" && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-sm"
                                            >
                                                <FontAwesomeIcon icon={faGear} />
                                                Quản trị
                                            </Link>
                                        )}

                                        <div className="border-t"></div>

                                        <button
                                            onClick={logoutUser}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-gray-100 text-sm"
                                        >
                                            <FontAwesomeIcon icon={faRightFromBracket} />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}        
                            </>
                        ) : (
                            <Link to='/login' className='flex items-center gap-1 text-sm hover:text-orange-500'>
                                <FontAwesomeIcon icon={faUser} className='text-lg' />
                                <span className='font-medium'>TÀI KHOẢN</span>
                            </Link>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
}

export default Header;