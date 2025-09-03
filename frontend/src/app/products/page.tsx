'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/productService';
import ProductTable from '@/components/tables/ProductTable';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', searchTerm, categoryId],
    queryFn: () => ProductService.getProducts(searchTerm, categoryId),
  });

  const {
    data: categories = [],
    isLoading: loadingCategories,
  } = useQuery<Array<{ id: string; name: string }>>({
    queryKey: ['categories'],
    queryFn: ProductService.getCategories,
  });

  if (isLoading || loadingCategories) {
    return <ProductListSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-red-600">
          Erro ao carregar produtos. Tente novamente mais tarde.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link href="/products/new">
          <Button>➕ Novo Produto</Button>
        </Link>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              className="w-full h-10 border border-gray-300 rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat: { id: string; name: string }) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <ProductTable products={products} />
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}