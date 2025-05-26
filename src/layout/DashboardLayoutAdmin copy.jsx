import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const DashboardLayoutAdmin = ({ children }) => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className='h-screen bg-blue-600'>
                <Sidebar role="admin" />
            </div>

            {/* Main content */}
            <div className="flex flex-col w-full ">
                <Header role="admin" />

                <div className=" flex-1 p-6  bg-[#ededed] ">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayoutAdmin;
