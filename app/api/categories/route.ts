import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/categories - Fetch all categories
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: db.categories,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
