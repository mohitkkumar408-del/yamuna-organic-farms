import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { FarmProvider, useFarm } from './context/FarmContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar, NavTab } from './components/Sidebar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { OrderManagementView } from './components/OrderManagementView.tsx';
import { SalesRevenueView } from './components/SalesRevenueView.tsx';
import { InventoryView } from './components/InventoryView.tsx';
import { ProductionView } from './components/ProductionView.tsx';
import { CustomerView } from './components/CustomerView.tsx';
import { SupplierView } from './components/SupplierView.tsx';
import { ExpenseView } from './components/ExpenseView.tsx';
import { ReportsView } from './components/ReportsView.tsx';
import { AuditLogView } from './components/AuditLogView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);

  const { toasts, removeToast } = useFarm();
  const { language } = useLanguage();

  const handleNavigate = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOrderFromDashboard = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('orders');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none print:hidden">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg backdrop-blur-md transition-all ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-200 border border-emerald-800/50'
                : toast.type === 'error'
                ? 'bg-red-950/95 text-red-200 border border-red-800/50'
                : 'bg-stone-900/95 text-stone-200 border border-stone-800/50'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 p-0.5 rounded hover:bg-white/10 text-stone-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleNavigate}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onSelectOrder={handleSelectOrderFromDashboard}
            />
          )}

          {activeTab === 'orders' && (
            <OrderManagementView initialSelectedOrderId={selectedOrderId} />
          )}

          {activeTab === 'sales' && <SalesRevenueView />}

          {activeTab === 'inventory' && <InventoryView />}

          {activeTab === 'production' && <ProductionView />}

          {activeTab === 'customers' && <CustomerView />}

          {activeTab === 'suppliers' && <SupplierView />}

          {activeTab === 'expenses' && <ExpenseView />}

          {activeTab === 'invoices' && (
            <OrderManagementView initialSelectedOrderId={selectedOrderId} />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'audit' && <AuditLogView />}
        </main>
      </div>

      {/* Settings & Backup Modal */}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <FarmProvider>
          <MainLayout />
        </FarmProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
