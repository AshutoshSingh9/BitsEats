import StatusBadge from '../StatusBadge';

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="open" />
      <StatusBadge status="closed" />
      <StatusBadge status="requested" />
      <StatusBadge status="confirmed" />
      <StatusBadge status="preparing" />
      <StatusBadge status="ready" />
      <StatusBadge status="completed" />
      <StatusBadge status="cancelled" />
    </div>
  );
}
