using Hypesoft.API;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using Hypesoft.Domain.Repositories;
using System.Net.Http.Json;
using System.Collections.Generic;
using Hypesoft.Application.DTOs;
using Xunit;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using System.Linq;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;

namespace Hypesoft.API.Tests.Controllers
{
    public class CategoriesControllerTests : IClassFixture<CategoriesControllerTests.TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory;

        public CategoriesControllerTests(TestWebApplicationFactory factory)
        {
            _factory = factory;
        }

        public class TestWebApplicationFactory : WebApplicationFactory<Hypesoft.API.Program>
        {
            protected override void ConfigureWebHost(IWebHostBuilder builder)
            {
                builder.ConfigureServices(services =>
                {
                    services.RemoveAll<IHostedService>();
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(ICategoryRepository));
                    if (descriptor != null) services.Remove(descriptor);
                    services.AddScoped(_ => MockCategoryRepository().Object);
                });
            }
        }

        private static Mock<ICategoryRepository> MockCategoryRepository()
        {
            var mock = new Mock<ICategoryRepository>();
            var categories = new List<Hypesoft.Domain.Entities.Category>
            {
                new Hypesoft.Domain.Entities.Category("Categoria 1", "")
            };

            mock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            mock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(categories[0]);

            return mock;
        }

        [Fact]
        public async Task Get_Retorna_Lista_De_Categorias()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/categories");
            var categorias = await response.Content.ReadFromJsonAsync<IEnumerable<CategoryDto>>();

            // Assert
            response.EnsureSuccessStatusCode();
            categorias.Should().NotBeNull();
            categorias.Should().HaveCount(1);
            categorias!.First().Name.Should().Be("Categoria 1");
        }

        [Fact]
        public async Task GetById_Retorna_Categoria_Existente()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/categories/" + Guid.NewGuid());
            var categoria = await response.Content.ReadFromJsonAsync<CategoryDto>();

            // Assert
            response.EnsureSuccessStatusCode();
            categoria.Should().NotBeNull();
            categoria!.Name.Should().Be("Categoria 1");
        }
    }
}