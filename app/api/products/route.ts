import { NextResponse } from "next/server";
import { db, Product } from "@/lib/db";

// GET /api/products - Fetch all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products = db.products;

    if (category && category !== "All") {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, stock, status, icon } = body;

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing required fields (name, category, price)" },
        { status: 400 }
      );
    }

    const nextId = db.products.length > 0 ? Math.max(...db.products.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: nextId,
      name,
      category,
      price: Number(price),
      stock: Number(stock) || 0,
      status: status || (Number(stock) > 20 ? "In Stock" : "Low Stock"),
      icon: icon || "☕",
    };

    db.products = [...db.products, newProduct];

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
