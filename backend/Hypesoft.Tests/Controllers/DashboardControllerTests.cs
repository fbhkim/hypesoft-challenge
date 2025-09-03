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
using Hypesoft.Domain.Entities;
using System.Collections.Generic;
using System;

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

                        services.AddControllers(options => options.Filters.Clear());
                    });
                });
        }

        private Mock<IProductRepository> MockProductRepository()
        {
            var mock = new Mock<IProductRepository>();
            var categoryId = Guid.NewGuid();

            var products = new List<Product>
            {
                new Product("Camiseta", "", 50, 8, categoryId),
                new Product("Calça", "", 100, 15, categoryId)
            };

            mock.Setup(r => r.GetAllAsync()).ReturnsAsync(products);
            return mock;
        }

        private Mock<ICategoryRepository> MockCategoryRepository()
        {
            var mock = new Mock<ICategoryRepository>();
            var categories = new List<Category>
            {
                new Category("Vestuário")
            };

            mock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            return mock;
        }

        [Fact]
        public async Task Get_Retorna_Dados_Do_Dashboard()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/dashboard");

            response.EnsureSuccessStatusCode();

            var dashboard = await response.Content.ReadFromJsonAsync<DashboardDto>();

            dashboard.Should().NotBeNull();
            dashboard!.TotalProducts.Should().Be(2);
            dashboard.TotalValue.Should().Be(50 * 8 + 100 * 15);
            dashboard.LowStockProducts.Should().Be(1);
            dashboard.TotalCategories.Should().Be(1);

            dashboard.ProductsByCategory.Should().NotBeNull();
            dashboard.ProductsByCategory.Should().HaveCount(1);
            dashboard.ProductsByCategory.ContainsKey("Vestuário").Should().BeTrue();
            dashboard.ProductsByCategory["Vestuário"].Should().Be(2);
        }
    }
}
