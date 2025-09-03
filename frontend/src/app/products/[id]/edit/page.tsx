'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm } from '@/components/forms/ProductForm';
import { ProductService } from '@/services/productService';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  type ProductFormData = {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
  };

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => ProductService.updateProduct(params.id, data),
    onSuccess: () => {
      toast.success('Produto atualizado com sucesso!');
      router.push('/products');
      router.refresh();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar produto.');
    },
  });

  // Carregar categorias
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: ProductService.getCategories,
  });

  // Carregar produto por ID
  const {
     data: product = [],
    isLoading: loadingProduct,
    error: productError,
  } = useQuery({
    queryKey: ['product', params.id],
    queryFn: () => ProductService.getProductById(params.id),
  });

  useEffect(() => {
    if (productError) {
      toast.error('Produto não encontrado.');
      router.push('/products');
    }
  }, [productError, router]);

  if (loadingCategories || loadingProduct) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categoriesError) {
    toast.error('Erro ao carregar categorias.');
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    updateMutation.mutate(data);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editar Produto</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            categories={categories}
            onSubmit={onSubmit}
            isPending={isSubmitting || updateMutation.isPending}
            defaultValues={{
              name: product?.name || '',
              description: product?.description || '',
              price: product?.price || 0,
              stock: product?.stock || 0,
              categoryId: product?.categoryId || '',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}