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
  AuditLog
} from '../src/types/index.ts';

export const initialSettings: BusinessSettings = {
  businessName: 'Yamuna Organic Farms',
  businessNameHi: 'यमुना ऑर्गेनिक फार्म्स',
  tagline: 'Premium Oyster Mushroom Cultivation & Supply',
  taglineHi: 'शुद्ध एवं पौष्टिक ढींगरी (ऑयस्टर) मशरूम उत्पादन एवं आपूर्ति',
  location: 'Dhanbad, Jharkhand, India',
  address: 'Plot No. 42, Govindpur Road, Near BIT More, Dhanbad, Jharkhand - 828109',
  phone: '+91 94311 82740',
  email: 'info@yamunaorganicfarms.in',
  upiId: 'yamunafarms@okhdfcbank',
  accountName: 'Yamuna Organic Farms',
  bankName: 'State Bank of India, Dhanbad Main Branch',
  accountNumber: '39482019482',
  ifscCode: 'SBIN0000066',
  gstNumber: '20AABCY1948Z1Z5',
  freshShelfLifeDays: 5,
  currency: 'INR',
  timezone: 'Asia/Kolkata'
};

export const initialUsers: User[] = [
  {
    id: 'USR-01',
    name: 'Rajesh Kumar Verma',
    nameHi: 'राजेश कुमार वर्मा',
    username: 'rajesh_owner',
    role: 'owner',
    pin: '1111',
    phone: '+91 94311 82740',
    active: true
  },
  {
    id: 'USR-02',
    name: 'Priya Sharma',
    nameHi: 'प्रिया शर्मा',
    username: 'priya_mgr',
    role: 'manager',
    pin: '2222',
    phone: '+91 70045 29184',
    active: true
  },
  {
    id: 'USR-03',
    name: 'Suresh Soren',
    nameHi: 'सुरेश सोरेन',
    username: 'suresh_staff',
    role: 'staff',
    pin: '3333',
    phone: '+91 91234 56789',
    active: true
  }
];

export const initialProducts: Product[] = [
  {
    id: 'PRD-01',
    name: 'Fresh Grey Oyster Mushroom',
    nameHi: 'ताजा भूरा ढींगरी मशरूम',
    variety: 'Grey Oyster (Pleurotus ostreatus)',
    type: 'fresh',
    unit: 'kg',
    costPricePaise: 8000, // ₹80.00/kg
    sellingPricePaise: 18000, // ₹180.00/kg
    minStockThresholdKg: 15,
    currentStockKg: 52.5,
    reservedStockKg: 8.0,
    isAvailable: true,
    shelfLifeDays: 5,
    imagePath: '/src/assets/images/fresh_oyster_harvest_1793024822970.jpg',
    description: 'Freshly harvested robust Grey Oyster clusters with rich umami flavour, perfect for curries, stir-fries, and gourmet dining.'
  },
  {
    id: 'PRD-02',
    name: 'Fresh White Oyster Mushroom',
    nameHi: 'ताजा सफेद ढींगरी मशरूम',
    variety: 'White Oyster (Pleurotus florida)',
    type: 'fresh',
    unit: 'kg',
    costPricePaise: 7500, // ₹75.00/kg
    sellingPricePaise: 17000, // ₹170.00/kg
    minStockThresholdKg: 15,
    currentStockKg: 44.0,
    reservedStockKg: 5.0,
    isAvailable: true,
    shelfLifeDays: 4,
    imagePath: '/src/assets/images/fresh_oyster_harvest_1793024822970.jpg',
    description: 'Crisp, velvety snow-white oyster mushroom clusters. Tender texture with gentle mild sweet aroma.'
  },
  {
    id: 'PRD-03',
    name: 'Fresh Pink Oyster Mushroom',
    nameHi: 'ताजा गुलाबी ढींगरी मशरूम',
    variety: 'Pink Oyster (Pleurotus djamor)',
    type: 'fresh',
    unit: 'kg',
    costPricePaise: 9500, // ₹95.00/kg
    sellingPricePaise: 23000, // ₹230.00/kg
    minStockThresholdKg: 10,
    currentStockKg: 18.0,
    reservedStockKg: 2.0,
    isAvailable: true,
    shelfLifeDays: 3,
    imagePath: '/src/assets/images/fresh_oyster_harvest_1793024822970.jpg',
    description: 'Vibrant tropical pink oyster mushroom with delicate meaty texture, highly sought after by premium hotels and cafes.'
  },
  {
    id: 'PRD-04',
    name: 'Sun-Dried Organic Oyster Mushroom (100g)',
    nameHi: 'धूप में सुखाया ढींगरी मशरूम (100 ग्राम)',
    variety: 'Value-Added Processed',
    type: 'processed',
    unit: 'pouch_100g',
    costPricePaise: 6000, // ₹60.00
    sellingPricePaise: 14000, // ₹140.00
    minStockThresholdKg: 20,
    currentStockKg: 38.0, // 38 units (1 unit = 100g)
    reservedStockKg: 0,
    isAvailable: true,
    shelfLifeDays: 180,
    imagePath: '/src/assets/images/dried_oyster_products_1793024837061.jpg',
    description: 'Hygienically dehydrated oyster mushroom slices in sealed kraft zip pouches. Long shelf life, reconstitutes instantly in warm water.'
  },
  {
    id: 'PRD-05',
    name: 'Pure Oyster Mushroom Protein Powder (100g)',
    nameHi: 'शुद्ध मशरूम प्रोटीन पाउडर (100 ग्राम)',
    variety: 'Value-Added Processed',
    type: 'processed',
    unit: 'pouch_100g',
    costPricePaise: 7000, // ₹70.00
    sellingPricePaise: 16000, // ₹160.00
    minStockThresholdKg: 15,
    currentStockKg: 28.0,
    reservedStockKg: 0,
    isAvailable: true,
    shelfLifeDays: 180,
    imagePath: '/src/assets/images/dried_oyster_products_1793024837061.jpg',
    description: 'Ultra-fine 100% natural oyster mushroom powder. Superfood immunity booster rich in beta-glucans and natural plant protein.'
  },
  {
    id: 'PRD-06',
    name: 'First-Generation Wheat Grain Spawn (Bottle)',
    nameHi: 'प्रथम पीढ़ी का गेहूं बीज स्पॉन',
    variety: 'Mushroom Spawn',
    type: 'spawn',
    unit: 'bottle',
    costPricePaise: 4000, // ₹40.00
    sellingPricePaise: 8000, // ₹80.00
    minStockThresholdKg: 20,
    currentStockKg: 45.0,
    reservedStockKg: 0,
    isAvailable: true,
    shelfLifeDays: 30,
    imagePath: '/src/assets/images/yamuna_oyster_farm_hero_1793024808213.jpg',
    description: 'Pure culture laboratory certified mushroom master spawn grown on sterilized whole wheat grains for local farmers.'
  }
];

export const initialBatches: CultivationBatch[] = [
  {
    id: 'BATCH-2026-OY-10',
    variety: 'Grey Oyster (Pleurotus ostreatus)',
    spawnSupplier: 'Birsa Agricultural Spawn Lab, Ranchi',
    spawnQtyKg: 15,
    spawnCostPaise: 60000, // ₹600.00
    strawType: 'Paddy Straw (धान का पुआल)',
    strawQtyKg: 300,
    strawCostPaise: 120000, // ₹1,200.00
    bagCount: 150,
    bagPrepDate: '2026-09-20',
    inoculationDate: '2026-09-22',
    expectedHarvestDate: '2026-10-14',
    status: 'Fruiting',
    contaminationBags: 3,
    labourExpensePaise: 180000, // ₹1,800.00
    electricityWaterExpensePaise: 65000, // ₹650.00
    packagingOtherExpensePaise: 45000, // ₹450.00
    totalCostPaise: 470000, // ₹4,700.00
    totalHarvestedKg: 245.0,
    costPerKgPaise: 1918, // ~₹19.18 per kg production cost!
    yieldPerBagKg: 1.63,
    biologicalEfficiencyPct: 81.6,
    notes: 'Flourishing 2nd flush currently underway. 3 bags showed trichoderma green mold early on and were safely segregated.',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-10-24T16:30:00Z'
  },
  {
    id: 'BATCH-2026-OY-11',
    variety: 'White Oyster (Pleurotus florida)',
    spawnSupplier: 'Birsa Agricultural Spawn Lab, Ranchi',
    spawnQtyKg: 20,
    spawnCostPaise: 80000,
    strawType: 'Wheat Straw (गेहूं का भूसा)',
    strawQtyKg: 400,
    strawCostPaise: 180000,
    bagCount: 200,
    bagPrepDate: '2026-09-28',
    inoculationDate: '2026-09-30',
    expectedHarvestDate: '2026-10-20',
    status: 'Fruiting',
    contaminationBags: 2,
    labourExpensePaise: 220000,
    electricityWaterExpensePaise: 80000,
    packagingOtherExpensePaise: 50000,
    totalCostPaise: 610000, // ₹6,100.00
    totalHarvestedKg: 290.0,
    costPerKgPaise: 2103, // ~₹21.03/kg
    yieldPerBagKg: 1.45,
    biologicalEfficiencyPct: 72.5,
    notes: 'First flush completed with outstanding white cap density. Humidity maintained at 88% with ultrasonic fogger.',
    createdAt: '2026-09-28T09:30:00Z',
    updatedAt: '2026-10-25T11:00:00Z'
  },
  {
    id: 'BATCH-2026-OY-12',
    variety: 'Pink Oyster (Pleurotus djamor)',
    spawnSupplier: 'Patna BioSpawn Center',
    spawnQtyKg: 10,
    spawnCostPaise: 55000,
    strawType: 'Paddy Straw (धान का पुआल)',
    strawQtyKg: 200,
    strawCostPaise: 90000,
    bagCount: 100,
    bagPrepDate: '2026-10-06',
    inoculationDate: '2026-10-08',
    expectedHarvestDate: '2026-10-24',
    status: 'Fruiting',
    contaminationBags: 1,
    labourExpensePaise: 120000,
    electricityWaterExpensePaise: 45000,
    packagingOtherExpensePaise: 30000,
    totalCostPaise: 340000,
    totalHarvestedKg: 78.0,
    costPerKgPaise: 4358,
    yieldPerBagKg: 0.78,
    biologicalEfficiencyPct: 39.0,
    notes: 'Fast colonization (14 days). First flush harvest ongoing. Pink hue is deep and vibrant.',
    createdAt: '2026-10-06T08:00:00Z',
    updatedAt: '2026-10-26T07:00:00Z'
  },
  {
    id: 'BATCH-2026-OY-13',
    variety: 'Grey Oyster (Pleurotus ostreatus)',
    spawnSupplier: 'Birsa Agricultural Spawn Lab, Ranchi',
    spawnQtyKg: 25,
    spawnCostPaise: 100000,
    strawType: 'Paddy Straw (धान का पुआल)',
    strawQtyKg: 500,
    strawCostPaise: 200000,
    bagCount: 250,
    bagPrepDate: '2026-10-18',
    inoculationDate: '2026-10-20',
    expectedHarvestDate: '2026-11-09',
    status: 'Colonization',
    contaminationBags: 0,
    labourExpensePaise: 250000,
    electricityWaterExpensePaise: 50000,
    packagingOtherExpensePaise: 60000,
    totalCostPaise: 660000,
    totalHarvestedKg: 0,
    costPerKgPaise: 0,
    yieldPerBagKg: 0,
    biologicalEfficiencyPct: 0,
    notes: 'Currently in dark spawn-run incubation room. Uniform white mycelium spreading through 65% of bag volume.',
    createdAt: '2026-10-18T11:00:00Z',
    updatedAt: '2026-10-26T06:00:00Z'
  }
];

export const initialHarvests: Harvest[] = [
  {
    id: 'HRV-2026-081',
    batchId: 'BATCH-2026-OY-10',
    flushNumber: 1,
    harvestDate: '2026-10-14',
    quantityKg: 135.0,
    grade: 'Grade A Cluster',
    wasteKg: 4.5,
    lotId: 'LOT-OY10-F1',
    recordedBy: 'Suresh Soren',
    notes: 'Prime first flush morning harvest. Clean clusters with no sporulation.',
    createdAt: '2026-10-14T08:30:00Z'
  },
  {
    id: 'HRV-2026-088',
    batchId: 'BATCH-2026-OY-10',
    flushNumber: 2,
    harvestDate: '2026-10-22',
    quantityKg: 110.0,
    grade: 'Grade A Cluster',
    wasteKg: 3.2,
    lotId: 'LOT-OY10-F2',
    recordedBy: 'Suresh Soren',
    notes: 'Second flush after rehydration misting. Excellent cluster size.',
    createdAt: '2026-10-22T08:00:00Z'
  },
  {
    id: 'HRV-2026-092',
    batchId: 'BATCH-2026-OY-11',
    flushNumber: 1,
    harvestDate: '2026-10-21',
    quantityKg: 180.0,
    grade: 'Grade A Cluster',
    wasteKg: 5.0,
    lotId: 'LOT-OY11-F1',
    recordedBy: 'Suresh Soren',
    notes: 'White oyster heavy yield. Packed into breathable micro-perforated liners.',
    createdAt: '2026-10-21T07:45:00Z'
  },
  {
    id: 'HRV-2026-095',
    batchId: 'BATCH-2026-OY-11',
    flushNumber: 2,
    harvestDate: '2026-10-25',
    quantityKg: 110.0,
    grade: 'Grade A Cluster',
    wasteKg: 2.8,
    lotId: 'LOT-OY11-F2',
    recordedBy: 'Suresh Soren',
    notes: 'Second flush morning pick.',
    createdAt: '2026-10-25T08:15:00Z'
  },
  {
    id: 'HRV-2026-099',
    batchId: 'BATCH-2026-OY-12',
    flushNumber: 1,
    harvestDate: '2026-10-25',
    quantityKg: 78.0,
    grade: 'Grade A Cluster',
    wasteKg: 1.5,
    lotId: 'LOT-OY12-F1',
    recordedBy: 'Priya Sharma',
    notes: 'Gourmet pink oyster harvest. Refrigerated immediately at 7°C.',
    createdAt: '2026-10-25T09:00:00Z'
  }
];

export const initialLots: InventoryLot[] = [
  {
    id: 'LOT-OY10-F2',
    productId: 'PRD-01',
    batchId: 'BATCH-2026-OY-10',
    harvestId: 'HRV-2026-088',
    lotNumber: 'LOT-OY10-F2-22OCT',
    harvestDate: '2026-10-22',
    expiryDate: '2026-10-27',
    initialQtyKg: 110.0,
    remainingQtyKg: 18.5,
    reservedQtyKg: 4.0,
    storageLocation: 'Cold Room - Rack A1 (4°C)',
    status: 'available'
  },
  {
    id: 'LOT-OY11-F1',
    productId: 'PRD-02',
    batchId: 'BATCH-2026-OY-11',
    harvestId: 'HRV-2026-092',
    lotNumber: 'LOT-OY11-F1-21OCT',
    harvestDate: '2026-10-21',
    expiryDate: '2026-10-26',
    initialQtyKg: 180.0,
    remainingQtyKg: 14.0,
    reservedQtyKg: 2.0,
    storageLocation: 'Cold Room - Rack B1 (4°C)',
    status: 'low'
  },
  {
    id: 'LOT-OY11-F2',
    productId: 'PRD-02',
    batchId: 'BATCH-2026-OY-11',
    harvestId: 'HRV-2026-095',
    lotNumber: 'LOT-OY11-F2-25OCT',
    harvestDate: '2026-10-25',
    expiryDate: '2026-10-30',
    initialQtyKg: 110.0,
    remainingQtyKg: 30.0,
    reservedQtyKg: 3.0,
    storageLocation: 'Cold Room - Rack B2 (4°C)',
    status: 'available'
  },
  {
    id: 'LOT-OY12-F1',
    productId: 'PRD-03',
    batchId: 'BATCH-2026-OY-12',
    harvestId: 'HRV-2026-099',
    lotNumber: 'LOT-OY12-F1-25OCT',
    harvestDate: '2026-10-25',
    expiryDate: '2026-10-28',
    initialQtyKg: 78.0,
    remainingQtyKg: 18.0,
    reservedQtyKg: 2.0,
    storageLocation: 'Cold Room - Top Shelf (6°C)',
    status: 'available'
  },
  {
    id: 'LOT-DRY-2026-04',
    productId: 'PRD-04',
    lotNumber: 'LOT-DRY-OCT-04',
    harvestDate: '2026-10-10',
    expiryDate: '2027-04-10',
    initialQtyKg: 50.0,
    remainingQtyKg: 38.0,
    reservedQtyKg: 0,
    storageLocation: 'Processing Shed - Sealed Bin C',
    status: 'available'
  },
  {
    id: 'LOT-POW-2026-02',
    productId: 'PRD-05',
    lotNumber: 'LOT-POW-OCT-02',
    harvestDate: '2026-10-12',
    expiryDate: '2027-04-12',
    initialQtyKg: 35.0,
    remainingQtyKg: 28.0,
    reservedQtyKg: 0,
    storageLocation: 'Processing Shed - Shelf D',
    status: 'available'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'CUST-01',
    name: 'Coal Capital Grand Hotel & Restaurant',
    phone: '+91 94313 11223',
    address: 'Near Bank More, Main Road, Dhanbad - 826001',
    type: 'Hotel',
    gstin: '20AAACC1122D1Z4',
    totalOrders: 14,
    totalPurchasesPaise: 16500000, // ₹1,65,000.00
    totalPaidPaise: 14500000, // ₹1,45,000.00
    balancePaise: 2000000, // ₹20,000.00
    lastOrderDate: '2026-10-25',
    notes: 'Consistently buys 25kg Grey & 15kg White Oyster every Tuesday and Friday for continental and Chinese menu.',
    createdAt: '2026-08-10T11:00:00Z'
  },
  {
    id: 'CUST-02',
    name: 'The Yellow Chilli Restaurant',
    phone: '+91 98351 44556',
    address: 'Ozone Galleria Mall, Saraidhela, Dhanbad - 828127',
    type: 'Restaurant',
    gstin: '20BBBYC4455E1Z8',
    totalOrders: 18,
    totalPurchasesPaise: 11200000,
    totalPaidPaise: 10400000,
    balancePaise: 800000, // ₹8,000.00
    lastOrderDate: '2026-10-26',
    notes: 'Premium gourmet customer. Prefers freshly picked Pink Oyster and Grade A Grey Oyster.',
    createdAt: '2026-08-15T14:30:00Z'
  },
  {
    id: 'CUST-03',
    name: 'Purana Bazar Mandi Traders (Manoj Gupta)',
    phone: '+91 93342 98765',
    address: 'Shop No. 18, Sabzi Mandi, Purana Bazar, Dhanbad - 826001',
    type: 'Wholesale',
    totalOrders: 22,
    totalPurchasesPaise: 24500000,
    totalPaidPaise: 22500000,
    balancePaise: 2000000, // ₹20,000.00
    lastOrderDate: '2026-10-24',
    notes: 'Wholesale distributor for Dhanbad, Jharia and Katras markets. Receives crates directly at farm gate.',
    createdAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'CUST-04',
    name: 'Dr. Amitav Mukherjee',
    phone: '+91 94711 55667',
    address: 'Quarter Type V, IIT (ISM) Campus, Dhanbad - 826004',
    type: 'Retail',
    totalOrders: 8,
    totalPurchasesPaise: 880000,
    totalPaidPaise: 880000,
    balancePaise: 0,
    lastOrderDate: '2026-10-25',
    notes: 'Orders 2kg Grey Oyster and 2 pouches of dried mushroom every alternate week. Instant UPI payment.',
    createdAt: '2026-09-02T16:00:00Z'
  },
  {
    id: 'CUST-05',
    name: 'Mrs. Sunita Singh',
    phone: '+91 97714 88990',
    address: 'Flat 302, Green Valley Apartments, Housing Colony, Dhanbad - 826001',
    type: 'Retail',
    totalOrders: 5,
    totalPurchasesPaise: 420000,
    totalPaidPaise: 420000,
    balancePaise: 0,
    lastOrderDate: '2026-10-22',
    notes: 'Health conscious family, regular buyer of Oyster mushroom powder for diabetes management.',
    createdAt: '2026-09-15T12:00:00Z'
  },
  {
    id: 'CUST-06',
    name: 'Bokaro Organic Mart & Cafe',
    phone: '+91 94315 77665',
    address: 'City Centre, Sector 4, Bokaro Steel City - 827004',
    type: 'Distributor',
    gstin: '20CCBOM7766G1Z2',
    totalOrders: 6,
    totalPurchasesPaise: 7400000,
    totalPaidPaise: 6000000,
    balancePaise: 1400000, // ₹14,000.00
    lastOrderDate: '2026-10-23',
    notes: 'Inter-district delivery via Bokaro shuttle van. Sells fresh packets and dried bags.',
    createdAt: '2026-09-18T10:00:00Z'
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'SUP-01',
    name: 'Birsa Agricultural Spawn Lab, Ranchi',
    phone: '+91 94317 22334',
    email: 'birsaspawnlab@gmail.com',
    address: 'Kanke Road, Near BAU Campus, Ranchi, Jharkhand - 834006',
    suppliesType: 'High-Purity Mushroom Spawn (Master Seed)',
    totalPurchasesPaise: 9500000,
    totalPaidPaise: 8000000,
    balancePaise: 1500000, // ₹15,000.00
    notes: 'Certified lab providing heat-tolerant Pleurotus florida and Pleurotus ostreatus wheat grain spawn.',
    createdAt: '2026-08-01T09:00:00Z'
  },
  {
    id: 'SUP-02',
    name: 'Bokaro Agro Straw & Substrate Co.',
    phone: '+91 98355 66778',
    email: 'bokarostraw@yahoo.com',
    address: 'Chas Bypass Road, Bokaro, Jharkhand - 827013',
    suppliesType: 'Paddy Straw & Wheat Straw Bales',
    totalPurchasesPaise: 7200000,
    totalPaidPaise: 6400000,
    balancePaise: 800000, // ₹8,000.00
    notes: 'Supplies golden, dry, mold-free paddy straw bales in mini truckloads directly to our farm.',
    createdAt: '2026-08-05T10:00:00Z'
  },
  {
    id: 'SUP-03',
    name: 'Dhanbad Polymer Packaging & Bags',
    phone: '+91 93348 11990',
    address: 'Industrial Area Phase 2, Govindpur, Dhanbad - 828109',
    suppliesType: 'PP Autoclavable Bags & Food Grade Pouches',
    totalPurchasesPaise: 3800000,
    totalPaidPaise: 3800000,
    balancePaise: 0,
    notes: 'Supplies 16x24 inch polypropylene cultivation bags, rubber bands, non-absorbent cotton, and kraft zip pouches.',
    createdAt: '2026-08-12T14:00:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'YOF-ORD-2026-101',
    customerId: 'CUST-01',
    customerName: 'Coal Capital Grand Hotel & Restaurant',
    customerPhone: '+91 94313 11223',
    customerAddress: 'Near Bank More, Main Road, Dhanbad - 826001',
    deliveryType: 'Dhanbad Local Delivery',
    orderDate: '2026-10-24',
    expectedDeliveryDate: '2026-10-25',
    actualDeliveryDate: '2026-10-25',
    items: [
      {
        id: 'ITEM-101-1',
        productId: 'PRD-01',
        productName: 'Fresh Grey Oyster Mushroom',
        variety: 'Grey Oyster (Pleurotus ostreatus)',
        quantityKg: 25.0,
        pricePerKgPaise: 16000, // Wholesale rate ₹160
        discountPaise: 0,
        totalPaise: 400000
      },
      {
        id: 'ITEM-101-2',
        productId: 'PRD-02',
        productName: 'Fresh White Oyster Mushroom',
        variety: 'White Oyster (Pleurotus florida)',
        quantityKg: 15.0,
        pricePerKgPaise: 15000, // Wholesale rate ₹150
        discountPaise: 0,
        totalPaise: 225000
      }
    ],
    subtotalPaise: 625000,
    deliveryChargePaise: 15000, // ₹150
    discountPaise: 20000, // ₹200 bulk discount
    totalPaise: 620000, // ₹6,200.00
    advancePaidPaise: 200000, // ₹2,000 advance
    amountPaidPaise: 620000, // Fully paid
    remainingDuePaise: 0,
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    status: 'Delivered',
    deliveryStatus: 'Delivered to Kitchen In-Charge Mr. Rakesh',
    stockDeducted: true,
    staffNotes: 'Inspected by chef. Commended the freshness and firm caps.',
    invoiceId: 'INV-2026-101',
    createdAt: '2026-10-24T10:00:00Z',
    updatedAt: '2026-10-25T11:30:00Z'
  },
  {
    id: 'YOF-ORD-2026-102',
    customerId: 'CUST-02',
    customerName: 'The Yellow Chilli Restaurant',
    customerPhone: '+91 98351 44556',
    customerAddress: 'Ozone Galleria Mall, Saraidhela, Dhanbad - 828127',
    deliveryType: 'Dhanbad Local Delivery',
    orderDate: '2026-10-25',
    expectedDeliveryDate: '2026-10-26',
    actualDeliveryDate: '2026-10-26',
    items: [
      {
        id: 'ITEM-102-1',
        productId: 'PRD-03',
        productName: 'Fresh Pink Oyster Mushroom',
        variety: 'Pink Oyster (Pleurotus djamor)',
        quantityKg: 6.0,
        pricePerKgPaise: 22000,
        discountPaise: 0,
        totalPaise: 132000
      },
      {
        id: 'ITEM-102-2',
        productId: 'PRD-01',
        productName: 'Fresh Grey Oyster Mushroom',
        variety: 'Grey Oyster (Pleurotus ostreatus)',
        quantityKg: 10.0,
        pricePerKgPaise: 17000,
        discountPaise: 0,
        totalPaise: 170000
      }
    ],
    subtotalPaise: 302000,
    deliveryChargePaise: 10000,
    discountPaise: 0,
    totalPaise: 312000, // ₹3,120.00
    advancePaidPaise: 100000,
    amountPaidPaise: 100000,
    remainingDuePaise: 212000, // ₹2,120.00 remaining
    paymentStatus: 'partial',
    paymentMethod: 'upi',
    status: 'Delivered',
    deliveryStatus: 'Delivered at service dock',
    stockDeducted: true,
    staffNotes: 'Cheque or UPI balance promised within 3 days as per their weekly cycle.',
    invoiceId: 'INV-2026-102',
    createdAt: '2026-10-25T14:00:00Z',
    updatedAt: '2026-10-26T09:15:00Z'
  },
  {
    id: 'YOF-ORD-2026-103',
    customerId: 'CUST-04',
    customerName: 'Dr. Amitav Mukherjee',
    customerPhone: '+91 94711 55667',
    customerAddress: 'Quarter Type V, IIT (ISM) Campus, Dhanbad - 826004',
    deliveryType: 'Dhanbad Local Delivery',
    orderDate: '2026-10-25',
    expectedDeliveryDate: '2026-10-26',
    items: [
      {
        id: 'ITEM-103-1',
        productId: 'PRD-01',
        productName: 'Fresh Grey Oyster Mushroom',
        variety: 'Grey Oyster (Pleurotus ostreatus)',
        quantityKg: 2.0,
        pricePerKgPaise: 18000,
        discountPaise: 0,
        totalPaise: 36000
      },
      {
        id: 'ITEM-103-2',
        productId: 'PRD-04',
        productName: 'Sun-Dried Organic Oyster Mushroom (100g)',
        variety: 'Value-Added Processed',
        quantityKg: 2.0,
        pricePerKgPaise: 14000,
        discountPaise: 0,
        totalPaise: 28000
      }
    ],
    subtotalPaise: 64000,
    deliveryChargePaise: 5000,
    discountPaise: 0,
    totalPaise: 69000, // ₹690.00
    advancePaidPaise: 69000,
    amountPaidPaise: 69000,
    remainingDuePaise: 0,
    paymentStatus: 'paid',
    paymentMethod: 'upi',
    status: 'Ready for Dispatch',
    deliveryStatus: 'Packed in thermal cool box, out for delivery this afternoon',
    stockDeducted: false,
    staffNotes: 'Call before reaching main gate security post.',
    invoiceId: 'INV-2026-103',
    createdAt: '2026-10-25T18:00:00Z',
    updatedAt: '2026-10-26T07:10:00Z'
  },
  {
    id: 'YOF-ORD-2026-104',
    customerId: 'CUST-03',
    customerName: 'Purana Bazar Mandi Traders (Manoj Gupta)',
    customerPhone: '+91 93342 98765',
    customerAddress: 'Shop No. 18, Sabzi Mandi, Purana Bazar, Dhanbad - 826001',
    deliveryType: 'Farm Pickup',
    orderDate: '2026-10-26',
    expectedDeliveryDate: '2026-10-26',
    items: [
      {
        id: 'ITEM-104-1',
        productId: 'PRD-01',
        productName: 'Fresh Grey Oyster Mushroom',
        variety: 'Grey Oyster (Pleurotus ostreatus)',
        quantityKg: 30.0,
        pricePerKgPaise: 15000,
        discountPaise: 0,
        totalPaise: 450000
      },
      {
        id: 'ITEM-104-2',
        productId: 'PRD-02',
        productName: 'Fresh White Oyster Mushroom',
        variety: 'White Oyster (Pleurotus florida)',
        quantityKg: 20.0,
        pricePerKgPaise: 14000,
        discountPaise: 0,
        totalPaise: 280000
      }
    ],
    subtotalPaise: 730000,
    deliveryChargePaise: 0,
    discountPaise: 30000,
    totalPaise: 700000, // ₹7,000.00
    advancePaidPaise: 300000,
    amountPaidPaise: 300000,
    remainingDuePaise: 400000, // ₹4,000 balance
    paymentStatus: 'partial',
    paymentMethod: 'cash',
    status: 'Preparing',
    deliveryStatus: 'Weighing and packing into 5kg ventilated plastic crates',
    stockDeducted: false,
    staffNotes: 'Manoj ji will send pickup auto around 11:30 AM.',
    invoiceId: 'INV-2026-104',
    createdAt: '2026-10-26T06:30:00Z',
    updatedAt: '2026-10-26T07:15:00Z'
  },
  {
    id: 'YOF-ORD-2026-105',
    customerId: 'CUST-05',
    customerName: 'Mrs. Sunita Singh',
    customerPhone: '+91 97714 88990',
    customerAddress: 'Flat 302, Green Valley Apartments, Housing Colony, Dhanbad - 826001',
    deliveryType: 'Dhanbad Local Delivery',
    orderDate: '2026-10-26',
    expectedDeliveryDate: '2026-10-27',
    items: [
      {
        id: 'ITEM-105-1',
        productId: 'PRD-05',
        productName: 'Pure Oyster Mushroom Protein Powder (100g)',
        variety: 'Value-Added Processed',
        quantityKg: 2.0,
        pricePerKgPaise: 16000,
        discountPaise: 0,
        totalPaise: 32000
      }
    ],
    subtotalPaise: 32000,
    deliveryChargePaise: 4000,
    discountPaise: 0,
    totalPaise: 36000, // ₹360.00
    advancePaidPaise: 0,
    amountPaidPaise: 0,
    remainingDuePaise: 36000,
    paymentStatus: 'unpaid',
    paymentMethod: 'cash',
    status: 'Confirmed',
    deliveryStatus: 'Order scheduled for morning delivery route',
    stockDeducted: false,
    staffNotes: 'Cash on delivery requested.',
    invoiceId: 'INV-2026-105',
    createdAt: '2026-10-26T07:00:00Z',
    updatedAt: '2026-10-26T07:05:00Z'
  },
  {
    id: 'YOF-ORD-2026-106',
    customerId: 'CUST-02',
    customerName: 'The Yellow Chilli Restaurant',
    customerPhone: '+91 98351 44556',
    customerAddress: 'Ozone Galleria Mall, Saraidhela, Dhanbad - 828127',
    deliveryType: 'Dhanbad Local Delivery',
    orderDate: '2026-10-20',
    expectedDeliveryDate: '2026-10-21',
    actualDeliveryDate: '2026-10-21',
    items: [
      {
        id: 'ITEM-106-1',
        productId: 'PRD-01',
        productName: 'Fresh Grey Oyster Mushroom',
        variety: 'Grey Oyster (Pleurotus ostreatus)',
        quantityKg: 10.0,
        pricePerKgPaise: 17000,
        discountPaise: 0,
        totalPaise: 170000
      }
    ],
    subtotalPaise: 170000,
    deliveryChargePaise: 10000,
    discountPaise: 0,
    totalPaise: 180000,
    advancePaidPaise: 180000,
    amountPaidPaise: 0, // Refunded on return!
    remainingDuePaise: 0,
    paymentStatus: 'unpaid',
    paymentMethod: 'upi',
    status: 'Returned',
    deliveryStatus: 'Returned on same day',
    stockDeducted: false,
    returnDate: '2026-10-21',
    returnReason: 'Private banquet at the restaurant got postponed; chef called within 1 hour and unopened crates were safely returned to farm and restocked.',
    restockedOnReturn: true,
    staffNotes: 'Advance payment of ₹1,800 refunded back via UPI.',
    createdAt: '2026-10-20T11:00:00Z',
    updatedAt: '2026-10-21T15:00:00Z'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-101',
    orderId: 'YOF-ORD-2026-101',
    invoiceDate: '2026-10-24',
    dueDate: '2026-10-25',
    customerId: 'CUST-01',
    customerName: 'Coal Capital Grand Hotel & Restaurant',
    customerPhone: '+91 94313 11223',
    customerAddress: 'Near Bank More, Main Road, Dhanbad - 826001',
    customerGstin: '20AAACC1122D1Z4',
    items: initialOrders[0].items,
    subtotalPaise: 625000,
    deliveryFeePaise: 15000,
    discountPaise: 20000,
    gstRatePct: 0,
    gstAmountPaise: 0,
    totalPaise: 620000,
    amountPaidPaise: 620000,
    balancePaise: 0,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    notes: 'Thank you for choosing Yamuna Organic Farms! Hand-picked fresh oyster mushrooms.',
    createdAt: '2026-10-24T10:05:00Z'
  },
  {
    id: 'INV-2026-102',
    orderId: 'YOF-ORD-2026-102',
    invoiceDate: '2026-10-25',
    dueDate: '2026-10-29',
    customerId: 'CUST-02',
    customerName: 'The Yellow Chilli Restaurant',
    customerPhone: '+91 98351 44556',
    customerAddress: 'Ozone Galleria Mall, Saraidhela, Dhanbad - 828127',
    customerGstin: '20BBBYC4455E1Z8',
    items: initialOrders[1].items,
    subtotalPaise: 302000,
    deliveryFeePaise: 10000,
    discountPaise: 0,
    gstRatePct: 0,
    gstAmountPaise: 0,
    totalPaise: 312000,
    amountPaidPaise: 100000,
    balancePaise: 212000,
    paymentMethod: 'upi',
    paymentStatus: 'partial',
    notes: 'Advance of ₹1,000 received. Balance ₹2,120 payable by 29 Oct.',
    createdAt: '2026-10-25T14:10:00Z'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'PAY-2026-081',
    orderId: 'YOF-ORD-2026-101',
    invoiceId: 'INV-2026-101',
    customerId: 'CUST-01',
    customerName: 'Coal Capital Grand Hotel & Restaurant',
    amountPaise: 200000,
    paymentDate: '2026-10-24',
    method: 'upi',
    transactionRef: 'UPI/2298192841/HDFC',
    recordedBy: 'Priya Sharma',
    notes: 'Advance payment upon order booking',
    createdAt: '2026-10-24T10:15:00Z'
  },
  {
    id: 'PAY-2026-082',
    orderId: 'YOF-ORD-2026-101',
    invoiceId: 'INV-2026-101',
    customerId: 'CUST-01',
    customerName: 'Coal Capital Grand Hotel & Restaurant',
    amountPaise: 420000,
    paymentDate: '2026-10-25',
    method: 'upi',
    transactionRef: 'UPI/3849102941/SBI',
    recordedBy: 'Priya Sharma',
    notes: 'Final settlement upon delivery',
    createdAt: '2026-10-25T12:00:00Z'
  },
  {
    id: 'PAY-2026-083',
    orderId: 'YOF-ORD-2026-102',
    invoiceId: 'INV-2026-102',
    customerId: 'CUST-02',
    customerName: 'The Yellow Chilli Restaurant',
    amountPaise: 100000,
    paymentDate: '2026-10-25',
    method: 'upi',
    transactionRef: 'UPI/9482019482/ICICI',
    recordedBy: 'Priya Sharma',
    notes: 'Booking advance',
    createdAt: '2026-10-25T14:30:00Z'
  },
  {
    id: 'PAY-2026-084',
    orderId: 'YOF-ORD-2026-103',
    invoiceId: 'INV-2026-103',
    customerId: 'CUST-04',
    customerName: 'Dr. Amitav Mukherjee',
    amountPaise: 69000,
    paymentDate: '2026-10-25',
    method: 'upi',
    transactionRef: 'UPI/1948201948/GPAY',
    recordedBy: 'Suresh Soren',
    notes: 'Prepaid order',
    createdAt: '2026-10-25T18:15:00Z'
  },
  {
    id: 'PAY-2026-085',
    orderId: 'YOF-ORD-2026-104',
    invoiceId: 'INV-2026-104',
    customerId: 'CUST-03',
    customerName: 'Purana Bazar Mandi Traders (Manoj Gupta)',
    amountPaise: 300000,
    paymentDate: '2026-10-26',
    method: 'cash',
    recordedBy: 'Rajesh Kumar Verma',
    notes: 'Cash advance given at farm',
    createdAt: '2026-10-26T06:45:00Z'
  }
];

export const initialPurchases: Purchase[] = [
  {
    id: 'PO-2026-041',
    supplierId: 'SUP-01',
    supplierName: 'Birsa Agricultural Spawn Lab, Ranchi',
    date: '2026-10-15',
    category: 'Spawn',
    itemsDescription: '50 Bottles High-Yield Pleurotus ostreatus & florida master spawn',
    quantity: '50 kg spawn',
    totalAmountPaise: 200000, // ₹2,000.00
    amountPaidPaise: 200000,
    balancePaise: 0,
    paymentStatus: 'paid',
    receivedStatus: 'Received',
    invoiceOrReceiptRef: 'BAU-SPW-2026-894',
    notes: 'Spawn bottles fresh with vibrant pure mycelium.',
    createdAt: '2026-10-15T11:00:00Z'
  },
  {
    id: 'PO-2026-042',
    supplierId: 'SUP-02',
    supplierName: 'Bokaro Agro Straw & Substrate Co.',
    date: '2026-10-18',
    category: 'Straw & Substrate',
    itemsDescription: 'Paddy straw bales (500 kg) clean dry unchopped',
    quantity: '500 kg',
    totalAmountPaise: 200000, // ₹2,000.00
    amountPaidPaise: 120000, // ₹1,200.00 paid
    balancePaise: 80000, // ₹800.00 due
    paymentStatus: 'partial',
    receivedStatus: 'Received',
    invoiceOrReceiptRef: 'BOK-AGR-491',
    notes: 'Delivered in tractor trolley to shed #2.',
    createdAt: '2026-10-18T14:00:00Z'
  },
  {
    id: 'PO-2026-043',
    supplierId: 'SUP-03',
    supplierName: 'Dhanbad Polymer Packaging & Bags',
    date: '2026-10-20',
    category: 'Poly Bags & Packaging',
    itemsDescription: '1000 pcs PP Autoclavable cultivation bags (16x24) + 200 kraft pouches',
    quantity: '1200 pcs',
    totalAmountPaise: 150000,
    amountPaidPaise: 150000,
    balancePaise: 0,
    paymentStatus: 'paid',
    receivedStatus: 'Received',
    invoiceOrReceiptRef: 'DPP-2026-1092',
    notes: 'Good gauge thickness, tested withstands hot water pasteurization.',
    createdAt: '2026-10-20T16:00:00Z'
  }
];

export const initialSupplierPayments: SupplierPayment[] = [
  {
    id: 'SPAY-2026-031',
    purchaseId: 'PO-2026-041',
    supplierId: 'SUP-01',
    supplierName: 'Birsa Agricultural Spawn Lab, Ranchi',
    amountPaise: 200000,
    date: '2026-10-15',
    method: 'upi',
    transactionRef: 'UPI/739102941/SBI',
    notes: 'Spawn invoice cleared',
    recordedBy: 'Rajesh Kumar Verma',
    createdAt: '2026-10-15T11:30:00Z'
  },
  {
    id: 'SPAY-2026-032',
    purchaseId: 'PO-2026-042',
    supplierId: 'SUP-02',
    supplierName: 'Bokaro Agro Straw & Substrate Co.',
    amountPaise: 120000,
    date: '2026-10-18',
    method: 'cash',
    notes: 'Advance to tractor driver',
    recordedBy: 'Rajesh Kumar Verma',
    createdAt: '2026-10-18T14:30:00Z'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'EXP-2026-101',
    date: '2026-10-05',
    category: 'Electricity',
    amountPaise: 385000, // ₹3,850.00
    payee: 'Jharkhand Bijli Vitran Nigam Ltd (JBVNL)',
    paymentMode: 'bank_transfer',
    isOpex: true,
    isCapital: false,
    receiptAttachment: 'JBVNL-OCT-394819',
    notes: 'Electricity bill for grow chambers, exhaust fans, and ultrasonic humidifier.',
    recordedBy: 'Rajesh Kumar Verma',
    createdAt: '2026-10-05T12:00:00Z'
  },
  {
    id: 'EXP-2026-102',
    date: '2026-10-10',
    category: 'Labour',
    amountPaise: 900000, // ₹9,000.00
    payee: 'Farm Cultivation & Harvesting Labour',
    paymentMode: 'cash',
    isOpex: true,
    isCapital: false,
    notes: 'Wages for straw chopping, boiling, bag filling, and morning harvest sorting.',
    recordedBy: 'Rajesh Kumar Verma',
    createdAt: '2026-10-10T18:00:00Z'
  },
  {
    id: 'EXP-2026-103',
    date: '2026-10-15',
    category: 'Water & Misting',
    amountPaise: 75000, // ₹750.00
    payee: 'Local RO Filter Servicing & Water Tanker',
    paymentMode: 'cash',
    isOpex: true,
    isCapital: false,
    notes: 'Clean softened water for chamber misting nozzles to prevent mineral clogging.',
    recordedBy: 'Rajesh Kumar Verma',
    createdAt: '2026-10-15T15:00:00Z'
  },
  {
    id: 'EXP-2026-104',
    date: '2026-10-22',
    category: 'Transport & Delivery',
    amountPaise: 120000, // ₹1,200.00
    payee: 'Dhanbad City Auto Delivery Fuel & Driver',
    paymentMode: 'cash',
    isOpex: true,
    isCapital: false,
    notes: 'Fuel and driver allowance for restaurant deliveries and Mandi transport.',
    recordedBy: 'Priya Sharma',
    createdAt: '2026-10-22T17:00:00Z'
  },
  {
    id: 'EXP-2026-105',
    date: '2026-10-24',
    category: 'Marketing',
    amountPaise: 80000, // ₹800.00
    payee: 'Banner Print & Dhanbad Food Expo Flyers',
    paymentMode: 'upi',
    isOpex: true,
    isCapital: false,
    notes: 'Printed waterproof brochures and organic mushroom recipe cards for retail customers.',
    recordedBy: 'Priya Sharma',
    createdAt: '2026-10-24T14:00:00Z'
  }
];

export const initialMovements: InventoryMovement[] = [
  {
    id: 'MOV-2026-001',
    timestamp: '2026-10-22T08:30:00Z',
    productId: 'PRD-01',
    productName: 'Fresh Grey Oyster Mushroom',
    lotId: 'LOT-OY10-F2',
    type: 'HARVEST',
    changeQtyKg: 110.0,
    previousStockKg: 0,
    newStockKg: 110.0,
    referenceId: 'HRV-2026-088',
    notes: 'Harvested from BATCH-2026-OY-10 (Flush 2)',
    performedBy: 'Suresh Soren'
  },
  {
    id: 'MOV-2026-002',
    timestamp: '2026-10-25T11:30:00Z',
    productId: 'PRD-01',
    productName: 'Fresh Grey Oyster Mushroom',
    lotId: 'LOT-OY10-F2',
    type: 'SALE',
    changeQtyKg: -25.0,
    previousStockKg: 110.0,
    newStockKg: 85.0,
    referenceId: 'YOF-ORD-2026-101',
    notes: 'Dispatched for order YOF-ORD-2026-101 (Coal Capital Hotel)',
    performedBy: 'Priya Sharma'
  },
  {
    id: 'MOV-2026-003',
    timestamp: '2026-10-26T09:15:00Z',
    productId: 'PRD-01',
    productName: 'Fresh Grey Oyster Mushroom',
    lotId: 'LOT-OY10-F2',
    type: 'SALE',
    changeQtyKg: -10.0,
    previousStockKg: 85.0,
    newStockKg: 75.0,
    referenceId: 'YOF-ORD-2026-102',
    notes: 'Dispatched for order YOF-ORD-2026-102 (Yellow Chilli)',
    performedBy: 'Priya Sharma'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-24T10:00:00Z',
    userName: 'Priya Sharma',
    userRole: 'manager',
    action: 'CREATE',
    entityType: 'ORDER',
    entityId: 'YOF-ORD-2026-101',
    summary: 'Created order YOF-ORD-2026-101 for Coal Capital Grand Hotel (₹6,200)'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-25T11:30:00Z',
    userName: 'Suresh Soren',
    userRole: 'staff',
    action: 'STOCK_DEDUCT',
    entityType: 'STOCK',
    entityId: 'YOF-ORD-2026-101',
    summary: 'Delivered order YOF-ORD-2026-101. Deducted 25kg Grey Oyster & 15kg White Oyster via FIFO.'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-25T12:00:00Z',
    userName: 'Priya Sharma',
    userRole: 'manager',
    action: 'PAYMENT',
    entityType: 'PAYMENT',
    entityId: 'PAY-2026-082',
    summary: 'Recorded final settlement ₹4,200 for YOF-ORD-2026-101 via UPI'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-10-21T15:00:00Z',
    userName: 'mohit kumar mahato',
    userRole: 'owner',
    action: 'RETURN',
    entityType: 'ORDER',
    entityId: 'YOF-ORD-2026-106',
    summary: 'Processed return for YOF-ORD-2026-106. Restocked 10kg Grey Oyster. Advance ₹1,800 refunded.'
  }
];
