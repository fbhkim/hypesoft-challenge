
using MediatR;
using Hypesoft.Domain.Repositories;
using System.Threading;
using System.Threading.Tasks;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Handlers
{
    public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Unit>
    {
        private readonly ICategoryRepository _categoryRepository;

        public DeleteCategoryCommandHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            var hasProducts = await _categoryRepository.HasProductsAsync(request.Id);
            if (hasProducts)
                throw new InvalidOperationException("Não é possível excluir uma categoria que possui produtos.");

            await _categoryRepository.DeleteAsync(request.Id);
            return Unit.Value;
        }
    }
}