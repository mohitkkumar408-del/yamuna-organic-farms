import React, { useState } from 'react';
import { Order, Invoice } from '../types/index.ts';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { formatINR, formatDate } from '../utils/formatters.ts';
import { Printer, X, Download, Share2, Receipt } from 'lucide-react';

interface InvoicePrintModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({ order, onClose }) => {
  const { settings, invoices, payments } = useFarm();
  const { language } = useLanguage();
  const [printMode, setPrintMode] = useState<'a4' | 'thermal'>('a4');

  const invoice = invoices.find(inv => inv.orderId === order.id || inv.id === order.invoiceId);
  const relatedPayments = payments.filter(p => p.orderId === order.id || (invoice && p.invoiceId === invoice.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Controls Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-stone-200 bg-stone-50 print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Format:
            </span>
            <div className="flex bg-stone-200 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setPrintMode('a4')}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  printMode === 'a4' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Standard A4 Invoice
              </button>
              <button
                onClick={() => setPrintMode('thermal')}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  printMode === 'thermal' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                Thermal Slip (58/80mm)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable View Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-100 flex justify-center">
          {printMode === 'a4' ? (
            /* --- A4 Professional Invoice --- */
            <div
              id="printable-invoice"
              className="bg-white border border-stone-200 shadow-sm p-8 max-w-[800px] w-full text-stone-900 text-xs font-sans print:border-none print:shadow-none print:p-0 print:m-0"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-5 mb-6">
                <div>
                  <div className="text-xl font-bold tracking-tight text-emerald-950 font-serif">
                    {settings?.businessName || 'Yamuna Organic Farms'}
                  </div>
                  <div className="text-stone-600 text-[11px] mt-0.5">
                    {settings?.businessNameHi || 'यमुना ऑर्गेनिक फार्म्स, धनबाद'}
                  </div>
                  <div className="text-stone-500 text-[10px] mt-2 max-w-sm leading-relaxed">
                    {settings?.address || 'Plot No. 42, Govindpur Road, Near BIT More, Dhanbad, Jharkhand - 828109'}
                    <br />
                    Phone: {settings?.phone || '+91 94311 82740'} · Email: {settings?.email || 'info@yamunaorganicfarms.in'}
                    {settings?.gstNumber && <><br />GSTIN: <span className="font-mono">{settings.gstNumber}</span></>}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 font-bold text-xs uppercase tracking-wider border border-emerald-200 mb-2">
                    Tax / Delivery Invoice
                  </span>
                  <div className="font-mono font-bold text-sm text-stone-900">
                    {order.invoiceId || `INV-${order.id.replace('YOF-ORD-', '')}`}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1">
                    Date: <span className="font-mono">{formatDate(order.orderDate)}</span>
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Delivery: <span className="font-mono">{formatDate(order.expectedDeliveryDate)}</span>
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Ref Order: <span className="font-mono">{order.id}</span>
                  </div>
                </div>
              </div>

              {/* Bill To & Dispatch Details */}
              <div className="grid grid-cols-2 gap-6 bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6 text-xs">
                <div>
                  <div className="font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Billed & Delivered To:
                  </div>
                  <div className="font-bold text-stone-900 text-sm">{order.customerName}</div>
                  <div className="text-stone-600 mt-0.5">{order.customerAddress}</div>
                  <div className="text-stone-600 mt-0.5 font-mono">Phone: {order.customerPhone}</div>
                </div>

                <div className="text-right sm:text-left">
                  <div className="font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-1">
                    Delivery & Payment Terms:
                  </div>
                  <div>Delivery Type: <span className="font-semibold">{order.deliveryType}</span></div>
                  <div>Payment Mode: <span className="font-semibold uppercase">{order.paymentMethod}</span></div>
                  <div>
                    Payment Status:{' '}
                    <span className={`font-bold uppercase ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse mb-6">
                <thead>
                  <tr className="border-b border-stone-300 text-[10px] uppercase tracking-wider text-stone-600 bg-stone-100">
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">Item Description & Variety</th>
                    <th className="py-2 px-3 text-right">Qty (Kg/Units)</th>
                    <th className="py-2 px-3 text-right">Rate (₹)</th>
                    <th className="py-2 px-3 text-right">Discount</th>
                    <th className="py-2 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3 text-stone-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-stone-900">{item.productName}</div>
                        <div className="text-[10px] text-stone-500">{item.variety}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {item.quantityKg} kg
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {formatINR(item.pricePerKgPaise)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-500">
                        {item.discountPaise > 0 ? formatINR(item.discountPaise) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                        {formatINR(item.totalPaise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              <div className="flex justify-between items-start border-t border-stone-200 pt-4 mb-6">
                {/* Bank / UPI Details */}
                <div className="text-[10px] text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200 max-w-sm space-y-1">
                  <div className="font-bold text-stone-800 uppercase tracking-wider text-[9px]">
                    Direct Bank & UPI Payment:
                  </div>
                  <div>UPI VPA: <span className="font-mono font-semibold text-stone-900">{settings?.upiId || 'yamunafarms@okhdfcbank'}</span></div>
                  <div>Bank: {settings?.bankName || 'State Bank of India, Dhanbad'}</div>
                  <div>A/C No: <span className="font-mono font-semibold">{settings?.accountNumber || '39482019482'}</span></div>
                  <div>IFSC: <span className="font-mono">{settings?.ifscCode || 'SBIN0000066'}</span></div>
                </div>

                {/* Calculations */}
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span className="font-mono tabular-nums">{formatINR(order.subtotalPaise)}</span>
                  </div>
                  {order.discountPaise > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Bulk Discount:</span>
                      <span className="font-mono tabular-nums">-{formatINR(order.discountPaise)}</span>
                    </div>
                  )}
                  {order.deliveryChargePaise > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Delivery / Transport:</span>
                      <span className="font-mono tabular-nums">{formatINR(order.deliveryChargePaise)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-300 pt-2">
                    <span>Total Amount:</span>
                    <span className="font-mono tabular-nums text-emerald-900">{formatINR(order.totalPaise)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600 border-t border-stone-200 pt-1">
                    <span>Advance / Paid:</span>
                    <span className="font-mono tabular-nums font-semibold text-stone-800">{formatINR(order.amountPaidPaise)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-stone-200 pt-1 text-xs">
                    <span className={order.remainingDuePaise > 0 ? 'text-amber-800' : 'text-emerald-700'}>
                      Balance Due:
                    </span>
                    <span className="font-mono tabular-nums">{formatINR(order.remainingDuePaise)}</span>
                  </div>
                </div>
              </div>

              {/* Payments Ledger if any */}
              {relatedPayments.length > 0 && (
                <div className="mb-6 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="text-[10px] font-bold text-stone-700 uppercase mb-1">Payment Receipts:</div>
                  <div className="space-y-1 text-[10px]">
                    {relatedPayments.map(p => (
                      <div key={p.id} className="flex justify-between text-stone-600">
                        <span>{formatDate(p.paymentDate)} · {p.method.toUpperCase()} ({p.transactionRef || 'Direct'})</span>
                        <span className="font-mono font-semibold text-stone-800">{formatINR(p.amountPaise)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Terms & Signature */}
              <div className="border-t border-stone-200 pt-6 mt-8 flex justify-between items-end text-[10px] text-stone-500">
                <div className="max-w-xs space-y-1">
                  <div className="font-semibold text-stone-700">Storage & Usage Notice:</div>
                  <div>Store fresh oyster mushrooms between 4°C - 7°C. Best consumed within 4-5 days of harvest date. Certified organic substrate.</div>
                </div>

                <div className="text-center">
                  <div className="h-10 border-b border-stone-400 w-44 mb-1" />
                  <div className="font-semibold text-stone-800">For Yamuna Organic Farms</div>
                  <div className="text-[9px]">Authorized Signatory</div>
                </div>
              </div>
            </div>
          ) : (
            /* --- Compact 58mm / 80mm Thermal Receipt --- */
            <div
              id="printable-thermal"
              className="bg-white border border-dashed border-stone-300 p-4 max-w-[320px] w-full text-stone-950 font-mono text-[11px] shadow-sm leading-tight print:border-none print:shadow-none print:p-0"
            >
              <div className="text-center pb-2 border-b border-dashed border-stone-400">
                <div className="font-bold text-sm tracking-tight uppercase">Yamuna Organic Farms</div>
                <div className="text-[9px]">Dhanbad, Jharkhand</div>
                <div className="text-[9px]">Mob: {settings?.phone || '+91 94311 82740'}</div>
                <div className="text-[9px] mt-1 font-semibold">CASH / DELIVERY SLIP</div>
              </div>

              <div className="py-2 border-b border-dashed border-stone-300 text-[10px] space-y-0.5">
                <div>Inv: {order.invoiceId || order.id}</div>
                <div>Date: {formatDate(order.orderDate)}</div>
                <div>Cust: {order.customerName}</div>
                <div>Phone: {order.customerPhone}</div>
              </div>

              <div className="py-2 border-b border-dashed border-stone-300">
                <div className="flex justify-between font-bold text-[10px] pb-1">
                  <span>ITEM</span>
                  <span>QTY x RATE = AMT</span>
                </div>
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-0.5">
                    <div className="font-semibold truncate">{it.productName}</div>
                    <div className="flex justify-between text-[10px] text-stone-700">
                      <span>{it.quantityKg}kg @ ₹{it.pricePerKgPaise / 100}</span>
                      <span className="font-bold">₹{it.totalPaise / 100}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-2 border-b border-dashed border-stone-400 space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotalPaise / 100}</span>
                </div>
                {order.discountPaise > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-₹{order.discountPaise / 100}</span>
                  </div>
                )}
                {order.deliveryChargePaise > 0 && (
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>₹{order.deliveryChargePaise / 100}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs border-t border-dashed border-stone-300 pt-1">
                  <span>NET TOTAL:</span>
                  <span>₹{order.totalPaise / 100}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span>₹{order.amountPaidPaise / 100}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>DUE:</span>
                  <span>₹{order.remainingDuePaise / 100}</span>
                </div>
              </div>

              <div className="text-center pt-3 text-[9px] text-stone-600 space-y-1">
                <div>UPI: {settings?.upiId || 'yamunafarms@upi'}</div>
                <div>*** Thank You! Visit Again ***</div>
                <div>Fresh Organic Oyster Mushrooms</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
