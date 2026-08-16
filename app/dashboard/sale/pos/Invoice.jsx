"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconPrinter, IconCheck } from "@tabler/icons-react"

export default function InvoiceReceipt({ isOpen, onOpenChange, customer, saleBy, invoiceNumber, cartItems, totalUSD, totalKHR, onClose }) {
  
  const handlePrint = () => {
    const printContent = document.getElementById("thermal-receipt").innerHTML
    const printWindow = window.open("", "_blank", "width=600,height=800")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt ${invoiceNumber}</title>
          <style>
            @page {
              size: auto;
              margin: 0mm;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 6mm;
            }
            .text-center { text-align: center; }
            .space-y-1 > * + * { margin-top: 4px; }
            .mb-3 { margin-bottom: 12px; }
            .text-lg { font-size: 16px; }
            .font-black { font-weight: 900; }
            .tracking-wider { letter-spacing: 0.05em; }
            .uppercase { text-transform: uppercase; }
            .text-[10px] { font-size: 10px; }
            .font-bold { font-weight: 700; }
            .text-zinc-500 { color: #52525b; }
            .tracking-widest { letter-spacing: 0.1em; }
            .my-2 { margin-top: 8px; margin-bottom: 8px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .capitalize { text-transform: capitalize; }
            .border-t { border-top: 1px solid #000; }
            .border-b-2 { border-bottom: 2px solid #000; }
            .border-dashed { border-style: dashed; }
            .border-zinc-400 { border-color: #71717a; }
            .pb-1 { padding-bottom: 4px; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            .w-8 { width: 32px; }
            .w-16 { width: 64px; }
            .divide-y > * + * { border-top: 1px solid #e4e4e7; }
            .divide-dashed > * + * { border-style: dashed; }
            .py-1 { padding-top: 4px; padding-bottom: 4px; }
            .font-semibold { font-weight: 600; }
            .bg-black { background-color: #000; color: #fff; padding: 6px; border-radius: 2px; }
            .text-xs { font-size: 12px; }
            .px-1 { padding-left: 4px; padding-right: 4px; }
            .text-[9px] { font-size: 9px; }
            .text-zinc-300 { color: #d4d4d8; }
            .pr-1 { padding-right: 4px; }
            .mt-3 { margin-top: 12px; }
          </style>
        </head>
        <body>
          <div style="width: 72mm; margin: 0 auto;">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // Get current date formatted like 23/Jul/2026
  const getFormattedDate = () => {
    const d = new Date()
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${String(d.getDate()).padStart(2, "0")}/${months[d.getMonth()]}/${d.getFullYear()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-[420px] p-4 sm:p-6 rounded-2xl overflow-y-auto max-h-[92vh]">
        {/* Style block to handle receipt isolated printing */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #thermal-receipt, #thermal-receipt * {
              visibility: visible;
            }
            #thermal-receipt {
              position: absolute;
              left: 50%;
              top: 0;
              transform: translateX(-50%);
              width: 80mm !important;
              margin: 0 !important;
              padding: 10mm !important;
              box-shadow: none !important;
              border: none !important;
              background: white !important;
              color: black !important;
            }
          }
        `}} />

        <div className="flex flex-col items-center">
          {/* Thermal Receipt Box */}
          <div 
            id="thermal-receipt" 
            className="w-full bg-white text-zinc-900 border border-zinc-200 shadow-sm p-5 rounded-md font-mono text-xs select-none"
          >
            {/* Header */}
            <div className="text-center space-y-1 mb-3">
              <h2 className="text-lg font-black tracking-wider uppercase">Jenny Coffee PSV</h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Receipt</p>
            </div>

            {/* Dash Divider */}
            <div className="border-t border-dashed border-zinc-400 my-2"></div>

            {/* Details */}
            <div className="space-y-1 mb-3 text-[10px] font-bold">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="capitalize">{customer || "Chan"}</span>
              </div>
              <div className="flex justify-between">
                <span>Sale by:</span>
                <span className="capitalize">{saleBy || "Super"}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{getFormattedDate()}</span>
              </div>
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span>{invoiceNumber || "000009"}</span>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-[10px] my-3">
              <thead>
                <tr className="border-b-2 border-zinc-800 font-black">
                  <th className="pb-1 text-left">Item</th>
                  <th className="pb-1 text-center w-8">Qty</th>
                  <th className="pb-1 text-right w-16">Unit</th>
                  <th className="pb-1 text-right w-16">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-zinc-300">
                {cartItems.map((item, idx) => (
                  <tr key={idx} className="font-semibold">
                    <td className="py-1 text-left truncate max-w-[120px]">{item.name}</td>
                    <td className="py-1 text-center">{item.qty}</td>
                    <td className="py-1 text-right">{Math.round(item.price * 4100).toLocaleString()}៛</td>
                    <td className="py-1 text-right">{Math.round((item.price * item.qty) * 4100).toLocaleString()}៛</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Dash Divider */}
            <div className="border-t border-dashed border-zinc-400 my-2"></div>

            {/* Total Section */}
            <div className="bg-black text-white p-2 rounded-sm text-center space-y-0.5 my-2">
              <div className="flex justify-between text-xs font-bold px-1">
                <span>Total</span>
                <span>{totalKHR.toLocaleString()}៛</span>
              </div>
              <div className="text-[9px] text-zinc-300 text-right pr-1">
                (${totalUSD.toFixed(2)})
              </div>
            </div>

            {/* Dash Divider */}
            <div className="border-t border-dashed border-zinc-400 my-2"></div>

            {/* Footer */}
            <div className="text-center font-bold text-[10px] tracking-wider mt-3">
              Thank you!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <Button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 gap-1.5 cursor-pointer rounded-xl"
            >
              <IconPrinter className="h-4 w-4" /> Print Invoice
            </Button>
            <Button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 gap-1.5 cursor-pointer rounded-xl"
            >
              <IconCheck className="h-4 w-4" /> Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
