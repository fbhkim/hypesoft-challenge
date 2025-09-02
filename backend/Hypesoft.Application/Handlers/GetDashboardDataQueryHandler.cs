
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
    public class GetDashboardDataQueryHandler : IRequestHandler<GetDashboardDataQuery, DashboardDto>
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;

        public GetDashboardDataQueryHandler(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<DashboardDto> Handle(GetDashboardDataQuery request, CancellationToken cancellationToken)
        {
            var products = (await _productRepository.GetAllAsync()).ToList();
            var categories = await _categoryRepository.GetAllAsync();

            var totalProducts = products.Count;
            var totalCategories = categories.Count();
            var totalValue = products.Sum(p => p.Price * p.Stock);
            var lowStockProducts = products.Count(p => p.Stock < 10);

            return new DashboardDto
            {
                TotalProducts = totalProducts,
                TotalCategories = totalCategories,
                TotalValue = totalValue,
                LowStockProducts = lowStockProducts
            };
        }
    }
}