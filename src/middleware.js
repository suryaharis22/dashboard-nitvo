// src/middleware.js

import { NextResponse } from 'next/server';
import { validateAccessToken } from './utils/auth';

export async function middleware(request) {
    const accessToken = request.cookies.get('token')?.value; // Mendapatkan token dari cookies
    const url = request.nextUrl.clone();
    const isLoginPage = url.pathname === '/login';

    // Jika tidak ada token dan mencoba mengakses halaman selain /login, arahkan ke /login
    if (!accessToken) {
        if (!isLoginPage) {
            url.pathname = '/login'; // Redirect ke /login jika tidak ada token
            return NextResponse.redirect(url);
        }
        return NextResponse.next(); // Jangan lakukan apapun jika sudah di halaman login
    }

    try {
        // Validasi token
        const profile = await validateAccessToken(accessToken);

        const isAdminPage = url.pathname.startsWith('/admin');
        const isCustomerPage = url.pathname.startsWith('/customer');

        // Jika sudah login dan mengakses /login, arahkan ke halaman sesuai role
        if (isLoginPage) {
            if (profile.role === 'admin') {
                url.pathname = '/admin'; // Redirect ke /admin untuk admin
                return NextResponse.redirect(url);
            } else if (profile.role === 'user') {
                url.pathname = '/customer'; // Redirect ke /customer untuk customer
                return NextResponse.redirect(url);
            }
        }

        // Validasi role dan akses halaman
        if (profile.role === 'user' && isAdminPage) {
            url.pathname = '/customer'; // Redirect ke halaman customer jika role customer mengakses halaman admin
            return NextResponse.redirect(url);
        }

        if (profile.role === 'admin' && isCustomerPage) {
            url.pathname = '/admin'; // Redirect ke halaman admin jika role admin mengakses halaman customer
            return NextResponse.redirect(url);
        }

    } catch (error) {
        // Menangani error token kadaluarsa atau token yang tidak valid
        if (error.message === 'TokenExpired' || error.response?.status === 401) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token'); // Hapus token dari cookies
            return response;
        }

        console.error('Middleware error:', error.message);
        return NextResponse.redirect(new URL('/login', request.url)); // Redirect ke login jika ada error lain
    }

    return NextResponse.next(); // Lanjutkan ke halaman yang diminta jika tidak ada masalah
}

export const config = {
    matcher: ['/admin/:path*', '/profile/:path*', '/customer/:path*', '/login'], // Melindungi halaman-halaman ini
};
