import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { formatINR, formatKg, formatDate, exportToCsv } from '../utils/formatters.ts';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
  ReceiptText,
  Boxes,
  Users,
  Truck
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { orders, products, batches, harvests, customers, suppliers, expenses, metrics } = useFarm();
  const { t, language } = useLanguage();

  const [reportType, setReportType] = useState<
    'sales' | 'inventory' | 'production' | 'expenses' | 'customers' | 'suppliers'
  >('sales');

  const [dateFilter, setDateFilter] = useState<'all' | 'thisMonth' | 'last30Days'>('all');

  // CSV Exporter for each report type
  const handleExportCsv = () => {
    if (reportType === 'sales') {
      const rows: (string | number)[][] = [
        ['Order ID', 'Date', 'Customer', 'Phone', 'Items', 'Total Amount (Rs)', 'Amount Paid (Rs)', 'Balance Due (Rs)', 'Status', 'Payment Method']
      ];
      orders.forEach(o => {
        rows.push([
          o.id,
          o.orderDate,
          o.customerName,
          o.customerPhone,
          o.items.map(i => `${i.productName} (${i.quantityKg}kg)`).join('; '),
          (o.totalPaise / 100).toFixed(2),
          (o.amountPaidPaise / 100).toFixed(2),
          (o.remainingDuePaise / 100).toFixed(2),
          o.status,
          o.paymentMethod.toUpperCase()
        ]);
      });
      exportToCsv(`Yamuna_Organic_Farms_Sales_${new Date().toISOString().split('T')[0]}`, rows);
    } else if (reportType === 'inventory') {
      const rows: (string | number)[][] = [
        ['Product ID', 'Product Name', 'Variety', 'Type', 'Unit', 'Current Stock (Kg)', 'Min Threshold (Kg)', 'Cost Price (Rs)', 'Selling Price (Rs)']
      ];
      products.forEach(p => {
        rows.push([
          p.id,
          p.name,
          p.variety,
          p.type,
          p.unit,
          p.currentStockKg,
          p.minStockThresholdKg,
          (p.costPricePaise / 100).toFixed(2),
          (p.sellingPricePaise / 100).toFixed(2)
        ]);
      });
      exportToCsv(`Yamuna_Organic_Farms_Inventory_${new Date().toISOString().split('T')[0]}`, rows);
    } else if (reportType === 'production') {
      const rows: (string | number)[][] = [
        ['Batch ID', 'Variety', 'Bags Count', 'Straw Type', 'Inoculation Date', 'Total Yield (Kg)', 'Cost/Kg (Rs)', 'Bio-Efficiency %', 'Status']
      ];
      batches.forEach(b => {
        rows.push([
          b.id,
          b.variety,
          b.bagCount,
          b.strawType,
          b.inoculationDate,
          b.totalHarvestedKg,
          (b.costPerKgPaise / 100).toFixed(2),
          b.biologicalEfficiencyPct,
          b.status
        ]);
      });
      exportToCsv(`Yamuna_Organic_Farms_Production_${new Date().toISOString().split('T')[0]}`, rows);
    } else if (reportType === 'expenses') {
      const rows: (string | number)[][] = [
        ['Expense ID', 'Date', 'Category', 'Payee', 'Payment Mode', 'Amount (Rs)', 'Is OPEX', 'Receipt Ref', 'Notes']
      ];
      expenses.forEach(e => {
        rows.push([
          e.id,
          e.date,
          e.category,
          e.payee,
          e.paymentMode.toUpperCase(),
          (e.amountPaise / 100).toFixed(2),
          e.isOpex ? 'YES' : 'NO',
          e.receiptAttachment || '',
          e.notes
        ]);
      });
      exportToCsv(`Yamuna_Organic_Farms_Expenses_${new Date().toISOString().split('T')[0]}`, rows);
    } else if (reportType === 'customers') {
      const rows: (string | number)[][] = [
        ['Customer ID', 'Name', 'Type', 'Phone', 'Address', 'Total Orders', 'Total Purchases (Rs)', 'Total Paid (Rs)', 'Balance Due (Rs)']
      ];
      customers.forEach(c => {
        rows.push([
          c.id,
          c.name,
          c.type,
          c.phone,
          c.address,
          c.totalOrders,
          (c.totalPurchasesPaise / 100).toFixed(2),
          (c.totalPaidPaise / 100).toFixed(2),
          (c.balancePaise / 100).toFixed(2)
        ]);
      });
      exportToCsv(`Yamuna_Organic_Farms_Customers_${new Date().toISOString().split('T')[0]}`, rows);
    } else if (reportType === 'suppliers') {
      const rows: (string | number)[][] = [
        ['Supplier ID', 'Name', 'Phone', 'Supplies Type', 'Total Purchased (Rs)', 'Total Paid (Rs)', 'Payable Balance (Rs)']
      ];
      suppliers.forEach(s => {
        rows.push([
          s.id,
          s.name,
          s.phone,
          s.suppliesType,
          (s.totalPurchasesPaise / 100).toFixed(2),
          (s.totalPaidPaise / 100).toFixed(2),
          (s.balancePaise / 100).toFixed(2)
        ]);
      });
      exportToCsv(`Yamuna_Organic_Farms_Suppliers_${new Date().toISOString().split('T')[0]}`, rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {language === 'hi' ? 'व्यावसायिक रिपोर्ट्स एवं डेटा डाउनलोड' : 'Business Reports & CSV Exports'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'hi'
              ? 'बिक्री, उत्पादन लागत, इन्वेंटरी एवं वित्तीय विवरणों का एक्सेल/CSV डाउनलोड'
              : 'Export audited accounting statements, FIFO inventory sheets & batch performance data'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {(
          [
            { id: 'sales', label: 'Sales & Orders', icon: TrendingUp },
            { id: 'inventory', label: 'Inventory Stock', icon: Boxes },
            { id: 'production', label: 'Batch Yields', icon: Layers },
            { id: 'expenses', label: 'Expenses & P&L', icon: ReceiptText },
            { id: 'customers', label: 'Customer Dues', icon: Users },
            { id: 'suppliers', label: 'Supplier Khata', icon: Truck }
          ] as const
        ).map(tab => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-emerald-900 text-white border-emerald-950 shadow-2xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 mb-2 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
              <span className="font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Preview Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Preview: {reportType.toUpperCase()} REPORT
          </h2>
          <span className="text-[11px] text-stone-400 font-mono">
            Yamuna Organic Farms · Dhanbad
          </span>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          {reportType === 'sales' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3 text-right">Order Value</th>
                  <th className="py-2.5 px-3 text-right">Paid</th>
                  <th className="py-2.5 px-3 text-right">Balance</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-bold text-stone-900">{o.id}</td>
                    <td className="py-2 px-3 text-stone-600">{o.orderDate}</td>
                    <td className="py-2 px-3 font-sans font-medium text-stone-800">{o.customerName}</td>
                    <td className="py-2 px-3 font-sans text-stone-600 text-[11px] max-w-xs truncate">
                      {o.items.map(i => `${i.productName} (${i.quantityKg}kg)`).join(', ')}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-stone-900">{formatINR(o.totalPaise)}</td>
                    <td className="py-2 px-3 text-right text-stone-700">{formatINR(o.amountPaidPaise)}</td>
                    <td className="py-2 px-3 text-right text-amber-700">{formatINR(o.remainingDuePaise)}</td>
                    <td className="py-2 px-3 text-center font-sans">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 font-semibold">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'inventory' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Variety</th>
                  <th className="py-2.5 px-3 text-right">Available Stock</th>
                  <th className="py-2.5 px-3 text-right">Min Threshold</th>
                  <th className="py-2.5 px-3 text-right">Cost Rate</th>
                  <th className="py-2.5 px-3 text-right">Selling Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-bold text-stone-900">{p.name}</td>
                    <td className="py-2 px-3 text-stone-600">{p.variety}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatKg(p.currentStockKg)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-500">{formatKg(p.minStockThresholdKg)}</td>
                    <td className="py-2 px-3 text-right font-mono text-stone-700">{formatINR(p.costPricePaise)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800">{formatINR(p.sellingPricePaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'production' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Batch ID</th>
                  <th className="py-2.5 px-3">Variety</th>
                  <th className="py-2.5 px-3 text-right">Bags</th>
                  <th className="py-2.5 px-3">Substrate</th>
                  <th className="py-2.5 px-3 text-right">Total Harvested</th>
                  <th className="py-2.5 px-3 text-right">Yield/Bag</th>
                  <th className="py-2.5 px-3 text-right">Cost/Kg</th>
                  <th className="py-2.5 px-3 text-right">Bio-Eff %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-mono">
                {batches.map(b => (
                  <tr key={b.id} className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-bold text-stone-900">{b.id}</td>
                    <td className="py-2 px-3 font-sans text-stone-800">{b.variety}</td>
                    <td className="py-2 px-3 text-right">{b.bagCount}</td>
                    <td className="py-2 px-3 font-sans text-stone-600">{b.strawType}</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-800">{formatKg(b.totalHarvestedKg)}</td>
                    <td className="py-2 px-3 text-right">{b.yieldPerBagKg} kg</td>
                    <td className="py-2 px-3 text-right font-bold">{formatINR(b.costPerKgPaise)}</td>
                    <td className="py-2 px-3 text-right text-emerald-700">{b.biologicalEfficiencyPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'expenses' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Payee</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3">OPEX</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-mono text-stone-600">{e.date}</td>
                    <td className="py-2 px-3 font-semibold text-stone-900">{e.category}</td>
                    <td className="py-2 px-3 text-stone-800">{e.payee}</td>
                    <td className="py-2 px-3 uppercase text-[11px] font-mono">{e.paymentMode}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatINR(e.amountPaise)}</td>
                    <td className="py-2 px-3 text-[11px] font-semibold">{e.isOpex ? 'YES' : 'NO'}</td>
                    <td className="py-2 px-3 text-stone-500 text-[11px] max-w-xs truncate">{e.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'customers' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3 text-right">Orders</th>
                  <th className="py-2.5 px-3 text-right">Total Purchases</th>
                  <th className="py-2.5 px-3 text-right">Amount Paid</th>
                  <th className="py-2.5 px-3 text-right">Outstanding Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-semibold text-stone-900">{c.name}</td>
                    <td className="py-2 px-3 text-stone-600">{c.type}</td>
                    <td className="py-2 px-3 font-mono text-stone-600">{c.phone}</td>
                    <td className="py-2 px-3 text-right font-mono">{c.totalOrders}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatINR(c.totalPurchasesPaise)}</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-800">{formatINR(c.totalPaidPaise)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-700">{formatINR(c.balancePaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'suppliers' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Supplier Name</th>
                  <th className="py-2.5 px-3">Supplies Type</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3 text-right">Purchases</th>
                  <th className="py-2.5 px-3 text-right">Paid</th>
                  <th className="py-2.5 px-3 text-right">Payable Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-stone-50">
                    <td className="py-2 px-3 font-semibold text-stone-900">{s.name}</td>
                    <td className="py-2 px-3 text-stone-600">{s.suppliesType}</td>
                    <td className="py-2 px-3 font-mono text-stone-600">{s.phone}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatINR(s.totalPurchasesPaise)}</td>
                    <td className="py-2 px-3 text-right font-mono text-emerald-800">{formatINR(s.totalPaidPaise)}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-amber-700">{formatINR(s.balancePaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
