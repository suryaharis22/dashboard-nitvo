import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { getData, putData } from '@/utils/api';
import moment from 'moment';
import Link from 'next/link';
import { TbCirclePlus } from 'react-icons/tb';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [nameFilter, setNameFilter] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = nameFilter ? `?name=${nameFilter}` : '';
            const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users${query}`;
            const res = await getData(url);
            setUsers(res?.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, [nameFilter]);

    // const handleStatusChange = async (sectionId) => {

    //     try {
    //         const response = await putData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections/id/${sectionId}/status/toggle`);
    //         console.log('response:', response);
    //         fetchSections();
    //         fetchMenus();
    //     } catch (err) {
    //         console.error('Error updating section status:', err);
    //     }
    // };

    const handleInputChange = (e) => {
        setNameFilter(e.target.value);
    };



    return (
        <div className="p-4">
            {/* Header Filter & Add Button */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-4">
                <div className="relative w-full md:w-1/3">
                    <input
                        type="text"
                        value={nameFilter}
                        onChange={handleInputChange}
                        placeholder="Search by name..."
                        className="w-full px-4 py-2 ps-10 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 7.5 15a7.5 7.5 0 0 0 9.15-1.35z" />
                        </svg>
                    </span>
                </div>

                <Link href="/admin/user/add-user" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light text-sm">
                    <TbCirclePlus size={20} />Tambah
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-md shadow">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gdn text-white">
                        <tr>
                            <th className="px-4 py-3">#</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Banned</th>
                            <th className="px-4 py-3">Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-5 text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{user.name}</td>
                                    <td className="px-4 py-3">{user.email}</td>
                                    <td className="px-4 py-3 capitalize">{user.role}</td>

                                    <td className="py-4 px-6 text-center">
                                        <input
                                            type="checkbox"
                                            checked={user.isActive === true}
                                            // onChange={() => handleStatusChange(user.id)}
                                            className="w-5 h-5 text-success-light focus:ring focus:ring-primary cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${user.isBanned
                                                ? 'bg-success-dark text-white'
                                                : ' bg-danger-light text-white'
                                                }`}
                                        >
                                            {user.isBanned ? 'Ok' : 'Banned'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {moment(user.createdAt).format('YYYY-MM-DD HH:mm')}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-5 text-gray-400">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
