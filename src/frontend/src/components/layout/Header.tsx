import { useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <img
            src="/assets/generated/easy-provision-logo.dim_512x512.png"
            alt="Easy Provision Store"
            className="h-10 w-10 rounded-lg"
          />
          <div className="flex flex-col items-start">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Easy Provision</h1>
            <p className="text-xs text-muted-foreground">Your neighborhood store</p>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="hidden sm:inline-flex"
          >
            <Store className="mr-2 h-4 w-4" />
            Browse
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/cart' })}
            className="relative"
          >
            <ShoppingCart className="h-4 w-4" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full px-1 text-xs"
              >
                {totalItems}
              </Badge>
            )}
            <span className="ml-2 hidden sm:inline">Cart</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
