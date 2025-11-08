import { Check } from "lucide-react";

type OrderStatus = 'requested' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

export default function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  const statuses: OrderStatus[] = ['requested', 'confirmed', 'preparing', 'ready', 'completed'];
  
  if (currentStatus === 'cancelled') {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-destructive font-semibold text-center">Order Cancelled</p>
      </div>
    );
  }

  const currentIndex = statuses.indexOf(currentStatus);

  const statusLabels: Record<OrderStatus, string> = {
    requested: 'Requested',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <div className="w-full" data-testid="timeline-order-status">
      <div className="flex items-center justify-between">
        {statuses.map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={status} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'bg-background border-border text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                  data-testid={`timeline-step-${status}`}
                >
                  {isActive && <Check className="w-5 h-5" />}
                </div>
                <p className={`text-xs mt-2 font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {statusLabels[status]}
                </p>
              </div>
              {index < statuses.length - 1 && (
                <div 
                  className={`h-0.5 flex-1 ${
                    index < currentIndex ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
