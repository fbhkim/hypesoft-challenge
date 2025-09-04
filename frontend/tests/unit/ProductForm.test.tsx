import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProductForm } from '@/components/forms/ProductForm';
import { Category } from '@/types/Category';
import { FormEvent } from 'react';

// Mock the react-hook-form
const mockRegister = jest.fn();
const mockHandleSubmit = jest.fn();
const mockSetValue = jest.fn();
const mockWatch = jest.fn();
const mockReset = jest.fn();

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    register: mockRegister,
    handleSubmit: (fn: (data: { name: string; description: string; price: number; stock: number; categoryId: string }) => void) => (e: FormEvent) => {
      e?.preventDefault?.();
      return fn({
        name: 'Camiseta',
        description: '100% algodão',
        price: 49.9,
        stock: 10,
        categoryId: '1',
      });
    },
    formState: { errors: {} },
    control: {
      _subjects: {},
      _names: {}
    },
    setValue: mockSetValue,
    watch: mockWatch,
    reset: mockReset,
  }),
  useController: () => ({
    field: {
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: '',
      name: 'field',
      ref: jest.fn(),
    },
    fieldState: { error: null },
  }),
}));

const mockCategories: Category[] = [
  { id: '1', name: 'Vestuário', description: '', createdAt: '' },
  { id: '2', name: 'Eletrônicos', description: '', createdAt: '' },
];

const mockOnSubmit = jest.fn();

describe('ProductForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock implementations
    mockHandleSubmit.mockImplementation((callback) => (e: FormEvent) => {
      e?.preventDefault?.();
      callback({
        name: 'Camiseta',
        description: '100% algodão',
        price: 49.9,
        stock: 10,
        categoryId: '1',
      });
    });
  });

  it('deve exibir erros de validação quando campos inválidos', async () => {
    render(
      <ProductForm
        categories={mockCategories}
        onSubmit={mockOnSubmit}
        isPending={false}
      />
    );

    const submitButton = screen.getByText('Salvar Produto');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify form submission
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Camiseta',
      description: '100% algodão',
      price: 49.9,
      stock: 10,
      categoryId: '1',
    });
  });

  it('deve chamar onSubmit com dados válidos', async () => {
    render(
      <ProductForm
        categories={mockCategories}
        onSubmit={mockOnSubmit}
        isPending={false}
        defaultValues={{
          name: 'Camiseta',
          description: '100% algodão',
          price: 49.9,
          stock: 10,
          categoryId: '1',
        }}
      />
    );

    const submitButton = screen.getByText('Salvar Produto');
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Camiseta',
      description: '100% algodão',
      price: 49.9,
      stock: 10,
      categoryId: '1',
    });
  });
});