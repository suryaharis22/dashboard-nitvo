// src/pages/_app.js

import { useRouter } from 'next/router';
import '../styles/globals.css';               // Tailwind
import { useEffect, useState } from 'react';
import DashboardLayoutAdmin from '@/layout/DashboardLayoutAdmin';
import DashboardLayoutCustomer from '@/layout/DashboardLayoutCustomer';
import { setRouter } from '@/utils/api';
import TokenRefresher from '@/utils/TokenRefresher';

function App({ Component, pageProps }) {
  const router = useRouter();

  // Route yang TIDAK butuh layout
  const noLayoutRequired = ['/', '/login', '/registrasi'];
  const isNoLayoutRoute = noLayoutRequired.includes(router.pathname);

  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Registrasi router ke interceptor axios
    setRouter(router);

    // Ambil profile dari localStorage
    const profileData = localStorage.getItem('profile');

    if (profileData) {
      const profile = JSON.parse(profileData);
      setRole(profile.role);
    } else if (!isNoLayoutRoute) {
      router.push('/login');
    }

    setIsLoading(false);
  }, [router, isNoLayoutRoute]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isNoLayoutRoute ? (
        /* ---------------- Halaman publik: tanpa layout & tanpa TokenRefresher -------------- */
        <Component {...pageProps} />

      ) : role === 'admin' ? (
        /* ---------------- Halaman ADMIN ---------------------------------------------------- */
        <>
          <TokenRefresher />
          <DashboardLayoutAdmin>
            <Component {...pageProps} />
          </DashboardLayoutAdmin>
        </>

      ) : role === 'user' ? (
        /* ---------------- Halaman CUSTOMER ------------------------------------------------- */
        <>
          <TokenRefresher />
          <DashboardLayoutCustomer>
            <Component {...pageProps} />
          </DashboardLayoutCustomer>
        </>

      ) : (
        /* ---------------- Tidak ada role / sedang redirect --------------------------------- */
        <div>Redirecting to login...</div>
      )}
    </>
  );
}

export default App;
