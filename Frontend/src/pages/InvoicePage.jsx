import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "../apis/api.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef();

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const fetchInvoice = async (invoiceId) => {
    try {
      setLoading(true);
      const res = await getInvoiceById(invoiceId);
      setInvoice(res.data.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      alert("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const input = invoiceRef.current;
    if (!input) return;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`invoice_${id}.pdf`);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-3xl">
        Loading...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-3xl">
        Invoice not found
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-cyan-900 to-blue-900 p-10">
      <div ref={invoiceRef} className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl text-black mb-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">INVOICE</h1>
            <p className="text-sm text-gray-500 mt-1">Invoice ID: {invoice._id}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-700">ShopKeeper Ltd.</h2>
            <p className="text-sm text-gray-500">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-6 flex justify-between">
          <div>
            <span className="font-bold text-slate-600 block mb-1">Customer / User:</span>
            <span className="text-slate-800 font-semibold">{invoice.userId?.name || "N/A"}</span>
            <span className="text-slate-500 text-sm block">{invoice.userId?.email}</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-slate-600 block mb-1">Order Ref:</span>
            <span className="text-slate-800 font-mono">{invoice.orderId?._id || invoice.orderId || "N/A"}</span>
          </div>
        </div>

        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              <th className="p-3 text-left font-bold text-slate-600">Product Name</th>
              <th className="p-3 text-center font-bold text-slate-600">Quantity</th>
              <th className="p-3 text-right font-bold text-slate-600">Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="p-3 text-slate-800 font-medium">{item.productName}</td>
                <td className="p-3 text-center text-slate-700">{item.quantity}</td>
                <td className="p-3 text-right text-slate-700">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 border-t pt-4 flex flex-col items-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{invoice.totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (GST):</span>
              <span>₹{invoice.tax || 0}</span>
            </div>
            <div className="flex justify-between text-slate-800 font-bold text-xl border-t pt-2">
              <span>Total:</span>
              <span>₹{invoice.finalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={downloadPDF}
        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8 py-3 rounded-2xl shadow-xl transition transform hover:scale-105"
      >
        Download Invoice PDF
      </button>
    </div>
  );
};

export default InvoicePage;