
using MediatR;
using System;

namespace Hypesoft.Application.Commands
{
    public class CreateProductCommand : IRequest<Guid>
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public Guid CategoryId { get; set; }
    }
}