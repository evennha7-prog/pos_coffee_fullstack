import { NextResponse } from "next/server";
import { db, Product } from "@/lib/db";

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = Number(params.id);
    const body = await request.json();

    const existingIndex = db.products.findIndex((p) => p.id === id);
    if (existingIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const updatedProduct: Product = {
      ...db.products[existingIndex],
      ...body,
      id,
    };

    const newProducts = [...db.products];
    newProducts[existingIndex] = updatedProduct;
    db.products = newProducts;

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const id = Number(params.id);

    const existingIndex = db.products.findIndex((p) => p.id === id);
    if (existingIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const deleted = db.products[existingIndex];
    db.products = db.products.filter((p) => p.id !== id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      data: deleted,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
