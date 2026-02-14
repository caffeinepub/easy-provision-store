import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../context/CartContext';
import { usePlaceOrder } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getSubtotal } = useCart();
  const placeOrder = usePlaceOrder();
  const subtotal = getSubtotal();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate({ to: '/cart' });
    }
  }, [cart.items.length, navigate]);

  const formatPrice = (price: bigint) => {
    return (Number(price) / 100).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim() || !shippingAddress.trim()) {
      return;
    }

    try {
      const firstItem = cart.items[0];
      const orderDetails = `${customerName}${phone ? ` | ${phone}` : ''}${email ? ` | ${email}` : ''}${note ? ` | Note: ${note}` : ''}`;
      
      const result = await placeOrder.mutateAsync({
        productId: firstItem.productId,
        quantity: BigInt(firstItem.quantity),
        customerName: orderDetails,
        shippingAddress,
      });

      sessionStorage.setItem('lastOrder', JSON.stringify({
        id: result.id.toString(),
        items: cart.items,
        total: subtotal.toString(),
        customerName,
        shippingAddress,
        timestamp: Date.now(),
      }));

      navigate({ to: '/confirmation' });
    } catch (error) {
      console.error('Order placement failed:', error);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Checkout</h2>
        <p className="text-muted-foreground">Complete your order details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">
                    Shipping Address <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="123 Main St, Apt 4B, City, State 12345"
                    required
                    rows={3}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="note">Order Notes (optional)</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special instructions or requests..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.items.map((item) => (
                    <div key={item.productId.toString()} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ${formatPrice(item.price * BigInt(item.quantity))}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${formatPrice(subtotal)}</span>
                </div>

                {placeOrder.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to place order. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={placeOrder.isPending || !customerName.trim() || !shippingAddress.trim()}
                  className="w-full"
                  size="lg"
                >
                  {placeOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
