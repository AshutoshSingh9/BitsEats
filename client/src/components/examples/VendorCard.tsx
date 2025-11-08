import VendorCard from '../VendorCard';

export default function VendorCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <VendorCard
        id="1"
        name="Campus Canteen"
        description="Indian, Chinese, Continental cuisine"
        isOpen={true}
        prepTime={15}
        onClick={() => console.log('Vendor 1 clicked')}
      />
      <VendorCard
        id="2"
        name="Night Canteen"
        description="Late night snacks and beverages"
        isOpen={false}
        prepTime={10}
        onClick={() => console.log('Vendor 2 clicked')}
      />
      <VendorCard
        id="3"
        name="Juice Center"
        description="Fresh juices and smoothies"
        isOpen={true}
        prepTime={5}
        onClick={() => console.log('Vendor 3 clicked')}
      />
    </div>
  );
}
