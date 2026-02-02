import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { mockApi } from "../utils/mockApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import logo from "../assets/logo.png";

export default function InvoiceDetails() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const token = localStorage.getItem("token");
    const [company, setCompany] = useState(null);


    const downloadPDF = () => {
        const input = document.getElementById("invoice-print");
        const button = document.getElementById("download-btn");

        if (button) button.style.display = "none";

        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${invoice.invoiceNumber}.pdf`);

            if (button) button.style.display = "inline-block";
        });
    };

    useEffect(() => {
        mockApi.fetchOne("invoices", id).then(setInvoice);
    }, [id]);


    useEffect(() => {
        // Mock company info
        setCompany({
            name: "My Billing Company",
            address: "123 Business St, Tech City, IN",
            gstNumber: "GSTIN123456789",
            email: "contact@mybilling.com",
            phone: "+91 9876543210"
        });
    }, []);
    if (!invoice) return <p>Loading...</p>;

    return (
        <div
            id="invoice-print"
            style={{
                backgroundColor: "#ffffffff",
                color: "#000000",
                padding: "24px",
                maxWidth: "800px",
                margin: "auto",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* ===== COMPANY HEADER ===== */}
            {company && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "2px solid #e5e7eb",
                        paddingBottom: "12px",
                        marginBottom: "16px",
                    }}
                >
                    {/* Logo */}
                    <div className="w-[140px] h-[70px] flex items-center">
                        <img
                            src={logo}
                            alt="Company Logo"
                        />
                    </div>

                    {/* Company Info */}
                    <div style={{ textAlign: "right", fontSize: "14px" }}>
                        <h2 style={{ margin: 0 }}>{company.name}</h2>
                        <p style={{ margin: 0 }}>{company.address}</p>
                        <p style={{ margin: 0 }}>GST: {company.gstNumber}</p>
                        <p style={{ margin: 0 }}>{company.email}</p>
                        <p style={{ margin: 0 }}>{company.phone}</p>
                    </div>
                </div>
            )}


            {/* ===== INVOICE TITLE ===== */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "16px",
                }}
            >
                <h3>Invoice</h3>
                <div style={{ fontSize: "14px" }}>
                    <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> {new Date(invoice.createdAt).toDateString()}</p>
                </div>
            </div>

            {/* ===== CUSTOMER INFO ===== */}
            <div style={{ marginTop: "12px", fontSize: "14px" }}>
                <p><strong>Billed To:</strong></p>
                <p>{invoice.customer.name}</p>
                <p>{invoice.customer.phone}</p>
                <p>{invoice.customer.address}</p>
            </div>

            {/* ===== ITEMS TABLE ===== */}
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "16px",
                    fontSize: "14px",
                }}
            >
                <thead style={{ backgroundColor: "#f3f4f6" }}>
                    <tr>
                        <th style={th}>Product</th>
                        <th style={th}>Qty</th>
                        <th style={th}>Price</th>
                        <th style={th}>Tax %</th>
                        <th style={th}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {invoice.items.map((item, i) => {
                        const itemTotal = item.price * item.qty;
                        const itemTax = (itemTotal * item.tax) / 100;

                        return (
                            <tr key={i}>
                                <td style={td}>{item.product.name}</td>
                                <td style={td}>{item.qty}</td>
                                <td style={td}>₹{item.price}</td>
                                <td style={td}>{item.tax}%</td>
                                <td style={td}>₹{itemTotal + itemTax}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* ===== TOTALS ===== */}
            <div
                style={{
                    textAlign: "right",
                    marginTop: "16px",
                    fontSize: "14px",
                }}
            >
                <p>Sub Total: ₹{invoice.subTotal}</p>
                <p>Tax Total: ₹{invoice.taxTotal}</p>
                <h3>Grand Total: ₹{invoice.grandTotal}</h3>
            </div>

            {/* ===== FOOTER ===== */}
            <p style={{ marginTop: "24px", fontSize: "13px", textAlign: "center" }}>
                Thank you for your business 🙏
            </p>

            {/* ===== DOWNLOAD BUTTON ===== */}
            <button
                id="download-btn"
                onClick={downloadPDF}
                style={{
                    marginTop: "16px",
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                Download PDF
            </button>
        </div>
    );
}

/* ===== Table Styles ===== */
const th = {
    padding: "8px",
    border: "1px solid #d1d5db",
    textAlign: "left",
};

const td = {
    padding: "8px",
    border: "1px solid #d1d5db",
};
