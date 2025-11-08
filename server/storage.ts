import { db } from "./db";
import { users, vendors, menuItems, orders, orderItems, type User, type Vendor, type MenuItem, type Order, type OrderItem, type InsertOrder, type InsertOrderItem, type OrderStatus } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(userData: UpsertUser): Promise<User>;
  createUser(email: string, name: string, role: User["role"]): Promise<User>;
  
  getVendors(activeOnly?: boolean): Promise<Vendor[]>;
  getVendorById(id: string): Promise<Vendor | undefined>;
  createVendor(data: Omit<typeof vendors.$inferInsert, 'id' | 'createdAt'>): Promise<Vendor>;
  updateVendor(id: string, data: Partial<Omit<typeof vendors.$inferInsert, 'id' | 'createdAt'>>): Promise<Vendor | undefined>;
  deleteVendor(id: string): Promise<void>;
  
  getMenuItemsByVendor(vendorId: string): Promise<MenuItem[]>;
  getAllMenuItems(): Promise<MenuItem[]>;
  createMenuItem(data: Omit<typeof menuItems.$inferInsert, 'id' | 'createdAt'>): Promise<MenuItem>;
  updateMenuItem(id: string, data: Partial<Omit<typeof menuItems.$inferInsert, 'id' | 'createdAt'>>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<void>;
  
  createOrder(orderData: InsertOrder, items: Array<{ menuItemId: string; quantity: number }>): Promise<Order>;
  getOrderById(id: string): Promise<(Order & { items: (OrderItem & { menuItem: MenuItem })[], vendor: Vendor, user: User }) | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  getVendorOrders(vendorId: string, statusFilter?: OrderStatus[]): Promise<(Order & { items: (OrderItem & { menuItem: MenuItem })[], user: User })[]>;
  updateOrderStatus(id: string, status: OrderStatus, etaMinutes?: number, vendorNote?: string): Promise<Order | undefined>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async upsertUser(userData: typeof users.$inferInsert): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createUser(email: string, name: string, role: User["role"]): Promise<User> {
    const [user] = await db.insert(users).values({ 
      id: crypto.randomUUID(),
      email, 
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || null,
      role 
    }).returning();
    return user;
  }

  async getVendors(activeOnly = false): Promise<Vendor[]> {
    if (activeOnly) {
      return db.select().from(vendors).where(eq(vendors.active, true));
    }
    return db.select().from(vendors);
  }

  async getVendorById(id: string): Promise<Vendor | undefined> {
    const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
    return result[0];
  }

  async createVendor(data: Omit<typeof vendors.$inferInsert, 'id' | 'createdAt'>): Promise<Vendor> {
    const [vendor] = await db.insert(vendors).values(data).returning();
    return vendor;
  }

  async updateVendor(id: string, data: Partial<Omit<typeof vendors.$inferInsert, 'id' | 'createdAt'>>): Promise<Vendor | undefined> {
    const [vendor] = await db.update(vendors).set(data).where(eq(vendors.id, id)).returning();
    return vendor;
  }

  async deleteVendor(id: string): Promise<void> {
    await db.delete(vendors).where(eq(vendors.id, id));
  }

  async getMenuItemsByVendor(vendorId: string): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.vendorId, vendorId));
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems);
  }

  async createMenuItem(data: Omit<typeof menuItems.$inferInsert, 'id' | 'createdAt'>): Promise<MenuItem> {
    const [item] = await db.insert(menuItems).values(data).returning();
    return item;
  }

  async updateMenuItem(id: string, data: Partial<Omit<typeof menuItems.$inferInsert, 'id' | 'createdAt'>>): Promise<MenuItem | undefined> {
    const [item] = await db.update(menuItems).set(data).where(eq(menuItems.id, id)).returning();
    return item;
  }

  async deleteMenuItem(id: string): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }

  async createOrder(orderData: InsertOrder, items: Array<{ menuItemId: string; quantity: number }>): Promise<Order> {
    let totalAmount = 0;
    const orderItemsData: InsertOrderItem[] = [];

    for (const item of items) {
      const menuItem = await db.select().from(menuItems).where(eq(menuItems.id, item.menuItemId)).limit(1);
      if (!menuItem[0]) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      
      const unitPrice = parseFloat(menuItem[0].price);
      const totalPrice = unitPrice * item.quantity;
      totalAmount += totalPrice;

      orderItemsData.push({
        orderId: '',
        menuItemId: item.menuItemId,
        menuItemName: menuItem[0].name,
        quantity: item.quantity,
        unitPrice: menuItem[0].price,
        totalPrice: totalPrice.toFixed(2),
      });
    }

    const [order] = await db.insert(orders).values({
      ...orderData,
      totalAmount: totalAmount.toFixed(2),
    }).returning();

    for (const item of orderItemsData) {
      await db.insert(orderItems).values({
        ...item,
        orderId: order.id,
      });
    }

    return order;
  }

  async getOrderById(id: string): Promise<(Order & { items: (OrderItem & { menuItem: MenuItem })[], vendor: Vendor, user: User }) | undefined> {
    const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!order[0]) return undefined;

    const items = await db.select({
      orderItem: orderItems,
      menuItem: menuItems,
    }).from(orderItems)
      .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .where(eq(orderItems.orderId, id));

    const vendor = await db.select().from(vendors).where(eq(vendors.id, order[0].vendorId)).limit(1);
    const user = await db.select().from(users).where(eq(users.id, order[0].userId)).limit(1);

    return {
      ...order[0],
      items: items.map(i => ({ ...i.orderItem, menuItem: i.menuItem! })),
      vendor: vendor[0],
      user: user[0],
    };
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getVendorOrders(vendorId: string, statusFilter?: OrderStatus[]): Promise<(Order & { items: (OrderItem & { menuItem: MenuItem })[], user: User })[]> {
    let query = db.select().from(orders).where(eq(orders.vendorId, vendorId));
    
    const ordersResult = await query.orderBy(desc(orders.createdAt));

    const ordersWithDetails = await Promise.all(
      ordersResult.map(async (order) => {
        const items = await db.select({
          orderItem: orderItems,
          menuItem: menuItems,
        }).from(orderItems)
          .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
          .where(eq(orderItems.orderId, order.id));

        const user = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);

        return {
          ...order,
          items: items.map(i => ({ ...i.orderItem, menuItem: i.menuItem! })),
          user: user[0],
        };
      })
    );

    if (statusFilter && statusFilter.length > 0) {
      return ordersWithDetails.filter(o => statusFilter.includes(o.status));
    }

    return ordersWithDetails;
  }

  async updateOrderStatus(id: string, status: OrderStatus, etaMinutes?: number, vendorNote?: string): Promise<Order | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (etaMinutes !== undefined) {
      updateData.etaMinutes = etaMinutes;
    }
    if (vendorNote !== undefined) {
      updateData.vendorNote = vendorNote;
    }

    const [order] = await db.update(orders).set(updateData).where(eq(orders.id, id)).returning();
    return order;
  }
}

export const storage = new DbStorage();
