// pages/admin/product/index.jsx

import ProductTable from '@/components/Table/ProductTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Products = () => {

    return (

        <div className='container p-6'>
            <h1 className='text=[30px] font-bold leading-10'>Produk</h1>
            <ProductTable />


        </div>
    );
};

export default Products;
