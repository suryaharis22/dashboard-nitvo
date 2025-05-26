// pages/admin/user/index.jsx

import UserTable from '@/components/Table/UserTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const User = () => {
    const router = useRouter();
    return (
        <div className='container p-6'>
            <h1 className='text=[30px] font-bold leading-10'>User</h1>

            <UserTable />

        </div>
    );
};

export default User;
