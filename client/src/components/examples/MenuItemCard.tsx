import MenuItemCard from '../MenuItemCard';

export default function MenuItemCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <MenuItemCard
        id="1"
        name="Masala Dosa"
        description="Crispy dosa filled with spiced potato"
        price={60}
        isAvailable={true}
        onQuantityChange={(qty) => console.log('Quantity:', qty)}
      />
      <MenuItemCard
        id="2"
        name="Paneer Tikka"
        description="Grilled paneer with spices"
        price={120}
        isAvailable={true}
        onQuantityChange={(qty) => console.log('Quantity:', qty)}
      />
      <MenuItemCard
        id="3"
        name="Veg Biryani"
        description="Aromatic rice with mixed vegetables"
        price={100}
        isAvailable={false}
        onQuantityChange={(qty) => console.log('Quantity:', qty)}
      />
    </div>
  );
}
