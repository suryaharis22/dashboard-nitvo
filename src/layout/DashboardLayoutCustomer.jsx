import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const DashboardLayoutCustomer = ({ children }) => {
    return (
        <div className="flex h-full ">
            {/* Sidebar */}
            <Sidebar role="customer" />

            {/* Main content */}
            <div className="flex flex-col w-full">
                <Header role="customer" />
                {children}
            </div>
        </div>
    );
};

export default DashboardLayoutCustomer;
