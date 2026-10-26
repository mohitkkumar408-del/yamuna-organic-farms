import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Brand & Nav
  appName: { en: 'Yamuna Organic Farms', hi: 'यमुना ऑर्गेनिक फार्म्स' },
  tagline: { en: 'Dhanbad Oyster Mushroom Business', hi: 'धनबाद ढींगरी मशरूम कृषि प्रबंधन' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  orders: { en: 'Orders & Dispatch', hi: 'ऑर्डर एवं आपूर्ति' },
  sales: { en: 'Sales & Revenue', hi: 'बिक्री एवं आय' },
  inventory: { en: 'Inventory & Stock', hi: 'इन्वेंटरी एवं स्टॉक' },
  production: { en: 'Cultivation & Batches', hi: 'मशरूम उत्पादन एवं बैच' },
  customers: { en: 'Customers CRM', hi: 'ग्राहक प्रबंधन' },
  suppliers: { en: 'Suppliers & Purchases', hi: 'सप्लायर्स एवं खरीद' },
  expenses: { en: 'Expenses & Profit', hi: 'खर्च एवं मुनाफा' },
  invoices: { en: 'Invoices & Receipts', hi: 'बिल एवं रसीदें' },
  reports: { en: 'Reports & Analytics', hi: 'रिपोर्ट्स एवं विश्लेषण' },
  auditLog: { en: 'Audit Log', hi: 'ऑडिट लॉग' },
  settings: { en: 'Settings', hi: 'सेटिंग्स' },

  // Dashboard KPIs
  salesToday: { en: 'Sales Today', hi: 'आज की बिक्री' },
  salesThisWeek: { en: 'Sales This Week', hi: 'इस हफ्ते की बिक्री' },
  salesThisMonth: { en: 'Sales This Month', hi: 'इस महीने की बिक्री' },
  salesAllTime: { en: 'All-Time Sales', hi: 'कुल कुल बिक्री' },
  totalKgSold: { en: 'Total Sold (Kg)', hi: 'कुल बिकी मशरूम (किग्रा)' },
  availableStock: { en: 'Available Stock', hi: 'उपलब्ध स्टॉक' },
  productionThisMonth: { en: 'Production This Month', hi: 'इस माह उत्पादन' },
  cashCollected: { en: 'Cash Collected', hi: 'प्राप्त भुगतान' },
  customerDues: { en: 'Customer Receivables', hi: 'ग्राहकों का बकाया' },
  supplierDues: { en: 'Supplier Payables', hi: 'सप्लायर को देय' },
  grossProfit: { en: 'Gross Profit', hi: 'सकल लाभ' },
  netProfit: { en: 'Net Operating Profit', hi: 'शुद्ध मुनाफा' },
  totalExpenses: { en: 'Total Expenses', hi: 'कुल खर्च' },
  upcomingDeliveries: { en: 'Upcoming Deliveries', hi: 'आगामी डिलीवरी' },
  overdueOrders: { en: 'Overdue Orders', hi: 'अतिदेय ऑर्डर' },
  lowStockAlert: { en: 'Low Stock Alert', hi: 'कम स्टॉक चेतावनी' },
  expiringLots: { en: 'Expiring Lots (48h)', hi: 'शीघ्र समाप्त लॉट' },

  // Order Statuses
  New: { en: 'New', hi: 'नया' },
  Confirmed: { en: 'Confirmed', hi: 'स्वीकृत' },
  Preparing: { en: 'Preparing', hi: 'पैकिंग जारी' },
  'Ready for Dispatch': { en: 'Ready for Dispatch', hi: 'डिस्पैच तैयार' },
  Dispatched: { en: 'Dispatched', hi: 'रवाना किया' },
  Delivered: { en: 'Delivered', hi: 'पहुंचा दिया' },
  Cancelled: { en: 'Cancelled', hi: 'रद्द' },
  Returned: { en: 'Returned', hi: 'वापस' },

  // Actions
  createNewOrder: { en: 'New Order', hi: 'नया ऑर्डर' },
  recordHarvest: { en: 'Record Harvest', hi: 'तुड़ाई दर्ज करें' },
  newBatch: { en: 'New Batch', hi: 'नया बैच शुरू करें' },
  recordPayment: { en: 'Record Payment', hi: 'भुगतान दर्ज करें' },
  recordExpense: { en: 'Record Expense', hi: 'खर्च दर्ज करें' },
  printInvoice: { en: 'Print Invoice', hi: 'बिल प्रिंट करें' },
  printThermal: { en: 'Thermal Slip', hi: 'थर्मल पर्ची' },
  downloadCsv: { en: 'Download CSV', hi: 'CSV डाउनलोड करें' },
  filter: { en: 'Filter', hi: 'फिल्टर' },
  search: { en: 'Search...', hi: 'खोजें...' },
  save: { en: 'Save', hi: 'सुरक्षित करें' },
  cancel: { en: 'Cancel', hi: 'रद्द करें' },
  close: { en: 'Close', hi: 'बंद करें' },
  confirm: { en: 'Confirm', hi: 'पुष्टि करें' },
  edit: { en: 'Edit', hi: 'संपादित करें' },

  // Common labels
  customer: { en: 'Customer', hi: 'ग्राहक' },
  phone: { en: 'Phone', hi: 'फ़ोन' },
  address: { en: 'Address', hi: 'पता' },
  quantity: { en: 'Quantity', hi: 'मात्रा' },
  rate: { en: 'Rate (₹/Kg)', hi: 'दर (₹/किग्रा)' },
  amount: { en: 'Amount', hi: 'रकम' },
  balance: { en: 'Balance Due', hi: 'बकाया' },
  paid: { en: 'Paid', hi: 'चुकाया गया' },
  advance: { en: 'Advance', hi: 'अग्रिम' },
  paymentMode: { en: 'Payment Method', hi: 'भुगतान माध्यम' },
  deliveryDate: { en: 'Delivery Date', hi: 'डिलीवरी तारीख' },
  orderDate: { en: 'Order Date', hi: 'ऑर्डर तारीख' },
  variety: { en: 'Mushroom Variety', hi: 'मशरूम किस्म' },
  batch: { en: 'Batch', hi: 'बैच' },
  flush: { en: 'Flush', hi: 'तुड़ाई चक्र' },
  yield: { en: 'Total Yield', hi: 'कुल पैदावार' },
  costPerKg: { en: 'Cost per Kg', hi: 'प्रति किग्रा लागत' },
  bioEfficiency: { en: 'Bio-Efficiency', hi: 'जैविक दक्षता' },
  notes: { en: 'Notes / Remarks', hi: 'टिप्पणी' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('yof_language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('yof_language', lang);
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
