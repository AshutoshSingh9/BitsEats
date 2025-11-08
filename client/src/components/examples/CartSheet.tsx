import CartSheet from '../CartSheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function CartSheetExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([
    { id: '1', name: 'Masala Dosa', price: 60, quantity: 2 },
    { id: '2', name: 'Paneer Tikka', price: 120, quantity: 1 },
  ]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setItems(items.filter(item => item.id !== itemId));
    } else {
      setItems(items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  return (
    <CartSheet
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      items={items}
      onQuantityChange={handleQuantityChange}
      onRemoveItem={(id) => setItems(items.filter(item => item.id !== id))}
      onCheckout={() => console.log('Checkout clicked')}
      trigger={<Button>Open Cart</Button>}
    />
  );
}
