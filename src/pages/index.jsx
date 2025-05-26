import { useState, useEffect } from 'react';
import Router from 'next/router';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';

const Hero = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');

    if (!token) {
      localStorage.removeItem('profile');
    } else {
      setTimeout(() => {
        setLoading(true);
        const profileData = localStorage.getItem('profile');
        if (profileData) {
          const parsedProfile = JSON.parse(profileData);

          if (parsedProfile.role === 'admin') {
            Router.push('/admin').finally(() => setLoading(false));
          } else if (parsedProfile.role === 'user') {
            Router.push('/customer').finally(() => setLoading(false));
          } else {
            Router.push('/login').finally(() => setLoading(false));
          }
        } else {
          setLoading(true);
          Router.push('/login').finally(() => setLoading(false));
        }
      }, 2000);
    }
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[url('/SplashScreen.png')] bg-cover bg-center px-4 text-white text-center">
      {loading && <Loading />}

      {!loading && (
        <div className="backdrop-blur-sm bg-black/20 p-6 rounded-xl shadow-lg flex flex-col items-center">
          {/* Logo */}
          <img
            src="/NITVO-rmbg.png"
            alt="Logo"
            className="w-32 md:w-40 mb-4"
          />

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Selamat Datang di <span className="text-yellow-400">ARANA</span>
          </h1>

          <p className="text-lg md:text-xl mb-6">
            Sistem manajemen layanan <span className="font-semibold">PPOB (Payment Point Online Bank)</span> terbaik untuk kemudahan transaksi Anda
          </p>


          <button
            onClick={() => Router.push('/login')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300"
          >
            Masuk Sekarang
          </button>
        </div>
      )}
    </div>
  );
};

export default Hero;
