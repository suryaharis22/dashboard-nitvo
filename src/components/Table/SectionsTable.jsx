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
import Swal from 'sweetalert2';
import Image from 'next/image';

const SectionsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sections, setSections] = useState([]);
    const [menus, setMenus] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [menuId, setMenuId] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const { openPreviewImgMDL } = PreviewImgMDL();

    const fetchSections = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/sections`;
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
            setSections(data.data);
            setTotalPages(data.metadata.totalPages);
        } catch (err) {
            console.error('Error fetching sections:', err);
        }
    };

    const fetchMenus = async () => {
        try {
            const data = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menus?page=1&pageSize=100`);
            setMenus(data.data);
        } catch (err) {
            console.error('Error fetching menus:', err);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    useEffect(() => {
        fetchSections();
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

    const handleStatusChange = async (sectionId) => {

        try {
            const response = await putData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections/id/${sectionId}/status/toggle`);
            console.log('response:', response);
            fetchSections();
            fetchMenus();
        } catch (err) {
            console.error('Error updating section status:', err);
        }
    };

    const handleDelete = async (section) => {
        const confirm = await Swal.fire({
            title: "Apakah Anda yakin ingin menghapus section ini?",
            html: `
            <div class="text-left space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                    <div class="space-y-2">
                        <p class="font-semibold">
                            Nama: <span class="font-normal">${section.name}</span>
                        </p>
                        <p class="font-semibold">
                            Type: <span class="font-normal">${section.type}</span>
                        </p>
                        <p class="font-semibold">
                            Status: <span class="font-normal">${section.status ? 'Aktif' : 'Tidak Aktif'}</span>
                        </p>
                    </div>
                    <div class="flex gap-3">
                        <div class="w-[60px] h-[60px] rounded-md overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                            <img 
                                src="${process.env.NEXT_PUBLIC_URL_STORAGE}${section.icon}" 
                                alt="Icon section" 
                                class="w-full h-full object-contain"
                            />
                        </div>
                        <div class="w-[60px] h-[60px] rounded-md overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                            <img 
                                src="${process.env.NEXT_PUBLIC_URL_STORAGE}${section.icon}" 
                                alt="Icon section" 
                                class="w-full h-full object-contain"
                            />
                        </div>
                    </div>
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
                const response = await deleteData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections/id/${section.id}`);

                if (response?.status?.code === 200) {
                    await Swal.fire("Berhasil", "Section berhasil dihapus", "success");
                    fetchSections();
                } else {
                    Swal.fire("Gagal", "Gagal menghapus section. Silakan coba lagi.", "error");
                }

            } catch (error) {
                console.error("Error deleting section:", error);
                Swal.fire("Gagal", "Terjadi kesalahan saat menghapus section", "error");
            }
        }
    };



    return (
        <div>
            {/* Filter dan tombol tambah */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2">
                    {/* Search */}
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

                    {/* Filter menu */}
                    <select
                        value={menuId}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setMenuId(e.target.value);
                        }}
                        className="p-2.5 border rounded-lg text-sm text-gray-900 bg-gray-50 border-gray-300"
                    >
                        <option value="">All Menus</option>
                        {menus.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Tombol tambah */}
                <Link
                    href="/admin/section/add-section"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light text-sm"
                >
                    <TbCirclePlus size={20} /> Tambah
                </Link>
            </div>

            {/* Tabel */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-white uppercase bg-gdn">
                        <tr>
                            {['name', 'type', 'status', 'icon', 'bener'].map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 cursor-pointer"
                                    onClick={() => handleSortChange(col)}
                                >
                                    <div className="flex items-center">
                                        {col.charAt(0).toUpperCase() + col.slice(1)}
                                        {sortColumn === col && (
                                            <span className="ml-1">
                                                {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sections.map((section) => (
                            <tr
                                key={section.id}
                                className="bg-white border-b hover:bg-gray-100"
                            >
                                <td className="px-6 py-4">{section.name}</td>
                                <td className="px-6 py-4">{section.type}</td>
                                <td className="py-4 px-6 text-center">
                                    <input
                                        type="checkbox"
                                        checked={section.isActive === true}
                                        onChange={() => handleStatusChange(section.id)}
                                        className="w-5 h-5 text-green-500 focus:ring focus:ring-green-300 cursor-pointer"
                                    />
                                </td>

                                {/* Icon */}
                                <td className="px-6 py-4 text-center">
                                    <Image
                                        onClick={() => openPreviewImgMDL(`${process.env.NEXT_PUBLIC_URL_STORAGE}${section.icon}`)}
                                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${section.icon}`}
                                        alt="icon"
                                        className="w-20 h-20 rounded-lg object-cover mx-auto bg-gray-300"
                                        width={50}
                                        height={50}
                                    />
                                </td>

                                {/* Banner */}
                                <td className="px-6 py-4 text-center">
                                    <Image
                                        onClick={() => openPreviewImgMDL(`${process.env.NEXT_PUBLIC_URL_STORAGE}${section.banner}`)}
                                        src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${section.banner}`}
                                        alt="banner"
                                        className="w-20 h-20 rounded-lg object-cover mx-auto"
                                        width={100}
                                        height={100}
                                    />
                                </td>

                                {/* Aksi */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center items-center space-x-2">
                                        <Link
                                            href={`/admin/section/${section.id}`}
                                            className="text-primary hover:text-primary-light"
                                        >
                                            <FaRegEye size={25} />
                                        </Link>
                                        <Link
                                            href={`/admin/section/edit/${section.id}`}
                                            className="text-warning hover:text-warning-light"
                                        >
                                            <PiPencilLine size={25} />
                                        </Link>
                                        <button onClick={() => handleDelete(section)} className="text-danger hover:text-danger-light">
                                            <FaRegTrashAlt size={25} />
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

export default SectionsTable;
