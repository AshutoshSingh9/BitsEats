import VendorDashboardOrderCard from '../VendorDashboardOrderCard';

export default function VendorDashboardOrderCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <VendorDashboardOrderCard
        orderId="ORD001"
        customerName="Rahul Sharma"
        customerPhone="+91 98765 43210"
        roomNo="A-201"
        items={[
          { name: 'Masala Dosa', quantity: 2, price: 60 },
          { name: 'Filter Coffee', quantity: 1, price: 30 },
        ]}
        total={150}
        status="requested"
        createdAt="2 mins ago"
        onConfirm={(eta) => console.log('Confirmed with ETA:', eta)}
      />
      <VendorDashboardOrderCard
        orderId="ORD002"
        customerName="Priya Desai"
        customerPhone="+91 87654 32109"
        roomNo="B-305"
        items={[
          { name: 'Paneer Tikka', quantity: 1, price: 120 },
        ]}
        total={120}
        status="confirmed"
        createdAt="5 mins ago"
        etaMinutes={15}
        onUpdateStatus={(status) => console.log('Updated to:', status)}
      />
      <VendorDashboardOrderCard
        orderId="ORD003"
        customerName="Amit Patel"
        customerPhone="+91 76543 21098"
        roomNo="C-102"
        items={[
          { name: 'Veg Biryani', quantity: 1, price: 100 },
          { name: 'Raita', quantity: 1, price: 20 },
        ]}
        total={120}
        status="preparing"
        createdAt="10 mins ago"
        etaMinutes={10}
        onUpdateStatus={(status) => console.log('Updated to:', status)}
      />
    </div>
  );
}
