import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockApi } from "../utils/mockApi";




export default function Invoices() {
    const [invoices, setInvoices] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [filters, setFilters] = useState({
        customerId: "",
        fromDate: "",
        toDate: "",
        invoiceNumber: ""
    });

    const handlePayInvoice = async (invoiceId) => {
        try {
            const invoice = invoices.find(i => i._id === invoiceId);
            if (invoice) {
                await mockApi.update("invoices", invoiceId, { ...invoice, status: "PAID" });
                setInvoices((prev) =>
                    prev.map((inv) =>
                        inv._id === invoiceId ? { ...inv, status: "PAID" } : inv
                    )
                );
                alert("Invoice paid successfully!");
            }
        } catch (error) {
            console.error("Error paying invoice:", error);
            alert("Failed to pay invoice. Please try again.");
        }
    };


    // Client-side invoice number filter
    const filteredInvoices = invoices.filter((inv) => {
        if (!filters.invoiceNumber) return true;
        return inv.invoiceNumber === filters.invoiceNumber;
    });

    // Backend filter (date range, customer, etc.)
    // Backend filter (date range, customer, etc.)
    const fetchInvoices = async () => {
        const data = await mockApi.fetch("invoices");
        // Basic mock client side filter if needed, actually calling fetch will get all
        // and let client side filter do the rest
        setInvoices(data);
    };

    // Reset filters + reload all invoices
    // Reset filters + reload all invoices
    const handleResetFilters = async () => {
        setFilters({
            customerId: "",
            fromDate: "",
            toDate: "",
            invoiceNumber: ""
        });

        const data = await mockApi.fetch("invoices");
        setInvoices(data);
    };

    // Initial load
    useEffect(() => {
        handleResetFilters();
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Invoices</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <select
                    className="border p-2 rounded"
                    value={filters.invoiceNumber}
                    onChange={(e) =>
                        setFilters({ ...filters, invoiceNumber: e.target.value })
                    }
                >
                    <option value="">All Invoices</option>
                    {invoices.map((inv) => (
                        <option key={inv._id} value={inv.invoiceNumber}>
                            {inv.invoiceNumber}
                        </option>
                    ))}
                </select>

                <input
                    type="date"
                    className="border p-2 rounded"
                    value={filters.fromDate}
                    onChange={(e) =>
                        setFilters({ ...filters, fromDate: e.target.value })
                    }
                />

                <input
                    type="date"
                    className="border p-2 rounded"
                    value={filters.toDate}
                    onChange={(e) =>
                        setFilters({ ...filters, toDate: e.target.value })
                    }
                />

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={fetchInvoices}
                >
                    Filter
                </button>

                <button
                    onClick={handleResetFilters}
                    disabled={
                        !filters.invoiceNumber &&
                        !filters.fromDate &&
                        !filters.toDate
                    }
                    className="bg-gray-500 text-white px-4 py-2 rounded
                               disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Reset
                </button>
            </div>

            {/* Table */}
            <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Invoice No</th>
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-right">Total</th>
                        <th className="p-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInvoices.map((inv) => (
                        <tr key={inv._id} className="border-t">
                            <td className="p-3">{inv.invoiceNumber}</td>
                            <td className="p-3">{inv.customer?.name}</td>
                            <td className="p-3">
                                {new Date(inv.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right font-semibold">
                                ₹{inv.grandTotal}
                            </td>
                            <td className="p-3 text-center">
                                <button
                                    onClick={() =>
                                        navigate(`/invoices/${inv._id}`)
                                    }
                                    className="bg-blue-600 text-white px-4 py-1 rounded"
                                >
                                    View
                                </button>
                                {inv.status !== "PAID" && (
                                    <button
                                        onClick={() => handlePayInvoice(inv._id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                    >
                                        Pay
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}

                    {filteredInvoices.length === 0 && (
                        <tr>
                            <td
                                colSpan="5"
                                className="text-center p-4 text-gray-500"
                            >
                                No invoices found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
