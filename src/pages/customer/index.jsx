// pages/Customer.js

import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CustomerPage = () => {
    const router = useRouter();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const profileData = localStorage.getItem('profile');
        if (profileData) {
            setProfile(JSON.parse(profileData));
        }
    }, []);
    const handleLogout = () => {
        logout(router);  // Pass router to the logout function
    };

    return (
        <div>
            <h1>Customer Dashboard</h1>
            {profile ? (
                <p>Welcome, {profile.name}</p>
            ) : (
                <p>Loading profile...</p>
            )}

            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
                Logout
            </button>
        </div>
    );
};

export default CustomerPage;
