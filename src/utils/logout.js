// src/utils/logout.js
import Cookies from 'js-cookie';

export function logout(router) {
    // Remove the access token from cookies
    Cookies.remove('access_token');

    // Clear all items from localStorage
    localStorage.clear();

    // Redirect the user to the login page
    router.push('/login');
}
