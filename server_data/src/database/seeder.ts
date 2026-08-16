import dotenv from "dotenv";
dotenv.config();
import bcryptjs from "bcryptjs";
import pool from "./db";
import { migrateDatabase } from "./migrate";

export const seedDatabase = async (): Promise<void> => {
  // First ensure tables exist
  await migrateDatabase();

  const connection = await pool.getConnection();
  try {
    console.log("Seeding MySQL Database with Initial Data...");

    // 1. Seed Super Admin User
    const superEmail = process.env.SUPER_EMAIL || "super@coffee.com";
    const superPassword = process.env.SUPER_PASSWORD || "123456";
    const superUsername = process.env.SUPER_USERNAME || "superadmin";

    const [existingUsers]: any = await connection.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [superEmail]
    );

    if (existingUsers.length === 0) {
      const hashedPassword = await bcryptjs.hash(superPassword, 10);
      await connection.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [superUsername, superEmail, hashedPassword, "super"]
      );
      console.log(`✓ Super Admin seeded (${superEmail} / ${superPassword})`);
    } else {
      console.log(`ℹ Super Admin (${superEmail}) already exists`);
    }

    // 2. Seed Default Categories
    const categories = [
      { name: "Meat", note: "Fresh meat, poultry, beef, pork & BBQ" },
      { name: "Coffee", note: "Espresso, Latte, Cappuccino & specialty brews" },
      { name: "Tea", note: "Green tea, Matcha, Earl Grey, Herbal infusions" },
      { name: "Pastries", note: "Freshly baked croissants, muffins, cookies" },
      { name: "Beans", note: "Whole roasted beans (Arabica, Robusta 250g/500g)" },
    ];

    for (const cat of categories) {
      await connection.query(
        "INSERT IGNORE INTO categories (name, note) VALUES (?, ?)",
        [cat.name, cat.note]
      );
    }
    console.log("✓ Categories seeded");

    // 3. Seed Default Customer
    await connection.query(
      "INSERT IGNORE INTO customers (name, phone, address, note) VALUES (?, ?, ?, ?)",
      ["Walk-in Customer", "012345678", "Phnom Penh", "Default retail customer"]
    );
    console.log("✓ Default Customer seeded");

    // 4. Seed Default Supplier
    await connection.query(
      "INSERT IGNORE INTO suppliers (business_name, name, phone, address, note) VALUES (?, ?, ?, ?, ?)",
      [
        "Mondulkiri Coffee Beans Co.",
        "Sokha Bean Importer",
        "098765432",
        "Mondulkiri, Cambodia",
        "Organic highland roasted coffee beans supplier",
      ]
    );
    console.log("✓ Default Supplier seeded");

    // 5. Seed Default Products
    const [catRows]: any = await connection.query("SELECT id, name FROM categories");
    const catMap = new Map(catRows.map((c: any) => [c.name, c.id]));

    const defaultProducts = [
      {
        name: "សាច់ជ្រូកបេខុនអាំងផ្សែង",
        category: "Meat",
        code: "1190",
        image_url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&auto=format&fit=crop&q=80",
        cost_price: 4.5,
        sale_price: 3.38,
        current_stock: 170,
        note: "Smoked Bacon BBQ Premium Pack",
      },
      {
        name: "មាន់ស្រែមួយក្បាល ១.២គក",
        category: "Meat",
        code: "1034",
        image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80",
        cost_price: 5.9,
        sale_price: 4.43,
        current_stock: 142,
        note: "Whole Free-Range Farm Chicken 1.2kg",
      },
      {
        name: "ទ្រូងមាន់អត់ឆ្អឹង ១គក",
        category: "Meat",
        code: "1082",
        image_url: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80",
        cost_price: 4.9,
        sale_price: 3.68,
        current_stock: 142,
        note: "Fresh Boneless Chicken Breast 1kg",
      },
      {
        name: "សាច់គោស្រស់អាំង / Beef Steak",
        category: "Meat",
        code: "1205",
        image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80",
        cost_price: 8.5,
        sale_price: 6.99,
        current_stock: 95,
        note: "Prime Australian Cut Beef Steak",
      },
      {
        name: "Iced Caramel Macchiato",
        category: "Coffee",
        code: "2001",
        image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80",
        cost_price: 4.5,
        sale_price: 3.5,
        current_stock: 50,
        note: "Espresso with vanilla syrup, steamed milk and caramel drizzle",
      },
      {
        name: "Double Shot Espresso",
        category: "Coffee",
        code: "2002",
        image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
        cost_price: 3.5,
        sale_price: 2.8,
        current_stock: 80,
        note: "Rich and bold double shot espresso",
      },
      {
        name: "Butter Croissant",
        category: "Pastries",
        code: "3001",
        image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80",
        cost_price: 3.5,
        sale_price: 2.75,
        current_stock: 35,
        note: "Golden flaky French butter croissant",
      },
      {
        name: "Matcha Green Tea Latte",
        category: "Tea",
        code: "4001",
        image_url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
        cost_price: 4.8,
        sale_price: 3.9,
        current_stock: 40,
        note: "Japanese Uji matcha with steamed milk",
      },
      {
        name: "Iced Americano",
        category: "Coffee",
        code: "2003",
        image_url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80",
        cost_price: 3.5,
        sale_price: 2.9,
        current_stock: 60,
        note: "Fresh espresso poured over chilled water and ice",
      },
    ];

    for (const prod of defaultProducts) {
      const categoryId = catMap.get(prod.category) || null;
      await connection.query(
        `INSERT IGNORE INTO products 
         (name, category_id, code, image_url, cost_price, sale_price, current_stock, note) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.name,
          categoryId,
          prod.code,
          prod.image_url,
          prod.cost_price,
          prod.sale_price,
          prod.current_stock,
          prod.note,
        ]
      );
    }
    console.log("✓ Default Products seeded");

    // 6. Seed Counters
    await connection.query(
      "INSERT IGNORE INTO counters (id, sequence_value) VALUES ('product_code', 10), ('invoice_number', 100)"
    );
    console.log("✓ Counters initialized");

    console.log("\n==========================================");
    console.log("🎉 Database seeding completed successfully!");
    console.log("==========================================\n");
  } catch (error: any) {
    console.error("Seeding Error:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};

// Run if executed directly
if (require.main === module || process.argv[1]?.includes("seeder")) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
