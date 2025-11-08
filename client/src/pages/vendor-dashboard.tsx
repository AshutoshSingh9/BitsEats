import { useState } from "react";
import Header from "@/components/Header";
import VendorDashboardOrderCard from "@/components/VendorDashboardOrderCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type OrderStatus = 'requested' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface Order {
  orderId: string;
  customerName: string;
  customerPhone: string;
  roomNo: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: OrderStatus;
  createdAt: string;
  etaMinutes?: number;
}

export default function VendorDashboard() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([
    {
      orderId: 'ORD001',
      customerName: 'Rahul Sharma',
      customerPhone: '+91 98765 43210',
      roomNo: 'A-201',
      items: [
        { name: 'Masala Dosa', quantity: 2, price: 60 },
        { name: 'Filter Coffee', quantity: 1, price: 30 },
      ],
      total: 150,
      status: 'requested',
      createdAt: '2 mins ago',
    },
    {
      orderId: 'ORD002',
      customerName: 'Priya Desai',
      customerPhone: '+91 87654 32109',
      roomNo: 'B-305',
      items: [{ name: 'Paneer Tikka', quantity: 1, price: 120 }],
      total: 120,
      status: 'confirmed',
      createdAt: '5 mins ago',
      etaMinutes: 15,
    },
    {
      orderId: 'ORD003',
      customerName: 'Amit Patel',
      customerPhone: '+91 76543 21098',
      roomNo: 'C-102',
      items: [
        { name: 'Veg Biryani', quantity: 1, price: 100 },
        { name: 'Raita', quantity: 1, price: 20 },
      ],
      total: 120,
      status: 'preparing',
      createdAt: '10 mins ago',
      etaMinutes: 10,
    },
    {
      orderId: 'ORD004',
      customerName: 'Sneha Reddy',
      customerPhone: '+91 65432 10987',
      roomNo: 'D-405',
      items: [{ name: 'Butter Naan', quantity: 3, price: 30 }],
      total: 90,
      status: 'ready',
      createdAt: '15 mins ago',
      etaMinutes: 5,
    },
    {
      orderId: 'ORD005',
      customerName: 'Vijay Kumar',
      customerPhone: '+91 54321 09876',
      roomNo: 'E-101',
      items: [{ name: 'Dal Makhani', quantity: 2, price: 80 }],
      total: 160,
      status: 'completed',
      createdAt: '1 hour ago',
      etaMinutes: 20,
    },
  ]);

  const handleConfirmOrder = (orderId: string, etaMinutes: number) => {
    setOrders(orders.map(order => 
      order.orderId === orderId 
        ? { ...order, status: 'confirmed', etaMinutes }
        : order
    ));
    toast({
      title: "Order Confirmed",
      description: `Order ${orderId} confirmed with ${etaMinutes} min ETA`,
    });
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.orderId === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    toast({
      title: "Status Updated",
      description: `Order ${orderId} marked as ${newStatus}`,
    });
  };

  const requestedOrders = orders.filter(o => o.status === 'requested');
  const activeOrders = orders.filter(o => ['confirmed', 'preparing', 'ready'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={0}
        isAuthenticated={true}
        userEmail="vendor@goa.bits-pilani.ac.in"
        onCartClick={() => {}}
        onProfileClick={() => console.log('Profile clicked')}
      />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="new" data-testid="tab-new-orders">
              New ({requestedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active-orders">
              Active ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed-orders">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requestedOrders.map((order) => (
                <VendorDashboardOrderCard
                  key={order.orderId}
                  {...order}
                  onConfirm={(eta) => handleConfirmOrder(order.orderId, eta)}
                />
              ))}
              {requestedOrders.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No new orders
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.map((order) => (
                <VendorDashboardOrderCard
                  key={order.orderId}
                  {...order}
                  onUpdateStatus={(status) => handleUpdateStatus(order.orderId, status)}
                />
              ))}
              {activeOrders.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No active orders
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedOrders.map((order) => (
                <VendorDashboardOrderCard
                  key={order.orderId}
                  {...order}
                />
              ))}
              {completedOrders.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No completed orders
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
