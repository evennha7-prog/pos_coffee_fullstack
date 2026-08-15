import { User } from "./types"

let mockUsers: User[] = [
  { id: 1, username: "panha", email: "panha@gmail.com", role: "cashier" },
]

export async function getUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return [...mockUsers]
}

export async function createUser(user: Omit<User, "id">): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  const newUser = { ...user, id: mockUsers.length + 1 }
  mockUsers.push(newUser)
  return newUser
}

export async function updateUser(user: User): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockUsers = mockUsers.map((u) => (u.id === user.id ? user : u))
  return user
}

export async function deleteUser(id: number): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  mockUsers = mockUsers.filter((u) => u.id !== id)
  return true
}
