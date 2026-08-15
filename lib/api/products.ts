import { Product } from "./types"

let mockProducts: Product[] = [
  { id: "P-001", name: "Caramel Macchiato", price: 4.50, qty: 45, category: "Iced Drinks", icon: "☕", status: "In Stock" },
  { id: "P-002", name: "Cappuccino Hot", price: 3.50, qty: 12, category: "Hot Coffee", icon: "☕", status: "Low Stock" },
  { id: "P-003", name: "Butter Croissant", price: 2.80, qty: 0, category: "Bakery & Pastries", icon: "🥐", status: "Out of Stock" },
  { id: "P-004", name: "Matcha Latte Iced", price: 4.20, qty: 60, category: "Iced Drinks", icon: "🍵", status: "In Stock" },
]

export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockProducts]
}

export async function createProduct(prod: Product): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockProducts.push(prod)
  return prod
}

export async function updateProduct(prod: Product): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockProducts = mockProducts.map((p) => (p.id === prod.id ? prod : p))
  return prod
}

export async function deleteProduct(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockProducts = mockProducts.filter((p) => p.id !== id)
  return true
}
