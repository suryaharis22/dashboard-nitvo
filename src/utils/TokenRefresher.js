import { useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function TokenRefresher() {
    const intervalId = useRef(null);
    const timeoutId = useRef(null);

    const tokenRefreshUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh`;

    const fetchToken = () => {
        axios.get(tokenRefreshUrl, { withCredentials: true }) // kirim cookie otomatis
            .then((response) => {

                const token = response.data?.data?.token;
                if (token) {
                    // Simpan token akses baru di cookie, expired 10 menit (1/144 hari)
                    Cookies.set('access_token', token, { expires: 1 / 144 });
                    console.log('Token disimpan di cookie');
                }
            })
            .catch((error) => {
                console.error('Error refreshing token:', error);
            });
    };

    const startInterval = () => {
        if (intervalId.current) return; // sudah jalan

        fetchToken(); // langsung panggil sekali saat mulai

        intervalId.current = setInterval(() => {
            fetchToken();
        }, 8 * 60 * 1000); // tiap 8 menit
    };

    const stopInterval = () => {
        if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
            console.log('Interval stopped karena user tidak aktif');
        }
    };

    const resetTimeout = () => {
        if (timeoutId.current) clearTimeout(timeoutId.current);

        // Kalau tidak ada aktivitas 1 menit, stop interval refresh token
        timeoutId.current = setTimeout(() => {
            stopInterval();
        }, 1 * 60 * 1000);
    };

    useEffect(() => {
        const activityHandler = () => {
            if (!intervalId.current) {
                console.log('User aktif, mulai interval refresh token');
                startInterval();
            }
            resetTimeout();
        };

        window.addEventListener('mousemove', activityHandler);
        window.addEventListener('keydown', activityHandler);
        window.addEventListener('scroll', activityHandler);

        startInterval();
        resetTimeout();

        return () => {
            window.removeEventListener('mousemove', activityHandler);
            window.removeEventListener('keydown', activityHandler);
            window.removeEventListener('scroll', activityHandler);
            stopInterval();

            if (timeoutId.current) clearTimeout(timeoutId.current);
        };
    }, []);

    return null; // komponen ini tidak render apapun
}
