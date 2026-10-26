import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BusinessSettings,
  Product,
  CultivationBatch,
  Harvest,
  InventoryLot,
  InventoryMovement,
  Customer,
  Supplier,
  Order,
  Invoice,
  Payment,
  Purchase,
  Expense,
  AuditLog,
  DashboardMetrics,
  OrderStatus,
  PaymentMethod
} from '../types/index.ts';
import { useAuth } from './AuthContext.tsx';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface FarmContextType {
  loading: boolean;
  metrics: DashboardMetrics | null;
  orders: Order[];
  products: Product[];
  batches: CultivationBatch[];
  harvests: Harvest[];
  lots: InventoryLot[];
  movements: InventoryMovement[];
  customers: Customer[];
  suppliers: Supplier[];
  purchases: Purchase[];
  expenses: Expense[];
  invoices: Invoice[];
  payments: Payment[];
  auditLogs: AuditLog[];
  settings: BusinessSettings | null;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshAll: () => Promise<void>;
  
  // Actions
  createOrder: (order: any) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string, deliveryStatus?: string) => Promise<Order>;
  recordOrderPayment: (orderId: string, amountPaise: number, method: PaymentMethod, txRef?: string, notes?: string) => Promise<any>;
  createProduct: (product: any) => Promise<Product>;
  updateProduct: (id: string, updates: any) => Promise<Product>;
  createBatch: (batch: any) => Promise<CultivationBatch>;
  updateBatch: (id: string, updates: any) => Promise<CultivationBatch>;
  recordHarvest: (harvestData: any, targetProductId?: string) => Promise<any>;
  adjustStock: (productId: string, lotId: string | undefined, adjustmentKg: number, type: any, reason: string) => Promise<void>;
  createCustomer: (customer: any) => Promise<Customer>;
  updateCustomer: (id: string, updates: any) => Promise<Customer>;
  createSupplier: (supplier: any) => Promise<Supplier>;
  createPurchase: (purchase: any) => Promise<Purchase>;
  recordSupplierPayment: (supplierId: string, purchaseId: string | undefined, amountPaise: number, method: PaymentMethod, txRef?: string, notes?: string) => Promise<any>;
  createExpense: (expense: any) => Promise<Expense>;
  updateSettings: (updates: Partial<BusinessSettings>) => Promise<void>;
  resetToSeeds: () => Promise<void>;
  restoreBackup: (backupData: any) => Promise<void>;
}

const FarmContext = createContext<FarmContextType | null>(null);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<CultivationBatch[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [lots, setLots] = useState<InventoryLot[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const authHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'x-user-name': currentUser.name,
      'x-user-role': currentUser.role
    };
  }, [currentUser]);

  const refreshAll = useCallback(async () => {
    try {
      const [
        metricsRes,
        ordersRes,
        productsRes,
        batchesRes,
        harvestsRes,
        lotsRes,
        movementsRes,
        customersRes,
        suppliersRes,
        purchasesRes,
        expensesRes,
        invoicesRes,
        paymentsRes,
        auditRes,
        settingsRes
      ] = await Promise.all([
        fetch('/api/metrics').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/batches').then(r => r.json()),
        fetch('/api/harvests').then(r => r.json()),
        fetch('/api/inventory/lots').then(r => r.json()),
        fetch('/api/inventory/movements').then(r => r.json()),
        fetch('/api/customers').then(r => r.json()),
        fetch('/api/suppliers').then(r => r.json()),
        fetch('/api/purchases').then(r => r.json()),
        fetch('/api/expenses').then(r => r.json()),
        fetch('/api/invoices').then(r => r.json()),
        fetch('/api/payments').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json()),
        fetch('/api/settings').then(r => r.json())
      ]);

      setMetrics(metricsRes);
      setOrders(ordersRes);
      setProducts(productsRes);
      setBatches(batchesRes);
      setHarvests(harvestsRes);
      setLots(lotsRes);
      setMovements(movementsRes);
      setCustomers(customersRes);
      setSuppliers(suppliersRes);
      setPurchases(purchasesRes);
      setExpenses(expensesRes);
      setInvoices(invoicesRes);
      setPayments(paymentsRes);
      setAuditLogs(auditRes);
      setSettings(settingsRes);
    } catch (err) {
      console.error('Error fetching farm data:', err);
      showToast('Error syncing with farm server', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Actions
  const createOrder = async (orderData: any) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create order');
    }
    const created = await res.json();
    showToast(`Order ${created.id} created successfully!`, 'success');
    await refreshAll();
    return created;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, reason?: string, deliveryStatus?: string) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status, reason, deliveryStatus })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }
    const updated = await res.json();
    showToast(`Order ${orderId} marked as ${status}`, 'success');
    await refreshAll();
    return updated;
  };

  const recordOrderPayment = async (orderId: string, amountPaise: number, method: PaymentMethod, txRef?: string, notes?: string) => {
    const res = await fetch(`/api/orders/${orderId}/payment`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ amountPaise, method, transactionRef: txRef, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to record payment');
    }
    const data = await res.json();
    showToast(`Payment of ₹${(amountPaise / 100).toFixed(2)} recorded for ${orderId}`, 'success');
    await refreshAll();
    return data;
  };

  const createProduct = async (productData: any) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(productData)
    });
    if (!res.ok) throw new Error('Failed to create product');
    const created = await res.json();
    showToast(`Product ${created.name} added!`, 'success');
    await refreshAll();
    return created;
  };

  const updateProduct = async (id: string, updates: any) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update product');
    const updated = await res.json();
    showToast(`Product updated!`, 'success');
    await refreshAll();
    return updated;
  };

  const createBatch = async (batchData: any) => {
    const res = await fetch('/api/batches', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(batchData)
    });
    if (!res.ok) throw new Error('Failed to create batch');
    const created = await res.json();
    showToast(`Batch ${created.id} started with ${created.bagCount} bags!`, 'success');
    await refreshAll();
    return created;
  };

  const updateBatch = async (id: string, updates: any) => {
    const res = await fetch(`/api/batches/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update batch');
    const updated = await res.json();
    showToast(`Batch ${id} updated!`, 'success');
    await refreshAll();
    return updated;
  };

  const recordHarvest = async (harvestData: any, targetProductId?: string) => {
    const res = await fetch('/api/harvests', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ ...harvestData, targetProductId })
    });
    if (!res.ok) throw new Error('Failed to record harvest');
    const data = await res.json();
    showToast(`Recorded harvest of ${harvestData.quantityKg} kg! Stock updated automatically.`, 'success');
    await refreshAll();
    return data;
  };

  const adjustStock = async (productId: string, lotId: string | undefined, adjustmentKg: number, type: any, reason: string) => {
    const res = await fetch('/api/inventory/adjust', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ productId, lotId, adjustmentKg, type, reason })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to adjust stock');
    }
    showToast(`Stock adjusted (${type}) by ${adjustmentKg > 0 ? '+' : ''}${adjustmentKg} kg`, 'success');
    await refreshAll();
  };

  const createCustomer = async (customerData: any) => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(customerData)
    });
    if (!res.ok) throw new Error('Failed to add customer');
    const created = await res.json();
    showToast(`Customer ${created.name} added!`, 'success');
    await refreshAll();
    return created;
  };

  const updateCustomer = async (id: string, updates: any) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update customer');
    const updated = await res.json();
    showToast(`Customer updated!`, 'success');
    await refreshAll();
    return updated;
  };

  const createSupplier = async (supplierData: any) => {
    const res = await fetch('/api/suppliers', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(supplierData)
    });
    if (!res.ok) throw new Error('Failed to add supplier');
    const created = await res.json();
    showToast(`Supplier ${created.name} added!`, 'success');
    await refreshAll();
    return created;
  };

  const createPurchase = async (purchaseData: any) => {
    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(purchaseData)
    });
    if (!res.ok) throw new Error('Failed to record purchase');
    const created = await res.json();
    showToast(`Purchase order ${created.id} saved!`, 'success');
    await refreshAll();
    return created;
  };

  const recordSupplierPayment = async (supplierId: string, purchaseId: string | undefined, amountPaise: number, method: PaymentMethod, txRef?: string, notes?: string) => {
    const res = await fetch('/api/purchases/pay', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ supplierId, purchaseId, amountPaise, method, transactionRef: txRef, notes })
    });
    if (!res.ok) throw new Error('Failed to record supplier payment');
    const payment = await res.json();
    showToast(`Paid ₹${(amountPaise / 100).toFixed(2)} to supplier`, 'success');
    await refreshAll();
    return payment;
  };

  const createExpense = async (expenseData: any) => {
    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(expenseData)
    });
    if (!res.ok) throw new Error('Failed to record expense');
    const created = await res.json();
    showToast(`Expense of ₹${(created.amountPaise / 100).toFixed(2)} recorded under ${created.category}`, 'success');
    await refreshAll();
    return created;
  };

  const updateSettings = async (updates: Partial<BusinessSettings>) => {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const updated = await res.json();
    setSettings(updated);
    showToast('Farm settings saved!', 'success');
  };

  const resetToSeeds = async () => {
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to reset data');
    showToast('Reset to demo sample dataset', 'info');
    await refreshAll();
  };

  const restoreBackup = async (backupData: any) => {
    const res = await fetch('/api/admin/restore', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(backupData)
    });
    if (!res.ok) throw new Error('Failed to restore backup');
    showToast('Database backup successfully restored!', 'success');
    await refreshAll();
  };

  return (
    <FarmContext.Provider
      value={{
        loading,
        metrics,
        orders,
        products,
        batches,
        harvests,
        lots,
        movements,
        customers,
        suppliers,
        purchases,
        expenses,
        invoices,
        payments,
        auditLogs,
        settings,
        toasts,
        showToast,
        removeToast,
        refreshAll,
        createOrder,
        updateOrderStatus,
        recordOrderPayment,
        createProduct,
        updateProduct,
        createBatch,
        updateBatch,
        recordHarvest,
        adjustStock,
        createCustomer,
        updateCustomer,
        createSupplier,
        createPurchase,
        recordSupplierPayment,
        createExpense,
        updateSettings,
        resetToSeeds,
        restoreBackup
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) throw new Error('useFarm must be used within FarmProvider');
  return context;
};
