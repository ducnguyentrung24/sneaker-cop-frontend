import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/auth.service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../context/AuthContext';

import toast from 'react-hot-toast';

function LoginPage() {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    
    const validate = () => {
        let newErrors = {
            email: '',
            password: '',
        };

        if (!form.email) newErrors.email = 'Email không được để trống';
        else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email không hợp lệ';

        if (!form.password) newErrors.password = 'Mật khẩu không được để trống';
        else if (form.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

        setErrors(newErrors);
        return !newErrors.email && !newErrors.password;
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

            const res = await login(form);
            if (!res.token) throw new Error('Đăng nhập thất bại');

            localStorage.setItem('token', res.token);
            loginUser(res.user);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
            setError('Email hoặc Mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
            {/* Card */}
            <div className='w-full max-w-md bg-white px-5 sm:px-8 py-8 sm:py-12 md:py-15 shadow-md rounded-xl'>

                <h2 className='text-xl sm:text-2xl font-bold text-center text-orange-500 mb-2'>ĐĂNG NHẬP</h2>
                <p className='text-center text-gray-500 text-xs sm:text-sm mb-6'>Chào mừng bạn đến với Sneaker Cop!</p>

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className='mb-4'>
                        <label className='mb-1 block'>Email:</label>
                        <input
                            type="text"
                            name="email"
                            placeholder='you@example.com'
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
                                placeholder='********'
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

                    {/* Forgot password */}
                    <div className='text-right text-xs mb-4'>
                        <a href="/forgot-password" className='text-blue-500 hover:underline'>
                            Quên mật khẩu
                        </a>
                    </div>

                    {error && (
                        <p className='text-red-500 text-sm mb-4 text-center'>
                            {error}
                        </p>
                    )}

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
                            Đăng nhập
                    </button>                    
                </form>

                {/* Register */}
                <p className='text-center text-xs sm:text-sm text-gray-500 mt-4'>
                    Chưa có tài khoản?{' '}
                    <Link to='/register' className='text-black font-medium cursor-pointer hover:text-blue-500'>
                        Đăng ký ngay
                    </Link>
                </p>

            </div>
        </div>
    );    
}

export default LoginPage;