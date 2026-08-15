import { StockItem, AdjustmentLog, ExpiringItem, DamagedItem, ExpiredItem } from "./types"

let mockStockItems: StockItem[] = [
  { id: "1", name: "Arabica Coffee Beans", sku: "CB-ARA-01", category: "Coffee Beans", currentQty: 28, unit: "kg", reorderLevel: 20, maxLimit: 100, quality: "Good", caseQty: 1, unitsPerCase: 28, reservedQty: 4, lastUpdated: "2026-07-22 18:30" },
  { id: "2", name: "Robusta Coffee Beans", sku: "CB-ROB-01", category: "Coffee Beans", currentQty: 32, unit: "kg", reorderLevel: 20, maxLimit: 100, quality: "Standard", caseQty: 2, unitsPerCase: 16, reservedQty: 0, lastUpdated: "2026-07-22 18:30" },
  { id: "3", name: "Whole Milk 1L", sku: "MK-WHL-01", category: "Dairy", currentQty: 48, unit: "packs", reorderLevel: 30, maxLimit: 200, quality: "Good", caseQty: 4, unitsPerCase: 12, reservedQty: 10, lastUpdated: "2026-07-23 09:15" },
  { id: "4", name: "Caramel Syrup", sku: "SY-CAR-02", category: "Syrups", currentQty: 14, unit: "bottles", reorderLevel: 10, maxLimit: 50, quality: "Premium", caseQty: 1, unitsPerCase: 14, reservedQty: 2, lastUpdated: "2026-07-23 10:00" },
  { id: "5", name: "Paper Cups 12oz", sku: "CP-PAP-12", category: "Packaging", currentQty: 150, unit: "pcs", reorderLevel: 500, maxLimit: 10000, quality: "Good", caseQty: 0, unitsPerCase: 0, reservedQty: 0, lastUpdated: "2026-07-23 10:30" },
  { id: "6", name: "Paper Cups 8oz", sku: "CP-PAP-08", category: "Packaging", currentQty: 3200, unit: "pcs", reorderLevel: 500, maxLimit: 2000, quality: "Good", caseQty: 0, unitsPerCase: 0, reservedQty: 0, lastUpdated: "2026-07-23 10:30" },
  { id: "7", name: "Plastic Straws", sku: "CP-STR-01", category: "Packaging", currentQty: 5000, unit: "pcs", reorderLevel: 1000, maxLimit: 3000, quality: "Good", caseQty: 0, unitsPerCase: 0, reservedQty: 0, lastUpdated: "2026-07-23 10:30" },
  { id: "8", name: "Paper Straws (Brown)", sku: "CP-STR-10", category: "Packaging", currentQty: 0, unit: "pcs", reorderLevel: 1000, maxLimit: 5000, quality: "Good", caseQty: 0, unitsPerCase: 0, reservedQty: 0, lastUpdated: "2026-07-23 10:30" },
]

let mockAdjustmentLogs: AdjustmentLog[] = [
  { id: "1", sku: "CB-ARA-01", name: "Arabica Coffee Beans", type: "addition", qty: 10, reason: "Restock Correction", date: "2026-07-22 14:10" },
  { id: "2", sku: "MK-WHL-01", name: "Whole Milk 1L", type: "subtraction", qty: 2, reason: "Spillage/Damaged", date: "2026-07-21 08:45" },
]

let mockExpiringItems: ExpiringItem[] = [
  { id: "1", name: "Fresh Dairy Milk 1L", batchNo: "B-MILK-902", qty: 24, expiryDate: "2026-07-26", daysRemaining: 3, unit: "packs" },
  { id: "2", name: "Whipped Cream Cans", batchNo: "B-CRM-104", qty: 8, expiryDate: "2026-07-28", daysRemaining: 5, unit: "cans" },
  { id: "3", name: "Caramel Sauce Syrup", batchNo: "B-SYR-881", qty: 5, expiryDate: "2026-08-05", daysRemaining: 13, unit: "bottles" },
]

let mockDamagedItems: DamagedItem[] = [
  { id: "1", name: "Whole Milk 1L", sku: "MK-WHL-01", category: "Dairy", qty: 2, unit: "packs", reason: "Spillage during delivery", recordedAt: "2026-07-21 08:45" },
  { id: "2", name: "Whipped Cream Can", sku: "CP-CRM-01", category: "Dairy", qty: 1, unit: "can", reason: "Defective nozzle valve", recordedAt: "2026-07-20 16:30" },
]

let mockExpiredItems: ExpiredItem[] = [
  { id: "1", name: "Fresh Dairy Milk 1L", sku: "MK-WHL-01", category: "Dairy", qty: 4, unit: "packs", expiryDate: "2026-07-20", removedAt: "2026-07-21 08:30" },
  { id: "2", name: "Banana Cake Slice", sku: "BK-BAN-01", category: "Pastries", qty: 3, unit: "pcs", expiryDate: "2026-07-21", removedAt: "2026-07-22 08:00" },
]

export async function getStockItems(): Promise<StockItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockStockItems]
}

export async function createStockItem(item: StockItem): Promise<StockItem> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockStockItems.push(item)
  return item
}

export async function updateStockItem(item: StockItem): Promise<StockItem> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockStockItems = mockStockItems.map((s) => (s.id === item.id ? item : s))
  return item
}

export async function deleteStockItem(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockStockItems = mockStockItems.filter((s) => s.id !== id)
  return true
}

export async function getAdjustmentLogs(): Promise<AdjustmentLog[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockAdjustmentLogs]
}

export async function createAdjustmentLog(log: AdjustmentLog): Promise<AdjustmentLog> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockAdjustmentLogs.unshift(log)
  return log
}

export async function getExpiringItems(): Promise<ExpiringItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockExpiringItems]
}

export async function discardExpiringBatch(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockExpiringItems = mockExpiringItems.filter((i) => i.id !== id)
  return true
}

export async function getDamagedItems(): Promise<DamagedItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockDamagedItems]
}

export async function getExpiredItems(): Promise<ExpiredItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockExpiredItems]
}
