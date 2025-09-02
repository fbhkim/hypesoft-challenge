
using MediatR;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using System.Threading;
using System.Threading.Tasks;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Handlers
{
    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Guid>
    {
        private readonly ICategoryRepository _categoryRepository;

        public CreateCategoryCommandHandler(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Guid> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            var category = new Category(request.Name, request.Description);
            await _categoryRepository.AddAsync(category);
            return category.Id;
        }
    }
}