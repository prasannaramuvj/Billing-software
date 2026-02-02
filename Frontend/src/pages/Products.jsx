import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { mockApi } from "../utils/mockApi";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        tax: ""
    });
    const [editId, setEditId] = useState(null);
    const token = localStorage.getItem("token");

    const fetchProducts = async () => {
        const data = await mockApi.fetch("products");
        setProducts(data);
    };

    useEffect(() => { fetchProducts(); }, []);

    const submit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock),
            tax: parseFloat(form.tax || 0)
        };

        if (editId) {
            await mockApi.update("products", editId, payload);
        } else {
            await mockApi.create("products", payload);
        }

        setForm({ name: "", price: "", stock: "", tax: "" });
        setEditId(null);
        fetchProducts();
    };

    const editProduct = (p) => {
        setForm({
            name: p.name,
            price: p.price,
            stock: p.stock,
            tax: p.tax
        });
        setEditId(p._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteProduct = async (id) => {
        if (confirm("Delete this product?")) {
            await mockApi.delete("products", id);
            fetchProducts();
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800">📦 Products</h2>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 border-b pb-2">
                    {editId ? "✏️ Edit Product" : "➕ Add New Product"}
                </h3>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Price (₹)"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Stock"
                        value={form.stock}
                        onChange={e => setForm({ ...form, stock: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Tax %"
                        value={form.tax}
                        onChange={e => setForm({ ...form, tax: e.target.value })}
                    />

                    <button
                        className={`md:col-span-4 py-3 rounded-lg text-white font-semibold transition
                            ${editId
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {editId ? "Update Product" : "Add Product"}
                    </button>
                </form>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                    🧾 Product List
                </h3>

                <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr className="text-gray-600 uppercase text-xs tracking-wide">
                                <th className="p-4 text-left">Name</th>
                                <th className="p-4 text-left">Price</th>
                                <th className="p-4 text-left">Stock</th>
                                <th className="p-4 text-left">Tax</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {products.map(p => (
                                <tr
                                    key={p._id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="p-4 font-medium text-gray-800">
                                        {p.name}
                                    </td>

                                    <td className="p-4 text-gray-700">
                                        ₹{p.price}
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                ${p.stock > 0
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {p.stock > 0 ? "In Stock" : "Out"} ({p.stock})
                                        </span>
                                    </td>

                                    <td className="p-4 text-gray-700">
                                        {p.tax || 0}%
                                    </td>

                                    <td className="p-4 text-center">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => editProduct(p)}
                                                className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-100 transition"
                                                title="Edit"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>

                                            <button
                                                onClick={() => deleteProduct(p._id)}
                                                className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-10 text-gray-400"
                                    >
                                        No products found
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
