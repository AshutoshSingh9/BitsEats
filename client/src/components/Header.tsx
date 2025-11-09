import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  cartItemCount?: number;
  isAuthenticated?: boolean;
  userEmail?: string;
  onCartClick?: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export default function Header({ 
  cartItemCount = 0, 
  isAuthenticated = false,
  userEmail,
  onCartClick,
  onLoginClick,
  onLogoutClick
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">🍔</div>
          <h1 className="text-xl font-bold">BITS Goa Campus Food</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={onCartClick}
            data-testid="button-cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                data-testid="badge-cart-count"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>
          
          {isAuthenticated ? (
            <Button 
              variant="outline"
              onClick={onLogoutClick}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button 
              onClick={onLoginClick}
              data-testid="button-login"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
