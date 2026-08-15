import { Customer } from "./types"

let mockCustomers: Customer[] = [
  { id: "C-0001", name: "Sophea Chan", email: "sophea@gmail.com", phone: "012345678", points: 120, spent: 45.00 },
  { id: "C-0002", name: "David Miller", email: "david@example.com", phone: "098765432", points: 80, spent: 32.50 },
  { id: "C-0003", name: "Vannak Sam", email: "vannak.sam@gmail.com", phone: "088123456", points: 250, spent: 110.00 },
]

export async function getCustomers(): Promise<Customer[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockCustomers]
}

export async function createCustomer(cust: Omit<Customer, "id">): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  const newCust = { ...cust, id: "C-" + String(mockCustomers.length + 1).padStart(4, "0") }
  mockCustomers.push(newCust)
  return newCust
}

export async function updateCustomer(cust: Customer): Promise<Customer> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockCustomers = mockCustomers.map((c) => (c.id === cust.id ? cust : c))
  return cust
}

export async function deleteCustomer(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockCustomers = mockCustomers.filter((c) => c.id !== id)
  return true
}
