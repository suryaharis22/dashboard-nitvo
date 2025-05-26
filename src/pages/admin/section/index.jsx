// pages/admin/product/index.jsx

import SectionsTable from '@/components/Table/SectionsTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Section = () => {

    return (

        <div className='container p-6'>
            <h1 className='text=[30px] font-bold leading-10'>Section</h1>
            <SectionsTable />


        </div>
    );
};

export default Section;
