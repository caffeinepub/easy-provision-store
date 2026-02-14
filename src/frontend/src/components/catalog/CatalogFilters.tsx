import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CatalogFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
}

export default function CatalogFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: CatalogFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label htmlFor="search" className="text-sm font-medium">
          Search Products
        </Label>
        <div className="relative mt-1.5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="w-full sm:w-48">
        <Label htmlFor="category" className="text-sm font-medium">
          Category
        </Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger id="category" className="mt-1.5">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
