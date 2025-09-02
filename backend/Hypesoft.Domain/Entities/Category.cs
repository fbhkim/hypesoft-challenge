
using System;

namespace Hypesoft.Domain.Entities
{
    public class Category : Entity
    {
        public string Name { get; private set; } = string.Empty;
        public string? Description { get; private set; }
        public DateTime CreatedAt { get; private set; }

        private Category() { }

        public Category(string name, string? description = null)
        {
            Validate(name);
            Id = Guid.NewGuid();
            Name = name;
            Description = description;
            CreatedAt = DateTime.UtcNow;
        }

        public void Update(string name, string? description)
        {
            Validate(name);
            Name = name;
            Description = description;
        }

        private void Validate(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("O nome da categoria é obrigatório.", nameof(name));

            if (name.Length < 2 || name.Length > 100)
                throw new ArgumentException("O nome deve ter entre 2 e 100 caracteres.", nameof(name));
        }
    }
}