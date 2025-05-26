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
import DetailProductMDL from '../Modal/DetailProductMDL';
import Image from 'next/image';

const ProductTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [sections, setSections] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sectionId, setSectionId] = useState('');
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const { openPreviewImgMDL } = PreviewImgMDL();
    const { openDetailProductMDLMDL } = DetailProductMDL();

    const fetchProducts = async () => {
        try {
            let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products`;
            const queryParams = new URLSearchParams({
                page: currentPage,
                pageSize: perPage,
            });

            if (searchTerm) queryParams.append('search', searchTerm);
            if (sectionId) queryParams.append('sectionId', sectionId);
            if (sortColumn) {
                queryParams.append('sortBy', sortColumn);
                queryParams.append('order', sortOrder);
            }

            const data = await getData(`${url}?${queryParams.toString()}`);
            setProducts(Array.isArray(data?.data) ? data.data : []);
            setTotalPages(data?.metadata?.totalPages || 1);
        } catch (err) {
            console.error('Error fetching products:', err);
            setProducts([]);
        }
    };

    const fetchSections = async () => {
        try {
            const data = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections?page=1&pageSize=100`);
            setSections(Array.isArray(data?.data) ? data.data : []);
        } catch (err) {
            console.error('Error fetching sections:', err);
            setSections([]);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [currentPage, perPage, searchTerm, sectionId, sortColumn, sortOrder]);

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

    const handleStatusChange = async (productId) => {
        console.log('productId:', productId);

        try {
            const response = await putData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/id/${productId}/status/toggle`);
            fetchProducts();
            fetchSections();
        } catch (err) {
            console.error('Error updating product status:', err);
        }
    };
    const handleDelete = async (product) => {
        const confirm = await Swal.fire({
            title: "Apakah Anda yakin ingin menghapus product ini?",
            html: `
                <div class="text-left space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                        <div class="space-y-2">
                            <p class="font-semibold">
                                Code: <span class="font-normal">${product.code}</span>
                            </p>
                            <p class="font-semibold">
                                Name: <span class="font-normal">${product.name}</span>
                            </p>
                            <p class="font-semibold">
                                Description: <span class="font-normal">${product.description}</span>
                            </p>
                            <p class="font-semibold">
                                Base Price: <span class="font-normal">${formatToRupiah(product.basePrice)}</span>
                            </p>
                            <p class="font-semibold">
                                Final Price: <span class="font-normal">${formatToRupiah(product.finalPrice)}</span>
                            </p>
                            <p class="font-semibold">
                                Channel: <span class="font-normal">${product.channel}</span>
                            </p>
                            <p class="font-semibold">
                                Status: <span class="font-normal">${product.status ? 'Aktif' : 'Tidak Aktif'}</span>
                            </p>
                        </div>
                        <div class="flex gap-3">
                            <div class="w-[60px] h-[60px] rounded-md overflow-hidden border border-gray-300 flex items-center justify-center bg-gray-100">
                                <img 
                                    src="${process.env.NEXT_PUBLIC_URL_STORAGE}${product.icon}" 
                                    alt="Icon product" 
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

                    <select
                        value={sectionId}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setSectionId(e.target.value);
                        }}
                        className="p-2.5 border rounded-lg text-sm text-gray-900 bg-gray-50 border-gray-300"
                    >
                        <option value="">All Sections</option>
                        {Array.isArray(sections) && sections.map((section) => (
                            <option key={section.id} value={section.id}>
                                {section.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Link href="/admin/product/add-product" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light text-sm">
                    <TbCirclePlus size={20} />Tambah
                </Link>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-white uppercase bg-gdn">
                        <tr>
                            {['name', , 'code', 'price', 'channel', 'status', 'icon'].map((col) => (
                                <th key={col} className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange(col)}>
                                    <div className="flex items-center">
                                        {col.charAt(0).toUpperCase() + col.slice(1)}
                                        {sortColumn === col && (
                                            <span className="ml-1">{sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}</span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(products) && products.length > 0 ?
                            products.map((product) => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-100">
                                    <td className="px-6 py-4">{product.name}</td>
                                    <td className="px-6 py-4">{product.code}</td>
                                    <td className="px-6 py-4">{formatToRupiah(product.finalPrice)}</td>
                                    <td className="px-6 py-4">{product.channel || '-'}</td>
                                    {/* <td className="px-6 py-4">{product.sectionId}</td> */}
                                    <td className="py-4 px-6 text-center">
                                        <input
                                            type="checkbox"
                                            checked={product.isActive === true}
                                            onChange={() => handleStatusChange(product.id)}
                                            className="w-5 h-5 text-green-500 focus:ring focus:ring-green-300 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Image
                                            onClick={() => openPreviewImgMDL(`${process.env.NEXT_PUBLIC_URL_STORAGE}${product.icon}`)}
                                            src={`${process.env.NEXT_PUBLIC_URL_STORAGE}${product.icon}`}
                                            alt=""
                                            className='w-20 h-20 rounded-lg object-cover mx-auto'
                                            width={50}
                                            height={50} />

                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => openDetailProductMDLMDL(product)}

                                                className="text-primary hover:text-primary-light "
                                            >
                                                <FaRegEye size={25} />
                                            </button>
                                            <Link
                                                href={`/admin/product/edit/${product.id}`}
                                                className="text-warning hover:text-warning-light"
                                            >
                                                <PiPencilLine size={25} />
                                            </Link>

                                        </div>
                                    </td>
                                </tr>
                            ))
                            :
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center">No data found</td>
                            </tr>
                        }
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

export default ProductTable;
