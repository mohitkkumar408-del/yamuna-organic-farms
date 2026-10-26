/**
 * Yamuna Organic Farms - Business Management Types
 * Currency values are stored in paise (1 INR = 100 paise) to prevent floating-point calculation errors.
 */

export type UserRole = 'owner' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  nameHi: string;
  username: string;
  role: UserRole;
  pin: string;
  phone: string;
  active: boolean;
}

export type ProductVariety = 
  | 'Grey Oyster (Pleurotus ostreatus)'
  | 'White Oyster (Pleurotus florida)'
  | 'Pink Oyster (Pleurotus djamor)'
  | 'King Oyster (Pleurotus eryngii)'
  | 'Value-Added Processed'
  | 'Mushroom Spawn';

export type ProductType = 'fresh' | 'processed' | 'spawn';
export type UnitOfMeasurement = 'kg' | 'packet_200g' | 'pouch_100g' | 'bottle';

export interface Product {
  id: string;
  name: string;
  nameHi: string;
  variety: ProductVariety;
  type: ProductType;
  unit: UnitOfMeasurement;
  costPricePaise: number;
  sellingPricePaise: number;
  minStockThresholdKg: number;
  currentStockKg: number;
  reservedStockKg: number;
  isAvailable: boolean;
  imagePath?: string;
  shelfLifeDays: number;
  description?: string;
}

export type BatchStatus = 'Inoculation' | 'Colonization' | 'Fruiting' | 'Completed' | 'Contaminated';

export interface CultivationBatch {
  id: string; // e.g. BATCH-2026-OY-01
  variety: ProductVariety;
  spawnSupplier: string;
  spawnQtyKg: number;
  spawnCostPaise: number;
  strawType: string; // Paddy Straw / Wheat Straw
  strawQtyKg: number;
  strawCostPaise: number;
  bagCount: number;
  bagPrepDate: string; // YYYY-MM-DD
  inoculationDate: string; // YYYY-MM-DD
  expectedHarvestDate: string; // YYYY-MM-DD
  status: BatchStatus;
  contaminationBags: number;
  labourExpensePaise: number;
  electricityWaterExpensePaise: number;
  packagingOtherExpensePaise: number;
  totalCostPaise: number;
  totalHarvestedKg: number;
  costPerKgPaise: number;
  yieldPerBagKg: number;
  biologicalEfficiencyPct: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Harvest {
  id: string;
  batchId: string;
  flushNumber: number; // 1, 2, 3
  harvestDate: string; // YYYY-MM-DD
  quantityKg: number;
  grade: 'Grade A Cluster' | 'Grade B Loose' | 'Processing Grade';
  wasteKg: number;
  lotId?: string;
  recordedBy: string;
  notes: string;
  createdAt: string;
}

export interface InventoryLot {
  id: string;
  productId: string;
  batchId?: string;
  harvestId?: string;
  lotNumber: string;
  harvestDate: string;
  expiryDate: string;
  initialQtyKg: number;
  remainingQtyKg: number;
  reservedQtyKg: number;
  storageLocation: string; // e.g. Cold Room Rack 1, Drying Room Shelf A
  status: 'available' | 'low' | 'depleted' | 'expired';
}

export type InventoryMovementType = 
  | 'HARVEST' 
  | 'SALE' 
  | 'RETURN' 
  | 'DAMAGE' 
  | 'EXPIRED' 
  | 'MANUAL_ADJUSTMENT';

export interface InventoryMovement {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  lotId?: string;
  type: InventoryMovementType;
  changeQtyKg: number; // positive or negative
  previousStockKg: number;
  newStockKg: number;
  referenceId?: string; // Order ID, Batch ID, etc.
  notes: string;
  performedBy: string;
}

export type CustomerType = 'Retail' | 'Wholesale' | 'Restaurant' | 'Hotel' | 'Distributor';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  type: CustomerType;
  gstin?: string;
  totalOrders: number;
  totalPurchasesPaise: number;
  totalPaidPaise: number;
  balancePaise: number;
  lastOrderDate?: string;
  notes: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  suppliesType: string; // Spawn, Paddy Straw, Poly Bags, Racks, Misting Foggers
  totalPurchasesPaise: number;
  totalPaidPaise: number;
  balancePaise: number;
  notes: string;
  createdAt: string;
}

export type OrderStatus = 
  | 'New' 
  | 'Confirmed' 
  | 'Preparing' 
  | 'Ready for Dispatch' 
  | 'Dispatched' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Returned';

export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'credit';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variety: ProductVariety;
  quantityKg: number;
  pricePerKgPaise: number;
  discountPaise: number;
  totalPaise: number;
  allocatedLots?: Array<{
    lotId: string;
    lotNumber: string;
    qtyKg: number;
  }>;
}

export interface Order {
  id: string; // YOF-ORD-2026-101
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryType: 'Farm Pickup' | 'Dhanbad Local Delivery' | 'Wholesale Cargo / Mandi';
  orderDate: string; // YYYY-MM-DD
  expectedDeliveryDate: string; // YYYY-MM-DD
  actualDeliveryDate?: string;
  items: OrderItem[];
  subtotalPaise: number;
  deliveryChargePaise: number;
  discountPaise: number;
  totalPaise: number;
  advancePaidPaise: number;
  amountPaidPaise: number;
  remainingDuePaise: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryStatus: string;
  stockDeducted: boolean;
  cancellationReason?: string;
  cancellationDate?: string;
  returnReason?: string;
  returnDate?: string;
  restockedOnReturn?: boolean;
  staffNotes: string;
  invoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string; // INV-2026-101
  orderId: string;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerGstin?: string;
  items: OrderItem[];
  subtotalPaise: number;
  deliveryFeePaise: number;
  discountPaise: number;
  gstRatePct: number; // 0 for fresh agriculture products unless configured
  gstAmountPaise: number;
  totalPaise: number;
  amountPaidPaise: number;
  balancePaise: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId?: string;
  invoiceId?: string;
  customerId: string;
  customerName: string;
  amountPaise: number;
  paymentDate: string;
  method: PaymentMethod;
  transactionRef?: string;
  recordedBy: string;
  notes: string;
  createdAt: string;
}

export interface Purchase {
  id: string; // PO-2026-051
  supplierId: string;
  supplierName: string;
  date: string;
  category: 'Spawn' | 'Straw & Substrate' | 'Poly Bags & Packaging' | 'Equipment & Racks' | 'Other Supplies';
  itemsDescription: string;
  quantity: string;
  totalAmountPaise: number;
  amountPaidPaise: number;
  balancePaise: number;
  paymentStatus: PaymentStatus;
  receivedStatus: 'Pending' | 'Partial' | 'Received';
  invoiceOrReceiptRef?: string;
  notes: string;
  createdAt: string;
}

export interface SupplierPayment {
  id: string;
  purchaseId?: string;
  supplierId: string;
  supplierName: string;
  amountPaise: number;
  date: string;
  method: PaymentMethod;
  transactionRef?: string;
  notes: string;
  recordedBy: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Spawn'
  | 'Straw & Substrate'
  | 'Poly Bags & Packaging'
  | 'Electricity'
  | 'Water & Misting'
  | 'Labour'
  | 'Rent'
  | 'Transport & Delivery'
  | 'Equipment & Racks'
  | 'Repairs & Maintenance'
  | 'Marketing'
  | 'Spoilage & Wastage'
  | 'Owner Withdrawal'
  | 'Capital Contribution'
  | 'Other';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  customCategory?: string;
  amountPaise: number;
  payee: string;
  paymentMode: PaymentMethod;
  isOpex: boolean; // false for Owner Withdrawal & Capital Contribution
  isCapital: boolean;
  receiptAttachment?: string;
  notes: string;
  recordedBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'STATUS_CHANGE' | 'STOCK_DEDUCT' | 'CANCEL' | 'RETURN' | 'PAYMENT' | 'OVERRIDE' | 'DELETE_SOFT';
  entityType: 'ORDER' | 'STOCK' | 'HARVEST' | 'BATCH' | 'PAYMENT' | 'EXPENSE' | 'PURCHASE' | 'CUSTOMER' | 'SUPPLIER';
  entityId: string;
  summary: string;
  details?: Record<string, any>;
}

export interface BusinessSettings {
  businessName: string;
  businessNameHi: string;
  tagline: string;
  taglineHi: string;
  address: string;
  location: string;
  phone: string;
  email: string;
  upiId: string; // e.g. yamunafarms@okhdfcbank
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  gstNumber?: string;
  freshShelfLifeDays: number;
  currency: string;
  timezone: string;
}

export interface DashboardMetrics {
  salesTodayPaise: number;
  salesThisWeekPaise: number;
  salesThisMonthPaise: number;
  salesAllTimePaise: number;
  totalOrdersCount: number;
  ordersByStatus: Record<OrderStatus, number>;
  totalKgSold: number;
  availableStockKg: number;
  reservedStockKg: number;
  productionThisMonthKg: number;
  totalReceivedPaise: number;
  totalReceivablesPaise: number;
  totalSupplierPayablesPaise: number;
  totalExpensesPaise: number;
  operatingExpensesPaise: number;
  costOfGoodsSoldPaise: number;
  grossProfitPaise: number;
  netProfitPaise: number;
  lowStockItemsCount: number;
  upcomingDeliveriesCount: number;
  overdueOrdersCount: number;
  expiringLotsCount: number;
}
