import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  BusinessSettings,
  User,
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
  SupplierPayment,
  Expense,
  AuditLog,
  DashboardMetrics,
  OrderStatus
} from '../src/types/index.ts';

import {
  initialSettings,
  initialUsers,
  initialProducts,
  initialBatches,
  initialHarvests,
  initialLots,
  initialCustomers,
  initialSuppliers,
  initialOrders,
  initialInvoices,
  initialPayments,
  initialPurchases,
  initialSupplierPayments,
  initialExpenses,
  initialMovements,
  initialAuditLogs
} from './seedData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'yamuna_farm_database.json');

export interface FarmDatabaseSchema {
  settings: BusinessSettings;
  users: User[];
  products: Product[];
  batches: CultivationBatch[];
  harvests: Harvest[];
  lots: InventoryLot[];
  movements: InventoryMovement[];
  customers: Customer[];
  suppliers: Supplier[];
  orders: Order[];
  invoices: Invoice[];
  payments: Payment[];
  purchases: Purchase[];
  supplierPayments: SupplierPayment[];
  expenses: Expense[];
  auditLogs: AuditLog[];
}

export class FarmDatabase {
  private data: FarmDatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): FarmDatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure all arrays exist
        return {
          settings: parsed.settings || initialSettings,
          users: parsed.users || initialUsers,
          products: parsed.products || initialProducts,
          batches: parsed.batches || initialBatches,
          harvests: parsed.harvests || initialHarvests,
          lots: parsed.lots || initialLots,
          movements: parsed.movements || initialMovements,
          customers: parsed.customers || initialCustomers,
          suppliers: parsed.suppliers || initialSuppliers,
          orders: parsed.orders || initialOrders,
          invoices: parsed.invoices || initialInvoices,
          payments: parsed.payments || initialPayments,
          purchases: parsed.purchases || initialPurchases,
          supplierPayments: parsed.supplierPayments || initialSupplierPayments,
          expenses: parsed.expenses || initialExpenses,
          auditLogs: parsed.auditLogs || initialAuditLogs
        };
      }
    } catch (err) {
      console.error('Error reading database file, initializing with seeds:', err);
    }

    const initialData: FarmDatabaseSchema = {
      settings: initialSettings,
      users: initialUsers,
      products: initialProducts,
      batches: initialBatches,
      harvests: initialHarvests,
      lots: initialLots,
      movements: initialMovements,
      customers: initialCustomers,
      suppliers: initialSuppliers,
      orders: initialOrders,
      invoices: initialInvoices,
      payments: initialPayments,
      purchases: initialPurchases,
      supplierPayments: initialSupplierPayments,
      expenses: initialExpenses,
      auditLogs: initialAuditLogs
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave: FarmDatabaseSchema = this.data): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to write database atomically:', err);
    }
  }

  public logAudit(
    userName: string,
    userRole: User['role'],
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    summary: string,
    details?: Record<string, any>
  ): void {
    const log: AuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userName,
      userRole,
      action,
      entityType,
      entityId,
      summary,
      details
    };
    this.data.auditLogs.unshift(log);
    // Keep max 1000 logs
    if (this.data.auditLogs.length > 1000) {
      this.data.auditLogs.pop();
    }
    this.saveData();
  }

  // --- Settings ---
  public getSettings(): BusinessSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<BusinessSettings>, performedBy: string): BusinessSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.logAudit(performedBy, 'owner', 'UPDATE', 'CUSTOMER', 'SETTINGS', 'Updated business settings');
    this.saveData();
    return this.data.settings;
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public authenticate(username: string, pin: string): User | null {
    const user = this.data.users.find(u => u.username === username && u.pin === pin && u.active);
    return user || null;
  }

  // --- Products ---
  public getProducts(): Product[] {
    return this.data.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(product: Omit<Product, 'id'>, performedBy: string): Product {
    const newId = `PRD-${String(this.data.products.length + 1).padStart(2, '0')}`;
    const newProduct: Product = {
      ...product,
      id: newId,
      currentStockKg: product.currentStockKg || 0,
      reservedStockKg: 0
    };
    this.data.products.push(newProduct);
    this.logAudit(performedBy, 'manager', 'CREATE', 'STOCK', newId, `Added new product: ${newProduct.name}`);
    this.saveData();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>, performedBy: string): Product {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.logAudit(performedBy, 'manager', 'UPDATE', 'STOCK', id, `Updated product ${id}`);
    this.saveData();
    return this.data.products[index];
  }

  // --- Batches & Cultivation ---
  public getBatches(): CultivationBatch[] {
    return this.data.batches;
  }

  public createBatch(batchData: Omit<CultivationBatch, 'id' | 'createdAt' | 'updatedAt' | 'totalHarvestedKg' | 'costPerKgPaise' | 'yieldPerBagKg' | 'biologicalEfficiencyPct'>, performedBy: string): CultivationBatch {
    const count = this.data.batches.length + 10;
    const newId = `BATCH-2026-OY-${count}`;
    const now = new Date().toISOString();
    
    const totalCostPaise = 
      (batchData.spawnCostPaise || 0) +
      (batchData.strawCostPaise || 0) +
      (batchData.labourExpensePaise || 0) +
      (batchData.electricityWaterExpensePaise || 0) +
      (batchData.packagingOtherExpensePaise || 0);

    const newBatch: CultivationBatch = {
      ...batchData,
      id: newId,
      totalCostPaise,
      totalHarvestedKg: 0,
      costPerKgPaise: 0,
      yieldPerBagKg: 0,
      biologicalEfficiencyPct: 0,
      createdAt: now,
      updatedAt: now
    };

    this.data.batches.unshift(newBatch);

    // Also record initial expense entries if desired
    if (batchData.strawCostPaise > 0) {
      this.createExpense({
        date: batchData.bagPrepDate || now.split('T')[0],
        category: 'Straw & Substrate',
        amountPaise: batchData.strawCostPaise,
        payee: `Substrate for ${newId}`,
        paymentMode: 'cash',
        isOpex: true,
        isCapital: false,
        notes: `Paddy/wheat straw for batch ${newId}`,
        recordedBy: performedBy
      }, performedBy, false);
    }

    if (batchData.spawnCostPaise > 0) {
      this.createExpense({
        date: batchData.inoculationDate || now.split('T')[0],
        category: 'Spawn',
        amountPaise: batchData.spawnCostPaise,
        payee: batchData.spawnSupplier || `Spawn for ${newId}`,
        paymentMode: 'upi',
        isOpex: true,
        isCapital: false,
        notes: `Spawn bottles for batch ${newId}`,
        recordedBy: performedBy
      }, performedBy, false);
    }

    this.logAudit(performedBy, 'manager', 'CREATE', 'BATCH', newId, `Initiated cultivation batch ${newId} with ${newBatch.bagCount} bags`);
    this.saveData();
    return newBatch;
  }

  public updateBatch(id: string, updates: Partial<CultivationBatch>, performedBy: string): CultivationBatch {
    const index = this.data.batches.findIndex(b => b.id === id);
    if (index === -1) throw new Error('Batch not found');
    const existing = this.data.batches[index];
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Recompute total cost
    updated.totalCostPaise = 
      (updated.spawnCostPaise || 0) +
      (updated.strawCostPaise || 0) +
      (updated.labourExpensePaise || 0) +
      (updated.electricityWaterExpensePaise || 0) +
      (updated.packagingOtherExpensePaise || 0);

    // Recompute metrics if harvests exist
    if (updated.totalHarvestedKg > 0) {
      updated.costPerKgPaise = Math.round(updated.totalCostPaise / updated.totalHarvestedKg);
      updated.yieldPerBagKg = Number((updated.totalHarvestedKg / (updated.bagCount || 1)).toFixed(2));
      if (updated.strawQtyKg > 0) {
        updated.biologicalEfficiencyPct = Number(((updated.totalHarvestedKg / updated.strawQtyKg) * 100).toFixed(1));
      }
    }

    this.data.batches[index] = updated;
    this.logAudit(performedBy, 'manager', 'UPDATE', 'BATCH', id, `Updated batch ${id}`);
    this.saveData();
    return updated;
  }

  // --- Harvests & Automatic Stock Addition ---
  public getHarvests(): Harvest[] {
    return this.data.harvests;
  }

  public recordHarvest(
    harvestData: Omit<Harvest, 'id' | 'createdAt' | 'lotId'>,
    performedBy: string,
    targetProductId?: string
  ): { harvest: Harvest; lot: InventoryLot } {
    const harvestId = `HRV-2026-${String(this.data.harvests.length + 101).padStart(3, '0')}`;
    const now = new Date().toISOString();

    // Find the batch
    const batchIndex = this.data.batches.findIndex(b => b.id === harvestData.batchId);
    if (batchIndex === -1) throw new Error('Referenced cultivation batch not found');
    const batch = this.data.batches[batchIndex];

    // Identify corresponding product
    let product = this.data.products.find(p => p.id === targetProductId);
    if (!product) {
      // Find by variety
      product = this.data.products.find(p => p.variety === batch.variety && p.type === 'fresh') || this.data.products[0];
    }

    // Shelf life for fresh oyster is usually 4-5 days
    const harvestDateObj = new Date(harvestData.harvestDate || now.split('T')[0]);
    const expiryDateObj = new Date(harvestDateObj);
    expiryDateObj.setDate(expiryDateObj.getDate() + (product.shelfLifeDays || 5));
    const expiryDateStr = expiryDateObj.toISOString().split('T')[0];

    const lotNumber = `LOT-${batch.id.replace('BATCH-2026-', '')}-F${harvestData.flushNumber}-${harvestData.harvestDate.replace(/-/g, '').slice(4)}`;
    const lotId = `LOT-${Date.now().toString().slice(-6)}`;

    // Create FIFO Inventory Lot
    const newLot: InventoryLot = {
      id: lotId,
      productId: product.id,
      batchId: batch.id,
      harvestId,
      lotNumber,
      harvestDate: harvestData.harvestDate,
      expiryDate: expiryDateStr,
      initialQtyKg: harvestData.quantityKg,
      remainingQtyKg: harvestData.quantityKg,
      reservedQtyKg: 0,
      storageLocation: 'Cold Room (4°C)',
      status: 'available'
    };

    const newHarvest: Harvest = {
      ...harvestData,
      id: harvestId,
      lotId,
      createdAt: now
    };

    // Update batch totals
    batch.totalHarvestedKg = Number((batch.totalHarvestedKg + harvestData.quantityKg).toFixed(2));
    if (batch.status === 'Colonization' || batch.status === 'Inoculation') {
      batch.status = 'Fruiting';
    }
    batch.yieldPerBagKg = Number((batch.totalHarvestedKg / (batch.bagCount || 1)).toFixed(2));
    if (batch.strawQtyKg > 0) {
      batch.biologicalEfficiencyPct = Number(((batch.totalHarvestedKg / batch.strawQtyKg) * 100).toFixed(1));
    }
    if (batch.totalHarvestedKg > 0) {
      batch.costPerKgPaise = Math.round(batch.totalCostPaise / batch.totalHarvestedKg);
    }
    batch.updatedAt = now;

    // Update Product Stock
    const prevStock = product.currentStockKg;
    product.currentStockKg = Number((product.currentStockKg + harvestData.quantityKg).toFixed(2));

    // Record Stock Movement
    const movement: InventoryMovement = {
      id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: now,
      productId: product.id,
      productName: product.name,
      lotId,
      type: 'HARVEST',
      changeQtyKg: harvestData.quantityKg,
      previousStockKg: prevStock,
      newStockKg: product.currentStockKg,
      referenceId: harvestId,
      notes: `Flush ${harvestData.flushNumber} harvested from ${batch.id}. ${harvestData.grade}.`,
      performedBy
    };

    this.data.harvests.unshift(newHarvest);
    this.data.lots.unshift(newLot);
    this.data.movements.unshift(movement);

    this.logAudit(
      performedBy,
      'staff',
      'CREATE',
      'HARVEST',
      harvestId,
      `Recorded harvest: ${harvestData.quantityKg} kg from ${batch.id} (Flush ${harvestData.flushNumber})`
    );

    this.saveData();
    return { harvest: newHarvest, lot: newLot };
  }

  // --- Inventory Lots & Movements (FIFO) ---
  public getLots(): InventoryLot[] {
    return this.data.lots;
  }

  public getMovements(): InventoryMovement[] {
    return this.data.movements;
  }

  public manualStockAdjustment(
    productId: string,
    lotId: string | undefined,
    adjustmentKg: number,
    type: 'DAMAGE' | 'EXPIRED' | 'MANUAL_ADJUSTMENT',
    reason: string,
    performedBy: string
  ): void {
    const product = this.data.products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');

    const prevStock = product.currentStockKg;
    const newStock = Number((prevStock + adjustmentKg).toFixed(2));
    if (newStock < 0) {
      throw new Error(`Cannot reduce stock below 0 kg (Current: ${prevStock}kg, Adjustment: ${adjustmentKg}kg)`);
    }

    product.currentStockKg = newStock;

    if (lotId) {
      const lot = this.data.lots.find(l => l.id === lotId);
      if (lot) {
        lot.remainingQtyKg = Math.max(0, Number((lot.remainingQtyKg + adjustmentKg).toFixed(2)));
        if (lot.remainingQtyKg === 0) lot.status = 'depleted';
      }
    }

    const movement: InventoryMovement = {
      id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      productId: product.id,
      productName: product.name,
      lotId,
      type,
      changeQtyKg: adjustmentKg,
      previousStockKg: prevStock,
      newStockKg: newStock,
      notes: reason,
      performedBy
    };

    this.data.movements.unshift(movement);
    this.logAudit(
      performedBy,
      'manager',
      'STOCK_DEDUCT',
      'STOCK',
      productId,
      `Stock adjustment (${type}): ${adjustmentKg > 0 ? '+' : ''}${adjustmentKg} kg for ${product.name}. Reason: ${reason}`
    );

    this.saveData();
  }

  // --- Orders & Delivery FIFO Deduction ---
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public createOrder(
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'stockDeducted' | 'invoiceId'>,
    performedBy: string
  ): Order {
    const orderNum = this.data.orders.length + 101;
    const orderId = `YOF-ORD-2026-${orderNum}`;
    const invoiceId = `INV-2026-${orderNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      invoiceId,
      stockDeducted: false,
      createdAt: now,
      updatedAt: now
    };

    // If advance payment was made, record payment entry
    if (orderData.advancePaidPaise > 0) {
      const payId = `PAY-2026-${String(this.data.payments.length + 101).padStart(3, '0')}`;
      const payment: Payment = {
        id: payId,
        orderId,
        invoiceId,
        customerId: orderData.customerId,
        customerName: orderData.customerName,
        amountPaise: orderData.advancePaidPaise,
        paymentDate: orderData.orderDate,
        method: orderData.paymentMethod,
        recordedBy: performedBy,
        notes: `Advance payment for order ${orderId}`,
        createdAt: now
      };
      this.data.payments.unshift(payment);
    }

    // Create corresponding Invoice
    const newInvoice: Invoice = {
      id: invoiceId,
      orderId,
      invoiceDate: orderData.orderDate,
      dueDate: orderData.expectedDeliveryDate,
      customerId: orderData.customerId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      items: orderData.items,
      subtotalPaise: orderData.subtotalPaise,
      deliveryFeePaise: orderData.deliveryChargePaise,
      discountPaise: orderData.discountPaise,
      gstRatePct: 0,
      gstAmountPaise: 0,
      totalPaise: orderData.totalPaise,
      amountPaidPaise: orderData.amountPaidPaise,
      balancePaise: orderData.remainingDuePaise,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      notes: orderData.staffNotes || 'Thank you for supporting Yamuna Organic Farms!',
      createdAt: now
    };
    this.data.invoices.unshift(newInvoice);

    // Update customer stats
    const customer = this.data.customers.find(c => c.id === orderData.customerId);
    if (customer) {
      customer.totalOrders += 1;
      customer.totalPurchasesPaise += orderData.totalPaise;
      customer.totalPaidPaise += orderData.amountPaidPaise;
      customer.balancePaise += orderData.remainingDuePaise;
      customer.lastOrderDate = orderData.orderDate;
    }

    this.data.orders.unshift(newOrder);

    // If order was created directly as 'Delivered', perform stock deduction immediately
    if (newOrder.status === 'Delivered') {
      this.deductStockForOrder(newOrder, performedBy);
    }

    this.logAudit(
      performedBy,
      'staff',
      'CREATE',
      'ORDER',
      orderId,
      `Created order ${orderId} for ${orderData.customerName} (₹${(orderData.totalPaise / 100).toFixed(2)})`
    );

    this.saveData();
    return newOrder;
  }

  /**
   * Safe FIFO Stock Deduction when Order is Delivered.
   * Prevents duplicate deduction if called multiple times!
   */
  public deductStockForOrder(order: Order, performedBy: string): void {
    if (order.stockDeducted) {
      return; // Already deducted! No duplicate deduction.
    }

    const now = new Date().toISOString();

    for (const item of order.items) {
      const product = this.data.products.find(p => p.id === item.productId);
      if (!product) continue;

      let remainingToDeduct = item.quantityKg;
      const prevProductStock = product.currentStockKg;

      // Deduct from FIFO lots for this product (sorted by harvestDate ASC)
      const availableLots = this.data.lots
        .filter(l => l.productId === item.productId && l.remainingQtyKg > 0)
        .sort((a, b) => new Date(a.harvestDate).getTime() - new Date(b.harvestDate).getTime());

      const itemAllocations: Array<{ lotId: string; lotNumber: string; qtyKg: number }> = [];

      for (const lot of availableLots) {
        if (remainingToDeduct <= 0) break;

        const deductFromLot = Math.min(lot.remainingQtyKg, remainingToDeduct);
        lot.remainingQtyKg = Number((lot.remainingQtyKg - deductFromLot).toFixed(2));
        remainingToDeduct = Number((remainingToDeduct - deductFromLot).toFixed(2));

        if (lot.remainingQtyKg === 0) {
          lot.status = 'depleted';
        }

        itemAllocations.push({
          lotId: lot.id,
          lotNumber: lot.lotNumber,
          qtyKg: deductFromLot
        });

        // Record stock movement for this lot
        this.data.movements.unshift({
          id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: now,
          productId: product.id,
          productName: product.name,
          lotId: lot.id,
          type: 'SALE',
          changeQtyKg: -deductFromLot,
          previousStockKg: prevProductStock,
          newStockKg: Math.max(0, Number((prevProductStock - deductFromLot).toFixed(2))),
          referenceId: order.id,
          notes: `FIFO dispatch from lot ${lot.lotNumber} for ${order.id} (${order.customerName})`,
          performedBy
        });
      }

      item.allocatedLots = itemAllocations;

      // Reduce total product stock
      product.currentStockKg = Math.max(0, Number((product.currentStockKg - item.quantityKg).toFixed(2)));
    }

    order.stockDeducted = true;
    order.actualDeliveryDate = order.actualDeliveryDate || now.split('T')[0];

    this.logAudit(
      performedBy,
      'staff',
      'STOCK_DEDUCT',
      'ORDER',
      order.id,
      `Delivered ${order.id}: Deducted stock via FIFO for ${order.items.map(i => `${i.quantityKg}kg ${i.productName}`).join(', ')}`
    );

    this.saveData();
  }

  public updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    performedBy: string,
    reason?: string,
    deliveryStatus?: string
  ): Order {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    const previousStatus = order.status;
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (deliveryStatus) {
      order.deliveryStatus = deliveryStatus;
    }

    // Case 1: Transitioning to Delivered
    if (newStatus === 'Delivered' && !order.stockDeducted) {
      this.deductStockForOrder(order, performedBy);
    }

    // Case 2: Transitioning to Cancelled
    if (newStatus === 'Cancelled') {
      order.cancellationDate = new Date().toISOString().split('T')[0];
      order.cancellationReason = reason || 'Order cancelled by customer or staff';
      
      // If stock was already deducted, restore it!
      if (order.stockDeducted) {
        this.restoreStockForOrder(order, performedBy, 'Restocked due to order cancellation');
        order.stockDeducted = false;
      }

      // Revert customer balance
      const customer = this.data.customers.find(c => c.id === order.customerId);
      if (customer) {
        customer.totalPurchasesPaise = Math.max(0, customer.totalPurchasesPaise - order.totalPaise);
        customer.balancePaise = Math.max(0, customer.balancePaise - order.remainingDuePaise);
      }

      this.logAudit(
        performedBy,
        'manager',
        'CANCEL',
        'ORDER',
        order.id,
        `Cancelled order ${order.id}. Reason: ${order.cancellationReason}`
      );
    }

    // Case 3: Transitioning to Returned
    if (newStatus === 'Returned') {
      order.returnDate = new Date().toISOString().split('T')[0];
      order.returnReason = reason || 'Customer returned delivery';
      order.restockedOnReturn = true;

      // Restore stock
      if (order.stockDeducted) {
        this.restoreStockForOrder(order, performedBy, `Restocked returned items from ${order.id}`);
        order.stockDeducted = false;
      }

      // Adjust customer balance
      const customer = this.data.customers.find(c => c.id === order.customerId);
      if (customer) {
        customer.totalPurchasesPaise = Math.max(0, customer.totalPurchasesPaise - order.totalPaise);
        customer.balancePaise = Math.max(0, customer.balancePaise - order.remainingDuePaise);
      }

      this.logAudit(
        performedBy,
        'manager',
        'RETURN',
        'ORDER',
        order.id,
        `Processed return for ${order.id}. Reason: ${order.returnReason}`
      );
    }

    // Sync Invoice Status
    if (order.invoiceId) {
      const invoice = this.data.invoices.find(inv => inv.id === order.invoiceId);
      if (invoice) {
        invoice.paymentStatus = order.paymentStatus;
      }
    }

    this.logAudit(
      performedBy,
      'staff',
      'STATUS_CHANGE',
      'ORDER',
      order.id,
      `Status changed from ${previousStatus} to ${newStatus} for ${order.id}`
    );

    this.saveData();
    return order;
  }

  private restoreStockForOrder(order: Order, performedBy: string, reason: string): void {
    const now = new Date().toISOString();
    for (const item of order.items) {
      const product = this.data.products.find(p => p.id === item.productId);
      if (!product) continue;

      const prevStock = product.currentStockKg;
      product.currentStockKg = Number((product.currentStockKg + item.quantityKg).toFixed(2));

      // Put back into newest available lot or latest lot
      const lot = this.data.lots.find(l => l.productId === item.productId);
      if (lot) {
        lot.remainingQtyKg = Number((lot.remainingQtyKg + item.quantityKg).toFixed(2));
        lot.status = 'available';
      }

      this.data.movements.unshift({
        id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: now,
        productId: product.id,
        productName: product.name,
        type: 'RETURN',
        changeQtyKg: item.quantityKg,
        previousStockKg: prevStock,
        newStockKg: product.currentStockKg,
        referenceId: order.id,
        notes: reason,
        performedBy
      });
    }
  }

  public recordOrderPayment(
    orderId: string,
    amountPaise: number,
    method: Order['paymentMethod'],
    performedBy: string,
    transactionRef?: string,
    notes?: string
  ): { order: Order; payment: Payment } {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');

    if (amountPaise <= 0) throw new Error('Payment amount must be greater than zero');
    if (amountPaise > order.remainingDuePaise) {
      throw new Error(`Payment ₹${(amountPaise / 100).toFixed(2)} exceeds remaining balance ₹${(order.remainingDuePaise / 100).toFixed(2)}`);
    }

    const now = new Date().toISOString();
    const payId = `PAY-2026-${String(this.data.payments.length + 101).padStart(3, '0')}`;

    const newPayment: Payment = {
      id: payId,
      orderId: order.id,
      invoiceId: order.invoiceId,
      customerId: order.customerId,
      customerName: order.customerName,
      amountPaise,
      paymentDate: now.split('T')[0],
      method,
      transactionRef,
      recordedBy: performedBy,
      notes: notes || `Payment against order ${order.id}`,
      createdAt: now
    };

    order.amountPaidPaise += amountPaise;
    order.remainingDuePaise = Math.max(0, order.totalPaise - order.amountPaidPaise);

    if (order.remainingDuePaise === 0) {
      order.paymentStatus = 'paid';
    } else {
      order.paymentStatus = 'partial';
    }

    // Update Invoice
    if (order.invoiceId) {
      const invoice = this.data.invoices.find(inv => inv.id === order.invoiceId);
      if (invoice) {
        invoice.amountPaidPaise = order.amountPaidPaise;
        invoice.balancePaise = order.remainingDuePaise;
        invoice.paymentStatus = order.paymentStatus;
      }
    }

    // Update Customer Balance
    const customer = this.data.customers.find(c => c.id === order.customerId);
    if (customer) {
      customer.totalPaidPaise += amountPaise;
      customer.balancePaise = Math.max(0, customer.balancePaise - amountPaise);
    }

    this.data.payments.unshift(newPayment);

    this.logAudit(
      performedBy,
      'manager',
      'PAYMENT',
      'PAYMENT',
      payId,
      `Recorded payment ₹${(amountPaise / 100).toFixed(2)} for ${order.id} via ${method}`
    );

    this.saveData();
    return { order, payment: newPayment };
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    return this.data.customers;
  }

  public createCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalPurchasesPaise' | 'totalPaidPaise' | 'balancePaise'>, performedBy: string): Customer {
    const newId = `CUST-${String(this.data.customers.length + 1).padStart(2, '0')}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
      totalOrders: 0,
      totalPurchasesPaise: 0,
      totalPaidPaise: 0,
      balancePaise: 0,
      createdAt: new Date().toISOString()
    };
    this.data.customers.push(newCustomer);
    this.logAudit(performedBy, 'staff', 'CREATE', 'CUSTOMER', newId, `Added customer: ${newCustomer.name}`);
    this.saveData();
    return newCustomer;
  }

  public updateCustomer(id: string, updates: Partial<Customer>, performedBy: string): Customer {
    const index = this.data.customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    this.data.customers[index] = { ...this.data.customers[index], ...updates };
    this.logAudit(performedBy, 'manager', 'UPDATE', 'CUSTOMER', id, `Updated customer ${id}`);
    this.saveData();
    return this.data.customers[index];
  }

  // --- Suppliers & Purchases ---
  public getSuppliers(): Supplier[] {
    return this.data.suppliers;
  }

  public createSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'totalPurchasesPaise' | 'totalPaidPaise' | 'balancePaise'>, performedBy: string): Supplier {
    const newId = `SUP-${String(this.data.suppliers.length + 1).padStart(2, '0')}`;
    const newSupplier: Supplier = {
      ...supplierData,
      id: newId,
      totalPurchasesPaise: 0,
      totalPaidPaise: 0,
      balancePaise: 0,
      createdAt: new Date().toISOString()
    };
    this.data.suppliers.push(newSupplier);
    this.logAudit(performedBy, 'manager', 'CREATE', 'SUPPLIER', newId, `Added supplier: ${newSupplier.name}`);
    this.saveData();
    return newSupplier;
  }

  public getPurchases(): Purchase[] {
    return this.data.purchases;
  }

  public createPurchase(purchaseData: Omit<Purchase, 'id' | 'createdAt'>, performedBy: string): Purchase {
    const newId = `PO-2026-${String(this.data.purchases.length + 51).padStart(3, '0')}`;
    const now = new Date().toISOString();

    const newPurchase: Purchase = {
      ...purchaseData,
      id: newId,
      createdAt: now
    };

    const supplier = this.data.suppliers.find(s => s.id === purchaseData.supplierId);
    if (supplier) {
      supplier.totalPurchasesPaise += purchaseData.totalAmountPaise;
      supplier.totalPaidPaise += purchaseData.amountPaidPaise;
      supplier.balancePaise += purchaseData.balancePaise;
    }

    if (purchaseData.amountPaidPaise > 0) {
      const spayId = `SPAY-2026-${String(this.data.supplierPayments.length + 41).padStart(3, '0')}`;
      this.data.supplierPayments.unshift({
        id: spayId,
        purchaseId: newId,
        supplierId: purchaseData.supplierId,
        supplierName: purchaseData.supplierName,
        amountPaise: purchaseData.amountPaidPaise,
        date: purchaseData.date,
        method: 'cash',
        notes: `Initial payment for purchase ${newId}`,
        recordedBy: performedBy,
        createdAt: now
      });
    }

    this.data.purchases.unshift(newPurchase);
    this.logAudit(performedBy, 'manager', 'CREATE', 'PURCHASE', newId, `Recorded supplier purchase ${newId} (₹${(purchaseData.totalAmountPaise / 100).toFixed(2)})`);
    this.saveData();
    return newPurchase;
  }

  public recordSupplierPayment(
    supplierId: string,
    purchaseId: string | undefined,
    amountPaise: number,
    method: Order['paymentMethod'],
    performedBy: string,
    transactionRef?: string,
    notes?: string
  ): SupplierPayment {
    const supplier = this.data.suppliers.find(s => s.id === supplierId);
    if (!supplier) throw new Error('Supplier not found');

    const now = new Date().toISOString();
    const spayId = `SPAY-2026-${String(this.data.supplierPayments.length + 41).padStart(3, '0')}`;

    const newPayment: SupplierPayment = {
      id: spayId,
      purchaseId,
      supplierId,
      supplierName: supplier.name,
      amountPaise,
      date: now.split('T')[0],
      method,
      transactionRef,
      notes: notes || `Payment to ${supplier.name}`,
      recordedBy: performedBy,
      createdAt: now
    };

    supplier.totalPaidPaise += amountPaise;
    supplier.balancePaise = Math.max(0, supplier.balancePaise - amountPaise);

    if (purchaseId) {
      const purchase = this.data.purchases.find(p => p.id === purchaseId);
      if (purchase) {
        purchase.amountPaidPaise += amountPaise;
        purchase.balancePaise = Math.max(0, purchase.totalAmountPaise - purchase.amountPaidPaise);
        purchase.paymentStatus = purchase.balancePaise === 0 ? 'paid' : 'partial';
      }
    }

    this.data.supplierPayments.unshift(newPayment);
    this.logAudit(performedBy, 'owner', 'PAYMENT', 'PURCHASE', spayId, `Paid supplier ${supplier.name}: ₹${(amountPaise / 100).toFixed(2)}`);
    this.saveData();
    return newPayment;
  }

  public getSupplierPayments(): SupplierPayment[] {
    return this.data.supplierPayments;
  }

  // --- Expenses ---
  public getExpenses(): Expense[] {
    return this.data.expenses;
  }

  public createExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>, performedBy: string, save = true): Expense {
    const newId = `EXP-2026-${String(this.data.expenses.length + 101).padStart(3, '0')}`;
    const newExpense: Expense = {
      ...expenseData,
      id: newId,
      createdAt: new Date().toISOString()
    };
    this.data.expenses.unshift(newExpense);
    this.logAudit(performedBy, 'manager', 'CREATE', 'EXPENSE', newId, `Recorded expense ${newId}: ₹${(expenseData.amountPaise / 100).toFixed(2)} (${expenseData.category})`);
    if (save) this.saveData();
    return newExpense;
  }

  // --- Invoices & Payments ---
  public getInvoices(): Invoice[] {
    return this.data.invoices;
  }

  public getPayments(): Payment[] {
    return this.data.payments;
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  // --- Dashboard Real-Time Metrics ---
  public getDashboardMetrics(): DashboardMetrics {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Start of this week (Monday)
    const dayOfWeek = now.getDay() || 7;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    // Start of this month
    const startOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    let salesTodayPaise = 0;
    let salesThisWeekPaise = 0;
    let salesThisMonthPaise = 0;
    let salesAllTimePaise = 0;
    let totalKgSold = 0;

    const ordersByStatus: Record<OrderStatus, number> = {
      'New': 0,
      'Confirmed': 0,
      'Preparing': 0,
      'Ready for Dispatch': 0,
      'Dispatched': 0,
      'Delivered': 0,
      'Cancelled': 0,
      'Returned': 0
    };

    let upcomingDeliveriesCount = 0;
    let overdueOrdersCount = 0;

    for (const order of this.data.orders) {
      if (ordersByStatus[order.status] !== undefined) {
        ordersByStatus[order.status] += 1;
      }

      // Overdue check: expectedDeliveryDate < today and status not Delivered/Cancelled/Returned
      if (
        order.expectedDeliveryDate < todayStr &&
        order.status !== 'Delivered' &&
        order.status !== 'Cancelled' &&
        order.status !== 'Returned'
      ) {
        overdueOrdersCount += 1;
      }

      // Upcoming delivery check: expectedDeliveryDate >= today and pending delivery
      if (
        order.expectedDeliveryDate >= todayStr &&
        (order.status === 'Confirmed' || order.status === 'Preparing' || order.status === 'Ready for Dispatch' || order.status === 'Dispatched')
      ) {
        upcomingDeliveriesCount += 1;
      }

      // Realized Sales are strictly for Delivered orders (excluding cancelled & returned)
      if (order.status === 'Delivered') {
        salesAllTimePaise += order.totalPaise;

        const orderDeliveryDate = order.actualDeliveryDate || order.orderDate;
        if (orderDeliveryDate === todayStr) {
          salesTodayPaise += order.totalPaise;
        }
        if (orderDeliveryDate >= startOfWeekStr) {
          salesThisWeekPaise += order.totalPaise;
        }
        if (orderDeliveryDate >= startOfMonthStr) {
          salesThisMonthPaise += order.totalPaise;
        }

        // Sum kg sold
        for (const item of order.items) {
          totalKgSold += item.quantityKg;
        }
      }
    }

    // Available Stock
    let availableStockKg = 0;
    let reservedStockKg = 0;
    let lowStockItemsCount = 0;

    for (const product of this.data.products) {
      availableStockKg += product.currentStockKg;
      reservedStockKg += product.reservedStockKg || 0;
      if (product.currentStockKg <= product.minStockThresholdKg) {
        lowStockItemsCount += 1;
      }
    }

    // Production this month (sum of harvests this month)
    let productionThisMonthKg = 0;
    for (const harvest of this.data.harvests) {
      if (harvest.harvestDate >= startOfMonthStr) {
        productionThisMonthKg += harvest.quantityKg;
      }
    }

    // Total actual money received from customers
    let totalReceivedPaise = 0;
    for (const payment of this.data.payments) {
      totalReceivedPaise += payment.amountPaise;
    }

    // Outstanding customer payments (Receivables)
    let totalReceivablesPaise = 0;
    for (const customer of this.data.customers) {
      totalReceivablesPaise += customer.balancePaise;
    }

    // Outstanding supplier payables
    let totalSupplierPayablesPaise = 0;
    for (const supplier of this.data.suppliers) {
      totalSupplierPayablesPaise += supplier.balancePaise;
    }

    // Expenses calculation
    let totalExpensesPaise = 0;
    let operatingExpensesPaise = 0;

    for (const expense of this.data.expenses) {
      totalExpensesPaise += expense.amountPaise;
      if (expense.isOpex) {
        operatingExpensesPaise += expense.amountPaise;
      }
    }

    // Cost of Goods Sold (COGS): average cost per kg * total kg sold
    // If average batch cost is ~₹20/kg = 2000 paise/kg
    const avgCostPerKgPaise = 2000;
    const costOfGoodsSoldPaise = Math.round(totalKgSold * avgCostPerKgPaise);

    const grossProfitPaise = salesAllTimePaise - costOfGoodsSoldPaise;
    const netProfitPaise = grossProfitPaise - operatingExpensesPaise;

    // Expiring lots check (within 48 hours)
    const inTwoDays = new Date();
    inTwoDays.setDate(now.getDate() + 2);
    const inTwoDaysStr = inTwoDays.toISOString().split('T')[0];

    let expiringLotsCount = 0;
    for (const lot of this.data.lots) {
      if (lot.remainingQtyKg > 0 && lot.expiryDate <= inTwoDaysStr) {
        expiringLotsCount += 1;
      }
    }

    return {
      salesTodayPaise,
      salesThisWeekPaise,
      salesThisMonthPaise,
      salesAllTimePaise,
      totalOrdersCount: this.data.orders.length,
      ordersByStatus,
      totalKgSold: Number(totalKgSold.toFixed(2)),
      availableStockKg: Number(availableStockKg.toFixed(2)),
      reservedStockKg: Number(reservedStockKg.toFixed(2)),
      productionThisMonthKg: Number(productionThisMonthKg.toFixed(2)),
      totalReceivedPaise,
      totalReceivablesPaise,
      totalSupplierPayablesPaise,
      totalExpensesPaise,
      operatingExpensesPaise,
      costOfGoodsSoldPaise,
      grossProfitPaise,
      netProfitPaise,
      lowStockItemsCount,
      upcomingDeliveriesCount,
      overdueOrdersCount,
      expiringLotsCount
    };
  }

  // --- Reset & Backup / Restore ---
  public getBackupJson(): FarmDatabaseSchema {
    return this.data;
  }

  public restoreBackupJson(backup: FarmDatabaseSchema, performedBy: string): void {
    if (!backup.products || !backup.orders || !backup.batches) {
      throw new Error('Invalid backup schema');
    }
    this.data = backup;
    this.saveData();
    this.logAudit(performedBy, 'owner', 'OVERRIDE', 'STOCK', 'RESTORE', 'Restored system from backup archive');
  }

  public resetToSeeds(performedBy: string): void {
    this.data = {
      settings: initialSettings,
      users: initialUsers,
      products: initialProducts,
      batches: initialBatches,
      harvests: initialHarvests,
      lots: initialLots,
      movements: initialMovements,
      customers: initialCustomers,
      suppliers: initialSuppliers,
      orders: initialOrders,
      invoices: initialInvoices,
      payments: initialPayments,
      purchases: initialPurchases,
      supplierPayments: initialSupplierPayments,
      expenses: initialExpenses,
      auditLogs: initialAuditLogs
    };
    this.saveData();
    this.logAudit(performedBy, 'owner', 'OVERRIDE', 'STOCK', 'RESET', 'Reset farm database to official seed demo dataset');
  }
}

export const farmDb = new FarmDatabase();
