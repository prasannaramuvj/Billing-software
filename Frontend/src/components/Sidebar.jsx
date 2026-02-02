import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-60 bg-blue-600 text-white p-4">
            <h2 className="text-xl font-bold mb-6">Billing App</h2>
            <nav className="space-y-3">
                <Link to="/" className="block hover:bg-blue-500 p-2 rounded">Dashboard</Link>
                <Link to="/products" className="block hover:bg-blue-500 p-2 rounded">Products</Link>
                <Link to="/customers" className="block hover:bg-blue-500 p-2 rounded">Customers</Link>
                <Link to="/billing" className="block hover:bg-blue-500 p-2 rounded">Billing</Link>
                <Link to="/invoices" className="block hover:bg-blue-500 p-2 rounded">Invoices</Link>
                <Link to="/reports" className="block hover:bg-blue-500 p-2 rounded">Reports</Link>
            </nav>
        </div>
    );
}
