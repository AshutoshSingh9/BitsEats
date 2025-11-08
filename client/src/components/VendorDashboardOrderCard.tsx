import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StatusBadge from "./StatusBadge";
import { Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

type OrderStatus = 'requested' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface VendorDashboardOrderCardProps {
  orderId: string;
  customerName: string;
  customerPhone: string;
  roomNo: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  etaMinutes?: number;
  onConfirm?: (etaMinutes: number) => void;
  onUpdateStatus?: (status: OrderStatus) => void;
}

export default function VendorDashboardOrderCard({
  orderId,
  customerName,
  customerPhone,
  roomNo,
  items,
  total,
  status,
  createdAt,
  etaMinutes,
  onConfirm,
  onUpdateStatus
}: VendorDashboardOrderCardProps) {
  const [eta, setEta] = useState(etaMinutes?.toString() || '15');
  const [isExpanded, setIsExpanded] = useState(false);

  const canConfirm = status === 'requested';
  const canUpdateStatus = status === 'confirmed' || status === 'preparing' || status === 'ready';

  const getNextStatus = (): OrderStatus | null => {
    if (status === 'confirmed') return 'preparing';
    if (status === 'preparing') return 'ready';
    if (status === 'ready') return 'completed';
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <Card data-testid={`card-vendor-order-${orderId}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Order #{orderId}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{createdAt}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{customerName}</span>
            <span className="text-muted-foreground">{customerPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>Room {roomNo}</span>
          </div>
        </div>

        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0 h-auto font-semibold"
            data-testid={`button-toggle-items-${orderId}`}
          >
            {items.length} items - ₹{total}
          </Button>
          {isExpanded && (
            <div className="mt-2 space-y-1 text-sm">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {etaMinutes && (
          <div className="flex items-center gap-2 text-sm bg-primary/10 p-2 rounded">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-medium">ETA: {etaMinutes} minutes</span>
          </div>
        )}

        {canConfirm && (
          <div className="space-y-2">
            <Label htmlFor={`eta-${orderId}`}>Set ETA (minutes)</Label>
            <div className="flex gap-2">
              <Input 
                id={`eta-${orderId}`}
                type="number" 
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                placeholder="15"
                className="flex-1"
                data-testid={`input-eta-${orderId}`}
              />
              <Button 
                onClick={() => onConfirm?.(parseInt(eta))}
                data-testid={`button-confirm-${orderId}`}
              >
                Confirm Order
              </Button>
            </div>
          </div>
        )}

        {canUpdateStatus && nextStatus && (
          <Button 
            className="w-full"
            onClick={() => onUpdateStatus?.(nextStatus)}
            data-testid={`button-update-status-${orderId}`}
          >
            Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
