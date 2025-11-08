import { useState } from "react";
import Header from "@/components/Header";
import MenuItemCard from "@/components/MenuItemCard";
import CartSheet from "@/components/CartSheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Phone } from "lucide-react";
import { useLocation, useParams } from "wouter";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function VendorMenu() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const vendorId = params.id;

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const vendor = {
    id: vendorId,
    name: 'Campus Canteen',
    contactName: 'Ramesh Kumar',
    contactPhone: '+91 98765 43210',
    openingHours: '8:00 AM - 10:00 PM',
  };

  const menuItems = [
    { id: '1', name: 'Masala Dosa', description: 'Crispy dosa filled with spiced potato', price: 60, isAvailable: true },
    { id: '2', name: 'Paneer Tikka', description: 'Grilled paneer with spices', price: 120, isAvailable: true },
    { id: '3', name: 'Veg Biryani', description: 'Aromatic rice with mixed vegetables', price: 100, isAvailable: false },
    { id: '4', name: 'Butter Naan', description: 'Soft flatbread with butter', price: 30, isAvailable: true },
    { id: '5', name: 'Dal Makhani', description: 'Creamy black lentils', price: 80, isAvailable: true },
    { id: '6', name: 'Chana Masala', description: 'Spiced chickpea curry', price: 70, isAvailable: true },
  ];

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(c => c.id === itemId);
      
      if (quantity === 0) {
        return prevCart.filter(c => c.id !== itemId);
      }
      
      if (existingItem) {
        return prevCart.map(c => c.id === itemId ? { ...c, quantity } : c);
      }
      
      return [...prevCart, { id: itemId, name: item.name, price: item.price, quantity }];
    });
  };

  const handleCartQuantityChange = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(c => c.id !== itemId));
    } else {
      setCart(cart.map(c => c.id === itemId ? { ...c, quantity } : c));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        isAuthenticated={false}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => console.log('Login clicked')}
      />

      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/')}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vendors
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{vendor.openingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{vendor.contactPhone}</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              {...item}
              quantity={cart.find(c => c.id === item.id)?.quantity || 0}
              onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
            />
          ))}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-4 right-4">
            <Button 
              size="lg" 
              onClick={() => setIsCartOpen(true)}
              data-testid="button-view-cart"
            >
              View Cart ({cart.length} items)
            </Button>
          </div>
        )}
      </main>

      <CartSheet
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cart}
        onQuantityChange={handleCartQuantityChange}
        onRemoveItem={(id) => setCart(cart.filter(c => c.id !== id))}
        onCheckout={() => setLocation('/checkout')}
      />
    </div>
  );
}
