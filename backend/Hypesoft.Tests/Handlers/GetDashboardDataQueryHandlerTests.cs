using Hypesoft.Application.Handlers;
using Hypesoft.Application.Queries;
using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.Entities;
using Moq;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;

namespace Hypesoft.API.Tests.Handlers
{
    public class GetDashboardDataQueryHandlerTests
    {
        [Fact]
        public async Task Handle_Retorna_Estatisticas_Corretas()
        {
            // Arrange
            var categoriaId = Guid.NewGuid();
            var categoria = new Category("Vestuário");

            var produtos = new List<Product>
            {
                new Product("Camiseta", "", 50, 8, categoriaId),  // estoque baixo
                new Product("Calça", "", 100, 15, categoriaId),
                new Product("Tênis", "", 200, 3, categoriaId),    // estoque baixo
            };

            var mockProductRepo = new Mock<IProductRepository>();
            var mockCategoryRepo = new Mock<ICategoryRepository>();

            mockProductRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(produtos);
            mockCategoryRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new[] { categoria });

            var handler = new GetDashboardDataQueryHandler(mockProductRepo.Object, mockCategoryRepo.Object);

            // Act
            var result = await handler.Handle(new GetDashboardDataQuery(), default);

            // Assert
            result.TotalProducts.Should().Be(3);
            result.TotalValue.Should().Be(50*8 + 100*15 + 200*3); // 400 + 1500 + 600 = 2500
            result.LowStockProducts.Should().Be(2);
            result.TotalCategories.Should().Be(1);
        }
    }
}