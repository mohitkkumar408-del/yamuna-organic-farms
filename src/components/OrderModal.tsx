import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Product, OrderItem, PaymentMethod } from '../types/index.ts';
import { formatINR } from '../utils/formatters.ts';
import { Plus, Trash2, X, AlertCircle } from 'lucide-react';

interface OrderModalProps {
  onClose: () => void;
  onSuccess: (order: any) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ onClose, onSuccess }) => {
  const { products, customers, createOrder } = useFarm();
  const { t, language } = useLanguage();

  const [customerId, setCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<'Farm Pickup' | 'Dhanbad Local Delivery' | 'Wholesale Cargo / Mandi'>('Dhanbad Local Delivery');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [orderDate, setOrderDate] = useState<string>(todayStr);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState<string>(tomorrowStr);

  const [items, setItems] = useState<Array<{
    productId: string;
    productName: string;
    variety: any;
    quantityKg: number;
    pricePerKgRupees: number;
    discountRupees: number;
  }>>([
    {
      productId: products[0]?.id || '',
      productName: products[0]?.name || '',
      variety: products[0]?.variety || 'Grey Oyster (Pleurotus ostreatus)',
      quantityKg: 5,
      pricePerKgRupees: (products[0]?.sellingPricePaise || 18000) / 100,
      discountRupees: 0
    }
  ]);

  const [deliveryChargeRupees, setDeliveryChargeRupees] = useState<number>(0);
  const [overallDiscountRupees, setOverallDiscountRupees] = useState<number>(0);
  const [advancePaidRupees, setAdvancePaidRupees] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [staffNotes, setStaffNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Handle customer selection
  const handleSelectCustomer = (id: string) => {
    setCustomerId(id);
    const found = customers.find(c => c.id === id);
    if (found) {
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address);
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: prod.id,
      productName: prod.name,
      variety: prod.variety,
      pricePerKgRupees: prod.sellingPricePaise / 100
    };
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const newItems = [...items];
    newItems[index].quantityKg = Math.max(0.1, Number(qty));
    setItems(newItems);
  };

  const handlePriceChange = (index: number, price: number) => {
    const newItems = [...items];
    newItems[index].pricePerKgRupees = Math.max(0, Number(price));
    setItems(newItems);
  };

  const addItemRow = () => {
    const defaultProd = products[0];
    if (!defaultProd) return;
    setItems(prev => [
      ...prev,
      {
        productId: defaultProd.id,
        productName: defaultProd.name,
        variety: defaultProd.variety,
        quantityKg: 2,
        pricePerKgRupees: defaultProd.sellingPricePaise / 100,
        discountRupees: 0
      }
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const calculatedItems: OrderItem[] = items.map((it, idx) => {
    const lineTotalRupees = it.quantityKg * it.pricePerKgRupees - (it.discountRupees || 0);
    return {
      id: `ITEM-${idx + 1}`,
      productId: it.productId,
      productName: it.productName,
      variety: it.variety,
      quantityKg: it.quantityKg,
      pricePerKgPaise: Math.round(it.pricePerKgRupees * 100),
      discountPaise: Math.round((it.discountRupees || 0) * 100),
      totalPaise: Math.round(Math.max(0, lineTotalRupees) * 100)
    };
  });

  const subtotalPaise = calculatedItems.reduce((sum, item) => sum + item.totalPaise, 0);
  const deliveryChargePaise = Math.round(deliveryChargeRupees * 100);
  const overallDiscountPaise = Math.round(overallDiscountRupees * 100);
  const totalPaise = Math.max(0, subtotalPaise + deliveryChargePaise - overallDiscountPaise);

  const advancePaidPaise = Math.round(advancePaidRupees * 100);
  const amountPaidPaise = Math.min(totalPaise, advancePaidPaise);
  const remainingDuePaise = Math.max(0, totalPaise - amountPaidPaise);

  const paymentStatus =
    amountPaidPaise === 0 ? 'unpaid' : amountPaidPaise >= totalPaise ? 'paid' : 'partial';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Customer name is required');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg('Customer phone number is required');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('At least one product item is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await createOrder({
        customerId: customerId || `CUST-${Date.now().toString().slice(-4)}`,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim() || 'Dhanbad, Jharkhand',
        deliveryType,
        orderDate,
        expectedDeliveryDate,
        items: calculatedItems,
        subtotalPaise,
        deliveryChargePaise,
        discountPaise: overallDiscountPaise,
        totalPaise,
        advancePaidPaise,
        amountPaidPaise,
        remainingDuePaise,
        paymentStatus,
        paymentMethod,
        status: 'Confirmed',
        deliveryStatus: 'Scheduled for preparation',
        staffNotes
      });
      onSuccess(newOrder);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              {language === 'hi' ? 'नया मशरूम ऑर्डर बनाएं' : 'Create Customer Mushroom Order'}
            </h2>
            <p className="text-xs text-stone-500">
              Yamuna Organic Farms · Automatic invoice generation & FIFO stock allocation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Customer Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                1. Customer Information
              </span>
              {customers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-500">Choose existing:</span>
                  <select
                    value={customerId}
                    onChange={e => handleSelectCustomer(e.target.value)}
                    className="text-xs bg-stone-100 border border-stone-300 rounded-md px-2 py-1"
                  >
                    <option value="">-- New Customer / Walk-in --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Customer / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Coalfield Dine or Manoj Kumar"
                  className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Phone Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+91 94313 12345"
                  className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-700 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Delivery Mode
                </label>
                <select
                  value={deliveryType}
                  onChange={e => setDeliveryType(e.target.value as any)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-700 outline-none bg-white"
                >
                  <option value="Dhanbad Local Delivery">Dhanbad City Local Delivery</option>
                  <option value="Farm Pickup">Farm Gate Pickup (Govindpur)</option>
                  <option value="Wholesale Cargo / Mandi">Wholesale Cargo / Mandi Transport</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-700 mb-1">
                Delivery Address in Dhanbad / Region
              </label>
              <input
                type="text"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                placeholder="e.g. Near Ozone Galleria, Saraidhela, Dhanbad"
                className="w-full text-xs border border-stone-300 rounded-lg p-2 focus:ring-1 focus:ring-emerald-700 outline-none"
              />
            </div>
          </div>

          {/* Section 2: Dates */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
            <div>
              <label className="block text-[11px] font-medium text-stone-700 mb-1">
                Order Date
              </label>
              <input
                type="date"
                value={orderDate}
                onChange={e => setOrderDate(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2 font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-700 mb-1">
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={e => setExpectedDeliveryDate(e.target.value)}
                className="w-full text-xs border border-stone-300 rounded-lg p-2 font-mono outline-none"
              />
            </div>
          </div>

          {/* Section 3: Mushroom Items Table */}
          <div className="pt-2 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                2. Mushroom Products & Quantities
              </span>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center gap-1 text-xs font-medium text-emerald-800 hover:text-emerald-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const prod = products.find(p => p.id === item.productId);
                const currentStock = prod ? prod.currentStockKg : 0;
                const isOverStock = item.quantityKg > currentStock;

                return (
                  <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-12 sm:col-span-5">
                        <label className="block text-[10px] text-stone-500 mb-0.5">Product</label>
                        <select
                          value={item.productId}
                          onChange={e => handleProductChange(idx, e.target.value)}
                          className="w-full text-xs border border-stone-300 rounded-lg p-1.5 bg-white font-medium"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Stock: {p.currentStockKg}kg)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <label className="block text-[10px] text-stone-500 mb-0.5">Quantity (Kg)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          value={item.quantityKg}
                          onChange={e => handleQuantityChange(idx, Number(e.target.value))}
                          className="w-full text-xs border border-stone-300 rounded-lg p-1.5 font-mono"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <label className="block text-[10px] text-stone-500 mb-0.5">Rate (₹/Kg)</label>
                        <input
                          type="number"
                          step="1"
                          value={item.pricePerKgRupees}
                          onChange={e => handlePriceChange(idx, Number(e.target.value))}
                          className="w-full text-xs border border-stone-300 rounded-lg p-1.5 font-mono"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-2 text-right">
                        <label className="block text-[10px] text-stone-500 mb-0.5">Line Total</label>
                        <span className="font-mono text-xs font-bold text-stone-900">
                          ₹{(item.quantityKg * item.pricePerKgRupees).toFixed(0)}
                        </span>
                      </div>

                      <div className="col-span-1 text-right">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(idx)}
                            className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {isOverStock && (
                      <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Notice: Requested {item.quantityKg}kg exceeds current warehouse stock ({currentStock}kg). Make sure upcoming harvest is scheduled.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Adjustments, Delivery Fee & Payments */}
          <div className="pt-2 border-t border-stone-200 bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
              3. Pricing, Delivery & Payment
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Delivery Charge (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deliveryChargeRupees}
                  onChange={e => setDeliveryChargeRupees(Number(e.target.value))}
                  className="w-full text-xs border border-stone-300 rounded-lg p-1.5 font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Discount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={overallDiscountRupees}
                  onChange={e => setOverallDiscountRupees(Number(e.target.value))}
                  className="w-full text-xs border border-stone-300 rounded-lg p-1.5 font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Advance Paid (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={advancePaidRupees}
                  onChange={e => setAdvancePaidRupees(Number(e.target.value))}
                  className="w-full text-xs border border-stone-300 rounded-lg p-1.5 font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}
                  className="w-full text-xs border border-stone-300 rounded-lg p-1.5 bg-white uppercase font-medium"
                >
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="credit">Credit (Khata)</option>
                </select>
              </div>
            </div>

            {/* Calculations Summary Banner */}
            <div className="bg-white p-3 rounded-lg border border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-stone-500">Subtotal: </span>
                <span className="font-mono font-semibold">{formatINR(subtotalPaise)}</span>
              </div>
              <div>
                <span className="text-stone-500">Order Net Total: </span>
                <span className="font-mono font-bold text-sm text-emerald-900">{formatINR(totalPaise)}</span>
              </div>
              <div>
                <span className="text-stone-500">Advance Received: </span>
                <span className="font-mono font-semibold text-stone-800">{formatINR(advancePaidPaise)}</span>
              </div>
              <div>
                <span className="text-stone-500">Balance Due: </span>
                <span className={`font-mono font-bold ${remainingDuePaise > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                  {formatINR(remainingDuePaise)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-700 mb-1">
                Staff Notes & Instructions
              </label>
              <textarea
                rows={2}
                value={staffNotes}
                onChange={e => setStaffNotes(e.target.value)}
                placeholder="e.g. Pack in perforated crates. Deliver before 11:30 AM."
                className="w-full text-xs border border-stone-300 rounded-lg p-2 outline-none bg-white"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Order...' : 'Confirm & Save Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
