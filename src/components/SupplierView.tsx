import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { formatINR, formatDate } from '../utils/formatters.ts';
import {
  Truck,
  Plus,
  CreditCard,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X
} from 'lucide-react';
import { Supplier, Purchase, PaymentMethod } from '../types/index.ts';

export const SupplierView: React.FC = () => {
  const { suppliers, purchases, createSupplier, createPurchase, recordSupplierPayment } = useFarm();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'purchases' | 'suppliers'>('purchases');
  
  // New Supplier Modal
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [suppName, setSuppName] = useState('');
  const [suppPhone, setSuppPhone] = useState('');
  const [suppEmail, setSuppEmail] = useState('');
  const [suppAddress, setSuppAddress] = useState('');
  const [suppType, setSuppType] = useState('High-Purity Mushroom Spawn');
  const [suppNotes, setSuppNotes] = useState('');

  // New Purchase Modal
  const [isNewPurchaseOpen, setIsNewPurchaseOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [purchaseCategory, setPurchaseCategory] = useState<any>('Straw & Substrate');
  const [purchaseDesc, setPurchaseDesc] = useState('');
  const [purchaseQty, setPurchaseQty] = useState('');
  const [purchaseTotalRupees, setPurchaseTotalRupees] = useState<number>(2000);
  const [purchasePaidRupees, setPurchasePaidRupees] = useState<number>(1000);
  const [purchaseInvoiceRef, setPurchaseInvoiceRef] = useState('');
  const [purchaseNotes, setPurchaseNotes] = useState('');

  // Pay Supplier Modal
  const [payModalSupplier, setPayModalSupplier] = useState<Supplier | null>(null);
  const [payAmountRupees, setPayAmountRupees] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [payTxRef, setPayTxRef] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSupplier({
        name: suppName.trim(),
        phone: suppPhone.trim(),
        email: suppEmail.trim() || undefined,
        address: suppAddress.trim(),
        suppliesType: suppType.trim(),
        notes: suppNotes.trim()
      });
      setIsAddSupplierOpen(false);
      setSuppName('');
      setSuppPhone('');
      setSuppAddress('');
    } catch (err: any) {
      alert(err.message || 'Failed to add supplier');
    }
  };

  const handleCreatePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    if (!supplier) return;

    const totalPaise = Math.round(purchaseTotalRupees * 100);
    const paidPaise = Math.round(purchasePaidRupees * 100);
    const balancePaise = Math.max(0, totalPaise - paidPaise);

    try {
      await createPurchase({
        supplierId: supplier.id,
        supplierName: supplier.name,
        date: todayStr,
        category: purchaseCategory,
        itemsDescription: purchaseDesc.trim(),
        quantity: purchaseQty.trim(),
        totalAmountPaise: totalPaise,
        amountPaidPaise: paidPaise,
        balancePaise,
        paymentStatus: balancePaise === 0 ? 'paid' : paidPaise > 0 ? 'partial' : 'unpaid',
        receivedStatus: 'Received',
        invoiceOrReceiptRef: purchaseInvoiceRef.trim(),
        notes: purchaseNotes.trim()
      });
      setIsNewPurchaseOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to record purchase');
    }
  };

  const handleConfirmPaySupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalSupplier) return;

    const amountPaise = Math.round(payAmountRupees * 100);
    if (amountPaise <= 0 || amountPaise > payModalSupplier.balancePaise) {
      alert('Invalid payment amount');
      return;
    }

    try {
      await recordSupplierPayment(
        payModalSupplier.id,
        undefined,
        amountPaise,
        payMethod,
        payTxRef.trim(),
        payNotes.trim()
      );
      setPayModalSupplier(null);
    } catch (err: any) {
      alert(err.message || 'Failed to pay supplier');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {language === 'hi' ? 'सप्लायर एवं खरीद प्रबंधन' : 'Supplier & Material Purchases'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'hi'
              ? 'मशरूम स्पॉन, धान का पुआल, पीपी बैग, रैक एवं आपूर्तिकर्ताओं का भुगतान हिसाब'
              : 'Procurement ledger for grain spawn, paddy straw, PP bags, misting nozzles & equipment'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsNewPurchaseOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record Material Purchase</span>
          </button>

          <button
            onClick={() => setIsAddSupplierOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Building className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'purchases'
              ? 'border-emerald-800 text-emerald-950 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Purchase Orders & Deliveries ({purchases.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'suppliers'
              ? 'border-emerald-800 text-emerald-950 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Registered Suppliers & Khata ({suppliers.length})</span>
        </button>
      </div>

      {/* Tab 1: Purchase Orders */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">PO ID</th>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5">Supplier</th>
                  <th className="py-3 px-3.5">Category & Description</th>
                  <th className="py-3 px-3.5">Qty</th>
                  <th className="py-3 px-3.5 text-right">Total Amount</th>
                  <th className="py-3 px-3.5 text-right">Paid</th>
                  <th className="py-3 px-3.5 text-right">Balance Due</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {purchases.map(po => (
                  <tr key={po.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3.5 font-mono font-bold text-stone-900">{po.id}</td>
                    <td className="py-3 px-3.5 whitespace-nowrap">{formatDate(po.date)}</td>
                    <td className="py-3 px-3.5 font-semibold text-stone-900">{po.supplierName}</td>
                    <td className="py-3 px-3.5">
                      <div className="font-medium text-stone-800">{po.category}</div>
                      <div className="text-[10px] text-stone-500 truncate max-w-xs">{po.itemsDescription}</div>
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[11px] text-stone-700">{po.quantity}</td>
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-stone-900 tabular-nums">
                      {formatINR(po.totalAmountPaise)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono text-emerald-800 tabular-nums">
                      {formatINR(po.amountPaidPaise)}
                    </td>
                    <td className="py-3 px-3.5 text-right font-mono tabular-nums">
                      {po.balancePaise > 0 ? (
                        <span className="text-amber-700 font-bold">{formatINR(po.balancePaise)}</span>
                      ) : (
                        <span className="text-emerald-700">Cleared</span>
                      )}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          po.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : po.paymentStatus === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {po.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Registered Suppliers */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suppliers.map(supp => (
            <div
              key={supp.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{supp.name}</h3>
                    <span className="text-[11px] text-emerald-800 font-medium">{supp.suppliesType}</span>
                  </div>
                  <span className="font-mono text-xs text-stone-400 font-semibold">{supp.id}</span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{supp.phone}</span>
                  </div>
                  {supp.email && (
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{supp.email}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5 text-[11px] text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{supp.address}</span>
                  </div>
                </div>

                {supp.notes && (
                  <p className="text-[11px] text-stone-500 italic mt-2 line-clamp-2">
                    &quot;{supp.notes}&quot;
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total Purchased:</span>
                    <span className="font-mono font-semibold">{formatINR(supp.totalPurchasesPaise)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Payable Balance:</span>
                    <span className={`font-mono font-bold ${supp.balancePaise > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                      {formatINR(supp.balancePaise)}
                    </span>
                  </div>
                </div>

                {supp.balancePaise > 0 && (
                  <button
                    onClick={() => {
                      setPayModalSupplier(supp);
                      setPayAmountRupees(supp.balancePaise / 100);
                      setPayMethod('upi');
                      setPayTxRef('');
                      setPayNotes('');
                    }}
                    className="w-full py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Clear Balance Due</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pay Supplier Modal */}
      {payModalSupplier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Record Supplier Payment to {payModalSupplier.name}
            </h3>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs flex justify-between">
              <span className="text-stone-500">Current Outstanding Balance:</span>
              <span className="font-mono font-bold text-amber-800">
                {formatINR(payModalSupplier.balancePaise)}
              </span>
            </div>

            <form onSubmit={handleConfirmPaySupplier} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Amount to Pay (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={payModalSupplier.balancePaise / 100}
                  value={payAmountRupees}
                  onChange={e => setPayAmountRupees(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white uppercase font-medium"
                >
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Transaction Ref / UTR</label>
                <input
                  type="text"
                  value={payTxRef}
                  onChange={e => setPayTxRef(e.target.value)}
                  placeholder="e.g. UPI/739182941"
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  placeholder="e.g. Paid for paddy straw shipment"
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setPayModalSupplier(null)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700"
                >
                  Confirm Supplier Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Purchase Modal */}
      {isNewPurchaseOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">Record Material Purchase</h3>
              <button onClick={() => setIsNewPurchaseOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePurchase} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Select Supplier *</label>
                <select
                  value={selectedSupplierId}
                  onChange={e => setSelectedSupplierId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                >
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.suppliesType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={purchaseCategory}
                    onChange={e => setPurchaseCategory(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Spawn">Spawn (Seed Master)</option>
                    <option value="Straw & Substrate">Straw & Substrate</option>
                    <option value="Poly Bags & Packaging">Poly Bags & Packaging</option>
                    <option value="Equipment & Racks">Equipment & Racks</option>
                    <option value="Other Supplies">Other Farm Supplies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Quantity *</label>
                  <input
                    type="text"
                    required
                    value={purchaseQty}
                    onChange={e => setPurchaseQty(e.target.value)}
                    placeholder="e.g. 500 kg or 50 bottles"
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Items Description *</label>
                <input
                  type="text"
                  required
                  value={purchaseDesc}
                  onChange={e => setPurchaseDesc(e.target.value)}
                  placeholder="e.g. Dry paddy straw bundles from Bokaro"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Total Bill Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={purchaseTotalRupees}
                    onChange={e => setPurchaseTotalRupees(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Amount Paid Now (₹)</label>
                  <input
                    type="number"
                    min="0"
                    max={purchaseTotalRupees}
                    value={purchasePaidRupees}
                    onChange={e => setPurchasePaidRupees(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Supplier Invoice / Bill No.</label>
                <input
                  type="text"
                  value={purchaseInvoiceRef}
                  onChange={e => setPurchaseInvoiceRef(e.target.value)}
                  placeholder="e.g. BOK-AGR-492"
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewPurchaseOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700"
                >
                  Save Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">Add New Supplier</h3>
              <button onClick={() => setIsAddSupplierOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Supplier / Firm Name *</label>
                <input
                  type="text"
                  required
                  value={suppName}
                  onChange={e => setSuppName(e.target.value)}
                  placeholder="e.g. Ranchi Agro Biotech"
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={suppPhone}
                    onChange={e => setSuppPhone(e.target.value)}
                    placeholder="+91 9431..."
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Supplies Type</label>
                  <input
                    type="text"
                    value={suppType}
                    onChange={e => setSuppType(e.target.value)}
                    placeholder="e.g. Wheat grain spawn"
                    className="w-full border border-stone-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Location / Address *</label>
                <input
                  type="text"
                  required
                  value={suppAddress}
                  onChange={e => setSuppAddress(e.target.value)}
                  placeholder="e.g. Kanke Road, Ranchi"
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700"
                >
                  Register Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
