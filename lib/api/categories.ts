import { Category } from "./types"

let mockCategories: Category[] = [
  { id: "1", name: "Hot Coffee", status: "Active", icon: "☕" },
  { id: "2", name: "Iced Drinks", status: "Active", icon: "🥤" },
  { id: "3", name: "Hot Tea", status: "Active", icon: "🍵" },
  { id: "4", name: "Bakery & Pastries", status: "Active", icon: "🥐" },
  { id: "5", name: "Sandwiches & Salads", status: "Active", icon: "🥗" },
]

export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockCategories]
}

export async function createCategory(cat: Omit<Category, "id">): Promise<Category> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  const newCat = { ...cat, id: (mockCategories.length + 1).toString() }
  mockCategories.push(newCat)
  return newCat
}

export async function updateCategory(cat: Category): Promise<Category> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockCategories = mockCategories.map((c) => (c.id === cat.id ? cat : c))
  return cat
}

export async function deleteCategory(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockCategories = mockCategories.filter((c) => c.id !== id)
  return true
}
