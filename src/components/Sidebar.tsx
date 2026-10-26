import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useFarm } from '../context/FarmContext.tsx';
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Boxes,
  Sprout,
  Users,
  Truck,
  ReceiptText,
  FileSpreadsheet,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'orders'
  | 'sales'
  | 'inventory'
  | 'production'
  | 'customers'
  | 'suppliers'
  | 'expenses'
  | 'invoices'
  | 'reports'
  | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const { t, language } = useLanguage();
  const { metrics } = useFarm();

  const navItems: Array<{
    id: NavTab;
    labelKey: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    {
      id: 'orders',
      labelKey: 'orders',
      icon: ShoppingCart,
      badge: metrics?.ordersByStatus?.['New'] || 0,
      badgeColor: 'bg-emerald-600 text-white'
    },
    { id: 'sales', labelKey: 'sales', icon: TrendingUp },
    {
      id: 'inventory',
      labelKey: 'inventory',
      icon: Boxes,
      badge: metrics?.lowStockItemsCount || 0,
      badgeColor: 'bg-amber-600 text-white'
    },
    { id: 'production', labelKey: 'production', icon: Sprout },
    { id: 'customers', labelKey: 'customers', icon: Users },
    { id: 'suppliers', labelKey: 'suppliers', icon: Truck },
    { id: 'expenses', labelKey: 'expenses', icon: ReceiptText },
    { id: 'invoices', labelKey: 'invoices', icon: FileCheck2 },
    { id: 'reports', labelKey: 'reports', icon: FileSpreadsheet },
    { id: 'audit', labelKey: 'auditLog', icon: ShieldCheck }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-stone-900 border-r border-stone-800 p-3 z-40 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 print:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto space-y-1">
          {/* Mobile close button */}
          <div className="flex md:hidden items-center justify-between px-2 py-1 mb-2 text-stone-400">
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-400">Navigation</span>
            <button onClick={onCloseMobile} className="p-1 rounded-md hover:bg-stone-800 text-stone-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                  <span className="truncate">{t(item.labelKey)}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums font-semibold shrink-0 ${
                      item.badgeColor || 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Quick status bar */}
        <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 space-y-1.5">
          <div className="flex items-center justify-between px-2">
            <span>{language === 'hi' ? 'फार्म स्थिति' : 'Farm Status'}</span>
            <span className="text-emerald-400 font-medium">
              {language === 'hi' ? 'सक्रिय' : 'Active'}
            </span>
          </div>
          {metrics && metrics.lowStockItemsCount > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-amber-950/40 border border-amber-800/30 text-amber-300 text-[10px]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>{metrics.lowStockItemsCount} items low on stock</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
