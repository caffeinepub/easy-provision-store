import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';

interface OrderData {
  id: string;
  items: Array<{
    productId: bigint;
    name: string;
    price: bigint;
    quantity: number;
  }>;
  total: string;
  customerName: string;
  shippingAddress: string;
  timestamp: number;
}

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder');
    if (!stored) {
      navigate({ to: '/' });
      return;
    }

    const parsed = JSON.parse(stored);
    setOrderData({
      ...parsed,
      items: parsed.items.map((item: any) => ({
        ...item,
        productId: BigInt(item.productId),
        price: BigInt(item.price),
      })),
    });

    clearCart();
    sessionStorage.removeItem('lastOrder');
  }, [navigate, clearCart]);

  if (!orderData) {
    return null;
  }

  const formatPrice = (price: bigint | string) => {
    const priceNum = typeof price === 'string' ? BigInt(price) : price;
    return (Number(priceNum) / 100).toFixed(2);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Order Confirmed!</h2>
          <p className="text-muted-foreground">
            Thank you for your order. We'll process it shortly.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-mono font-semibold">#{orderData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{formatDate(orderData.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{orderData.customerName}</span>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="mb-2 font-semibold">Shipping Address</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {orderData.shippingAddress}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderData.items.map((item) => (
              <div key={item.productId.toString()} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">
                  ${formatPrice(item.price * BigInt(item.quantity))}
                </p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${formatPrice(orderData.total)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate({ to: '/' })} className="flex-1" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
