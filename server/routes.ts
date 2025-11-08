import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, requireRole } from "./auth";
import { insertVendorSchema, insertMenuItemSchema, insertOrderSchema, type OrderStatus, orderStatusEnum } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

const connectedClients = new Map<string, Set<WebSocket>>();

function broadcastOrderUpdate(orderId: string, updateData: any) {
  const clients = connectedClients.get(orderId);
  if (clients) {
    const message = JSON.stringify({
      type: 'ORDER_UPDATE',
      orderId,
      ...updateData
    });
    
    clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // ===========================
  // PUBLIC ENDPOINTS
  // ===========================

  app.get("/api/vendors", async (req, res) => {
    try {
      const activeOnly = req.query.activeOnly === 'true';
      const vendors = await storage.getVendors(activeOnly);
      res.json(vendors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const vendor = await storage.getVendorById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/vendors/:id/menu", async (req, res) => {
    try {
      const vendor = await storage.getVendorById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      const menuItems = await storage.getMenuItemsByVendor(req.params.id);
      res.json(menuItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===========================
  // AUTHENTICATED USER ENDPOINTS
  // ===========================

  app.get("/api/users/me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const orderCreateSchema = insertOrderSchema.extend({
        items: z.array(z.object({
          menuItemId: z.string(),
          quantity: z.number().int().positive()
        })).min(1, "At least one item is required")
      });

      const result = orderCreateSchema.safeParse({
        ...req.body,
        userId
      });

      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const { items, ...orderData } = result.data;
      const order = await storage.createOrder(
        orderData,
        items
      );

      res.status(201).json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      const order = await storage.getOrderById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const user = await storage.getUser(userId);
      const canView = order.userId === userId || 
                     order.vendorId === user?.id || 
                     user?.role === 'admin';

      if (!canView) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/users/me/orders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===========================
  // VENDOR ENDPOINTS
  // ===========================

  app.get("/api/vendor/orders", isAuthenticated, requireRole('vendor', 'admin'), async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const vendorId = user.role === 'admin' ? req.query.vendorId as string : user.id;
      
      const statusFilter = req.query.status 
        ? (req.query.status as string).split(',') as OrderStatus[]
        : undefined;

      const orders = await storage.getVendorOrders(vendorId, statusFilter);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/vendor/orders/:id", isAuthenticated, requireRole('vendor', 'admin'), async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const user = await storage.getUser(userId);
      
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (user?.role !== 'admin' && order.vendorId !== user?.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updateOrderSchema = z.object({
        status: z.enum(orderStatusEnum.enumValues),
        etaMinutes: z.number().int().positive().optional(),
        vendorNote: z.string().optional()
      });

      const result = updateOrderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const { status, etaMinutes, vendorNote } = result.data;
      const updatedOrder = await storage.updateOrderStatus(
        req.params.id,
        status,
        etaMinutes,
        vendorNote
      );

      broadcastOrderUpdate(req.params.id, {
        status: updatedOrder?.status,
        etaMinutes: updatedOrder?.etaMinutes,
        vendorNote: updatedOrder?.vendorNote,
        updatedAt: updatedOrder?.updatedAt
      });

      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===========================
  // ADMIN ENDPOINTS - Vendors
  // ===========================

  app.get("/api/admin/vendors", isAuthenticated, requireRole('admin'), async (_req, res) => {
    try {
      const vendors = await storage.getVendors(false);
      res.json(vendors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/vendors", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const result = insertVendorSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const vendor = await storage.createVendor(result.data);
      res.status(201).json(vendor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/vendors/:id", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const result = insertVendorSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const vendor = await storage.updateVendor(req.params.id, result.data);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/vendors/:id", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      await storage.deleteVendor(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===========================
  // ADMIN ENDPOINTS - Menu Items
  // ===========================

  app.get("/api/admin/menu-items", isAuthenticated, requireRole('admin'), async (_req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/menu-items", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const result = insertMenuItemSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const menuItem = await storage.createMenuItem({
        ...result.data,
        price: result.data.price.toString()
      });
      res.status(201).json(menuItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/menu-items/:id", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      const result = insertMenuItemSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: fromZodError(result.error).message 
        });
      }

      const updateData: Record<string, any> = {};
      if (result.data.name !== undefined) updateData.name = result.data.name;
      if (result.data.description !== undefined) updateData.description = result.data.description;
      if (result.data.vendorId !== undefined) updateData.vendorId = result.data.vendorId;
      if (result.data.isAvailable !== undefined) updateData.isAvailable = result.data.isAvailable;
      if (result.data.price !== undefined) updateData.price = result.data.price.toString();

      const menuItem = await storage.updateMenuItem(req.params.id, updateData);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/admin/menu-items/:id", isAuthenticated, requireRole('admin'), async (req, res) => {
    try {
      await storage.deleteMenuItem(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ===========================
  // WEBSOCKET SERVER
  // ===========================

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket client connected');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'SUBSCRIBE_ORDER') {
          const orderId = data.orderId;
          if (!connectedClients.has(orderId)) {
            connectedClients.set(orderId, new Set());
          }
          connectedClients.get(orderId)!.add(ws);
          console.log(`Client subscribed to order: ${orderId}`);
        }
        
        if (data.type === 'UNSUBSCRIBE_ORDER') {
          const orderId = data.orderId;
          const clients = connectedClients.get(orderId);
          if (clients) {
            clients.delete(ws);
            if (clients.size === 0) {
              connectedClients.delete(orderId);
            }
          }
          console.log(`Client unsubscribed from order: ${orderId}`);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      connectedClients.forEach((clients, orderId) => {
        clients.delete(ws);
        if (clients.size === 0) {
          connectedClients.delete(orderId);
        }
      });
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
