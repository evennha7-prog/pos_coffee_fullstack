// lib/db.ts
// Shared interfaces for database models

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

export const db = {
  get products() {
    if (!global._db_products) {
      global._db_products = [];
    }
    return global._db_products;
  },
  set products(val: Product[]) {
    global._db_products = val;
  },

  get categories() {
    if (!global._db_categories) {
      global._db_categories = [];
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
