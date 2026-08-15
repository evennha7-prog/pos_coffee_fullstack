import { NextResponse } from "next/server";
import { db, Sale } from "@/lib/db";

// GET /api/sales - Fetch all sales history
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: db.sales,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

// POST /api/sales - Record a new sale from POS
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, subtotal, tax, totalUSD, totalKHR, paymentMethod, customerName } = body;

    if (!items || !items.length || totalUSD === undefined) {
      return NextResponse.json(
        { success: false, message: "Invalid sale payload: items and total are required." },
        { status: 400 }
      );
    }

    const nextInvoice = "INV-" + (db.sales.length + 1).toString().padStart(6, "0");
    const newSale: Sale = {
      id: "sale_" + Date.now(),
      invoiceNumber: nextInvoice,
      customerName: customerName || "Walk-in Customer",
      items,
      subtotal: Number(subtotal),
      tax: Number(tax),
      totalUSD: Number(totalUSD),
      totalKHR: Number(totalKHR),
      paymentMethod: paymentMethod || "Cash",
      createdAt: new Date().toISOString(),
    };

    // Deduct stock for each sold item
    items.forEach((soldItem: { id: number; qty: number }) => {
      const product = db.products.find((p) => p.id === soldItem.id);
      if (product) {
        product.stock = Math.max(0, product.stock - (soldItem.qty || 1));
        if (product.stock === 0) product.status = "Out of Stock";
        else if (product.stock < 15) product.status = "Low Stock";
      }
    });

    db.sales = [newSale, ...db.sales];

    return NextResponse.json(
      {
        success: true,
        message: "Sale processed successfully",
        data: newSale,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process sale" },
      { status: 500 }
    );
  }
}
