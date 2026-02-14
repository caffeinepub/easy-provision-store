import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/catalog/ProductCard';
import CatalogFilters from '../components/catalog/CatalogFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package } from 'lucide-react';
import { Product } from '../backend';

export default function CatalogPage() {
  const { data: products, isLoading, error } = useProducts();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set(products.map((p) => p.category));
    return Array.from(uniqueCategories).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  return (
    <div className="catalog-page relative min-h-[calc(100vh-8rem)]">
      <div className="container py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Browse Our Products</h2>
          <p className="text-muted-foreground">
            Find everything you need for your home and family
          </p>
        </div>

        <div className="mb-6">
          <CatalogFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
          />
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load products. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-xl font-semibold">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
