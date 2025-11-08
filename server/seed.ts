import { db } from "./db";
import { users, vendors, menuItems } from "@shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  console.log("Creating admin user...");
  await db.insert(users).values({
    id: crypto.randomUUID(),
    email: "admin@goa.bits-pilani.ac.in",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  }).onConflictDoNothing();

  console.log("Creating test student user...");
  await db.insert(users).values({
    id: crypto.randomUUID(),
    email: "student@goa.bits-pilani.ac.in",
    firstName: "Test",
    lastName: "Student",
    phone: "+91 98765 43210",
    roomNo: "A-201",
    role: "student",
  }).onConflictDoNothing();

  console.log("Creating vendors...");
  const [canteen] = await db.insert(vendors).values({
    name: "Campus Canteen",
    description: "Indian, Chinese, Continental cuisine",
    contactName: "Ramesh Kumar",
    contactPhone: "+91 98765 43210",
    email: "canteen@goa.bits-pilani.ac.in",
    openingHours: "8:00 AM - 10:00 PM",
    prepTimeMinutes: 15,
    active: true,
  }).returning();

  const [nightCanteen] = await db.insert(vendors).values({
    name: "Night Canteen",
    description: "Late night snacks and beverages",
    contactName: "Suresh Patel",
    contactPhone: "+91 87654 32109",
    email: "nightcanteen@goa.bits-pilani.ac.in",
    openingHours: "8:00 PM - 2:00 AM",
    prepTimeMinutes: 10,
    active: true,
  }).returning();

  const [juiceCenter] = await db.insert(vendors).values({
    name: "Juice Center",
    description: "Fresh juices and smoothies",
    contactName: "Vikram Singh",
    contactPhone: "+91 76543 21098",
    email: "juice@goa.bits-pilani.ac.in",
    openingHours: "7:00 AM - 9:00 PM",
    prepTimeMinutes: 5,
    active: true,
  }).returning();

  const [coffeeShop] = await db.insert(vendors).values({
    name: "Coffee Shop",
    description: "Coffee, tea, and light snacks",
    contactName: "Priya Sharma",
    contactPhone: "+91 65432 10987",
    email: "coffee@goa.bits-pilani.ac.in",
    openingHours: "6:00 AM - 11:00 PM",
    prepTimeMinutes: 8,
    active: true,
  }).returning();

  const [foodCourt] = await db.insert(vendors).values({
    name: "Food Court",
    description: "Multiple cuisines under one roof",
    contactName: "Anil Reddy",
    contactPhone: "+91 54321 09876",
    email: "foodcourt@goa.bits-pilani.ac.in",
    openingHours: "11:00 AM - 10:00 PM",
    prepTimeMinutes: 20,
    active: false,
  }).returning();

  console.log("Creating menu items...");
  
  await db.insert(menuItems).values([
    {
      vendorId: canteen.id,
      name: "Masala Dosa",
      description: "Crispy dosa filled with spiced potato",
      price: "60.00",
      isAvailable: true,
    },
    {
      vendorId: canteen.id,
      name: "Paneer Tikka",
      description: "Grilled paneer with spices",
      price: "120.00",
      isAvailable: true,
    },
    {
      vendorId: canteen.id,
      name: "Veg Biryani",
      description: "Aromatic rice with mixed vegetables",
      price: "100.00",
      isAvailable: false,
    },
    {
      vendorId: canteen.id,
      name: "Butter Naan",
      description: "Soft flatbread with butter",
      price: "30.00",
      isAvailable: true,
    },
    {
      vendorId: canteen.id,
      name: "Dal Makhani",
      description: "Creamy black lentils",
      price: "80.00",
      isAvailable: true,
    },
    {
      vendorId: canteen.id,
      name: "Chana Masala",
      description: "Spiced chickpea curry",
      price: "70.00",
      isAvailable: true,
    },
    {
      vendorId: nightCanteen.id,
      name: "Maggi Noodles",
      description: "Spicy instant noodles",
      price: "40.00",
      isAvailable: true,
    },
    {
      vendorId: nightCanteen.id,
      name: "Veg Sandwich",
      description: "Grilled vegetable sandwich",
      price: "50.00",
      isAvailable: true,
    },
    {
      vendorId: nightCanteen.id,
      name: "Chai",
      description: "Hot Indian tea",
      price: "15.00",
      isAvailable: true,
    },
    {
      vendorId: juiceCenter.id,
      name: "Mango Smoothie",
      description: "Fresh mango blended smoothie",
      price: "60.00",
      isAvailable: true,
    },
    {
      vendorId: juiceCenter.id,
      name: "Watermelon Juice",
      description: "Fresh watermelon juice",
      price: "40.00",
      isAvailable: true,
    },
    {
      vendorId: juiceCenter.id,
      name: "Mixed Fruit Bowl",
      description: "Seasonal fresh fruits",
      price: "80.00",
      isAvailable: true,
    },
    {
      vendorId: coffeeShop.id,
      name: "Cappuccino",
      description: "Classic Italian coffee",
      price: "60.00",
      isAvailable: true,
    },
    {
      vendorId: coffeeShop.id,
      name: "Cold Coffee",
      description: "Chilled coffee with ice cream",
      price: "80.00",
      isAvailable: true,
    },
    {
      vendorId: coffeeShop.id,
      name: "Chocolate Croissant",
      description: "Buttery croissant with chocolate",
      price: "70.00",
      isAvailable: true,
    },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
