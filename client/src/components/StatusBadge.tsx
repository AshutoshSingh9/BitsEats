import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'open' | 'closed' | 'requested' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    open: { label: 'Open', className: 'bg-green-500 text-white hover:bg-green-600' },
    closed: { label: 'Closed', className: 'bg-gray-500 text-white hover:bg-gray-600' },
    requested: { label: 'Requested', className: 'bg-blue-500 text-white hover:bg-blue-600' },
    confirmed: { label: 'Confirmed', className: 'bg-green-500 text-white hover:bg-green-600' },
    preparing: { label: 'Preparing', className: 'bg-yellow-500 text-white hover:bg-yellow-600' },
    ready: { label: 'Ready', className: 'bg-orange-500 text-white hover:bg-orange-600' },
    completed: { label: 'Completed', className: 'bg-gray-700 text-white hover:bg-gray-800' },
    cancelled: { label: 'Cancelled', className: 'bg-red-500 text-white hover:bg-red-600' },
  };

  const { label, className } = config[status];

  return (
    <Badge className={className} data-testid={`badge-status-${status}`}>
      {label}
    </Badge>
  );
}
