import { db } from "./db";
import { users } from "@shared/schema";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

async function createMasterAccounts() {
  console.log("🔐 Creating master accounts...");

  const SALT_ROUNDS = 10;

  // Master Vendor Account
  const vendorEmail = "vendor@goa.bits-pilani.ac.in";
  const vendorPassword = "vendor123";
  const vendorPasswordHash = await bcrypt.hash(vendorPassword, SALT_ROUNDS);

  const existingVendor = await db.select().from(users).where(eq(users.email, vendorEmail)).limit(1);
  
  if (existingVendor.length === 0) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: vendorEmail,
      firstName: "Master",
      lastName: "Vendor",
      role: "vendor",
      passwordHash: vendorPasswordHash,
    });
    console.log("✅ Created vendor account:");
    console.log("   Email: vendor@goa.bits-pilani.ac.in");
    console.log("   Password: vendor123");
  } else {
    await db.update(users)
      .set({ passwordHash: vendorPasswordHash })
      .where(eq(users.email, vendorEmail));
    console.log("✅ Updated existing vendor account password");
  }

  // Master Admin Account
  const adminEmail = "admin@goa.bits-pilani.ac.in";
  const adminPassword = "admin123";
  const adminPasswordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const existingAdmin = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  
  if (existingAdmin.length === 0) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: adminEmail,
      firstName: "Master",
      lastName: "Admin",
      role: "admin",
      passwordHash: adminPasswordHash,
    });
    console.log("✅ Created admin account:");
    console.log("   Email: admin@goa.bits-pilani.ac.in");
    console.log("   Password: admin123");
  } else {
    await db.update(users)
      .set({ passwordHash: adminPasswordHash })
      .where(eq(users.email, adminEmail));
    console.log("✅ Updated existing admin account password");
  }

  // Master Student Account
  const studentEmail = "student@goa.bits-pilani.ac.in";
  const studentPassword = "student123";
  const studentPasswordHash = await bcrypt.hash(studentPassword, SALT_ROUNDS);

  const existingStudent = await db.select().from(users).where(eq(users.email, studentEmail)).limit(1);
  
  if (existingStudent.length === 0) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: studentEmail,
      firstName: "Test",
      lastName: "Student",
      phone: "+91 98765 43210",
      roomNo: "A-201",
      role: "student",
      passwordHash: studentPasswordHash,
    });
    console.log("✅ Created student account:");
    console.log("   Email: student@goa.bits-pilani.ac.in");
    console.log("   Password: student123");
  } else {
    await db.update(users)
      .set({ passwordHash: studentPasswordHash })
      .where(eq(users.email, studentEmail));
    console.log("✅ Updated existing student account password");
  }

  console.log("");
  console.log("📝 Master Credentials Summary:");
  console.log("================================");
  console.log("Vendor Login:");
  console.log("  Email: vendor@goa.bits-pilani.ac.in");
  console.log("  Password: vendor123");
  console.log("");
  console.log("Admin Login:");
  console.log("  Email: admin@goa.bits-pilani.ac.in");
  console.log("  Password: admin123");
  console.log("");
  console.log("Student Login:");
  console.log("  Email: student@goa.bits-pilani.ac.in");
  console.log("  Password: student123");
  console.log("================================");
}

createMasterAccounts()
  .catch((error) => {
    console.error("❌ Error creating master accounts:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
