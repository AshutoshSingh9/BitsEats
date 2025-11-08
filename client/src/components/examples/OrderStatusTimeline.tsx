import OrderStatusTimeline from '../OrderStatusTimeline';

export default function OrderStatusTimelineExample() {
  return (
    <div className="space-y-8 p-4">
      <div>
        <h3 className="text-sm font-medium mb-4">Requested</h3>
        <OrderStatusTimeline currentStatus="requested" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Confirmed</h3>
        <OrderStatusTimeline currentStatus="confirmed" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Preparing</h3>
        <OrderStatusTimeline currentStatus="preparing" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Ready</h3>
        <OrderStatusTimeline currentStatus="ready" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Completed</h3>
        <OrderStatusTimeline currentStatus="completed" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4">Cancelled</h3>
        <OrderStatusTimeline currentStatus="cancelled" />
      </div>
    </div>
  );
}
