import { useEffect, useState } from "react";
import { mockApi } from "../utils/mockApi";

export default function Billing() {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);
    const [customer, setCustomer] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        Promise.all([
            mockApi.fetch("customers"),
            mockApi.fetch("products")
        ]).then(([c, p]) => {
            setCustomers(c);
            setProducts(p);
        });
    }, []);

    const addItem = (p) => {
        setItems([...items, {
            product: p._id,
            name: p.name,
            qty: 1,
            price: p.price,
            tax: p.tax || 0
        }]);
    };

    const totals = items.reduce((acc, i) => {
        const price = parseFloat(i.price) || 0;
        const qty = parseInt(i.qty) || 0;
        const tax = parseFloat(i.tax) || 0;

        const taxAmount = (price * qty * tax) / 100;
        const total = price * qty + taxAmount;

        acc.sub += price * qty;
        acc.tax += taxAmount;
        acc.grand += total;
        return acc;
    }, { sub: 0, tax: 0, grand: 0 });

    const saveInvoice = async () => {
        const fullCustomer = customers.find(c => c._id === customer);
        if (!fullCustomer) {
            alert("Invalid Customer Selected");
            return;
        }

        await mockApi.create("invoices", {
            invoiceNumber: "INV-" + Date.now(),
            customer: fullCustomer, // Save full object for dashboard/list display
            items,
            subTotal: totals.sub,
            taxTotal: totals.tax,
            grandTotal: totals.grand,
            status: "PENDING", // Default status
            createdAt: new Date().toISOString()
        });
        alert("Invoice created");
        setItems([]);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Create Invoice</h2>

            <select className="border p-2 rounded" onChange={e => setCustomer(e.target.value)}>
                <option value="">Select Customer</option>
                {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
                {products.map(p => (
                    <button
                        key={p._id}
                        onClick={() => addItem(p)}
                        className="border p-2 rounded hover:bg-gray-100"
                    >
                        {p.name} - ₹{p.price}
                    </button>
                ))}
            </div>

            <div className="bg-white shadow rounded p-4">
                {items.map((i, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span>{i.name} x {i.qty}</span>
                        <span>₹{(i.price * i.qty).toFixed(2)}</span>
                    </div>
                ))}
                <hr className="my-2" />
                <div>Subtotal: ₹{totals.sub}</div>
                <div>Tax: ₹{totals.tax}</div>
                <div className="font-bold">Total: ₹{totals.grand}</div>
            </div>

            <button
                onClick={saveInvoice}
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={!customer || items.length === 0}
            >
                Save Invoice
            </button>
        </div>
    );
}
