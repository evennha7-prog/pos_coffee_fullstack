import { Purchase } from "./types"

let mockPurchases: Purchase[] = [
  {
    id: "PO-2026-001",
    no: 1,
    supplier: "Highland Coffee Beans Co.",
    purchaseBy: "Admin",
    totalCost: 500000.00,
    dueAmount: 0.00,
    paidAmount: 500000.00,
    changeAmount: 0.00,
    paymentStatus: "Paid",
    purchaseStatus: "Received",
    purchaseDate: "2026-07-20",
  },
  {
    id: "PO-2026-002",
    no: 2,
    supplier: "Fresh Dairy Milk Supplies",
    purchaseBy: "Manager",
    totalCost: 136000.00,
    dueAmount: 0.00,
    paidAmount: 136000.00,
    changeAmount: 0.00,
    paymentStatus: "Paid",
    purchaseStatus: "Received",
    purchaseDate: "2026-07-19",
  },
  {
    id: "PO-2026-003",
    no: 3,
    supplier: "Artisan Bakery Wholesales",
    purchaseBy: "Admin",
    totalCost: 208000.00,
    dueAmount: 208000.00,
    paidAmount: 0.00,
    changeAmount: 0.00,
    paymentStatus: "Pending",
    purchaseStatus: "Pending",
    purchaseDate: "2026-07-18",
  },
  {
    id: "PO-2026-004",
    no: 4,
    supplier: "Eco Packaging Cambodia",
    purchaseBy: "Cashier",
    totalCost: 164000.00,
    dueAmount: 0.00,
    paidAmount: 164000.00,
    changeAmount: 0.00,
    paymentStatus: "Paid",
    purchaseStatus: "Ordered",
    purchaseDate: "2026-07-15",
  },
]

export async function getPurchases(): Promise<Purchase[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockPurchases]
}

export async function createPurchase(purch: Omit<Purchase, "id" | "no">): Promise<Purchase> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  const newPurch = {
    ...purch,
    id: "PO-2026-" + String(mockPurchases.length + 1).padStart(3, "0"),
    no: mockPurchases.length + 1,
  } as Purchase
  mockPurchases.push(newPurch)
  return newPurch
}

export async function deletePurchase(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockPurchases = mockPurchases.filter((p) => p.id !== id)
  return true
}
