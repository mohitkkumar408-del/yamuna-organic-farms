import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Customer, CustomerType } from '../types/index.ts';
import { formatINR, formatDate } from '../utils/formatters.ts';
import {
  Users,
  Plus,
  Phone,
  MapPin,
  FileText,
  Search,
  MessageCircle,
  CreditCard,
  Building,
  UtensilsCrossed,
  Store,
  Home,
  X
} from 'lucide-react';

export const CustomerView: React.FC = () => {
  const { customers, orders, payments, createCustomer, updateCustomer } = useFarm();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<CustomerType>('Retail');
  const [gstin, setGstin] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredCustomers = customers.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'ALL' || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await createCustomer({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        type,
        gstin: gstin.trim() || undefined,
        notes: notes.trim()
      });
      setIsAddModalOpen(false);
      setName('');
      setPhone('');
      setAddress('');
      setNotes('');
    } catch (err: any) {
      alert(err.message || 'Failed to create customer');
    } finally {
      setIsSaving(false);
    }
  };

  const getCustomerIcon = (custType: CustomerType) => {
    switch (custType) {
      case 'Hotel':
        return <Building className="w-4 h-4 text-indigo-600" />;
      case 'Restaurant':
        return <UtensilsCrossed className="w-4 h-4 text-amber-600" />;
      case 'Wholesale':
      case 'Distributor':
        return <Store className="w-4 h-4 text-emerald-600" />;
      default:
        return <Home className="w-4 h-4 text-stone-600" />;
    }
  };

  // Prepares pre-formatted WhatsApp payment reminder or greeting URL
  const getWhatsAppLink = (cust: Customer) => {
    const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const text = cust.balancePaise > 0
      ? `Namaste ${cust.name}, greetings from Yamuna Organic Farms, Dhanbad. This is a gentle reminder regarding your outstanding mushroom order balance of ${formatINR(cust.balancePaise)}. You can clear this via UPI to yamunafarms@okhdfcbank. Thank you!`
      : `Namaste ${cust.name}, greetings from Yamuna Organic Farms, Dhanbad. Fresh oyster mushroom harvest is available today! Let us know your requirements.`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
  };

  const customerOrders = selectedCustomer
    ? orders.filter(o => o.customerId === selectedCustomer.id)
    : [];

  const customerPayments = selectedCustomer
    ? payments.filter(p => p.customerId === selectedCustomer.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {language === 'hi' ? 'ग्राहक संबंध एवं खाता प्रबंधन (CRM)' : 'Customer CRM & Accounts Ledger'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'hi'
              ? 'होटल, रेस्टोरेंट, मंडी थोक व्यापारी एवं खुदरा ग्राहकों का खाता, बकाया एवं लेन-देन'
              : 'Client directory, outstanding khata balance, order history & account statements'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search customer name, phone or address..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-stone-700 outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Hotel">Hotels</option>
            <option value="Restaurant">Restaurants</option>
            <option value="Wholesale">Wholesale Mandi</option>
            <option value="Distributor">Distributors</option>
            <option value="Retail">Retail Households</option>
          </select>
        </div>
      </div>

      {/* Grid: Customers Cards + Statement Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Directory Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${selectedCustomer ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {filteredCustomers.map(cust => {
            const isSelected = selectedCustomer?.id === cust.id;
            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className={`bg-white rounded-xl border p-4.5 shadow-2xs hover:border-emerald-700 cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected ? 'border-emerald-700 bg-emerald-50/20 ring-1 ring-emerald-700' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                        {getCustomerIcon(cust.type)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 leading-tight">{cust.name}</h3>
                        <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-wide">
                          {cust.type}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-stone-400 font-semibold">{cust.id}</span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{cust.phone}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] text-stone-500 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>{cust.address}</span>
                    </div>
                  </div>

                  {cust.notes && (
                    <p className="text-[11px] text-stone-500 italic mt-2 line-clamp-2">
                      &quot;{cust.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total Purchases:</span>
                    <span className="font-mono font-semibold text-stone-800">
                      {formatINR(cust.totalPurchasesPaise)} ({cust.totalOrders} orders)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Balance Due:</span>
                    <span className={`font-mono font-bold ${cust.balancePaise > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {formatINR(cust.balancePaise)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredCustomers.length === 0 && (
            <div className="col-span-full py-12 text-center text-stone-400 text-xs">
              No customers found. Click &quot;Add New Customer&quot; above to register.
            </div>
          )}
        </div>

        {/* Selected Customer Statement Drawer */}
        {selectedCustomer && (
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">Customer Statement</span>
                <h3 className="text-sm font-bold text-stone-900">{selectedCustomer.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Balances Highlight */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
              <div>
                <span className="text-[10px] text-stone-500 block">Total Purchased:</span>
                <span className="font-mono font-bold text-stone-900">{formatINR(selectedCustomer.totalPurchasesPaise)}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block">Outstanding Khata:</span>
                <span className={`font-mono font-bold text-sm ${selectedCustomer.balancePaise > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                  {formatINR(selectedCustomer.balancePaise)}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <a
                href={getWhatsAppLink(selectedCustomer)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Statement</span>
              </a>
            </div>

            {/* Order History */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Order History ({customerOrders.length})
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1.5 divide-y divide-stone-100">
                {customerOrders.map(o => (
                  <div key={o.id} className="pt-1.5 first:pt-0 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-mono font-semibold text-stone-900">{o.id}</div>
                      <div className="text-[10px] text-stone-400">{formatDate(o.orderDate)} · {o.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-stone-900">{formatINR(o.totalPaise)}</div>
                      <div className="text-[10px] font-mono text-stone-500">
                        {o.remainingDuePaise > 0 ? `Due: ${formatINR(o.remainingDuePaise)}` : 'Paid'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payments History */}
            <div className="space-y-2 border-t border-stone-200 pt-3">
              <div className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Payments Received ({customerPayments.length})
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
                {customerPayments.map(p => (
                  <div key={p.id} className="flex justify-between items-center py-1 border-b border-stone-100 text-[11px]">
                    <div>
                      <span className="font-medium">{formatDate(p.paymentDate)}</span>
                      <span className="text-stone-400 font-mono ml-1">({p.method.toUpperCase()})</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-800">{formatINR(p.amountPaise)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">Add Customer to CRM</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Customer / Hotel Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Coalfield Dine or Dr. Amitav"
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 94313 12345"
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Customer Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Retail">Retail Household</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Wholesale">Wholesale Mandi</option>
                    <option value="Distributor">Distributor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={e => setGstin(e.target.value)}
                    placeholder="20AABC..."
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Delivery Address in Dhanbad *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. Near Ozone Galleria, Saraidhela, Dhanbad"
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Customer Preferences & Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Requires 10kg Grey Oyster every Tuesday. Prefers morning 10 AM delivery."
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Register Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
