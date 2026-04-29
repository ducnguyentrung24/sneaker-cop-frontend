import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/auth.service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const [loading, setLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    
    const validate = () => {
        let newErrors = {
            full_name: '',
            email: '',
            password: '',
            confirm_password: '',
        };

        if (!form.full_name) newErrors.full_name = 'Họ tên không được để trống';

        if (!form.email) newErrors.email = 'Email không được để trống';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';

        if (!form.password) newErrors.password = 'Mật khẩu không được để trống';
        else if (form.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

        if (!form.confirm_password) newErrors.confirm_password = 'Vui lòng xác nhận mật khẩu';
        else if (form.confirm_password !== form.password) newErrors.confirm_password = 'Mật khẩu không khớp';

        setErrors(newErrors);
        return !newErrors.full_name && !newErrors.email && !newErrors.password && !newErrors.confirm_password;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

        setErrors(prev => ({
            ...prev,
            [name]: '', 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;
        try {
            setLoading(true);
            setError('');

            await register({
                full_name: form.full_name,
                email: form.email,
                password: form.password,
            });

            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.message;

            if (message === 'Email already exists') setError('Email đã được sử dụng để đăng ký tài khoản')
            else setError('Đăng ký thất bại. Vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            {/* CARD */}
            <div className='w-full max-w-md bg-white p-8 shadow-md rounded py-10'>

                <h2 className='text-2xl font-bold text-center text-orange-500 mb-2'>ĐĂNG KÝ TÀI KHOẢN</h2>
                <p className='text-center text-gray-500 text-sm mb-6'>
                    Tạo tài khoản để có trải nghiệm mua sắm tốt hơn tại <br/> Sneaker Cop!
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className='mb-4'>
                        <label className='mb-1 block'>Họ tên:</label>
                        <input
                            type="text"
                            name="full_name"
                            placeholder='Nhập họ tên của bạn'
                            value={form.full_name}
                            onChange={handleChange}
                            className='w-full border border-gray-200 px-3 py-2 text-sm outline-none rounded focus:ring-2 focus:ring-orange-500'
                        />
                        
                        {errors.full_name && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors.full_name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className='mb-4'>
                        <label className='mb-1 block'>Email:</label>
                        <input
                            type="text"
                            name="email"
                            placeholder='Nhập email của bạn'
                            value={form.email}
                            onChange={handleChange}
                            className='w-full border border-gray-200 px-3 py-2 text-sm outline-none rounded focus:ring-2 focus:ring-orange-500'
                        />

                        {errors.email && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className='mb-2'>
                        <label className='mb-1 block'>Mật khẩu:</label>
                        <div className='relative'>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder='Nhập mật khẩu'
                                value={form.password}
                                onChange={handleChange}
                                className='w-full border border-gray-200 px-3 py-2 pr-10 text-sm outline-none rounded focus:ring-2 focus:ring-orange-500'
                            />

                            {/* Icon eye */}
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer'>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        {errors.password && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Passowrd */}
                    <div className='mb-10'>
                        <label className='mb-1 block'>Xác nhận mật khẩu:</label>
                        <div className='relative'>
                            <input 
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirm_password"
                                placeholder='Xác nhận mật khẩu'
                                value={form.confirm_password}
                                onChange={handleChange}
                                className='w-full border border-gray-200 px-3 py-2 pr-10 text-sm outline-none rounded focus:ring-2 focus:ring-orange-500'
                            />

                            {/* Icon eye */}
                            <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer'>
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>

                        {errors.confirm_password && (
                            <p className='text-red-500 text-sm mt-1'>
                                {errors.confirm_password}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-orange-500 text-white py-2 font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2
                        ${loading
                            ? 'bg-orange-600'
                            : 'hover:bg-orange-600 hover:shadow-lg'
                        }
                        `}>
                            Đăng ký
                    </button>

                    {error && (
                        <p className='text-red-500 text-sm my-4 text-center'>
                            {error}
                        </p>
                    )}                 
                </form>

                {/* Register */}
                <p className='text-center text-sm text-gray-500 mt-4'>
                    Đã có tài khoản?{' '}
                    <Link to='/login' className='text-black font-medium cursor-pointer hover:text-blue-500'>
                        Đăng nhập ngay
                    </Link>
                </p>

            </div>
        </div>
    );    
}

export default RegisterPage;