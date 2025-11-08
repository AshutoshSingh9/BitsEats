import { useState } from "react";
import Header from "@/components/Header";
import VendorCard from "@/components/VendorCard";
import CartSheet from "@/components/CartSheet";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const vendors = [
    { id: '1', name: 'Campus Canteen', description: 'Indian, Chinese, Continental cuisine', isOpen: true, prepTime: 15 },
    { id: '2', name: 'Night Canteen', description: 'Late night snacks and beverages', isOpen: true, prepTime: 10 },
    { id: '3', name: 'Juice Center', description: 'Fresh juices and smoothies', isOpen: true, prepTime: 5 },
    { id: '4', name: 'Food Court', description: 'Multiple cuisines under one roof', isOpen: false, prepTime: 20 },
    { id: '5', name: 'Coffee Shop', description: 'Coffee, tea, and light snacks', isOpen: true, prepTime: 8 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={0}
        isAuthenticated={false}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => console.log('Login clicked')}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">BITS Goa Campus Food</h2>
          <p className="text-muted-foreground">Order from your favorite campus vendors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              {...vendor}
              onClick={() => setLocation(`/vendor/${vendor.id}`)}
            />
          ))}
        </div>
      </main>

      <CartSheet
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={[]}
        onCheckout={() => setLocation('/checkout')}
      />
    </div>
  );
}
