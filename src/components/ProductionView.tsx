import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { formatINR, formatKg, formatDate } from '../utils/formatters.ts';
import {
  Sprout,
  Plus,
  Scissors,
  Calendar,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Thermometer,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { CultivationBatch, ProductVariety } from '../types/index.ts';

export const ProductionView: React.FC = () => {
  const { batches, harvests, createBatch, updateBatch, recordHarvest, products } = useFarm();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'batches' | 'harvests' | 'guide'>('batches');
  const [selectedBatch, setSelectedBatch] = useState<CultivationBatch | null>(null);

  // New Batch Modal State
  const [isNewBatchOpen, setIsNewBatchOpen] = useState(false);
  const [variety, setVariety] = useState<ProductVariety>('Grey Oyster (Pleurotus ostreatus)');
  const [spawnSupplier, setSpawnSupplier] = useState('Birsa Agricultural Spawn Lab, Ranchi');
  const [spawnQtyKg, setSpawnQtyKg] = useState(20);
  const [spawnCostRupees, setSpawnCostRupees] = useState(800);
  const [strawType, setStrawType] = useState('Paddy Straw (धान का पुआल)');
  const [strawQtyKg, setStrawQtyKg] = useState(400);
  const [strawCostRupees, setStrawCostRupees] = useState(1600);
  const [bagCount, setBagCount] = useState(200);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const harvestExpected = new Date();
  harvestExpected.setDate(harvestExpected.getDate() + 22);
  const harvestExpectedStr = harvestExpected.toISOString().split('T')[0];

  const [bagPrepDate, setBagPrepDate] = useState(todayStr);
  const [inoculationDate, setInoculationDate] = useState(todayStr);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(harvestExpectedStr);
  const [labourCostRupees, setLabourCostRupees] = useState(1500);
  const [electricityWaterRupees, setElectricityWaterRupees] = useState(500);
  const [packagingOtherRupees, setPackagingOtherRupees] = useState(400);
  const [batchNotes, setBatchNotes] = useState('');
  const [isCreatingBatch, setIsCreatingBatch] = useState(false);

  // Record Harvest Flush Modal State
  const [isHarvestModalOpen, setIsHarvestModalOpen] = useState(false);
  const [harvestBatchId, setHarvestBatchId] = useState<string>(batches[0]?.id || '');
  const [flushNumber, setFlushNumber] = useState<number>(1);
  const [harvestDate, setHarvestDate] = useState(todayStr);
  const [harvestKg, setHarvestKg] = useState<number>(25);
  const [harvestGrade, setHarvestGrade] = useState<'Grade A Cluster' | 'Grade B Loose' | 'Processing Grade'>('Grade A Cluster');
  const [harvestWasteKg, setHarvestWasteKg] = useState<number>(1);
  const [harvestNotes, setHarvestNotes] = useState<string>('');
  const [isRecordingHarvest, setIsRecordingHarvest] = useState(false);

  // Handle New Batch Creation
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingBatch(true);
      await createBatch({
        variety,
        spawnSupplier,
        spawnQtyKg: Number(spawnQtyKg),
        spawnCostPaise: Math.round(spawnCostRupees * 100),
        strawType,
        strawQtyKg: Number(strawQtyKg),
        strawCostPaise: Math.round(strawCostRupees * 100),
        bagCount: Number(bagCount),
        bagPrepDate,
        inoculationDate,
        expectedHarvestDate,
        status: 'Inoculation',
        contaminationBags: 0,
        labourExpensePaise: Math.round(labourCostRupees * 100),
        electricityWaterExpensePaise: Math.round(electricityWaterRupees * 100),
        packagingOtherExpensePaise: Math.round(packagingOtherRupees * 100),
        notes: batchNotes
      });
      setIsNewBatchOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create batch');
    } finally {
      setIsCreatingBatch(false);
    }
  };

  // Handle Flush Harvest Recording
  const handleRecordHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsRecordingHarvest(true);
      await recordHarvest({
        batchId: harvestBatchId,
        flushNumber: Number(flushNumber),
        harvestDate,
        quantityKg: Number(harvestKg),
        grade: harvestGrade,
        wasteKg: Number(harvestWasteKg),
        notes: harvestNotes,
        recordedBy: 'Farm Staff'
      });
      setIsHarvestModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to record harvest');
    } finally {
      setIsRecordingHarvest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {language === 'hi' ? 'मशरूम उत्पादन एवं बैच चक्र' : 'Mushroom Cultivation & Batch Performance'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'hi'
              ? 'बीजारोपण (Inoculation), माइसेलियम फैलाव, बहु-तुड़ाई चक्र एवं प्रति थैला पैदावार'
              : 'Spawning, bag colonization, multi-flush harvests, cost-per-kg & bio-efficiency tracking'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setHarvestBatchId(batches[0]?.id || '');
              setFlushNumber(1);
              setHarvestKg(30);
              setIsHarvestModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Scissors className="w-4 h-4" />
            <span>{t('recordHarvest')}</span>
          </button>

          <button
            onClick={() => setIsNewBatchOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newBatch')}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'batches'
              ? 'border-emerald-800 text-emerald-950 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Active & Completed Batches ({batches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('harvests')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'harvests'
              ? 'border-emerald-800 text-emerald-950 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Harvest Logs & Flushes ({harvests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'guide'
              ? 'border-emerald-800 text-emerald-950 font-semibold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Droplets className="w-4 h-4" />
          <span>Cultivation Protocols & Reminders</span>
        </button>
      </div>

      {/* Tab 1: Cultivation Batches */}
      {activeTab === 'batches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {batches.map(batch => {
            const hasHarvested = batch.totalHarvestedKg > 0;
            return (
              <div
                key={batch.id}
                onClick={() => setSelectedBatch(batch)}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs hover:border-emerald-700 cursor-pointer transition-colors space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-stone-900 block">{batch.id}</span>
                      <span className="text-xs text-stone-600 font-medium">{batch.variety}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        batch.status === 'Fruiting'
                          ? 'bg-emerald-100 text-emerald-800'
                          : batch.status === 'Colonization'
                          ? 'bg-amber-100 text-amber-800'
                          : batch.status === 'Completed'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>

                  {/* Batch Substrate & Bag Info */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <div>
                      <span className="text-stone-400 text-[10px] block">Cultivation Bags:</span>
                      <span className="font-bold text-stone-900 font-mono">{batch.bagCount} bags</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block">Inoculation Date:</span>
                      <span className="font-medium text-stone-700">{formatDate(batch.inoculationDate)}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block">Total Harvested:</span>
                      <span className="font-bold text-emerald-800 font-mono">{formatKg(batch.totalHarvestedKg)}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 text-[10px] block">Expected 1st Flush:</span>
                      <span className="font-medium text-stone-700">{formatDate(batch.expectedHarvestDate)}</span>
                    </div>
                  </div>

                  {/* Efficiency Metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                    <div className="p-2 rounded bg-stone-50 border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">Cost / Kg</span>
                      <span className="font-mono font-bold text-stone-900">
                        {hasHarvested ? formatINR(batch.costPerKgPaise) : '—'}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-stone-50 border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">Yield / Bag</span>
                      <span className="font-mono font-bold text-stone-900">
                        {hasHarvested ? `${batch.yieldPerBagKg} kg` : '—'}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-stone-50 border border-stone-100">
                      <span className="text-[10px] text-stone-500 block">Bio-Eff %</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {hasHarvested ? `${batch.biologicalEfficiencyPct}%` : '—'}
                      </span>
                    </div>
                  </div>

                  {batch.notes && (
                    <p className="text-[11px] text-stone-500 mt-2 line-clamp-2 italic">
                      &quot;{batch.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Total Batch Cost:</span>
                  <span className="font-mono font-semibold text-stone-900">{formatINR(batch.totalCostPaise)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Harvest Flushes */}
      {activeTab === 'harvests' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Harvest Logs & Multi-Flush History
              </h3>
              <p className="text-[11px] text-stone-500">
                Every logged harvest automatically updates available inventory and generates a FIFO lot
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Harvest ID</th>
                  <th className="py-2.5 px-3">Batch ID</th>
                  <th className="py-2.5 px-3">Flush No.</th>
                  <th className="py-2.5 px-3">Harvest Date</th>
                  <th className="py-2.5 px-3 text-right">Harvest Qty (Kg)</th>
                  <th className="py-2.5 px-3">Quality Grade</th>
                  <th className="py-2.5 px-3 text-right">Waste (Kg)</th>
                  <th className="py-2.5 px-3">Lot Assigned</th>
                  <th className="py-2.5 px-3">Staff & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {harvests.map(h => (
                  <tr key={h.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900">{h.id}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-700">{h.batchId}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                        Flush {h.flushNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">{formatDate(h.harvestDate)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 tabular-nums">
                      {formatKg(h.quantityKg)}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-stone-700">{h.grade}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-stone-500 tabular-nums">
                      {formatKg(h.wasteKg)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600">{h.lotId || '—'}</td>
                    <td className="py-2.5 px-3 text-[11px] text-stone-600 max-w-xs truncate">
                      <span className="font-semibold text-stone-800">{h.recordedBy}: </span>
                      {h.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cultivation Protocols & Reminders */}
      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <Thermometer className="w-4 h-4" />
              <span>1. Spawn Run / Colonization</span>
            </div>
            <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>Keep spawn-run room in total darkness for 18–22 days.</li>
              <li>Maintain room temperature between 24°C and 28°C.</li>
              <li>Ensure passive ventilation to expel CO₂ build-up.</li>
              <li>Monitor daily for competitor mold (Trichoderma green mold). Segregate contaminated bags immediately.</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <Droplets className="w-4 h-4" />
              <span>2. Fruiting Chamber & Misting</span>
            </div>
            <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>Provide 8–10 hours of diffused light when pinheads emerge.</li>
              <li>Run ultrasonic mist humidifier to hold relative humidity at 85%–90%.</li>
              <li>Avoid spraying direct water jets onto young developing pinheads.</li>
              <li>Exhaust fan run: 15 minutes every 2 hours to provide fresh oxygen (O₂).</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <Scissors className="w-4 h-4" />
              <span>3. Multi-Flush Harvest Protocol</span>
            </div>
            <ul className="text-xs text-stone-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>Harvest clusters when cap edges are still slightly curled downward.</li>
              <li>Twist and pull gently at base; never leave broken stem stumps on bag.</li>
              <li>After 1st flush harvest, scrape old debris and mist heavily for 2nd flush (approx 8-10 days later).</li>
              <li>Oyster mushroom can yield up to 3 flushes with 70–90% biological efficiency.</li>
            </ul>
          </div>
        </div>
      )}

      {/* New Batch Modal */}
      {isNewBatchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">
                Initiate New Oyster Cultivation Batch
              </h3>
              <button onClick={() => setIsNewBatchOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Mushroom Variety *</label>
                  <select
                    value={variety}
                    onChange={e => setVariety(e.target.value as any)}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value="Grey Oyster (Pleurotus ostreatus)">Grey Oyster (Pleurotus ostreatus)</option>
                    <option value="White Oyster (Pleurotus florida)">White Oyster (Pleurotus florida)</option>
                    <option value="Pink Oyster (Pleurotus djamor)">Pink Oyster (Pleurotus djamor)</option>
                    <option value="King Oyster (Pleurotus eryngii)">King Oyster (Pleurotus eryngii)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Number of Bags *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={bagCount}
                    onChange={e => setBagCount(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              {/* Substrate & Spawn */}
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Substrate Type</label>
                  <input
                    type="text"
                    value={strawType}
                    onChange={e => setStrawType(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-1.5 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-[10px] text-stone-500">Straw Qty (Kg):</span>
                      <input
                        type="number"
                        value={strawQtyKg}
                        onChange={e => setStrawQtyKg(Number(e.target.value))}
                        className="w-full border border-stone-300 rounded-lg p-1 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500">Straw Cost (₹):</span>
                      <input
                        type="number"
                        value={strawCostRupees}
                        onChange={e => setStrawCostRupees(Number(e.target.value))}
                        className="w-full border border-stone-300 rounded-lg p-1 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Spawn Supplier</label>
                  <input
                    type="text"
                    value={spawnSupplier}
                    onChange={e => setSpawnSupplier(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-1.5 bg-white"
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-[10px] text-stone-500">Spawn Qty (Kg):</span>
                      <input
                        type="number"
                        value={spawnQtyKg}
                        onChange={e => setSpawnQtyKg(Number(e.target.value))}
                        className="w-full border border-stone-300 rounded-lg p-1 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500">Spawn Cost (₹):</span>
                      <input
                        type="number"
                        value={spawnCostRupees}
                        onChange={e => setSpawnCostRupees(Number(e.target.value))}
                        className="w-full border border-stone-300 rounded-lg p-1 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Bag Prep Date</label>
                  <input
                    type="date"
                    value={bagPrepDate}
                    onChange={e => setBagPrepDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Inoculation Date</label>
                  <input
                    type="date"
                    value={inoculationDate}
                    onChange={e => setInoculationDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Expected 1st Flush</label>
                  <input
                    type="date"
                    value={expectedHarvestDate}
                    onChange={e => setExpectedHarvestDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              {/* Additional Operating Expenses Allocated */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Labour Wages (₹)</label>
                  <input
                    type="number"
                    value={labourCostRupees}
                    onChange={e => setLabourCostRupees(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Power / Water (₹)</label>
                  <input
                    type="number"
                    value={electricityWaterRupees}
                    onChange={e => setElectricityWaterRupees(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Bags & Packaging (₹)</label>
                  <input
                    type="number"
                    value={packagingOtherRupees}
                    onChange={e => setPackagingOtherRupees(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Batch Notes</label>
                <input
                  type="text"
                  value={batchNotes}
                  onChange={e => setBatchNotes(e.target.value)}
                  placeholder="e.g. Master spawn batch #18, hot water pasteurization 80°C for 2 hours."
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewBatchOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingBatch}
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isCreatingBatch ? 'Creating...' : 'Start Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Flush Harvest Modal */}
      {isHarvestModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">
                Record Mushroom Harvest Flush
              </h3>
              <button onClick={() => setIsHarvestModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordHarvest} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Target Cultivation Batch *</label>
                <select
                  value={harvestBatchId}
                  onChange={e => setHarvestBatchId(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white font-mono"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.id} ({b.variety} - {b.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Flush Number *</label>
                  <select
                    value={flushNumber}
                    onChange={e => setFlushNumber(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 bg-white"
                  >
                    <option value={1}>Flush 1 (Prime Harvest)</option>
                    <option value={2}>Flush 2 (Second Harvest)</option>
                    <option value={3}>Flush 3 (Third Flush)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Harvest Date *</label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={e => setHarvestDate(e.target.value)}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">Harvest Quantity (Kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    min="0.5"
                    value={harvestKg}
                    onChange={e => setHarvestKg(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono font-bold text-emerald-900"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Discard / Trimmings (Kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={harvestWasteKg}
                    onChange={e => setHarvestWasteKg(Number(e.target.value))}
                    className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Quality Grade</label>
                <select
                  value={harvestGrade}
                  onChange={e => setHarvestGrade(e.target.value as any)}
                  className="w-full border border-stone-300 rounded-lg p-2 bg-white font-medium"
                >
                  <option value="Grade A Cluster">Grade A Cluster (Firm, large caps, uniform)</option>
                  <option value="Grade B Loose">Grade B Loose (Slightly split margins, fresh)</option>
                  <option value="Processing Grade">Processing Grade (For dehydration / powder)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Staff Notes</label>
                <input
                  type="text"
                  value={harvestNotes}
                  onChange={e => setHarvestNotes(e.target.value)}
                  placeholder="e.g. Crisp morning harvest. Transferred to cold storage."
                  className="w-full border border-stone-300 rounded-lg p-2 outline-none"
                />
              </div>

              <div className="p-2.5 rounded bg-emerald-50 text-emerald-900 text-[11px] border border-emerald-200">
                Notice: Submitting this form will automatically add {harvestKg} kg to warehouse stock and create an active FIFO batch lot.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsHarvestModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRecordingHarvest}
                  className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isRecordingHarvest ? 'Recording...' : 'Add to Stock & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
