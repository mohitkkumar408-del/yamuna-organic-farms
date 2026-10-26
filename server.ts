import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { farmDb } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const isProd = process.env.NODE_ENV === 'production';
const PORT: number = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Request logger
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // --- Auth & Users ---
  app.post('/api/auth/login', (req, res) => {
    try {
      const { username, pin } = req.body;
      const user = farmDb.authenticate(username, pin);
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or PIN' });
      }
      farmDb.logAudit(user.name, user.role, 'CREATE', 'CUSTOMER', user.id, `User ${user.name} logged in`);
      res.json({ user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users', (req, res) => {
    res.json(farmDb.getUsers());
  });

  // --- Settings ---
  app.get('/api/settings', (req, res) => {
    res.json(farmDb.getSettings());
  });

  app.put('/api/settings', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Authorized User';
      const updated = farmDb.updateSettings(req.body, performedBy);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Dashboard Real-Time Metrics ---
  app.get('/api/metrics', (req, res) => {
    try {
      const metrics = farmDb.getDashboardMetrics();
      res.json(metrics);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Products Catalog ---
  app.get('/api/products', (req, res) => {
    res.json(farmDb.getProducts());
  });

  app.post('/api/products', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const product = farmDb.createProduct(req.body, performedBy);
      res.status(201).json(product);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/products/:id', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const updated = farmDb.updateProduct(req.params.id, req.body, performedBy);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- Cultivation Batches ---
  app.get('/api/batches', (req, res) => {
    res.json(farmDb.getBatches());
  });

  app.post('/api/batches', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const batch = farmDb.createBatch(req.body, performedBy);
      res.status(201).json(batch);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/batches/:id', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const updated = farmDb.updateBatch(req.params.id, req.body, performedBy);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- Harvests ---
  app.get('/api/harvests', (req, res) => {
    res.json(farmDb.getHarvests());
  });

  app.post('/api/harvests', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Staff';
      const { targetProductId, ...harvestData } = req.body;
      const result = farmDb.recordHarvest(harvestData, performedBy, targetProductId);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- Inventory Lots & Movements ---
  app.get('/api/inventory/lots', (req, res) => {
    res.json(farmDb.getLots());
  });

  app.get('/api/inventory/movements', (req, res) => {
    res.json(farmDb.getMovements());
  });

  app.post('/api/inventory/adjust', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const { productId, lotId, adjustmentKg, type, reason } = req.body;
      farmDb.manualStockAdjustment(productId, lotId, Number(adjustmentKg), type, reason, performedBy);
      res.json({ success: true, message: 'Stock adjusted successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- Customers ---
  app.get('/api/customers', (req, res) => {
    res.json(farmDb.getCustomers());
  });

  app.post('/api/customers', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Staff';
      const customer = farmDb.createCustomer(req.body, performedBy);
      res.status(201).json(customer);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/customers/:id', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const updated = farmDb.updateCustomer(req.params.id, req.body, performedBy);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- Suppliers & Purchases ---
  app.get('/api/suppliers', (req, res) => {
    res.json(farmDb.getSuppliers());
  });

  app.post('/api/suppliers', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const supplier = farmDb.createSupplier(req.body, performedBy);
      res.status(201).json(supplier);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/purchases', (req, res) => {
    res.json(farmDb.getPurchases());
  });

  app.post('/api/purchases', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const purchase = farmDb.createPurchase(req.body, performedBy);
      res.status(201).json(purchase);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/purchases/pay', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Owner';
      const { supplierId, purchaseId, amountPaise, method, transactionRef, notes } = req.body;
      const payment = farmDb.recordSupplierPayment(supplierId, purchaseId, amountPaise, method, performedBy, transactionRef, notes);
      res.status(201).json(payment);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get('/api/supplier-payments', (req, res) => {
    res.json(farmDb.getSupplierPayments());
  });

  // --- Orders ---
  app.get('/api/orders', (req, res) => {
    res.json(farmDb.getOrders());
  });

  app.post('/api/orders', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Staff';
      const order = farmDb.createOrder(req.body, performedBy);
      res.status(201).json(order);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put('/api/orders/:id/status', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Staff';
      const { status, reason, deliveryStatus } = req.body;
      const updated = farmDb.updateOrderStatus(req.params.id, status, performedBy, reason, deliveryStatus);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/orders/:id/payment', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Staff';
      const { amountPaise, method, transactionRef, notes } = req.body;
      const result = farmDb.recordOrderPayment(req.params.id, amountPaise, method, performedBy, transactionRef, notes);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- Invoices & Payments Ledger ---
  app.get('/api/invoices', (req, res) => {
    res.json(farmDb.getInvoices());
  });

  app.get('/api/payments', (req, res) => {
    res.json(farmDb.getPayments());
  });

  // --- Expenses ---
  app.get('/api/expenses', (req, res) => {
    res.json(farmDb.getExpenses());
  });

  app.post('/api/expenses', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Manager';
      const expense = farmDb.createExpense(req.body, performedBy);
      res.status(201).json(expense);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // --- Audit Logs ---
  app.get('/api/audit-logs', (req, res) => {
    res.json(farmDb.getAuditLogs());
  });

  // --- Backup & Reset ---
  app.get('/api/admin/backup', (req, res) => {
    res.json(farmDb.getBackupJson());
  });

  app.post('/api/admin/restore', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Owner';
      farmDb.restoreBackupJson(req.body, performedBy);
      res.json({ success: true, message: 'Database restored successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/admin/reset', (req, res) => {
    try {
      const performedBy = (req.headers['x-user-name'] as string) || 'Owner';
      farmDb.resetToSeeds(performedBy);
      res.json({ success: true, message: 'Reset to demo seed data' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Frontend Vite Integration ---
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yamuna Organic Farms server running on http://0.0.0.0:${PORT} [${isProd ? 'PROD' : 'DEV'}]`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
