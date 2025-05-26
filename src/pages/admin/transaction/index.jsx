// pages/admin/transaction/index.jsx

import TransactionTable from '@/components/Table/TransactionTable';
import { logout } from '@/utils/logout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Transaction = () => {

    return (

        <div className='container p-6'>
            <h1 className='text=[30px] font-bold leading-10'>Transaction</h1>
            <TransactionTable />


        </div>
    );
};

export default Transaction;
