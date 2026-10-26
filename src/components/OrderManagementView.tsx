import React, { useState, useMemo } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Order, OrderStatus, PaymentMethod } from '../types/index.ts';
import { formatINR, formatKg, formatDate } from '../utils/formatters.ts';
import { OrderModal } from './OrderModal.tsx';
import { InvoicePrintModal } from './InvoicePrintModal.tsx';
import {
  Search,
  Filter,
  Plus,
  Printer,
  CreditCard,
  CheckCircle,
  Truck,
  Ban,
  RotateCcw,
  Clock,
  Eye,
  AlertCircle,
  X
} from 'lucide-react';

interface OrderManagementViewProps {
  initialSelectedOrderId?: string;
}

export const OrderManagementView: React.FC<OrderManagementViewProps> = ({ initialSelectedOrderId }) => {
  const { orders, updateOrderStatus, recordOrderPayment, customers, loading } = useFarm();
  const { t, language } = useLanguage();
  const { canCancelOrders, canEditFinance } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [customerFilter, setCustomerFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (initialSelectedOrderId) {
      return orders.find(o => o.id === initialSelectedOrderId) || null;
    }
    return null;
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  // Status Change / Return / Cancellation Modal State
  const [statusActionOrder, setStatusActionOrder] = useState<Order | null>(null);
  const [targetStatus, setTargetStatus] = useState<OrderStatus>('Delivered');
  const [actionReason, setActionReason] = useState<string>('');
  const [actionDeliveryStatus, setActionDeliveryStatus] = useState<string>('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Payment Recording Modal State
  const [paymentModalOrder, setPaymentModalOrder] = useState<Order | null>(null);
  const [payAmountRupees, setPayAmountRupees] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [payTxRef, setPayTxRef] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');
  const [isRecordingPay, setIsRecordingPay] = useState(false);

  // Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery);

      const matchStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchCustomer = customerFilter === 'ALL' || order.customerId === customerFilter;

      return matchSearch && matchStatus && matchCustomer;
    });
  }, [orders, searchQuery, statusFilter, customerFilter]);

  // Open Status update modal
  const openStatusModal = (order: Order, newStatus: OrderStatus) => {
    setStatusActionOrder(order);
    setTargetStatus(newStatus);
    setActionReason('');
    setActionDeliveryStatus(order.deliveryStatus || '');
  };

  const handleConfirmStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusActionOrder) return;

    if ((targetStatus === 'Cancelled' || targetStatus === 'Returned') && !actionReason.trim()) {
      alert('Please provide a reason for cancellation / return.');
      return;
    }

    try {
      setIsUpdatingStatus(true);
      const updated = await updateOrderStatus(
        statusActionOrder.id,
        targetStatus,
        actionReason.trim(),
        actionDeliveryStatus.trim()
      );
      if (selectedOrder && selectedOrder.id === updated.id) {
        setSelectedOrder(updated);
      }
      setStatusActionOrder(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Open Payment Modal
  const openPaymentModal = (order: Order) => {
    setPaymentModalOrder(order);
    setPayAmountRupees(order.remainingDuePaise / 100);
    setPayMethod('upi');
    setPayTxRef('');
    setPayNotes('');
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalOrder) return;

    const amountPaise = Math.round(payAmountRupees * 100);
    if (amountPaise <= 0 || amountPaise > paymentModalOrder.remainingDuePaise) {
      alert('Invalid payment amount');
      return;
    }

    try {
      setIsRecordingPay(true);
      const { order: updated } = await recordOrderPayment(
        paymentModalOrder.id,
        amountPaise,
        payMethod,
        payTxRef.trim(),
        payNotes.trim()
      );
      if (selectedOrder && selectedOrder.id === updated.id) {
        setSelectedOrder(updated);
      }
      setPaymentModalOrder(null);
    } catch (err: any) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setIsRecordingPay(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* View Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {language === 'hi' ? 'ऑर्डर एवं आपूर्ति प्रबंधन' : 'Customer Orders & Dispatch Ledger'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'hi'
              ? 'ऑर्डर स्थिति, FIFO बैच आवंटन, आंशिक भुगतान एवं बिल प्रिंटिंग'
              : 'End-to-end order processing, FIFO inventory deduction, partial payments & receipts'}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createNewOrder')}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name or Phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-stone-700 outline-none"
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            <option value="New">New</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready for Dispatch">Ready for Dispatch</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>

          {/* Customer Filter */}
          <select
            value={customerFilter}
            onChange={e => setCustomerFilter(e.target.value)}
            className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-stone-700 outline-none max-w-[160px] truncate"
          >
            <option value="ALL">All Customers</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List Table (2 cols on desktop) */}
        <div className={`bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs ${selectedOrder ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Order ID</th>
                  <th className="py-3 px-3.5">Customer</th>
                  <th className="py-3 px-3.5">Date / Delivery</th>
                  <th className="py-3 px-3.5">Items & Qty</th>
                  <th className="py-3 px-3.5 text-right">Total</th>
                  <th className="py-3 px-3.5 text-right">Due</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredOrders.map(order => {
                  const isSelected = selectedOrder?.id === order.id;
                  const totalKg = order.items.reduce((s, i) => s + i.quantityKg, 0);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-stone-50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-stone-900 whitespace-nowrap">
                        {order.id}
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-stone-900 truncate max-w-[150px]">
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono truncate">
                          {order.customerPhone}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="text-stone-800">{formatDate(order.orderDate)}</div>
                        <div className="text-[10px] text-stone-500">Exp: {formatDate(order.expectedDeliveryDate)}</div>
                      </td>

                      <td className="py-3 px-3.5">
                        <div className="font-medium text-stone-900">
                          {formatKg(totalKg)}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate max-w-[140px]">
                          {order.items.map(i => i.productName).join(', ')}
                        </div>
                      </td>

                      <td className="py-3 px-3.5 text-right font-mono font-bold text-stone-900 whitespace-nowrap tabular-nums">
                        {formatINR(order.totalPaise)}
                      </td>

                      <td className="py-3 px-3.5 text-right font-mono whitespace-nowrap tabular-nums">
                        {order.remainingDuePaise > 0 ? (
                          <span className="text-amber-700 font-semibold">{formatINR(order.remainingDuePaise)}</span>
                        ) : (
                          <span className="text-emerald-700 font-medium">₹0 (Paid)</span>
                        )}
                      </td>

                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Cancelled'
                              ? 'bg-stone-200 text-stone-700'
                              : order.status === 'Returned'
                              ? 'bg-rose-100 text-rose-800'
                              : order.status === 'Ready for Dispatch'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t(order.status)}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPrintOrder(order)}
                            title="Print Invoice / Thermal Slip"
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {order.remainingDuePaise > 0 && order.status !== 'Cancelled' && (
                            <button
                              onClick={() => openPaymentModal(order)}
                              title="Record Payment"
                              className="p-1.5 rounded-lg text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 transition-colors"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-stone-400">
                      No orders found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Detailed Drawer (1 col on desktop) */}
        {selectedOrder && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <div className="text-xs text-stone-500 font-mono">Order Details</div>
                <div className="text-base font-bold text-stone-900 font-mono">{selectedOrder.id}</div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status change actions */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-stone-700">Update Status:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedOrder.status !== 'Delivered' && (
                  <button
                    onClick={() => openStatusModal(selectedOrder, 'Delivered')}
                    className="px-2.5 py-1 rounded bg-emerald-800 text-white text-[11px] font-medium hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Mark Delivered</span>
                  </button>
                )}

                {selectedOrder.status !== 'Ready for Dispatch' && selectedOrder.status !== 'Delivered' && (
                  <button
                    onClick={() => openStatusModal(selectedOrder, 'Ready for Dispatch')}
                    className="px-2.5 py-1 rounded bg-purple-700 text-white text-[11px] font-medium hover:bg-purple-600 flex items-center gap-1"
                  >
                    <Truck className="w-3 h-3" />
                    <span>Ready for Dispatch</span>
                  </button>
                )}

                {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && canCancelOrders && (
                  <button
                    onClick={() => openStatusModal(selectedOrder, 'Cancelled')}
                    className="px-2.5 py-1 rounded bg-stone-200 text-stone-700 text-[11px] font-medium hover:bg-stone-300 flex items-center gap-1"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Cancel Order</span>
                  </button>
                )}

                {selectedOrder.status === 'Delivered' && canCancelOrders && (
                  <button
                    onClick={() => openStatusModal(selectedOrder, 'Returned')}
                    className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 text-[11px] font-medium hover:bg-rose-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Process Return</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inventory Status Note */}
            <div className={`p-2.5 rounded-lg text-[11px] border ${selectedOrder.stockDeducted ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
              <div className="font-semibold">
                Inventory FIFO Status: {selectedOrder.stockDeducted ? 'Stock Deducted' : 'Pending Delivery'}
              </div>
              <div className="text-[10px] mt-0.5">
                {selectedOrder.stockDeducted
                  ? 'Batch inventory deducted based on FIFO. Cannot double deduct.'
                  : 'Stock will be deducted from oldest available batches when status is set to Delivered.'}
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs space-y-1">
              <div className="font-bold text-stone-900">{selectedOrder.customerName}</div>
              <div className="text-stone-600 font-mono text-[11px]">{selectedOrder.customerPhone}</div>
              <div className="text-stone-600 text-[11px]">{selectedOrder.customerAddress}</div>
              <div className="text-stone-500 text-[10px] mt-1">Delivery: {selectedOrder.deliveryType}</div>
            </div>

            {/* Items */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-stone-700">Items Ordered:</div>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-stone-50 border border-stone-100">
                  <div>
                    <div className="font-semibold text-stone-900">{it.productName}</div>
                    <div className="text-[10px] text-stone-500">{it.quantityKg} kg @ ₹{it.pricePerKgPaise / 100}/kg</div>
                  </div>
                  <div className="font-mono font-bold text-stone-900">{formatINR(it.totalPaise)}</div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1 text-xs border-t border-stone-200 pt-3">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatINR(selectedOrder.subtotalPaise)}</span>
              </div>
              {selectedOrder.deliveryChargePaise > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Delivery:</span>
                  <span className="font-mono">{formatINR(selectedOrder.deliveryChargePaise)}</span>
                </div>
              )}
              {selectedOrder.discountPaise > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatINR(selectedOrder.discountPaise)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Total Order Value:</span>
                <span className="font-mono text-emerald-900">{formatINR(selectedOrder.totalPaise)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Amount Paid:</span>
                <span className="font-mono">{formatINR(selectedOrder.amountPaidPaise)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-stone-200">
                <span className={selectedOrder.remainingDuePaise > 0 ? 'text-amber-800' : 'text-emerald-700'}>
                  Balance Due:
                </span>
                <span className="font-mono">{formatINR(selectedOrder.remainingDuePaise)}</span>
              </div>
            </div>

            {/* Cancellation or Return reason if any */}
            {selectedOrder.cancellationReason && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-900">
                <div className="font-semibold">Cancelled on {selectedOrder.cancellationDate}:</div>
                <div className="text-[11px] mt-0.5">{selectedOrder.cancellationReason}</div>
              </div>
            )}

            {selectedOrder.returnReason && (
              <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-900">
                <div className="font-semibold">Returned on {selectedOrder.returnDate}:</div>
                <div className="text-[11px] mt-0.5">{selectedOrder.returnReason}</div>
              </div>
            )}

            {/* Actions: Print and Pay */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setPrintOrder(selectedOrder)}
                className="flex-1 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill / Slip</span>
              </button>

              {selectedOrder.remainingDuePaise > 0 && selectedOrder.status !== 'Cancelled' && (
                <button
                  onClick={() => openPaymentModal(selectedOrder)}
                  className="flex-1 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Receive Due</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {isCreateModalOpen && (
        <OrderModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={newOrder => {
            setIsCreateModalOpen(false);
            setSelectedOrder(newOrder);
          }}
        />
      )}

      {/* Invoice & Thermal Slip Print Modal */}
      {printOrder && (
        <InvoicePrintModal order={printOrder} onClose={() => setPrintOrder(null)} />
      )}

      {/* Status Update & Cancellation Modal */}
      {statusActionOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Update Status to &quot;{targetStatus}&quot; for {statusActionOrder.id}
            </h3>

            {targetStatus === 'Delivered' && (
              <p className="text-xs text-stone-600 leading-relaxed">
                Marking this order as <strong>Delivered</strong> will automatically deduct stock from the oldest harvest batches using <strong>FIFO</strong>.
              </p>
            )}

            {(targetStatus === 'Cancelled' || targetStatus === 'Returned') && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Reason for {targetStatus} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={actionReason}
                  onChange={e => setActionReason(e.target.value)}
                  placeholder={`Provide detailed audit reason for ${targetStatus.toLowerCase()}...`}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Delivery Notes / Status
              </label>
              <input
                type="text"
                value={actionDeliveryStatus}
                onChange={e => setActionDeliveryStatus(e.target.value)}
                placeholder="e.g. Delivered to Mr. Rakesh at kitchen"
                className="w-full text-xs border border-stone-300 rounded-lg p-2 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusActionOrder(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                disabled={isUpdatingStatus}
                className="px-4 py-2 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >
                {isUpdatingStatus ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Order Payment Modal */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Record Customer Payment for {paymentModalOrder.id}
            </h3>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Customer:</span>
                <span className="font-semibold">{paymentModalOrder.customerName}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-stone-500">Remaining Balance Due:</span>
                <span className="font-mono font-bold text-amber-800">
                  {formatINR(paymentModalOrder.remainingDuePaise)}
                </span>
              </div>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Amount to Receive (₹) *</label>
                <input
                  type="number"
                  step="1"
                  required
                  min="1"
                  max={paymentModalOrder.remainingDuePaise / 100}
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
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Transaction Ref / UTR / Cheque No.</label>
                <input
                  type="text"
                  value={payTxRef}
                  onChange={e => setPayTxRef(e.target.value)}
                  placeholder="e.g. UPI/3948192841"
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  placeholder="e.g. Final settlement against delivery"
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setPaymentModalOrder(null)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRecordingPay}
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isRecordingPay ? 'Recording...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
