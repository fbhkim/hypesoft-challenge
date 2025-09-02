
using MediatR;

namespace Hypesoft.Application.Commands
{
    public class DeleteProductCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}