import { useState, useEffect } from 'react';
import {
    FaChevronLeft,
    FaChevronRight,
    FaSortUp,
    FaSortDown,
    FaSearch,
    FaRegTrashAlt,
    FaRegEye,
} from 'react-icons/fa';
import { TbCirclePlus } from 'react-icons/tb';
import { PiPencilLine } from 'react-icons/pi';
import Link from 'next/link';
import { deleteData, getData, putData } from '@/utils/api';
import { formatToRupiah } from '@/utils/formatToRupiah';
import Pagination from './Pagination';
import PreviewImgMDL from '../Modal/PreviewImgMDL';
import axios from 'axios';
import Swal from 'sweetalert2';
import Image from 'next/image';


const MenusTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [menus, setMenus] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuId, setMenuId] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const { openPreviewImgMDL } = PreviewImgMDL();

    const fetchMenus = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/menus`;
            const queryParams = new URLSearchParams({
                page: currentPage,
                pageSize: perPage,
            });

            if (searchTerm) queryParams.append('search', searchTerm);
            if (menuId) queryParams.append('menuId', menuId);
            if (sortColumn) {
                queryParams.append('sortBy', sortColumn);
                queryParams.append('order', sortOrder);
            }

            const data = await getData(`${url}?${queryParams.toString()}`);

            setMenus(data.data);
            setTotalPages(data.metadata.totalPages);
        } catch (err) {
            console.error('Error fetching menus:', err);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, [currentPage, perPage, searchTerm, menuId, sortColumn, sortOrder]);

    const handleSortChange = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleStatusChange = async (menuId) => {
        try {
            const response = await putData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menus/id/${menuId}/status/toggle`);
            console.log('response:', response);
            fetchMenus();
        } catch (err) {
            console.error('Error updating menu status:', err);
        }
    };

    const handleDelete = async (menu) => {
        const confirm = await Swal.fire({
            title: "Apakah Anda yakin ingin menghapus menu ini?",
            html: `
            <div style="text-align: left;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">
                    Nama: <span style="font-weight: 400;">${menu.name}</span>
                </p>
                <div style="
                    margin-top: 0.75rem;
                    width: 60px;
                    height: 60px;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f9fafb;
                ">
                    <img 
                        src="${process.env.NEXT_PUBLIC_URL_STORAGE}${menu.icon}" 
                        alt="Icon Menu" 
                        style="width: 100%; height: 100%; object-fit: contain;" 
                    />
                </div>
            </div>
        `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        });

        if (confirm.isConfirmed) {
            try {
                const response = await deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menus/id/${menu.id}`);

                if (response?.status?.code === 200) {
                    await Swal.fire("Berhasil", "Menu berhasil dihapus", "success");
                    fetchMenus(); // reload menu list
                } else {
                    Swal.fire("Gagal", "Gagal menghapus menu. Silakan coba lagi.", "error");
                }

            } catch (error) {
                console.error("Error deleting menu:", error);
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus menu", "error");
            }
        }
    };

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setSearchTerm(e.target.value);
                            }}
                            className="p-2.5 pr-10 border rounded-lg text-sm text-gray-900 bg-gray-50 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                            <FaSearch className="w-4 h-4 text-gray-500" />
                        </div>
                    </div>


                </div>

                <Link href="/admin/menu/add-menu" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light text-sm">
                    <TbCirclePlus size={20} />Tambah
                </Link>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-700 border rounded-lg overflow-hidden">
                    <thead className="text-xs text-white uppercase bg-gdn">
                        <tr>
                            {['Icon', 'Name', 'Status'].map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 cursor-pointer"
                                    onClick={() => handleSortChange(col.toLowerCase())}
                                >
                                    <div className="flex items-center gap-1">
                                        {col}
                                        {sortColumn === col.toLowerCase() && (
                                            <span>{sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menus.map((menu) => (
                            <tr
                                key={menu.id}
                                className="bg-white border-b hover:bg-gray-100 transition-colors duration-150"
                            >
                                {/* Icon */}
                                <td className="py-4 px-6 text-center">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${menu.icon}`}
                                        alt={`Icon ${menu.name}`}
                                        onClick={() => openPreviewImgMDL(`${process.env.NEXT_PUBLIC_URL_STORAGE}${menu.icon}`)}
                                        className="w-16 h-16 rounded-lg object-contain mx-auto bg-gray-100 cursor-pointer"
                                        width={100}
                                        height={100}
                                    />
                                </td>

                                {/* Name */}
                                <td className="py-4 px-6 font-medium text-gray-800">{menu.name}</td>

                                {/* Status */}
                                <td className="py-4 px-6 text-center">
                                    <input
                                        type="checkbox"
                                        checked={menu.isActive === true}
                                        onChange={() => handleStatusChange(menu.id)}
                                        className="w-5 h-5 text-green-500 focus:ring focus:ring-green-300 cursor-pointer"
                                    />
                                </td>

                                {/* Actions */}
                                <td className="py-4 px-6 text-center">
                                    <div className="flex justify-center items-center space-x-4">
                                        <Link
                                            href={`/admin/menu/edit/${menu.id}`}
                                            className="text-yellow-500 hover:text-yellow-400 transition-colors"
                                        >
                                            <PiPencilLine size={22} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(menu)}
                                            className="text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            <FaRegTrashAlt size={22} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default MenusTable;
