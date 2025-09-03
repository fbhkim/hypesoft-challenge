import api from '@/lib/apiClient';

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  // Add other product properties as needed
};

export const ProductService = {
  async getProducts(searchTerm = '', categoryId?: string) {
    const params = new URLSearchParams();
    if (searchTerm) params.append('searchTerm', searchTerm);
    if (categoryId) params.append('categoryId', categoryId);

    return api
      .get(`/products${params.toString() ? `?${params.toString()}` : ''}`)
      .then((res) => res.data);
  },

  async getCategories() {
    return api.get('/categories').then((res) => res.data);
  },

  async getProductById(id: string) {
    return api.get(`/products/${id}`).then((res) => res.data);
  },

  async createProduct(data: Omit<Product, 'id'>) {
    return api.post('/products', data);
  },

  async updateProduct(id: string, data: Partial<Product>) {
    return api.put(`/products/${id}`, data);
  },

  async deleteProduct(id: string) {
    return api.delete(`/products/${id}`);
  },

  async deleteCategory(id: string) {
    return api.delete(`/categories/${id}`);
  },

  async createCategory(data: { name: string; description?: string }) {
    return api.post('/categories', data);
  }
};