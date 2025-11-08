import { useState, useEffect } from "react";
import Header from "@/components/Header";
import OrderStatusTimeline from "@/components/OrderStatusTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, Phone, MapPin } from "lucide-react";
import { useLocation, useParams } from "wouter";

type OrderStatus = 'requested' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export default function OrderTracking() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const orderId = params.id;

  const [orderStatus, setOrderStatus] = useState<OrderStatus>('requested');

  useEffect(() => {
    const statuses: OrderStatus[] = ['requested', 'confirmed', 'preparing', 'ready', 'completed'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statuses.length - 1) {
        currentIndex++;
        setOrderStatus(statuses[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const order = {
    id: orderId,
    vendorName: 'Campus Canteen',
    vendorPhone: '+91 98765 43210',
    vendorContact: 'Ramesh Kumar',
    etaMinutes: orderStatus !== 'requested' ? 15 : null,
    items: [
      { name: 'Masala Dosa', quantity: 2, price: 60 },
      { name: 'Paneer Tikka', quantity: 1, price: 120 },
    ],
    total: 240,
    createdAt: 'Just now',
    customerName: 'Rahul Sharma',
    roomNo: 'A-201',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={0}
        isAuthenticated={true}
        userEmail="student@goa.bits-pilani.ac.in"
        onCartClick={() => {}}
        onProfileClick={() => console.log('Profile clicked')}
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
          <p className="text-muted-foreground">{order.createdAt}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusTimeline currentStatus={orderStatus} />
              
              {order.etaMinutes && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold text-lg">ETA: {order.etaMinutes} minutes</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {orderStatus !== 'requested' && (
            <Card>
              <CardHeader>
                <CardTitle>Vendor Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{order.vendorContact}</span>
                  <span className="text-muted-foreground">{order.vendorPhone}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>Room {order.roomNo}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.customerName}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span data-testid="text-order-total">₹{order.total}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
