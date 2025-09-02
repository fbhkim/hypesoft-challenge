
using MediatR;
using Hypesoft.Domain.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;
using System;

namespace Hypesoft.Application.Handlers
{
    public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, IEnumerable<ProductDto>>
    {
        private readonly IProductRepository _productRepository;

        public GetProductsQueryHandler(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
        {
            IEnumerable<Hypesoft.Domain.Entities.Product> products;

            if (request.CategoryId.HasValue)
            {
                products = await _productRepository.GetByCategoryAsync(request.CategoryId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                products = await _productRepository.SearchByNameAsync(request.SearchTerm);
            }
            else
            {
                products = await _productRepository.GetAllAsync();
            }

            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "Sem categoria",
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToList();
        }
    }
}