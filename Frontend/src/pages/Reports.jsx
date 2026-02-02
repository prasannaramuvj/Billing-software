import { useEffect, useState } from "react";
import { mockApi } from "../utils/mockApi";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [summary, setSummary] = useState({
        totalInvoices: 0,
        totalAmount: 0,
        totalTax: 0
    });
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        type: "daily"
    });

    const token = localStorage.getItem("token");

    const fetchReports = async () => {
        let data = await mockApi.fetch("invoices");

        // Client-side filtering
        if (filters.fromDate) {
            data = data.filter(i => new Date(i.createdAt) >= new Date(filters.fromDate));
        }
        if (filters.toDate) {
            // Add 1 day to include the end date properly or handle time comparison
            const endDate = new Date(filters.toDate);
            endDate.setHours(23, 59, 59);
            data = data.filter(i => new Date(i.createdAt) <= endDate);
        }

        setReports(data);

        // Calculate summary
        const totalSales = data.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
        const totalTax = data.reduce((acc, curr) => acc + (curr.taxTotal || 0), 0);

        setSummary({
            totalInvoices: data.length,
            totalAmount: totalSales,
            totalTax: totalTax
        });
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Aggregate data by date
    const aggregateByDate = (key) => {
        return reports.reduce((acc, r) => {
            const date = new Date(r.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + r[key];
            return acc;
        }, {});
    };

    const salesDataObj = aggregateByDate("grandTotal");
    const taxDataObj = aggregateByDate("taxTotal");
    // Function to create Bar chart data
    const createBarChart = (label, dataObj, bgColor) => ({
        labels: Object.keys(dataObj),
        datasets: [
            {
                label,
                data: Object.values(dataObj),
                backgroundColor: bgColor
            }
        ]
    });

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: false }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Reports</h2>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={filters.fromDate}
                    onChange={e => setFilters({ ...filters, fromDate: e.target.value })}
                />
                <input
                    type="date"
                    className="border p-2 rounded"
                    value={filters.toDate}
                    onChange={e => setFilters({ ...filters, toDate: e.target.value })}
                />
                <select
                    className="border p-2 rounded"
                    value={filters.type}
                    onChange={e => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                <button
                    onClick={fetchReports}
                    className="bg-blue-600 text-white rounded px-4"
                >
                    Apply Filter
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-gray-500">Total Invoices</p>
                    <h3 className="text-2xl font-bold">{summary.totalInvoices}</h3>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-green-600">
                        ₹{summary.totalAmount}
                    </h3>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-gray-500">Total Tax</p>
                    <h3 className="text-2xl font-bold text-orange-600">
                        ₹{summary.totalTax}
                    </h3>
                </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow p-4">
                        <h3 className="font-semibold mb-2 text-center">Total Sales</h3>
                        <Bar
                            data={createBarChart(
                                "Total Sales",
                                salesDataObj,
                                "rgba(37, 99, 235, 0.7)"
                            )}
                            options={chartOptions}
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow p-4">
                        <h3 className="font-semibold mb-2 text-center">Total Tax</h3>
                        <Bar
                            data={createBarChart(
                                "Total Tax",
                                taxDataObj,
                                "rgba(234, 88, 12, 0.7)"
                            )}
                            options={chartOptions}
                        />
                    </div>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Invoice Reports</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Invoice No</th>
                                <th className="p-2">Customer</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Tax</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map(r => (
                                    <tr key={r._id} className="border-t hover:bg-gray-50">
                                        <td className="p-2">{r.invoiceNumber}</td>
                                        <td className="p-2">{r.customer?.name}</td>
                                        <td className="p-2">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-2">₹{r.grandTotal}</td>
                                        <td className="p-2">₹{r.taxTotal}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-4 text-gray-500">
                                        No reports found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
