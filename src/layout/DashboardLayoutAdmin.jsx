import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const DashboardLayoutAdmin = ({ children }) => {
    return (
        <div className="flex h-full ">
            {/* Sidebar */}
            <Sidebar role="admin" />

            {/* Main content */}
            <div className="flex flex-col w-full">
                <Header role="admin" />
                {children}
            </div>
        </div>
    );
};

export default DashboardLayoutAdmin;
