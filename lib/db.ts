// lib/db.ts
// In-memory persistent data store for Coffee POS
// Note: In production, you can replace this with Prisma, Drizzle ORM, PostgreSQL, SQLite, or MongoDB.

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  icon?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  itemCount: number;
}

export interface SaleItem {
  id: number;
  name: string;
  category: string;
  price: number;
  qty: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  totalUSD: number;
  totalKHR: number;
  paymentMethod: string;
  createdAt: string;
}

// Global state simulation for development
declare global {
  var _db_products: Product[] | undefined;
  var _db_categories: Category[] | undefined;
  var _db_sales: Sale[] | undefined;
}

const initialProducts: Product[] = [
  { id: 1, name: "Iced Caramel Macchiato", category: "Coffee", price: 4.5, stock: 45, status: "In Stock", icon: "☕" },
  { id: 2, name: "Double Shot Espresso", category: "Coffee", price: 3.0, stock: 80, status: "In Stock", icon: "☕" },
  { id: 3, name: "Butter Croissant", category: "Pastries", price: 3.5, stock: 12, status: "Low Stock", icon: "🥐" },
  { id: 4, name: "Matcha Green Tea Latte", category: "Tea", price: 4.8, stock: 30, status: "In Stock", icon: "🍵" },
  { id: 5, name: "Iced Americano", category: "Coffee", price: 3.2, stock: 50, status: "In Stock", icon: "🥤" },
  { id: 6, name: "Chocolate Muffin", category: "Pastries", price: 3.0, stock: 18, status: "In Stock", icon: "🧁" },
  { id: 7, name: "Arabica Whole Beans (250g)", category: "Beans", price: 14.0, stock: 15, status: "Low Stock", icon: "🫘" },
];

const initialCategories: Category[] = [
  { id: 1, name: "Coffee", icon: "☕", itemCount: 3 },
  { id: 2, name: "Tea", icon: "🍵", itemCount: 1 },
  { id: 3, name: "Pastries", icon: "🥐", itemCount: 2 },
  { id: 4, name: "Beans", icon: "🫘", itemCount: 1 },
];

export const db = {
  get products() {
    if (!global._db_products) {
      global._db_products = [...initialProducts];
    }
    return global._db_products;
  },
  set products(val: Product[]) {
    global._db_products = val;
  },

  get categories() {
    if (!global._db_categories) {
      global._db_categories = [...initialCategories];
    }
    return global._db_categories;
  },
  set categories(val: Category[]) {
    global._db_categories = val;
  },

  get sales() {
    if (!global._db_sales) {
      global._db_sales = [];
    }
    return global._db_sales;
  },
  set sales(val: Sale[]) {
    global._db_sales = val;
  }
};
