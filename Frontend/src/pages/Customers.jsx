import { useEffect, useState } from "react";
import { mockApi } from "../utils/mockApi";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        gstNumber: ""
    });
    const [editId, setEditId] = useState(null);
    const token = localStorage.getItem("token");

    const fetchCustomers = async () => {
        const data = await mockApi.fetch("customers");
        setCustomers(data);
    };

    useEffect(() => { fetchCustomers(); }, []);

    const submit = async (e) => {
        e.preventDefault();
        if (editId) {
            await mockApi.update("customers", editId, form);
        } else {
            await mockApi.create("customers", form);
        }

        setForm({ name: "", phone: "", email: "", address: "", gstNumber: "" });
        setEditId(null);
        fetchCustomers();
    };

    const editCustomer = (c) => {
        setForm({
            name: c.name,
            phone: c.phone,
            email: c.email,
            address: c.address,
            gstNumber: c.gstNumber
        });
        setEditId(c._id);
    };

    const deleteCustomer = async (id) => {
        if (confirm("Delete this customer?")) {
            await mockApi.delete("customers", id);
            fetchCustomers();
        }
    };

    return (
        <div className="space-y-8">
            {/* Page Title */}
            <h2 className="text-2xl font-bold">Customers</h2>

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">
                    {editId ? "Edit Customer" : "Add New Customer"}
                </h3>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="border p-2 rounded"
                        placeholder="Customer Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        required
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="GST Number (optional)"
                        value={form.gstNumber}
                        onChange={e => setForm({ ...form, gstNumber: e.target.value })}
                    />
                    <textarea
                        className="border p-2 rounded md:col-span-2"
                        placeholder="Address"
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                    />

                    <button className="bg-blue-600 text-white py-2 rounded md:col-span-2 hover:bg-blue-700">
                        {editId ? "Update Customer" : "Add Customer"}
                    </button>
                </form>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-semibold mb-4">Customer List</h3>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-2">Name</th>
                                <th className="p-2">Phone</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">GST</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c._id} className="border-t hover:bg-gray-50">
                                    <td className="p-2">{c.name}</td>
                                    <td className="p-2">{c.phone}</td>
                                    <td className="p-2">{c.email || "-"}</td>
                                    <td className="p-2">{c.gstNumber || "-"}</td>
                                    <td className="p-2 space-x-2">
                                        <button
                                            onClick={() => editCustomer(c)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteCustomer(c._id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {customers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center p-4 text-gray-500">
                                        No customers found
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
