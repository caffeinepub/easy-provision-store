import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '../../backend';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const priceInDollars = Number(product.price) / 100;
  const isOutOfStock = product.stock === BigInt(0);

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        {product.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">${priceInDollars.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">
            {Number(product.stock)} in stock
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onAddToCart}
          disabled={isOutOfStock}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
