import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { formatINR, formatKg, formatDate } from '../utils/formatters.ts';
import {
  TrendingUp,
  Boxes,
  Sprout,
  IndianRupee,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Calendar,
  ArrowUpRight,
  Truck,
  RotateCcw,
  Ban
} from 'lucide-react';
import { OrderStatus } from '../types/index.ts';

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
  onSelectOrder?: (orderId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onSelectOrder }) => {
  const { metrics, orders, products, batches, lots, loading } = useFarm();
  const { t, language } = useLanguage();
  const [chartRange, setChartRange] = useState<'7days' | '30days' | 'thisMonth'>('7days');

  if (loading || !metrics) {
    return (
      <div className="p-8 text-center text-stone-500 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading real-time farm dashboard...</p>
      </div>
    );
  }

  // Calculate Best Selling Mushroom Products
  const productSalesMap: Record<string, { name: string; variety: string; kg: number; revenuePaise: number }> = {};
  for (const order of orders) {
    if (order.status === 'Delivered') {
      for (const item of order.items) {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.productName,
            variety: item.variety,
            kg: 0,
            revenuePaise: 0
          };
        }
        productSalesMap[item.productId].kg += item.quantityKg;
        productSalesMap[item.productId].revenuePaise += item.totalPaise;
      }
    }
  }

  const bestSellers = Object.values(productSalesMap).sort((a, b) => b.kg - a.kg);

  // Compute Daily Sales for the Chart
  const daysCount = chartRange === '7days' ? 7 : 30;
  const chartDays: Array<{ dateStr: string; label: string; salesPaise: number; profitPaise: number }> = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    let salesPaise = 0;
    let kgSold = 0;

    for (const order of orders) {
      if (order.status === 'Delivered' && (order.actualDeliveryDate === dateStr || order.orderDate === dateStr)) {
        salesPaise += order.totalPaise;
        for (const it of order.items) kgSold += it.quantityKg;
      }
    }

    const cogsPaise = kgSold * 2000; // estimated batch cost
    const profitPaise = Math.max(0, salesPaise - cogsPaise);

    chartDays.push({ dateStr, label, salesPaise, profitPaise });
  }

  const maxChartValue = Math.max(...chartDays.map(d => d.salesPaise), 100000); // at least ₹1000 max

  // Overdue and Upcoming Orders
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueOrders = orders.filter(
    o => o.expectedDeliveryDate < todayStr && o.status !== 'Delivered' && o.status !== 'Cancelled' && o.status !== 'Returned'
  );

  const upcomingOrders = orders.filter(
    o => o.expectedDeliveryDate >= todayStr && ['Confirmed', 'Preparing', 'Ready for Dispatch'].includes(o.status)
  );

  return (
    <div className="space-y-6">
      {/* Farm Banner & Location Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border border-emerald-900/40 p-6 text-white shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Dhanbad, Jharkhand</span>
            <span aria-hidden="true">·</span>
            <span>Oyster Mushroom Enterprise</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            {language === 'hi' ? 'यमुना ऑर्गेनिक फार्म्स प्रबंधन' : 'Yamuna Organic Farms Command Center'}
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed max-w-2xl">
            {language === 'hi'
              ? 'दैनिक तुड़ाई, बैच दक्षता, इन्वेंटरी FIFO ट्रैकिंग, थोक एवं खुदरा डिलीवरी तथा वास्तविक वित्तीय आंकड़ों का सजीव अवलोकन।'
              : 'Real-time overview of daily harvests, colonization batch yields, FIFO inventory, wholesale orders, and net profit ledger.'}
          </p>
        </div>

        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-80 opacity-25 pointer-events-none">
          <img
            src="/src/assets/images/yamuna_oyster_farm_hero_1793024808213.jpg"
            alt="Mushroom Bags"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Today */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>{t('salesToday')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {formatINR(metrics.salesTodayPaise)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>{t('salesThisWeek')}:</span>
            <span className="font-mono tabular-nums font-medium text-stone-700">
              {formatINR(metrics.salesThisWeekPaise)}
            </span>
          </div>
        </div>

        {/* Sales This Month */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>{t('salesThisMonth')}</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {formatINR(metrics.salesThisMonthPaise)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>{t('salesAllTime')}:</span>
            <span className="font-mono tabular-nums font-medium text-stone-700">
              {formatINR(metrics.salesAllTimePaise)}
            </span>
          </div>
        </div>

        {/* Mushroom Sold (Kg) */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>{t('totalKgSold')}</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 font-mono tabular-nums">
            {formatKg(metrics.totalKgSold)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>{t('availableStock')}:</span>
            <span className="font-mono tabular-nums font-medium text-emerald-700">
              {formatKg(metrics.availableStockKg)}
            </span>
          </div>
        </div>

        {/* Net Operating Profit */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>{t('netProfit')}</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${metrics.netProfitPaise >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            {formatINR(metrics.netProfitPaise)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
            <span>{t('grossProfit')}:</span>
            <span className="font-mono tabular-nums font-medium text-stone-700">
              {formatINR(metrics.grossProfitPaise)}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Financial & Operational Status Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Customer Receivables */}
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-3.5">
          <div className="text-xs text-stone-500">{t('customerDues')}</div>
          <div className="text-lg font-bold text-amber-700 font-mono tabular-nums mt-0.5">
            {formatINR(metrics.totalReceivablesPaise)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Pending payments from buyers</div>
        </div>

        {/* Supplier Payables */}
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-3.5">
          <div className="text-xs text-stone-500">{t('supplierDues')}</div>
          <div className="text-lg font-bold text-stone-800 font-mono tabular-nums mt-0.5">
            {formatINR(metrics.totalSupplierPayablesPaise)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Due for straw, spawn, bags</div>
        </div>

        {/* Actual Cash Received */}
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-3.5">
          <div className="text-xs text-stone-500">{t('cashCollected')}</div>
          <div className="text-lg font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
            {formatINR(metrics.totalReceivedPaise)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Deposited via UPI & Cash</div>
        </div>

        {/* Monthly Production */}
        <div className="bg-stone-50 rounded-xl border border-stone-200 p-3.5">
          <div className="text-xs text-stone-500">{t('productionThisMonth')}</div>
          <div className="text-lg font-bold text-emerald-800 font-mono tabular-nums mt-0.5">
            {formatKg(metrics.productionThisMonthKg)}
          </div>
          <div className="text-[10px] text-stone-400 mt-1">Fresh oyster harvested</div>
        </div>
      </div>

      {/* Actionable Alerts Bar: Overdue, Low Stock, Expiring */}
      {(overdueOrders.length > 0 || metrics.lowStockItemsCount > 0 || metrics.expiringLotsCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {overdueOrders.length > 0 && (
            <div
              onClick={() => onNavigate('orders')}
              className="cursor-pointer bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3 hover:bg-red-100/70 transition-colors"
            >
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-red-900">
                  {overdueOrders.length} {t('overdueOrders')}
                </div>
                <div className="text-[11px] text-red-700 mt-0.5">
                  Expected delivery past due date. Click to review and dispatch.
                </div>
              </div>
            </div>
          )}

          {metrics.lowStockItemsCount > 0 && (
            <div
              onClick={() => onNavigate('inventory')}
              className="cursor-pointer bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3 hover:bg-amber-100/70 transition-colors"
            >
              <Boxes className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-amber-900">
                  {metrics.lowStockItemsCount} Products Below Minimum Stock
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  Threshold alerts active. Check upcoming batch flush timings.
                </div>
              </div>
            </div>
          )}

          {metrics.expiringLotsCount > 0 && (
            <div
              onClick={() => onNavigate('inventory')}
              className="cursor-pointer bg-stone-100 border border-stone-300 rounded-xl p-3 flex items-start gap-3 hover:bg-stone-200/60 transition-colors"
            >
              <Clock className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-stone-900">
                  {metrics.expiringLotsCount} Fresh Batches Expiring in 48h
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5">
                  Perishable oyster shelf-life. Prioritize dispatch or dehydration.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Sales Chart + Order Status Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Profit Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Sales & Estimated Profit Trend</h2>
              <p className="text-xs text-stone-500">Delivered revenue calculated strictly from confirmed orders</p>
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => setChartRange('7days')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartRange === '7days' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartRange('30days')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  chartRange === '30days' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Pure SVG & CSS Bar Chart (Zero layout jitter, reliable tabular visual) */}
          <div className="h-56 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-stone-200">
            {chartDays.map((day, idx) => {
              const salesHeightPct = Math.max(6, Math.min(100, (day.salesPaise / maxChartValue) * 100));
              const profitHeightPct = Math.max(3, Math.min(100, (day.profitPaise / maxChartValue) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] rounded px-2 py-1 pointer-events-none whitespace-nowrap z-20 shadow-md">
                    <div>{day.dateStr}</div>
                    <div className="text-emerald-300 font-mono">Sales: {formatINR(day.salesPaise)}</div>
                    <div className="text-amber-300 font-mono">Profit: {formatINR(day.profitPaise)}</div>
                  </div>

                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Sales bar */}
                    <div
                      style={{ height: `${salesHeightPct}%` }}
                      className="w-full max-w-[14px] bg-emerald-800 rounded-t hover:bg-emerald-700 transition-all"
                    />
                    {/* Profit bar */}
                    <div
                      style={{ height: `${profitHeightPct}%` }}
                      className="w-full max-w-[10px] bg-amber-500 rounded-t hover:bg-amber-400 transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 truncate w-full text-center">
                    {idx % (chartRange === '30days' ? 5 : 1) === 0 ? day.label : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 mt-4 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-800" />
                <span>Sales Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-500" />
                <span>Gross Margin</span>
              </div>
            </div>
            <span className="font-mono text-stone-400 text-[11px]">
              Peak: {formatINR(maxChartValue)}
            </span>
          </div>
        </div>

        {/* Order Status Pipeline Breakdown */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-900">Order Fulfillment Pipeline</h2>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-0.5"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {(
                [
                  { status: 'New', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
                  { status: 'Confirmed', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
                  { status: 'Preparing', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
                  { status: 'Ready for Dispatch', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
                  { status: 'Dispatched', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
                  { status: 'Delivered', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
                  { status: 'Cancelled', color: 'text-stone-600', bg: 'bg-stone-50 border-stone-200' },
                  { status: 'Returned', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' }
                ] as Array<{ status: OrderStatus; color: string; bg: string }>
              ).map(item => {
                const count = metrics.ordersByStatus[item.status] || 0;
                return (
                  <div
                    key={item.status}
                    onClick={() => onNavigate('orders')}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-stone-50 cursor-pointer text-xs transition-colors"
                  >
                    <span className="text-stone-700 font-medium">{t(item.status)}</span>
                    <span className={`px-2 py-0.5 rounded font-mono font-semibold text-xs border ${item.bg} ${item.color}`}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 mt-4 text-xs text-stone-500 flex items-center justify-between">
            <span>Total Orders Logged:</span>
            <span className="font-mono font-bold text-stone-900">{metrics.totalOrdersCount}</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Best Selling Varieties & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Varieties */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-900">Best-Selling Mushroom Varieties</h2>
            <button
              onClick={() => onNavigate('sales')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-0.5"
            >
              Sales report <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {bestSellers.slice(0, 4).map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100">
                <div>
                  <div className="text-xs font-semibold text-stone-900">{p.name}</div>
                  <div className="text-[11px] text-stone-500">{p.variety}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-800 font-mono tabular-nums">
                    {formatKg(p.kg)}
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono tabular-nums">
                    {formatINR(p.revenuePaise)}
                  </div>
                </div>
              </div>
            ))}

            {bestSellers.length === 0 && (
              <div className="text-center py-8 text-stone-400 text-xs">
                No delivered sales recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Latest Orders Stream */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-stone-900">Latest Customer Orders</h2>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-0.5"
            >
              Manage all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 5).map(o => (
              <div
                key={o.id}
                onClick={() => {
                  if (onSelectOrder) onSelectOrder(o.id);
                  onNavigate('orders');
                }}
                className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:border-emerald-600 cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-stone-900">{o.id}</span>
                    <span className="text-[11px] text-stone-500 truncate max-w-[140px] sm:max-w-[200px]">
                      {o.customerName}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {formatDate(o.orderDate)} · {o.items.length} items ({o.items.reduce((s, i) => s + i.quantityKg, 0)} kg)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-stone-900 font-mono tabular-nums">
                    {formatINR(o.totalPaise)}
                  </div>
                  <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded font-medium ${
                    o.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : o.status === 'Cancelled'
                      ? 'bg-stone-200 text-stone-700'
                      : o.status === 'Returned'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t(o.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
