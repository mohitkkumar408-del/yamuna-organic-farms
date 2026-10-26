import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { formatINR, formatKg, formatDate } from '../utils/formatters.ts';
import {
  TrendingUp,
  CreditCard,
  Building,
  Store,
  DollarSign,
  PieChart,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const SalesRevenueView: React.FC = () => {
  const { orders, customers, products, payments, metrics } = useFarm();
  const { t, language } = useLanguage();

  const [dateRange, setDateRange] = useState<'all' | 'month' | 'week'>('month');

  // Breakdown by payment methods
  const paymentMethodStats: Record<string, { count: number; totalPaise: number }> = {
    upi: { count: 0, totalPaise: 0 },
    cash: { count: 0, totalPaise: 0 },
    bank_transfer: { count: 0, totalPaise: 0 }
  };

  for (const pay of payments) {
    const m = pay.method || 'cash';
    if (!paymentMethodStats[m]) paymentMethodStats[m] = { count: 0, totalPaise: 0 };
    paymentMethodStats[m].count += 1;
    paymentMethodStats[m].totalPaise += pay.amountPaise;
  }

  // Breakdown by Wholesale vs Retail
  let wholesaleSalesPaise = 0;
  let retailSalesPaise = 0;

  for (const ord of orders) {
    if (ord.status === 'Delivered') {
      const cust = customers.find(c => c.id === ord.customerId);
      if (cust && (cust.type === 'Wholesale' || cust.type === 'Hotel' || cust.type === 'Restaurant' || cust.type === 'Distributor')) {
        wholesaleSalesPaise += ord.totalPaise;
      } else {
        retailSalesPaise += ord.totalPaise;
      }
    }
  }

  // Breakdown by Product Variety
  const productRevenueMap: Record<string, { name: string; variety: string; kg: number; totalPaise: number }> = {};
  for (const ord of orders) {
    if (ord.status === 'Delivered') {
      for (const it of ord.items) {
        if (!productRevenueMap[it.productId]) {
          productRevenueMap[it.productId] = {
            name: it.productName,
            variety: it.variety,
            kg: 0,
            totalPaise: 0
          };
        }
        productRevenueMap[it.productId].kg += it.quantityKg;
        productRevenueMap[it.productId].totalPaise += it.totalPaise;
      }
    }
  }

  const productRevenues = Object.values(productRevenueMap).sort((a, b) => b.totalPaise - a.totalPaise);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900">
          {language === 'hi' ? 'बिक्री एवं राजस्व विश्लेषण' : 'Sales & Revenue Analytics'}
        </h1>
        <p className="text-xs text-stone-500">
          {language === 'hi'
            ? 'थोक बनाम खुदरा, यूपीआई बनाम नकदी, किस्म-वार बिक्री एवं ग्राहक योगदान'
            : 'Wholesale vs Retail breakdown, UPI collections, product margins & revenue streams'}
        </p>
      </div>

      {/* Top Level Sales KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="text-xs text-stone-500">Delivered Sales (Accrual)</div>
          <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
            {formatINR(metrics?.salesAllTimePaise || 0)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Completed fulfillments</div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="text-xs text-stone-500">Actual Cash / UPI Received</div>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {formatINR(metrics?.totalReceivedPaise || 0)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Total collections in bank</div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="text-xs text-stone-500">Uncollected Customer Credit</div>
          <div className="text-xl font-bold font-mono text-amber-700 mt-1">
            {formatINR(metrics?.totalReceivablesPaise || 0)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Pending payments from buyers</div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="text-xs text-stone-500">Total Kilograms Sold</div>
          <div className="text-xl font-bold font-mono text-stone-900 mt-1">
            {formatKg(metrics?.totalKgSold || 0)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Fresh & processed oyster</div>
        </div>
      </div>

      {/* Segment 1: Wholesale vs Retail & Payment Mode Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wholesale vs Retail */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Wholesale / B2B vs. Retail Home Delivery
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-stone-800 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-indigo-700" />
                  Wholesale, Hotels & Restaurants:
                </span>
                <span className="font-mono font-bold text-stone-900">{formatINR(wholesaleSalesPaise)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${
                      metrics?.salesAllTimePaise
                        ? (wholesaleSalesPaise / metrics.salesAllTimePaise) * 100
                        : 50
                    }%`
                  }}
                  className="bg-indigo-700 h-full rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-stone-800 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-700" />
                  Retail & Home Deliveries (Dhanbad):
                </span>
                <span className="font-mono font-bold text-stone-900">{formatINR(retailSalesPaise)}</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${
                      metrics?.salesAllTimePaise
                        ? (retailSalesPaise / metrics.salesAllTimePaise) * 100
                        : 50
                    }%`
                  }}
                  className="bg-emerald-700 h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Channels */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Payment Mode Collections
          </h2>

          <div className="space-y-2.5">
            {Object.entries(paymentMethodStats).map(([method, data]) => (
              <div key={method} className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100 text-xs">
                <div>
                  <div className="font-bold text-stone-900 uppercase font-mono">{method.replace('_', ' ')}</div>
                  <div className="text-[10px] text-stone-500">{data.count} successful transactions</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-900">{formatINR(data.totalPaise)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segment 2: Sales by Product Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Product-Wise Sales & Volume
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Variety</th>
                <th className="py-2.5 px-3 text-right">Kilograms Sold</th>
                <th className="py-2.5 px-3 text-right">Delivered Revenue</th>
                <th className="py-2.5 px-3 text-right">Avg Realized Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {productRevenues.map((p, idx) => {
                const avgRateRupees = p.kg > 0 ? (p.totalPaise / 100) / p.kg : 0;
                return (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{p.name}</td>
                    <td className="py-2.5 px-3 text-stone-600">{p.variety}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900 tabular-nums">
                      {formatKg(p.kg)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 tabular-nums">
                      {formatINR(p.totalPaise)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-stone-600 tabular-nums">
                      ₹{avgRateRupees.toFixed(1)} / kg
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
