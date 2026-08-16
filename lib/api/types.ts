export interface ApiResponse<T = any> {
  success: boolean;
  result?: T;
  data?: T;
  totalItem?: number;
  totalPage?: number;
  error?: string;
  message?: string;
}

export interface Category {
  id: number;
  name: string;
  note?: string;
  itemCount?: number;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  category_id?: number | null;
  categoryName?: string;
  category?: string;
  code: string;
  image_url: string;
  icon?: string;
  cost_price: number;
  sale_price: number;
  price?: number;
  current_stock: number;
  stock?: number;
  status?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: number;
  business_name: string;
  businessName?: string;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleItem {
  id?: number;
  sale_id?: number;
  product_id: number;
  productName?: string;
  productCode?: string;
  imageUrl?: string;
  quantity: number;
  qty?: number;
  unit_price: number;
  price?: number;
  total_price: number;
}

export interface Sale {
  id: number;
  invoice_number: string;
  invoice?: string;
  user_id?: number;
  cashierName?: string;
  saleBy?: string;
  customer_id?: number | null;
  customerName?: string;
  customerPhone?: string;
  customer?: string;
  total_cost: number;
  totalCostKHR?: number;
  totalCostUSD?: number;
  paid_amount: number;
  paidAmountKHR?: number;
  paidAmountUSD?: number;
  due_amount: number;
  dueAmountKHR?: number;
  dueAmountUSD?: number;
  change_amount: number;
  changeAmountKHR?: number;
  changeAmountUSD?: number;
  payment_status: "paid" | "due" | "partial";
  paymentStatus?: "PAID" | "PARTIAL" | "UNPAID" | "paid" | "due" | "partial";
  items?: SaleItem[];
  created_at?: string;
  createdAt?: string;
}

export interface PurchaseItem {
  id?: number;
  purchase_id?: number;
  product_id: number;
  code?: string;
  name?: string;
  productName?: string;
  productCode?: string;
  imageUrl?: string;
  icon?: string;
  quantity: number;
  qty?: number;
  unit_price: number;
  price?: number;
  total_price?: number;
}

export interface Purchase {
  id: number;
  no?: number;
  user_id?: number;
  purchasedByName?: string;
  purchaseBy?: string;
  supplier_id: number;
  supplierName?: string;
  supplierPhone?: string;
  supplier?: string;
  invoice_number: string;
  invoiceNumber?: string;
  purchase_date?: string;
  purchaseDate?: string;
  total_cost: number;
  totalCost?: number;
  paid_amount: number;
  paidAmount?: number;
  due_amount: number;
  dueAmount?: number;
  change_amount: number;
  changeAmount?: number;
  payment_status: "paid" | "due" | "partial";
  paymentStatus?: "Paid" | "Pending" | "Partial" | "paid" | "due" | "partial";
  purchase_status: "received" | "ordered" | "pending" | "cancel";
  purchaseStatus?: "Received" | "Pending" | "Ordered" | "received" | "ordered" | "pending" | "cancel";
  note?: string;
  items?: PurchaseItem[];
  created_at?: string;
  createdAt?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "super" | "admin" | "cashier";
  created_at?: string;
}

export interface GeneralReport {
  totalSaleToday: number;
  todayRevenue?: number;
  totalDueAmountSale: number;
  dueInvoice?: number;
  totalDueAmountPurchase: number;
  duePurchase?: number;
  totalMonthlySale: number;
  monthlyRevenue?: number;
  totalCustomers: number;
  customers?: number;
  totalSuppliers: number;
  suppliers?: number;
  totalPurchaseDue: number;
  purchaseDueInvoice?: number;
  totalSaleDue: number;
  saleDueInvoice?: number;
}

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentQty: number;
  unit: string;
  reorderLevel?: number;
  maxLimit?: number;
  quality?: string;
  caseQty?: number;
  unitsPerCase?: number;
  reservedQty?: number;
  lastUpdated: string;
}

export interface AdjustmentLog {
  id: string;
  sku: string;
  name: string;
  type: "addition" | "subtraction";
  qty: number;
  reason: string;
  date: string;
}

export interface ExpiringItem {
  id: string;
  name: string;
  batchNo: string;
  qty: number;
  expiryDate: string;
  daysRemaining: number;
  unit: string;
}

export interface DamagedItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  qty: number;
  unit: string;
  reason: string;
  recordedAt: string;
}

export interface ExpiredItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  qty: number;
  unit: string;
  expiryDate: string;
  removedAt: string;
}
