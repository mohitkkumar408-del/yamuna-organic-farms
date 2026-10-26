import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Building,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, resetToSeeds, restoreBackup } = useFarm();
  const { language } = useLanguage();
  const { canManageUsers } = useAuth();

  const [businessName, setBusinessName] = useState(settings?.businessName || 'Yamuna Organic Farms');
  const [businessNameHi, setBusinessNameHi] = useState(settings?.businessNameHi || 'यमुना ऑर्गेनिक फार्म्स');
  const [address, setAddress] = useState(settings?.address || '');
  const [phone, setPhone] = useState(settings?.phone || '');
  const [email, setEmail] = useState(settings?.email || '');
  const [upiId, setUpiId] = useState(settings?.upiId || '');
  const [bankName, setBankName] = useState(settings?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(settings?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(settings?.ifscCode || '');
  const [gstNumber, setGstin] = useState(settings?.gstNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateSettings({
        businessName,
        businessNameHi,
        address,
        phone,
        email,
        upiId,
        bankName,
        accountNumber,
        ifscCode,
        gstNumber: gstNumber || undefined
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await fetch('/api/admin/backup');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Yamuna_Organic_Farms_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export backup');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (confirm('Are you sure you want to restore this database backup? Existing data will be overwritten.')) {
          await restoreBackup(json);
          onClose();
        }
      } catch (err) {
        alert('Invalid backup JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetSeeds = async () => {
    if (confirm('Reset database to default Yamuna Organic Farms sample records? All recent changes will be reinitialized.')) {
      await resetToSeeds();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              Farm Settings & Database Management
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] pb-1 border-b border-stone-200">
              1. Business Profile (Dhanbad, Jharkhand)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Business Name (English)</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Business Name (हिंदी)</label>
                <input
                  type="text"
                  required
                  value={businessNameHi}
                  onChange={e => setBusinessNameHi(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Farm Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">GSTIN</label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={e => setGstin(e.target.value)}
                  placeholder="20AABC..."
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Address & Location</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border border-stone-300 rounded-lg p-2"
              />
            </div>

            <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] pt-2 pb-1 border-b border-stone-200">
              2. Banking & UPI Payment Setup (Appears on Invoices)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">UPI VPA ID *</label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yamunafarms@okhdfcbank"
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Bank Name & Branch</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-700 mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={e => setIfscCode(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 font-mono uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-lg bg-emerald-800 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>

          {/* Backup & Restore Controls */}
          {canManageUsers && (
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                3. Database Backup, Restore & Reinitialization
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-800" />
                  <span>Export JSON Backup</span>
                </button>

                <label className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-indigo-800" />
                  <span>Restore from JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleResetSeeds}
                  className="p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-red-700" />
                  <span>Reset to Demo Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
