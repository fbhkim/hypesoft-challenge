using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries
{
    public class GetCategoryByIdQuery : IRequest<CategoryDto?>
    {
        public Guid Id { get; set; }
    }
}
