// src/utils/errorHandler.js

export function handleAuthError(error, request) {
    if (error.message === 'TokenExpired' || error.response?.status === 401) {
        // Jika token expired atau unauthorized, hapus token dan redirect ke halaman login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken'); // Menghapus token dari cookies
        return response;
    }

    // Jika error lainnya, redirect ke halaman login
    return NextResponse.redirect(new URL('/login', request.url));
}
