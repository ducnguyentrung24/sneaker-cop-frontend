import { Link, useLocation } from 'react-router-dom';
import logo from "../../assets/images/logo.png";

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Header() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <header className='bg-white shadow-sm'>
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
                    <div className='flex items-center border rounded-md px-2 hover:border-orange-500'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className='text-gray-400 mr-2'/>
                        <input 
                            type="text" 
                            placeholder='Tìm kiếm sản phẩm' 
                            className='py-1 text-sm outline-none w-40'
                        />
                    </div>

                    {/* CART */}
                    <Link to='/cart' className='text-lg hover:text-orange-500'>
                        <FontAwesomeIcon icon={faCartShopping} />
                    </Link>

                    {/* USER */}
                    <Link to='/login' className='flex items-center gap-1 text-sm hover:text-orange-500'>
                        <FontAwesomeIcon icon={faUser} />
                        <span className='font-medium'>TÀI KHOẢN</span>
                    </Link>
                </div>

            </div>
        </header>
    );
}

export default Header;