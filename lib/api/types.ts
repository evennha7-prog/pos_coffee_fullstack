export interface Category {
  id: string
  name: string
  status: "Active" | "Inactive"
  icon: string
}

export interface Product {
  id: string
  name: string
  price: number
  qty: number
  category: string
  icon: string
  status: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  points: number
  spent: number
}

export interface Supplier {
  id: string
  businessName: string
  name: string
  phone: string
  address: string
  note?: string
}

export interface PurchaseItem {
  code: string
  name: string
  price: number
  qty: number
  icon: string
}

export interface Purchase {
  id: string
  no: number
  supplier: string
  purchaseBy: string
  totalCost: number
  dueAmount: number
  paidAmount: number
  changeAmount: number
  paymentStatus: "Paid" | "Pending" | "Partial"
  purchaseStatus: "Received" | "Pending" | "Ordered"
  purchaseDate: string
  invoiceNumber?: string
  note?: string
  items?: PurchaseItem[]
}

export interface Sale {
  id: string
  no: number
  invoice: string
  saleBy: string
  customer: string
  totalCostKHR: number
  totalCostUSD: number
  dueAmountKHR: number
  dueAmountUSD: number
  paidAmountKHR: number
  paidAmountUSD: number
  changeAmountKHR: number
  changeAmountUSD: number
  paymentStatus: "PAID" | "PARTIAL" | "UNPAID"
  createdAt: string
}

export interface User {
  id: number
  username: string
  email: string
  role: string
}

export interface StockItem {
  id: string
  name: string
  sku: string
  category: string
  currentQty: number
  unit: string
  reorderLevel?: number
  maxLimit?: number
  quality?: string
  caseQty?: number
  unitsPerCase?: number
  reservedQty?: number
  lastUpdated: string
}

export interface AdjustmentLog {
  id: string
  sku: string
  name: string
  type: "addition" | "subtraction"
  qty: number
  reason: string
  date: string
}

export interface ExpiringItem {
  id: string
  name: string
  batchNo: string
  qty: number
  expiryDate: string
  daysRemaining: number
  unit: string
}

export interface DamagedItem {
  id: string
  name: string
  sku: string
  category: string
  qty: number
  unit: string
  reason: string
  recordedAt: string
}

export interface ExpiredItem {
  id: string
  name: string
  sku: string
  category: string
  qty: number
  unit: string
  expiryDate: string
  removedAt: string
}
