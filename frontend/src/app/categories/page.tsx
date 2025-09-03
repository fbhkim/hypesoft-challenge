'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ProductService } from '@/services/productService';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Carregar categorias
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: ProductService.getCategories,
  });

  // Mutação para excluir categoria
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductService.deleteCategory(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      toast.success('Categoria excluída com sucesso!');
      refetch();
    },
    onError: (error: unknown) => {
      console.error(error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Erro ao excluir categoria. Verifique se não há produtos vinculados.';
      toast.error(errorMessage);
    },
    onSettled: () => setDeletingId(null),
  });

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  if (error) {
    toast.error('Erro ao carregar categorias.');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Link href="/categories/new">
          <Button>➕ Nova Categoria</Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 px-2">Nome</th>
                  <th className="py-3 px-2">Descrição</th>
                  <th className="py-3 px-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat: Category) => (
                    <tr key={cat.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{cat.name}</td>
                      <td className="py-3 px-2 text-gray-600">{cat.description || '-'}</td>
                      <td className="py-3 px-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(cat.id)}
                          disabled={deletingId === cat.id}
                        >
                          {deletingId === cat.id ? (
                            <span className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Excluindo...
                            </span>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-1" /> Excluir
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2"><Skeleton className="h-4 w-16" /></th>
                <th className="py-3 px-2"><Skeleton className="h-4 w-24" /></th>
                <th className="py-3 px-2"><Skeleton className="h-4 w-12" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(3)].map((_, i) => (
                <tr key={i} className="border-b">
                  <td className="py-3 px-2"><Skeleton className="h-4 w-32" /></td>
                  <td className="py-3 px-2"><Skeleton className="h-4 w-40" /></td>
                  <td className="py-3 px-2"><Skeleton className="h-8 w-20" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}