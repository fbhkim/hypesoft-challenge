
using System;

namespace Hypesoft.Domain.Entities
{
    public class Product : Entity
    {
        public string Name { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;
        public decimal Price { get; private set; }
        public int Stock { get; private set; }
        public Guid CategoryId { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        public virtual Category? Category { get; private set; }

        private Product() { }

        public Product(string name, string description, decimal price, int stock, Guid categoryId)
        {
            Validate(name, price, stock, categoryId);
            Id = Guid.NewGuid();
            Name = name;
            Description = description;
            Price = price;
            Stock = stock;
            CategoryId = categoryId;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Update(string name, string description, decimal price, int stock, Guid categoryId)
        {
            Validate(name, price, stock, categoryId);
            Name = name;
            Description = description;
            Price = price;
            Stock = stock;
            CategoryId = categoryId;
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateStock(int newStock)
        {
            if (newStock < 0)
                throw new InvalidOperationException("Estoque não pode ser negativo.");
            Stock = newStock;
            UpdatedAt = DateTime.UtcNow;
        }

        private void Validate(string name, decimal price, int stock, Guid categoryId)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Nome do produto é obrigatório.", nameof(name));

            if (price <= 0)
                throw new ArgumentException("Preço deve ser maior que zero.", nameof(price));

            if (stock < 0)
                throw new ArgumentException("Estoque não pode ser negativo.", nameof(stock));

            if (categoryId == Guid.Empty)
                throw new ArgumentException("Categoria é obrigatória.", nameof(categoryId));
        }
    }
}