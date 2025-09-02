
using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries
{
    public class GetProductByIdQuery : IRequest<ProductDto>
    {
        public Guid Id { get; set; }
    }
}