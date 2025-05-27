'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) localStorage.removeItem('profile');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            const { token } = response.data.data;
            Cookies.set('token', token, { expires: 1 });

            const profileResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.setItem('profile', JSON.stringify(profileResponse.data.data));

            const { role } = profileResponse.data.data;
            if (role === 'admin') router.push('/admin');
            else if (role === 'user') router.push('/customer');
        } catch (error) {
            setError('Login gagal. Periksa email dan password Anda.');
        } finally {
            setTimeout(() => setLoading(false), 3000);
        }
    };

    return (
        <div
            className="min-h-screen bg-[url('/cms/SplashScreen.png')] bg-cover bg-center flex items-center justify-center p-4"
        >
            <div className="backdrop-blur-sm bg-black/20 rounded-xl shadow-xl max-w-md w-full p-8 sm:p-10">
                {/* Logo di tengah atas */}
                <div className="flex justify-center mb-6">
                    <img src="/cms/NITVO-rmbg.png" alt="Logo NITVO" className="w-32 object-contain" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h2>
                <p className="text-gray-500 mb-6 text-center text-sm">Silakan masuk ke akun Anda</p>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="contoh@email.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="********"
                            required
                        />
                    </div>

                    <div className="text-right">
                        <a href="#" className="text-sm text-blue-500 hover:underline">
                            Lupa Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center items-center gap-2 font-semibold py-3 rounded-lg transition duration-300 ${loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="w-5 h-5 animate-spin text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Loading...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>

            {loading && <Loading />}
        </div>
    );
};

export default Login;
