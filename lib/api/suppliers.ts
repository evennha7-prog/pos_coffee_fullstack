import { Supplier } from "./types"

let mockSuppliers: Supplier[] = [
  { id: "S-001", businessName: "Highland Coffee Beans Co.", name: "Vannak Highland", phone: "012888999", address: "Phnom Penh, Cambodia", note: "Primary coffee supplier" },
  { id: "S-002", businessName: "Fresh Dairy Milk Supplies", name: "Sophea Milk", phone: "098777111", address: "Kampong Cham, Cambodia", note: "Daily milk delivery" },
  { id: "S-003", businessName: "Artisan Bakery Wholesales", name: "Dara Bakery", phone: "088666555", address: "Siem Reap, Cambodia", note: "Morning croissants delivery" },
]

export async function getSuppliers(): Promise<Supplier[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockSuppliers]
}

export async function createSupplier(supp: Omit<Supplier, "id">): Promise<Supplier> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  const newSupp = { ...supp, id: "S-" + String(mockSuppliers.length + 1).padStart(3, "0") }
  mockSuppliers.push(newSupp)
  return newSupp
}

export async function updateSupplier(supp: Supplier): Promise<Supplier> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockSuppliers = mockSuppliers.map((s) => (s.id === supp.id ? supp : s))
  return supp
}

export async function deleteSupplier(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockSuppliers = mockSuppliers.filter((s) => s.id !== id)
  return true
}
