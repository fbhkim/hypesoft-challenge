using Hypesoft.API;
using Hypesoft.Domain.Entities;
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
using System.Linq;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Hosting;
using System;

namespace Hypesoft.API.Tests.Controllers
{
    public class ProductsControllerTests : IClassFixture<ProductsControllerTests.TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory;

        public ProductsControllerTests(TestWebApplicationFactory factory)
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
                    var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IProductRepository));
                    if (descriptor != null) services.Remove(descriptor);

                    services.AddScoped(_ => MockProductRepository().Object);
                });
            }
        }

        private static Mock<IProductRepository> MockProductRepository()
        {
            var mock = new Mock<IProductRepository>();
            var products = new List<Product>
            {
                new Product("Produto 1", "", 10, 5, Guid.NewGuid())
            };

            mock.Setup(r => r.GetAllAsync()).ReturnsAsync(products);
            mock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(products[0]);

            return mock;
        }

        [Fact]
        public async Task Get_Retorna_Lista_De_Produtos()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/products");
            var produtos = await response.Content.ReadFromJsonAsync<IEnumerable<ProductDto>>();

            response.EnsureSuccessStatusCode();
            produtos.Should().NotBeNull();
            produtos.Should().HaveCount(1);
            produtos!.First().Name.Should().Be("Produto 1");
        }

        [Fact]
        public async Task GetById_Retorna_Produto_Existente()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/api/products/" + Guid.NewGuid());
            var produto = await response.Content.ReadFromJsonAsync<ProductDto>();

            response.EnsureSuccessStatusCode();
            produto.Should().NotBeNull();
            produto!.Name.Should().Be("Produto 1");
        }
    }
}
