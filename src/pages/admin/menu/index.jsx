// pages/admin/product/index.jsx

import MenusTable from '@/components/Table/MenusTable';
import SectionsTable from '@/components/Table/SectionsTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Menu = () => {

    return (

        <div className='container p-6'>
            <h1 className='text=[30px] font-bold leading-10'>Menu</h1>
            <MenusTable />


        </div>
    );
};

export default Menu;
