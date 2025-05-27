import { FaHome, FaUsers, FaCog, FaRegAddressCard, FaNetworkWired } from 'react-icons/fa';
import { MdOutlineDashboard } from 'react-icons/md';
import { LiaFileContractSolid } from "react-icons/lia";
import { RiShoppingBag4Line } from "react-icons/ri";
import { BsSdCard } from "react-icons/bs";
import { IoPricetagsOutline } from "react-icons/io5";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import Image from 'next/image';



const Sidebar = ({ role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter(); // Get the current router

    const sidebarItemsAdmin = [
        { name: 'Dashboard', icon: <MdOutlineDashboard />, href: '/admin' },
        { name: 'Transaksi', icon: <LiaFileContractSolid />, href: '/admin/transaction' },
        { name: 'Menu', icon: <IoPricetagsOutline />, href: '/admin/menu' },
        { name: 'Section', icon: <FaNetworkWired />, href: '/admin/section' },
        { name: 'Produk', icon: <RiShoppingBag4Line />, href: '/admin/product' },
        { name: 'Users', icon: <FaRegAddressCard />, href: '/admin/user' },
    ];

    const sidebarItemsCustomer = [
        { name: 'Home', icon: <FaHome />, href: '/customer' },
        { name: 'Profile', icon: <FaUsers />, href: '/profile' },
    ];

    const sidebarItems = role === 'admin' ? sidebarItemsAdmin : sidebarItemsCustomer;

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (

        <div
            className={`w-64 min-h-screen bg-primary-dark transition-transform z-40 md:translate-x-0 fixed md:relative ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            {/* Logo */}
            <div className="flex justify-center py-4">
                <Image src="/cms/NITVO-rmbg.png" alt="Logo" className="w-20 h-auto" width={100} height={100} />
            </div>

            {/* Render sidebar items based on the role */}
            <ul className="space-y-2 font-medium mx-[20px]">
                {sidebarItems.map((item, index) => {
                    const isActive = router.pathname === item.href;
                    return (
                        <li key={index}>
                            <Link href={item.href} className={`w-full h-[60px] text-[24px] flex items-center p-[20px] rounded-lg ${isActive ? 'text-white bg-gdn' : 'text-white hover:text-white hover:bg-gdn'} group`}>

                                {item.icon}
                                <span className="ml-[20px] capitalize">{item.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

        </div>

    );
};

export default Sidebar;
