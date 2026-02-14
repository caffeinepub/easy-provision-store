import { useNavigate } from '@tanstack/react-router';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart, getSubtotal } = useCart();
  const subtotal = getSubtotal();
  const isEmpty = cart.items.length === 0;

  const formatPrice = (price: bigint) => {
    return (Number(price) / 100).toFixed(2);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Shopping Cart</h2>
        <p className="text-muted-foreground">Review your items before checkout</p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-xl font-semibold">Your cart is empty</h3>
          <p className="mb-6 text-muted-foreground">
            Add some products to get started
          </p>
          <Button onClick={() => navigate({ to: '/' })}>
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cart Items ({cart.items.length})</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId.toString()}>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="mt-1 text-lg font-bold text-primary">
                          ${formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.productId)}
                          className="ml-2 h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${formatPrice(subtotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${formatPrice(subtotal)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  onClick={() => navigate({ to: '/checkout' })}
                  disabled={isEmpty}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: '/' })}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
