import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { formatINR, formatDate } from '../utils/formatters.ts';
import {
  ReceiptText,
  Plus,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  IndianRupee,
  Calendar,
  Layers,
  ArrowRight,
  X
} from 'lucide-react';
import { ExpenseCategory, PaymentMethod } from '../types/index.ts';

export const ExpenseView: React.FC = () => {
  const { expenses, metrics, createExpense } = useFarm();
  const { t, language } = useLanguage();

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('Electricity');
  const [amountRupees, setAmountRupees] = useState<number>(1000);
  const [payee, setPayee] = useState('');
  const [paymentMode, setPaymentMode] = useState<PaymentMethod>('cash');
  const [receiptRef, setReceiptRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isAccountingModalOpen, setIsAccountingModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const isOwnerDrawing = category === 'Owner Withdrawal';
    const isCapital = category === 'Capital Contribution';
    const isOpex = !isOwnerDrawing && !isCapital;

    try {
      await createExpense({
        date: todayStr,
        category,
        amountPaise: Math.round(amountRupees * 100),
        payee: payee.trim(),
        paymentMode,
        isOpex,
        isCapital,
        receiptAttachment: receiptRef.trim() || undefined,
        notes: notes.trim(),
        recordedBy: 'Rajesh Kumar Verma'
      });
      setIsAddExpenseOpen(false);
      setAmountRupees(500);
      setPayee('');
      setNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to record expense');
    }
  };

  // Group expenses by category
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    if (exp.isOpex) {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amountPaise;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {language === 'hi' ? 'खर्च, लागत एवं शुद्ध लाभ (P&L)' : 'Operating Expenses & Profit Architecture'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'hi'
              ? 'सकल लाभ, शुद्ध परिचालन मुनाफा, नकदी प्रवाह (Cash Flow) और स्पष्ट लेखांकन'
              : 'Accrual & Cash accounting, COGS deduction, operational overhead & net profit ledger'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAccountingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-800" />
            <span>Accounting Principles</span>
          </button>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* Accounting Formula Card (Accrual vs Cash Based) */}
      {metrics && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-4">
            Profit & Loss Architecture (Yamuna Organic Farms)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            {/* Step 1: Revenue */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">1. Delivered Sales</span>
              <div className="text-base font-bold font-mono text-stone-900 mt-1">
                {formatINR(metrics.salesAllTimePaise)}
              </div>
              <span className="text-[10px] text-stone-500 mt-0.5 block">Delivered orders only</span>
            </div>

            <div className="hidden md:flex justify-center text-stone-400 font-bold text-base">-</div>

            {/* Step 2: COGS */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">2. Cost of Goods (COGS)</span>
              <div className="text-base font-bold font-mono text-stone-800 mt-1">
                {formatINR(metrics.costOfGoodsSoldPaise)}
              </div>
              <span className="text-[10px] text-stone-500 mt-0.5 block">Spawn, straw, bags used</span>
            </div>

            <div className="hidden md:flex justify-center text-stone-400 font-bold text-base">=</div>

            {/* Step 3: Gross Profit */}
            <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase font-semibold block">3. Gross Profit</span>
              <div className="text-base font-bold font-mono text-emerald-950 mt-1">
                {formatINR(metrics.grossProfitPaise)}
              </div>
              <span className="text-[10px] text-emerald-700 mt-0.5 block">Margin before OPEX</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center mt-3 pt-3 border-t border-stone-100">
            {/* Step 3 Again */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Gross Profit</span>
              <div className="text-base font-bold font-mono text-stone-900 mt-1">
                {formatINR(metrics.grossProfitPaise)}
              </div>
            </div>

            <div className="hidden md:flex justify-center text-stone-400 font-bold text-base">-</div>

            {/* Operating Expenses */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Operating Overhead (OPEX)</span>
              <div className="text-base font-bold font-mono text-stone-800 mt-1">
                {formatINR(metrics.operatingExpensesPaise)}
              </div>
              <span className="text-[10px] text-stone-500 mt-0.5 block">Power, labour, fuel, rent</span>
            </div>

            <div className="hidden md:flex justify-center text-stone-400 font-bold text-base">=</div>

            {/* Net Operating Profit */}
            <div className="bg-emerald-900 text-white p-3.5 rounded-xl border border-emerald-950">
              <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Net Operating Profit</span>
              <div className="text-lg font-bold font-mono text-white mt-1">
                {formatINR(metrics.netProfitPaise)}
              </div>
              <span className="text-[10px] text-emerald-300 mt-0.5 block">Real business return</span>
            </div>
          </div>
        </div>
      )}

      {/* Categories Breakdown & Expenses List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Expenses by Category
          </h3>

          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([cat, amountPaise]) => {
              const pct = metrics?.operatingExpensesPaise ? Math.round((amountPaise / metrics.operatingExpensesPaise) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-700 font-medium">{cat}</span>
                    <span className="font-mono font-bold text-stone-900">{formatINR(amountPaise)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className="bg-emerald-800 h-full rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses Ledger Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Expenses Ledger ({expenses.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Payee / Vendor</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">Receipt Ref & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono text-stone-600 whitespace-nowrap">{formatDate(e.date)}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{e.category}</td>
                    <td className="py-2.5 px-3 text-stone-800">{e.payee}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-medium bg-stone-100 text-stone-700">
                        {e.paymentMode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900 tabular-nums">
                      {formatINR(e.amountPaise)}
                    </td>
                    <td className="py-2.5 px-3 text-stone-500 text-[11px] max-w-xs truncate">
                      {e.receiptAttachment && <span className="font-mono text-stone-700 font-semibold mr-1">[{e.receiptAttachment}]</span>}
                      {e.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Expense Modal */}
      {isAddExpenseOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">Record Farm Business Expense</h3>
              <button onClick={() => setIsAddExpenseOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Expense Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white font-medium"
                >
                  <option value="Electricity">Electricity (Chamber fans & humidifiers)</option>
                  <option value="Labour">Farm Labour & Harvesting Wages</option>
                  <option value="Water & Misting">Water Softening & Misting RO</option>
                  <option value="Transport & Delivery">Transport Fuel & Auto Delivery</option>
                  <option value="Spawn">Mushroom Spawn (Direct Purchase)</option>
                  <option value="Straw & Substrate">Straw & Substrate Chemicals (Lime/Gypsum)</option>
                  <option value="Poly Bags & Packaging">Poly Bags & Kraft Pouches</option>
                  <option value="Equipment & Racks">Equipment, Racks & Misting Foggers</option>
                  <option value="Repairs & Maintenance">Repairs & Maintenance</option>
                  <option value="Rent">Farm Shed / Chamber Rent</option>
                  <option value="Marketing">Marketing, Signs & Leaflets</option>
                  <option value="Spoilage & Wastage">Contaminated Spoilage Write-Off</option>
                  <option value="Owner Withdrawal">Owner Withdrawal (Drawings - non-opex)</option>
                  <option value="Capital Contribution">Capital Contribution (Equity)</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amountRupees}
                  onChange={e => setAmountRupees(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Payee / Vendor *</label>
                <input
                  type="text"
                  required
                  value={payee}
                  onChange={e => setPayee(e.target.value)}
                  placeholder="e.g. JBVNL or Daily Harvester Wages"
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white uppercase font-medium"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Receipt / Voucher No.</label>
                  <input
                    type="text"
                    value={receiptRef}
                    onChange={e => setReceiptRef(e.target.value)}
                    placeholder="e.g. VCH-1092"
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. 5 bags of agricultural gypsum & lime for straw pasteurization"
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accounting Principles Modal */}
      {isAccountingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">
                Accounting Principles & Business Rules
              </h3>
              <button onClick={() => setIsAccountingModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <strong className="text-stone-900 block mb-1">1. Revenue vs. Cash Collected:</strong>
                Revenue is only recognized when goods are <strong>Delivered</strong> to the customer. Unpaid balances remain as <em>Customer Receivables</em> and are not treated as cash received until paid.
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <strong className="text-stone-900 block mb-1">2. Cost of Goods Sold (COGS):</strong>
                Direct production costs (spawn, straw substrate, polypropylene cultivation bags, and pasteurization fuel) are tied to batch kg yields, giving true gross margin.
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <strong className="text-stone-900 block mb-1">3. Capital vs. Operating Expenses:</strong>
                Owner capital contributions are excluded from revenue. Owner personal drawings are recorded separately from farm operating expenses so net profit remains completely unskewed.
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-200">
              <button
                onClick={() => setIsAccountingModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-stone-900 text-white font-medium text-xs hover:bg-stone-800"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
