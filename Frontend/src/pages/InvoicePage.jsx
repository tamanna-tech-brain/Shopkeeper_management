import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoiceById } from "../apis/api.js";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import {
  FaPrint,
  FaFilePdf,
  FaArrowLeft,
  FaStore,
  FaCheckCircle,
} from "react-icons/fa";

const InvoicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const invoiceRef = useRef();

  const fetchInvoice = async (invoiceId) => {
    try {
      setLoading(true);
      const res = await getInvoiceById(invoiceId);
      setInvoice(res.data.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error(error.message || error.response?.data?.message || "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    try {
      setExporting(true);
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Simple clean vector PDF generation using jsPDF
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("INVOICE / CASH MEMO", 40, 50);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("ShopKeeper Pro Retail Systems", 40, 70);
      doc.text(`Invoice ID: ${invoice?._id}`, 40, 85);
      doc.text(
        `Date: ${new Date(invoice?.createdAt || Date.now()).toLocaleDateString()}`,
        40,
        100
      );

      // Customer
      doc.setFont("helvetica", "bold");
      doc.text("Billed To:", 350, 70);
      doc.setFont("helvetica", "normal");
      doc.text(invoice?.userId?.name || "Valued Customer", 350, 85);
      doc.text(invoice?.userId?.email || "walkin@customer.com", 350, 100);

      // Line
      doc.setDrawColor(200, 200, 200);
      doc.line(40, 115, 550, 115);

      // Table Header
      doc.setFont("helvetica", "bold");
      doc.text("Item Description", 40, 135);
      doc.text("Qty", 320, 135);
      doc.text("Rate (₹)", 400, 135);
      doc.text("Total (₹)", 490, 135);
      doc.line(40, 142, 550, 142);

      // Table Rows
      let y = 165;
      doc.setFont("helvetica", "normal");
      invoice?.items?.forEach((item) => {
        doc.text(String(item.productName || "Product"), 40, y);
        doc.text(String(item.quantity || 1), 320, y);
        doc.text(String(item.price || 0), 400, y);
        doc.text(String((item.quantity || 1) * (item.price || 0)), 490, y);
        y += 20;
      });

      // Total Line
      doc.line(40, y + 10, 550, y + 10);
      y += 30;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Grand Total:", 380, y);
      doc.text(`Rs. ${invoice?.finalAmount || invoice?.totalAmount}`, 490, y);

      doc.save(`Invoice_${id.slice(-6)}.pdf`);
      toast.success("Invoice PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Could not generate PDF directly, please use Print to PDF.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <Loader text="Rendering invoice details..." />;
  }

  if (!invoice) {
    return (
      <EmptyState
        title="Invoice Not Found"
        description="The requested retail invoice could not be located."
        actionText="Back to Sales"
        onAction={() => navigate("/sales")}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sales")}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Customer Invoice
            </h1>
            <p className="text-xs text-slate-400 font-mono">Invoice #{id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={downloadPDF}
            loading={exporting}
            icon={<FaFilePdf className="w-3.5 h-3.5 text-rose-400" />}
          >
            Download PDF
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            icon={<FaPrint className="w-3.5 h-3.5" />}
          >
            Print Invoice
          </Button>
        </div>
      </div>

      {/* Printable Invoice Sheet */}
      <div
        ref={invoiceRef}
        className="printable-area bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl border border-slate-200"
      >
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b-2 border-slate-100 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              <FaStore className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                ShopKeeper Pro
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Retail Management & POS Solutions
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                GSTIN: 07AAAAA0000A1Z5 | Reg. 2026
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              PAID INVOICE
            </span>
            <p className="text-2xl font-black text-slate-800">
              #{invoice._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Date:{" "}
              {new Date(invoice.createdAt || invoice.date || "1970-01-01").toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
          </div>
        </div>

        {/* Bill To Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Billed To
            </span>
            <h3 className="text-base font-bold text-slate-900">
              {invoice.userId?.name || "Customer / Walk-in"}
            </h3>
            <p className="text-slate-600 mt-0.5">
              {invoice.userId?.email || "customer@store.local"}
            </p>
            <p className="text-slate-500 mt-0.5">Client ID: {invoice.userId?._id || "N/A"}</p>
          </div>

          <div className="sm:text-right">
            <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Order Reference
            </span>
            <p className="font-mono font-semibold text-slate-800">
              {invoice.orderId?._id || invoice.orderId || "Direct POS Order"}
            </p>
            <p className="text-slate-500 mt-1">Payment Method: Completed</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                <th className="py-3 pl-2">#</th>
                <th className="py-3">Item Description</th>
                <th className="py-3 text-center">Quantity</th>
                <th className="py-3 text-right">Unit Price</th>
                <th className="py-3 text-right pr-2">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items?.map((item, i) => (
                <tr key={i}>
                  <td className="py-3.5 pl-2 text-slate-400 font-mono">{i + 1}</td>
                  <td className="py-3.5 font-bold text-slate-800">
                    {item.productName || "Product"}
                  </td>
                  <td className="py-3.5 text-center font-mono text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 text-right font-mono text-slate-700">
                    ₹{Number(item.price || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 text-right pr-2 font-bold font-mono text-slate-900">
                    ₹{(Number(item.quantity || 1) * Number(item.price || 0)).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="max-w-xs text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-700">Terms & Conditions:</p>
            <p>1. Goods once sold are subject to standard return policy within 7 days.</p>
            <p>2. Keep this invoice copy for warranty claims.</p>
            <p className="text-indigo-600 font-semibold pt-1">
              Thank you for shopping with us!
            </p>
          </div>

          <div className="sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 py-1">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-800">
                ₹{Number(invoice.totalAmount || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 py-1">
              <span>Tax / GST:</span>
              <span className="font-mono font-bold text-slate-800">
                ₹{Number(invoice.tax || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="font-mono text-indigo-700 text-lg">
                ₹{Number(invoice.finalAmount || invoice.totalAmount || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;