import { apiFetch } from "./client"
import { StockItem, AdjustmentLog, ExpiringItem, DamagedItem, ExpiredItem, Product } from "./types"

let mockAdjustmentLogs: AdjustmentLog[] = []
let mockExpiringItems: ExpiringItem[] = []
let mockDamagedItems: DamagedItem[] = []
let mockExpiredItems: ExpiredItem[] = []

export async function getStockItems(): Promise<StockItem[]> {
  try {
    const res = await apiFetch<Product[]>("/products")
    const prods = (res.result || res.data || []) as Product[]

    return prods.map((p) => ({
      id: String(p.id),
      name: p.name,
      sku: p.code || `SKU-${p.id}`,
      category: p.categoryName || p.category || "General",
      currentQty: Number(p.current_stock ?? p.stock ?? 0),
      unit: "pcs",
      reorderLevel: 15,
      quality: (p.current_stock ?? 0) > 0 ? "Good" : "Out of Stock",
      lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleString() : new Date().toLocaleDateString(),
    }))
  } catch (error) {
    console.error("Error fetching live stock items:", error)
    return []
  }
}

export async function getAdjustmentLogs(): Promise<AdjustmentLog[]> {
  return [...mockAdjustmentLogs]
}

export async function createAdjustmentLog(log: AdjustmentLog): Promise<AdjustmentLog> {
  mockAdjustmentLogs.unshift(log)
  return log
}

export async function getExpiringItems(): Promise<ExpiringItem[]> {
  return [...mockExpiringItems]
}

export async function discardExpiringBatch(id: string): Promise<boolean> {
  mockExpiringItems = mockExpiringItems.filter((i) => i.id !== id)
  return true
}

export async function getDamagedItems(): Promise<DamagedItem[]> {
  return [...mockDamagedItems]
}

export async function getExpiredItems(): Promise<ExpiredItem[]> {
  return [...mockExpiredItems]
}
