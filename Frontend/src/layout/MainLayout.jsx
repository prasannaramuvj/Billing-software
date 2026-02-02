import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ user, onLogout }) {
    const token = localStorage.getItem("token");
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex h-screen">
            {/* Sidebar on the left with blue background */}
            <div className="w-64 bg-blue-600">
                <Sidebar />
            </div>

            {/* Main content area */}
            <div className="flex-1 bg-gray-100 flex flex-col">
                <Header user={user} onLogout={onLogout} />
                <div className="p-4 flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>

    );
}
