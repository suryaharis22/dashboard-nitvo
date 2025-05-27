import { useEffect, useState } from 'react';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { getData } from '@/utils/api';
import Swal from 'sweetalert2';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
    LineElement,
    PointElement
);

const AdminPage = () => {
    const [statusCounts, setStatusCounts] = useState(null);
    const [topProducts, setTopProducts] = useState(null);
    const [menus, setMenus] = useState(null);
    const [sections, setSections] = useState(null);
    const [products, setProducts] = useState(null);
    const [productStatus, setProductStatus] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        GetDataTransactions();
        GetDataMenu();
        GetDatasections();
        GetDataProduct();
        GetDataUser();
    }, []);
    const GetDataTransactions = async () => {
        try {
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(today.getMonth() - 1);

            const formatDate = (date) => date.toISOString().split('T')[0];
            const minDate = formatDate(lastMonth);
            const maxDate = formatDate(today);

            const res = await getData(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/transactions?page=1&pageSize=100&minDate=${minDate}&maxDate=${maxDate}`
            );

            const dataList = res.data;

            // Hitung statusCode
            const statusCodes = {
                '00': 'Success',
                '01': 'Initiated',
                '02': 'Paying',
                '03': 'Pending',
                '04': 'Refunded',
                '05': 'Cancelled',
                '06': 'Failed',
                '07': 'Not Found',
                '08': 'Expired',
            };

            const counts = Object.fromEntries(Object.keys(statusCodes).map(code => [code, 0]));
            dataList.forEach((item) => {
                const code = item.statusCode;
                if (counts.hasOwnProperty(code)) {
                    counts[code]++;
                }
            });
            setStatusCounts({
                labels: Object.keys(statusCodes).map(code => statusCodes[code]),
                values: Object.keys(statusCodes).map(code => counts[code]),
            });

            // Hitung jumlah pembelian tiap produk berdasarkan title
            const productCounts = {};
            dataList.forEach((item) => {
                const title = item.title || 'Unknown Product';
                productCounts[title] = (productCounts[title] || 0) + 1;
            });

            // Sort produk berdasarkan jumlah terbanyak, ambil top 10
            const sortedProducts = Object.entries(productCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            setTopProducts({
                labels: sortedProducts.map(([title]) => title),
                values: sortedProducts.map(([, count]) => count),
            });

        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const GetDataMenu = async () => {
        try {
            const res = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menus`);
            setMenus(res);;

        } catch (error) {
            Swal.fire("Gagal", "Terjadi kesalahan saat mengambil data menu", "error");
        }
    }
    const GetDatasections = async () => {
        try {
            const res = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sections`);
            setSections(res);

        } catch (error) {
            Swal.fire("Gagal", "Terjadi kesalahan saat mengambil data section", "error");
        }
    }
    const GetDataProduct = async () => {
        try {
            const res = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products`);
            setProducts(res);

            // Hitung produk aktif dan nonaktif
            const activeCount = res.data.filter((item) => item.isActive).length;
            const inactiveCount = res.data.length - activeCount;

            setProductStatus({
                labels: ['Aktif', 'Nonaktif'],
                values: [activeCount, inactiveCount],
            });
        } catch (error) {
            Swal.fire("Gagal", "Terjadi kesalahan saat mengambil data produk", "error");
        }
    };

    const GetDataUser = async () => {
        try {
            const res = await getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`);
            setUser(res);

        } catch (error) {
            Swal.fire("Gagal", "Terjadi kesalahan saat mengambil data user", "error");
        }
    }

    const totalTransaksi = statusCounts?.values.reduce((a, b) => a + b, 0) || 0;
    const statusTerbanyak = statusCounts
        ? statusCounts.labels[
        statusCounts.values.indexOf(Math.max(...statusCounts.values))
        ]
        : '';

    const barData = {
        labels: statusCounts?.labels || [],
        datasets: [{
            label: 'Jumlah Transaksi',
            data: statusCounts?.values || [],
            backgroundColor: '#3b82f6',
            borderRadius: 6,
        }],
    };

    const pieData = {
        labels: statusCounts?.labels || [],
        datasets: [{
            label: 'Persentase Transaksi',
            data: statusCounts?.values || [],
            backgroundColor: [
                '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6',
                '#ef4444', '#14b8a6', '#eab308', '#f43f5e', '#6366f1'
            ],
            borderWidth: 1,
        }],
    };

    const lineData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Simulasi Jumlah Transaksi per Minggu',
            data: [10, 35, 22, 44],
            fill: false,
            borderColor: '#3b82f6',
            tension: 0.4,
        }],
    };

    const doughnutData = productStatus
        ? {
            labels: productStatus.labels,
            datasets: [{
                label: 'Status Produk',
                data: productStatus.values,
                backgroundColor: ['#10b981', '#ef4444'],
                borderWidth: 1,
            }],
        }
        : { labels: [], datasets: [] };

    const topProductsBarData = {
        labels: topProducts?.labels || [],
        datasets: [{
            label: 'Jumlah Produk Terbeli',
            data: topProducts?.values || [],
            backgroundColor: '#f59e0b',
            borderRadius: 6,
        }],
    };

    return (
        <div className="container p-6">
            <h1 className="text-[30px] font-bold leading-10 mb-6">Admin Dashboard</h1>

            {statusCounts ? (
                <>

                    {/* total Data  */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white text-primary p-4 rounded-lg shadow-sm text-center">
                            <p className="text-sm font-medium">Total Menu</p>
                            <p className="text-2xl font-bold">{menus?.metadata?.totalRows || 0}</p>
                        </div>
                        <div className="bg-white text-success p-4 rounded-lg shadow-sm text-center">
                            <p className="text-sm font-medium">Total sections</p>
                            <p className="text-xl font-semibold">{sections?.metadata?.totalRows || 0}</p>
                        </div>
                        <div className="bg-white text-warning p-4 rounded-lg shadow-sm text-center">
                            <p className="text-sm font-medium">Total Product</p>
                            <p className="text-xl font-bold">{products?.metadata?.totalRows || 0}</p>
                        </div>
                        <div className="bg-white text-danger p-4 rounded-lg shadow-sm text-center">
                            <p className="text-sm font-medium">Total User</p>
                            <p className="text-xl font-bold">{user?.metadata?.totalRows || 0}</p>
                        </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-sm">
                            <p className="text-sm font-medium">Total Transaksi</p>
                            <p className="text-2xl font-bold">{totalTransaksi}</p>
                        </div>
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-sm">
                            <p className="text-sm font-medium">Status Terbanyak</p>
                            <p className="text-xl font-semibold">{statusTerbanyak}</p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-sm">
                            <p className="text-sm font-medium">Status 'Success'</p>
                            <p className="text-xl font-bold">{statusCounts.values[0]}</p>
                        </div>
                        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-sm">
                            <p className="text-sm font-medium">Status 'Failed'</p>
                            <p className="text-xl font-bold">{statusCounts.values[6]}</p>
                        </div>
                    </div>



                    {/* Chart Grid */}
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                        <div className="bg-white p-4 shadow-md rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Line Chart Simulasi Mingguan</h2>
                            <Line data={lineData} />
                        </div>
                        <div className="bg-white p-4 shadow-md rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Bar Chart Status Transaksi</h2>
                            <Bar data={barData} />
                        </div>
                        <div className="bg-white p-4 shadow-md rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Pie Chart Status Transaksi</h2>
                            <Pie data={pieData} />
                        </div>
                        <div className="bg-white p-4 shadow-md rounded-lg">
                            <h2 className="text-xl font-semibold mb-2">Status Produk Aktif</h2>
                            {productStatus ? (
                                <Doughnut data={doughnutData} />
                            ) : (
                                <p>Loading status produk...</p>
                            )}
                        </div>

                    </div>

                    {/* Top 10 Produk Terbeli */}
                    <div className="bg-white p-4 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Top 10 Produk Terbeli Berdasarkan Title</h2>
                        {topProducts ? (
                            <Bar data={topProductsBarData} />
                        ) : (
                            <p>Loading top products...</p>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default AdminPage;
