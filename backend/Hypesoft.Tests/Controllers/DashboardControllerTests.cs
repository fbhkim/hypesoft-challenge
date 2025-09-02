
using Hypesoft.API;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using Hypesoft.Domain.Repositories;
using System.Net.Http.Json;
using Hypesoft.Application.DTOs;
using Xunit;
using FluentAssertions;

namespace Hypesoft.API.Tests.Controllers
{
    public class DashboardControllerTests : IClassFixture<WebApplicationFactory<Hypesoft.API.Program>>
    {
        private readonly WebApplicationFactory<Hypesoft.API.Program> _factory;

        public DashboardControllerTests()
        {
            _factory = new WebApplicationFactory<Hypesoft.API.Program>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        services.RemoveAll<IProductRepository>();
                        services.RemoveAll<ICategoryRepository>();

                        services.AddSingleton(MockProductRepository().Object);
                        services.AddSingleton(MockCategoryRepository().Object);
                    });
                });
        }

        private Mock<IProductRepository> MockProductRepository()
        {
            var mock = new Mock<IProductRepository>();
            var products = new List<Hypesoft.Domain.Entities.Product>
            {
                new Hypesoft.Domain.Entities.Product("Camiseta", "", 50, 8, Guid.NewGuid()) { Id = Guid.NewGuid() },
                new Hypesoft.Domain.Entities.Product("Calça", "", 100, 15, Guid.NewGuid()) { Id = Guid.NewGuid() }
            };

            mock.Setup(r => r.GetAllAsync()).ReturnsAsync(products);
            return mock;
        }

        private Mock<ICategoryRepository> MockCategoryRepository()
        {
            var mock = new Mock<ICategoryRepository>();
            var categories = new List<Hypesoft.Domain.Entities.Category>
            {
                new Hypesoft.Domain.Entities.Category("Vestuário") { Id = Guid.NewGuid() }
            };

            mock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            return mock;
        }

        [Fact]
        public async Task Get_Retorna_Dados_Do_Dashboard()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/dashboard");
            var dashboard = await response.Content.ReadFromJsonAsync<DashboardDto>();

            // Assert
            response.EnsureSuccessStatusCode();
            dashboard.Should().NotBeNull();
            dashboard.TotalProducts.Should().Be(2);
            dashboard.TotalStockValue.Should().Be(50*8 + 100*15); // 400 + 1500 = 1900
            dashboard.LowStockProducts.Should().HaveCount(1); // Camiseta com estoque 8 (<10)
            dashboard.ProductsByCategory.Should().HaveCount(1);
            dashboard.ProductsByCategory.ContainsKey("Vestuário").Should().BeTrue();
            dashboard.ProductsByCategory["Vestuário"].Should().Be(2);
        }
    }
}