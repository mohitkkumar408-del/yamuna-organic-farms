import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { formatDateTime } from '../utils/formatters.ts';
import { ShieldCheck, Search, Filter, Clock, UserCheck, ShieldAlert } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useFarm();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchSearch =
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-stone-900">
          {language === 'hi' ? 'सुरक्षा एवं लेखापरीक्षा (Audit Trail)' : 'Security & Traceable Audit Ledger'}
        </h1>
        <p className="text-xs text-stone-500">
          {language === 'hi'
            ? 'प्रत्येक वित्तीय संपादन, स्टॉक कटौती, ऑर्डर रद्द करने अथवा वापसी का अपरिवर्तनीय इतिहास'
            : 'Immutable timestamped audit trail of financial entries, FIFO stock deductions, and staff actions'}
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by User, Entity ID or event description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white font-medium text-stone-700 outline-none"
          >
            <option value="ALL">All Actions ({auditLogs.length})</option>
            <option value="CREATE">CREATE</option>
            <option value="STATUS_CHANGE">STATUS_CHANGE</option>
            <option value="STOCK_DEDUCT">STOCK_DEDUCT</option>
            <option value="PAYMENT">PAYMENT</option>
            <option value="CANCEL">CANCEL</option>
            <option value="RETURN">RETURN</option>
            <option value="OVERRIDE">OVERRIDE</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity Type & ID</th>
                <th className="py-2.5 px-3">Audit Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-stone-900">{log.userName}</div>
                    <span className="text-[10px] text-stone-400 capitalize">{log.userRole}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        log.action === 'CREATE'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'STOCK_DEDUCT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.action === 'PAYMENT'
                          ? 'bg-indigo-100 text-indigo-800'
                          : log.action === 'CANCEL' || log.action === 'RETURN'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-stone-700">
                    <span className="text-stone-400 text-[10px] mr-1">[{log.entityType}]</span>
                    {log.entityId}
                  </td>
                  <td className="py-2.5 px-3 text-stone-800 leading-relaxed">{log.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
