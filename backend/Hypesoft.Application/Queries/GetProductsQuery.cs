
using MediatR;
using System.Collections.Generic;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries
{
    public class GetProductsQuery : IRequest<IEnumerable<ProductDto>>
    {
        public string SearchTerm { get; set; } = string.Empty;
        public Guid? CategoryId { get; set; }
    }
}