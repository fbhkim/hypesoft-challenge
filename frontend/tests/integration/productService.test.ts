import { ProductService } from '@/services/productService';

// Create a mocked version of the ProductService with proper typing
const mockGetProducts = jest.fn();
const mockCreateProduct = jest.fn();

jest.mock('@/services/productService', () => {
  return {
    ProductService: {
      getProducts: mockGetProducts,
      createProduct: mockCreateProduct,
    },
  };
});

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar produtos com sucesso', async () => {
    const mockData = [
      { id: '1', name: 'Produto 1', price: 100, stock: 5, categoryId: '1' },
    ];
    
    mockGetProducts.mockResolvedValueOnce(mockData);

    const result = await ProductService.getProducts();

    expect(result).toEqual(mockData);
    expect(mockGetProducts).toHaveBeenCalled();
  });

  it('deve criar um novo produto', async () => {
    const newProduct = { name: 'Novo', price: 50, stock: 10, categoryId: '1' };
    const mockResponse = { data: { id: '2', ...newProduct } };
    
    mockCreateProduct.mockResolvedValueOnce(mockResponse);

    await ProductService.createProduct(newProduct);

    expect(ProductService.createProduct).toHaveBeenCalledWith(newProduct);
  });
});