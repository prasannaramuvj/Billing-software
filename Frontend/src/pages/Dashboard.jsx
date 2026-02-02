import { useEffect, useState } from "react";
import { mockApi } from "../utils/mockApi";
import { Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
);

export default function Dashboard() {
    const [summary, setSummary] = useState({});
    const [sales, setSales] = useState([]);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const loadData = async () => {
            const summaryData = await mockApi.getDashboardSummary();
            setSummary(summaryData);

            const salesData = await mockApi.getSalesChart();
            setSales(salesData);

            const recentInvoicesData = await mockApi.fetch("invoices");
            setRecentInvoices(recentInvoicesData);
        };
        loadData();
    }, []);

    return (
        <div className="space-y-8 p-4">
            <h2 className="text-2xl font-bold">Dashboard</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card title="Total Sales" value={`₹${summary.totalSales || 0}`} />
                <Card title="Total Invoices" value={summary.totalInvoices || 0} />
                <Card title="Paid Invoices" value={summary.paidInvoices || 0} />
                <Card title="Pending Invoices" value={summary.pendingInvoices || 0} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sales Line Chart */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="font-semibold mb-2">Sales Over Time</h3>
                    <Line
                        data={{
                            labels: sales.map(d => `Month ${d._id}`),
                            datasets: [
                                {
                                    label: "Sales",
                                    data: sales.map(d => d.total),
                                    borderColor: "#3b82f6",
                                    backgroundColor: "rgba(59,130,246,0.2)",
                                    fill: true,
                                    tension: 0.3,
                                },
                            ],
                        }}
                    />
                </div>

                {/* Invoice Status Doughnut */}
                <div className="bg-white p-4 rounded-xl shadow">
                    <h3 className="font-semibold mb-2">Invoice Status</h3>
                    <Doughnut
                        data={{
                            labels: ["Paid", "Pending"],
                            datasets: [
                                {
                                    data: [summary.paidInvoices || 0, summary.pendingInvoices || 0],
                                    backgroundColor: ["#10b981", "#f97316"],
                                },
                            ],
                        }}
                    />
                </div>
            </div>

            {/* Recent Invoices Table */}
            <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold mb-3">Recent Invoices</h3>
                <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Invoice No</th>
                            <th className="p-2">Customer</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentInvoices.map(inv => (
                            <tr key={inv._id} className="border-t hover:bg-gray-50">
                                <td className="p-2">{inv.invoiceNumber}</td>
                                <td className="p-2">{inv.customer?.name || "Unknown"}</td>
                                <td className="p-2">₹{inv.grandTotal}</td>
                                <td className="p-2">
                                    <span
                                        className={`px-2 py-0.5 rounded text-white ${inv.status === "PAID" ? "bg-green-500" : "bg-orange-500"
                                            }`}
                                    >
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-2">{new Date(inv.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {recentInvoices.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 p-4">
                                    No recent invoices
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
        </div>
    );
}
