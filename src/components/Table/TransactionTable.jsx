import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaHourglassHalf, FaPauseCircle, FaPlay, FaQrcode, FaQuestionCircle, FaRegEye, FaStop, FaTimesCircle, FaUndo } from 'react-icons/fa';
import { PiPencilLine } from 'react-icons/pi';
import { getData, putData } from '@/utils/api';
import Pagination from './Pagination';
import { formatToRupiah } from '@/utils/formatToRupiah';

const statusOptions = [
    { code: '00', label: 'Success' },
    { code: '01', label: 'Initiated' },
    { code: '02', label: 'Paying' },
    { code: '03', label: 'Pending' },
    { code: '04', label: 'Refunded' },
    { code: '05', label: 'Cancelled' },
    { code: '06', label: 'Failed' },
    { code: '07', label: 'Not Found' },
    { code: '08', label: 'Expired' },
];

const editableStatusOptions = [
    { code: '00', label: 'Success' },
    { code: '04', label: 'Refunded' },
    { code: '06', label: 'Failed' },
    { code: '08', label: 'Expired' },
];

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(20);
    const [totalPages, setTotalPages] = useState(1);
    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const [filters, setFilters] = useState({
        product: '',
        referenceNo: '',
        user: '',
        minDate: '',
        maxDate: '',
        status: '',
    });
    const [editingReferenceNo, setEditingReferenceNo] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');

    const fetchTransactions = async () => {
        try {
            const queryParams = new URLSearchParams({
                page: currentPage,
                pageSize: perPage,
            });

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '') {
                    queryParams.append(key, value);
                }
            });

            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/transactions?${queryParams}`;
            const data = await getData(url);

            setTransactions(data.data || []);
            setTotalPages(data.metadata?.totalPages || 1);
        } catch (error) {
            setTransactions([]);
            setTotalPages(1);
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [currentPage, filters]);

    useEffect(() => {
        if (isAutoRefresh) {
            const interval = setInterval(fetchTransactions, 5000);
            return () => clearInterval(interval);
        }
    }, [isAutoRefresh, currentPage, filters]);

    const handleChange = (e) => {
        setCurrentPage(1);
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const getStatusIcon = (statusCode) => {
        switch (statusCode) {
            case '01': // Initiated
                return <FaQrcode className="w-6 h-6 inline text-primary" title="Initiated" />;
            case '00': // Success
                return <FaCheckCircle className="w-6 h-6 inline text-success" title="Success" />;
            case '02': // Paying
                return <FaHourglassHalf className="w-6 h-6 inline text-warning" title="Paying" />;
            case '03': // Pending
                return <FaPauseCircle className="w-6 h-6 inline text-warning" title="Pending" />;
            case '04': // Refunded
                return <FaUndo className="w-6 h-6 inline text-secondary" title="Refunded" />;
            case '05': // Cancelled
                return <FaTimesCircle className="w-6 h-6 inline text-danger" title="Cancelled" />;
            case '06': // Failed
                return <FaExclamationCircle className="w-6 h-6 inline text-danger dark:text-danger-dark" title="Failed" />;
            case '07': // Not Found
                return <FaQuestionCircle className="w-6 h-6 inline text-gray-500" title="Not Found" />;
            case '08': // Expired
                return <FaTimesCircle className="w-6 h-6 inline text-gray-600" title="Expired" />;
            default: // Unknown
                return <FaQuestionCircle className="w-6 h-6 inline text-gray-400" title="Unknown" />;
        }
    };


    const handleEditClick = (referenceNo, currentStatus) => {
        setEditingReferenceNo(referenceNo);
        setSelectedStatus(currentStatus);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleUpdateStatus = async () => {
        if (!selectedStatus || !editingReferenceNo) return;

        try {
            await putData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/transactions/ref/${editingReferenceNo}`, { statusCode: selectedStatus });
            fetchTransactions();
            setEditingReferenceNo(null);
            setSelectedStatus('');
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleCancelEdit = () => {
        setEditingReferenceNo(null);
        setSelectedStatus('');
    };

    const handleRestFilter = () => {
        setCurrentPage(1);
        setFilters({
            product: '',
            referenceNo: '',
            user: '',
            minDate: '',
            maxDate: '',
            status: '',
        })
    }

    return (
        <div className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Transaction Table</h2>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                <input name="product" value={filters.product} onChange={handleChange} placeholder="Product ID" className="p-2 border rounded w-full" />
                <input name="referenceNo" value={filters.referenceNo} onChange={handleChange} placeholder="Reference No" className="p-2 border rounded w-full" />
                <input name="user" value={filters.user} onChange={handleChange} placeholder="User" className="p-2 border rounded w-full" />
                <select name="status" value={filters.status} onChange={handleChange} className="p-2 border rounded w-full">
                    <option value="">All Status</option>
                    {statusOptions.map(({ code, label }) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
                </select>
                <input type="date" name="minDate" value={filters.minDate} onChange={handleChange} className="p-2 border rounded w-full" />
                <input type="date" name="maxDate" value={filters.maxDate} onChange={handleChange} className="p-2 border rounded w-full" />
                <div className="flex gap-2">
                    <button onClick={handleRestFilter} className="bg-primary text-white p-2 rounded hover:bg-primary-light">
                        Reset Filter
                    </button>
                    <button
                        onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-white font-medium ${isAutoRefresh ? 'bg-danger hover:bg-danger-dark' : 'bg-warning hover:bg-warning-dark'
                            }`}
                    >
                        {isAutoRefresh ? <FaStop /> : <FaPlay />}
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded border">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gdn text-white text-xs uppercase">
                        <tr>
                            <th className="px-6 py-3">Reference No</th>
                            <th className="px-6 py-3">Destination</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Base Amount</th>
                            <th className="px-6 py-3">Final Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Created At</th>
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{tx.referenceNo}</td>
                                    <td className="px-6 py-4">{tx.userId || '-'}</td>
                                    <td className="px-6 py-4 max-w-[200px] relative group">
                                        <div className="truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:text-clip">{tx.title}</div>
                                    </td>
                                    <td className="px-6 py-4">{formatToRupiah(tx.baseAmount)}</td>
                                    <td className="px-6 py-4">{formatToRupiah(tx.finalAmount)}</td>
                                    <td className="px-6 py-4">{getStatusIcon(tx.statusCode)}</td>
                                    <td className="px-6 py-4">
                                        {new Date(tx.createdAt).toLocaleString('id-ID', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-center flex gap-2 justify-center items-center">
                                        <button className="text-blue-500 hover:text-blue-700" title="View">
                                            <FaRegEye size={25} />
                                        </button>

                                        {editingReferenceNo === tx.referenceNo ? (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={selectedStatus}
                                                    onChange={handleStatusChange}
                                                    className="p-1 border rounded"
                                                >
                                                    {editableStatusOptions.map(({ code, label }) => (
                                                        <option key={code} value={code}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleUpdateStatus}
                                                    className="bg-success hover:bg-success-dark text-white px-2 py-1 rounded"
                                                    title="Save"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                                                    title="Cancel"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="text-warning hover:text-warning-light"
                                                title="Edit Status"
                                                onClick={() => handleEditClick(tx.referenceNo, tx.statusCode)}
                                            >
                                                <PiPencilLine size={25} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-6 text-gray-400">
                                    No transactions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default TransactionTable;
