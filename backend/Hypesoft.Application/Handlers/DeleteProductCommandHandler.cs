
using MediatR;
using Hypesoft.Domain.Repositories;
using System.Threading;
using System.Threading.Tasks;
using Hypesoft.Application.Commands;
using System;

namespace Hypesoft.Application.Handlers
{
    public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand>
    {
        private readonly IProductRepository _productRepository;

        public DeleteProductCommandHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            await _productRepository.DeleteAsync(request.Id);
        }
    }
}