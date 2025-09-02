using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Hypesoft.Infrastructure.Configurations
{
    public static class SeedService
    {
        public static async Task SeedData(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var categoryRepo = scope.ServiceProvider.GetRequiredService<ICategoryRepository>();
            var productRepo = scope.ServiceProvider.GetRequiredService<IProductRepository>();

            if ((await categoryRepo.GetAllAsync()).Any()) return;

            
            var vestuario = new Category("Vestuário", "Roupas e acessórios");
            var eletronicos = new Category("Eletrônicos", "Smartphones, fones, etc.");
            var casa = new Category("Casa e Cozinha", "Utensílios domésticos");

            await categoryRepo.AddAsync(vestuario);
            await categoryRepo.AddAsync(eletronicos);
            await categoryRepo.AddAsync(casa);

           
            var products = new[]
            {
                new Product("Camiseta Premium", "Algodão 100%", 49.90m, 8, vestuario.Id),  
                new Product("Calça Jeans", "Modelo slim", 129.90m, 15, vestuario.Id),
                new Product("Tênis Esportivo", "Tamanho 40-45", 199.90m, 5, vestuario.Id),  
                new Product("Smartphone X", "128GB, câmera 48MP", 1299.90m, 12, eletronicos.Id),
                new Product("Fone Bluetooth", "Cancelamento de ruído", 299.90m, 20, eletronicos.Id),
                new Product("Panela Antiaderente", "Conjunto de 5 peças", 149.90m, 3, casa.Id),  
            };

            foreach (var p in products)
            {
                await productRepo.AddAsync(p);
            }
        }
    }
}