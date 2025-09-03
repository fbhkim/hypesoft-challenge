'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm } from '@/components/forms/ProductForm';


import { ProductService } from '@/services/productService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string;
  // Add other fields as needed based on your form
}

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar categorias
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: ProductService.getCategories,
  });

  if (loadingCategories) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando categorias...</CardTitle>
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
    toast.error('Erro ao carregar categorias. Tente novamente.');
  }

  // Enviar formulário
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await ProductService.createProduct(data);
      toast.success('Produto criado com sucesso!');
      router.push('/products');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
          : 'Erro ao criar produto.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Novo Produto</h1>
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
            isPending={isSubmitting}
            defaultValues={{
              name: '',
              description: '',
              price: 0,
              stock: 0,
              categoryId: '',
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}