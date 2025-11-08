import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export default function MenuItemCard({ 
  id, 
  name, 
  description, 
  price, 
  isAvailable,
  quantity = 0,
  onQuantityChange
}: MenuItemCardProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const handleIncrease = () => {
    const newQty = localQuantity + 1;
    setLocalQuantity(newQty);
    onQuantityChange?.(newQty);
  };

  const handleDecrease = () => {
    if (localQuantity > 0) {
      const newQty = localQuantity - 1;
      setLocalQuantity(newQty);
      onQuantityChange?.(newQty);
    }
  };

  return (
    <Card 
      className={`${!isAvailable ? 'opacity-50' : ''}`}
      data-testid={`card-menu-item-${id}`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-base">{name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            <p className="font-semibold text-lg mt-2">₹{price}</p>
            {!isAvailable && (
              <p className="text-sm text-destructive mt-1">Currently unavailable</p>
            )}
          </div>
          {isAvailable && (
            <div className="flex items-center gap-2">
              {localQuantity === 0 ? (
                <Button 
                  size="sm" 
                  onClick={handleIncrease}
                  data-testid={`button-add-${id}`}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={handleDecrease}
                    data-testid={`button-decrease-${id}`}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold" data-testid={`text-quantity-${id}`}>
                    {localQuantity}
                  </span>
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={handleIncrease}
                    data-testid={`button-increase-${id}`}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
