import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { formatINR, formatKg, formatDate, formatDateTime } from '../utils/formatters.ts';
import {
  Boxes,
  Clock,
  AlertTriangle,
  Plus,
  ArrowDownUp,
  History,
  ShieldAlert,
  Search,
  Filter,
  Layers,
  ThermometerSnowflake,
  X
} from 'lucide-react';
import { Product, InventoryLot, InventoryMovementType } from '../types/index.ts';

export const InventoryView: React.FC = () => {
  const { products, lots, movements, adjustStock, loading } = useFarm();
  const { t, language } = useLanguage();
  const { canAdjustStock } = useAuth();

  const [activeTab, setActiveTab] = useState<'catalog' | 'lots' | 'movements'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustProductId, setAdjustProductId] = useState<string>(products[0]?.id || '');
  const [adjustLotId, setAdjustLotId] = useState<string>('');
  const [adjustQtyKg, setAdjustQtyKg] = useState<number>(0);
  const [adjustType, setAdjustType] = useState<InventoryMovementType>('MANUAL_ADJUSTMENT');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  const [adjustError, setAdjustError] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];
  const inTwoDays = new Date();
  inTwoDays.setDate(inTwoDays.getDate() + 2);
  const inTwoDaysStr = inTwoDays.toISOString().split('T')[0];

  const handleConfirmAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdjustError('');
    if (adjustQtyKg === 0) {
      setAdjustError('Adjustment quantity cannot be 0');
      return;
    }
    if (!adjustReason.trim()) {
      setAdjustError('A detailed reason is required for audit logs');
      return;
    }

    try {
      setIsAdjusting(true);
      await adjustStock(adjustProductId, adjustLotId || undefined, adjustQtyKg, adjustType, adjustReason.trim());
      setIsAdjustModalOpen(false);
      setAdjustQtyKg(0);
      setAdjustReason('');
    } catch (err: any) {
      setAdjustError(err.message || 'Failed to adjust stock');
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {language === 'hi' ? 'इन्वेंटरी एवं FIFO बैच प्रबंधन' : 'Inventory & FIFO Batch Management'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'hi'
              ? 'ढींगरी मशरूम की शेल्फ-लाइफ, शीत कक्ष रैक और बैच-वार निर्गमन'
              : 'Perishable oyster mushroom FIFO rotation, cold storage tracking & traceability'}
          </p>
        </div>

        {canAdjustStock && (
          <button
            onClick={() => {
              setAdjustProductId(products[0]?.id || '');
              setAdjustLotId('');
              setAdjustQtyKg(0);
              setAdjustType('MANUAL_ADJUSTMENT');
              setAdjustReason('');
              setIsAdjustModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
          >
            <ArrowDownUp className="w-4 h-4" />
            <span>Manual Stock Adjustment</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'border-emerald-800 text-emerald-950 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Product Catalog & Stock ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('lots')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'lots'
              ? 'border-emerald-800 text-emerald-950 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active FIFO Batches & Lots ({lots.filter(l => l.remainingQtyKg > 0).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('movements')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'movements'
              ? 'border-emerald-800 text-emerald-950 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock Movement Ledger ({movements.length})</span>
        </button>
      </div>

      {/* Tab 1: Product Catalog & Stock */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(prod => {
            const isLowStock = prod.currentStockKg <= prod.minStockThresholdKg;
            return (
              <div
                key={prod.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
              >
                <div>
                  {prod.imagePath && (
                    <div className="h-36 w-full overflow-hidden bg-stone-100 relative">
                      <img
                        src={prod.imagePath}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-900/80 text-white backdrop-blur-xs uppercase tracking-wide">
                        {prod.type}
                      </span>
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-stone-900">{prod.name}</h3>
                        <div className="text-[11px] text-stone-500">{prod.variety}</div>
                      </div>
                      <span className="font-mono text-xs text-stone-400 font-semibold">{prod.id}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                      <div>
                        <span className="text-stone-400 text-[10px] block">Selling Rate:</span>
                        <span className="font-mono font-bold text-stone-900">
                          {formatINR(prod.sellingPricePaise)} / {prod.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Cost Price:</span>
                        <span className="font-mono text-stone-600">
                          {formatINR(prod.costPricePaise)} / {prod.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-stone-500">Available Stock:</div>
                    <div className="text-lg font-bold font-mono tabular-nums text-stone-900">
                      {formatKg(prod.currentStockKg)}
                    </div>
                  </div>

                  <div className="text-right">
                    {isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock (&lt;{prod.minStockThresholdKg}kg)
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                        Healthy ({prod.shelfLifeDays}d shelf life)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Active FIFO Batches & Lots */}
      {activeTab === 'lots' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs space-y-4">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Batch-Wise FIFO Stock Table
              </h3>
              <p className="text-[11px] text-stone-500">
                Sorted by harvest date (oldest first). Sales automatically dispatch from top lots.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Lot Number</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Batch Source</th>
                  <th className="py-2.5 px-3">Harvest Date</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3">Storage Location</th>
                  <th className="py-2.5 px-3 text-right">Initial Qty</th>
                  <th className="py-2.5 px-3 text-right">Remaining</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {lots
                  .sort((a, b) => new Date(a.harvestDate).getTime() - new Date(b.harvestDate).getTime())
                  .map(lot => {
                    const prod = products.find(p => p.id === lot.productId);
                    const isExpiringSoon = lot.remainingQtyKg > 0 && lot.expiryDate <= inTwoDaysStr;
                    const isExpired = lot.remainingQtyKg > 0 && lot.expiryDate < todayStr;

                    return (
                      <tr key={lot.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-900 whitespace-nowrap">
                          {lot.lotNumber}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-stone-800">
                          {prod ? prod.name : lot.productId}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600">
                          {lot.batchId || '—'}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{formatDate(lot.harvestDate)}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`font-medium ${
                              isExpired ? 'text-red-600 font-bold' : isExpiringSoon ? 'text-amber-600 font-bold' : 'text-stone-700'
                            }`}
                          >
                            {formatDate(lot.expiryDate)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-stone-600 flex items-center gap-1">
                          <ThermometerSnowflake className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>{lot.storageLocation}</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-500">
                          {formatKg(lot.initialQtyKg)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums text-stone-900">
                          {formatKg(lot.remainingQtyKg)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {lot.remainingQtyKg === 0 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 text-stone-500">
                              Depleted
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 font-bold">
                              Expired
                            </span>
                          ) : isExpiringSoon ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                              Expiring (&lt;48h)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">
                              Fresh
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Stock Movement Ledger */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-200 bg-stone-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Complete Stock Movement Ledger
            </h3>
            <p className="text-[11px] text-stone-500">
              Audit trail of every harvest addition, customer delivery dispatch, return, and manual adjustment
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-right">Change (Kg)</th>
                  <th className="py-2.5 px-3 text-right">New Stock</th>
                  <th className="py-2.5 px-3">Reference / Order</th>
                  <th className="py-2.5 px-3">Performed By & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {movements.map(m => (
                  <tr key={m.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                      {formatDateTime(m.timestamp)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          m.type === 'HARVEST'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.type === 'SALE'
                            ? 'bg-sky-100 text-sky-800'
                            : m.type === 'RETURN'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-stone-900">{m.productName}</td>
                    <td
                      className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums ${
                        m.changeQtyKg > 0 ? 'text-emerald-700' : 'text-stone-800'
                      }`}
                    >
                      {m.changeQtyKg > 0 ? `+${m.changeQtyKg}` : m.changeQtyKg} kg
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-stone-600">
                      {formatKg(m.newStockKg)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-700">
                      {m.referenceId || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 text-[11px]">
                      <span className="font-medium text-stone-900">{m.performedBy}: </span>
                      {m.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manual Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Authorized Stock Adjustment</span>
              </h3>
              <button onClick={() => setIsAdjustModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {adjustError && (
              <div className="p-2.5 rounded bg-red-50 text-red-700 text-xs border border-red-200">
                {adjustError}
              </div>
            )}

            <form onSubmit={handleConfirmAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Target Product *</label>
                <select
                  value={adjustProductId}
                  onChange={e => setAdjustProductId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.currentStockKg} kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Movement Type</label>
                <select
                  value={adjustType}
                  onChange={e => setAdjustType(e.target.value as any)}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white font-medium uppercase"
                >
                  <option value="MANUAL_ADJUSTMENT">Manual Reconciliation (Audit Correction)</option>
                  <option value="DAMAGE">Physical Damage / Mishandling Write-Off</option>
                  <option value="EXPIRED">Perishable Spoilage / Mold Discard</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">
                  Quantity Adjustment (Kg) * (Use negative for deduction e.g. -5.5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={adjustQtyKg}
                  onChange={e => setAdjustQtyKg(Number(e.target.value))}
                  placeholder="e.g. -3.0 or +5.0"
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Audit Reason / Justification *</label>
                <textarea
                  required
                  rows={2}
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="e.g. Broken storage tray during night shift, 3kg bruised caps discarded."
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isAdjusting ? 'Saving...' : 'Apply Stock Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
