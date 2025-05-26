import { useRouter } from 'next/router';
import '../styles/globals.css';  // Import Tailwind CSS
import { useEffect, useState } from 'react';
import DashboardLayoutAdmin from '@/layout/DashboardLayoutAdmin'; // Admin Layout
import DashboardLayoutCustomer from '@/layout/DashboardLayoutCustomer'; // Customer Layout
import { setRouter } from '@/utils/api'; // Import setRouter dari api.js
import TokenRefresher from '@/utils/TokenRefresher'; // Import TokenRefresher

function App({ Component, pageProps }) {
  const router = useRouter();

  // Define routes where no layout is required
  const noLayoutRequired = ['/', '/login', '/registrasi'];
  const isNoLayoutRoute = noLayoutRequired.includes(router.pathname);

  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Daftarkan router global ke api.js supaya interceptor bisa akses
    setRouter(router);

    // Retrieve profile from localStorage
    const profileData = localStorage.getItem('profile');

    if (profileData) {
      const profile = JSON.parse(profileData);
      setRole(profile.role);  // Set role jika profile ditemukan
    } else if (!isNoLayoutRoute) {
      router.push('/login'); // Redirect ke login jika profile tidak ditemukan
    }

    setIsLoading(false); // Loading selesai
  }, [router, isNoLayoutRoute]);

  if (isLoading) {
    return <div>Loading...</div>;  // Optional loading spinner
  }

  return (
    <>
      {/* TokenRefresher jalan terus selama app aktif */}
      <TokenRefresher />

      {isNoLayoutRoute ? (
        <Component {...pageProps} />
      ) : role === 'admin' ? (
        <DashboardLayoutAdmin>
          <Component {...pageProps} />
        </DashboardLayoutAdmin>
      ) : role === 'user' ? (
        <DashboardLayoutCustomer>
          <Component {...pageProps} />
        </DashboardLayoutCustomer>
      ) : (
        <div>Redirecting to login...</div>
      )}
    </>
  );
}

export default App;
