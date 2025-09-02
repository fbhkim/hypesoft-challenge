
using Hypesoft.Domain.Entities;
using FluentAssertions;
using System;

namespace Hypesoft.API.Tests.Domain
{
    public class ProductTests
    {
        [Fact]
        public void Deve_Criar_Produto_Valido()
        {
            // Arrange
            var nome = "Camiseta";
            var descricao = "Algodão";
            var preco = 49.90m;
            var estoque = 10;
            var categoriaId = Guid.NewGuid();

            // Act
            var produto = new Product(nome, descricao, preco, estoque, categoriaId);

            // Assert
            produto.Id.Should().NotBeEmpty();
            produto.Name.Should().Be(nome);
            produto.Price.Should().Be(preco);
            produto.Stock.Should().Be(estoque);
            produto.CategoryId.Should().Be(categoriaId);
        }

        [Fact]
        public void Nao_Deve_Criar_Produto_Com_Preco_Zero_Ou_Negativo()
        {
            // Arrange
            var nome = "Produto Inválido";
            var descricao = "";
            var preco = 0m;
            var estoque = 5;
            var categoriaId = Guid.NewGuid();

            // Act & Assert
            Action act = () => new Product(nome, descricao, preco, estoque, categoriaId);
            act.Should().Throw<ArgumentException>()
                .WithMessage("Preço deve ser maior que zero.*");
        }

        [Fact]
        public void Nao_Deve_Criar_Produto_Com_Nome_Vazio()
        {
            // Act & Assert
            Action act = () => new Product("", "Desc", 10, 5, Guid.NewGuid());
            act.Should().Throw<ArgumentException>()
                .WithMessage("Nome do produto é obrigatório.*");
        }

        [Fact]
        public void Deve_Atualizar_Produto_Com_Valores_Validos()
        {
            // Arrange
            var produto = new Product("Antigo", "", 10, 5, Guid.NewGuid());
            var novoNome = "Novo Nome";
            var novoPreco = 59.90m;

            // Act
            produto.Update(novoNome, "Nova desc", novoPreco, 20, produto.CategoryId);

            // Assert
            produto.Name.Should().Be(novoNome);
            produto.Price.Should().Be(novoPreco);
            produto.Stock.Should().Be(20);
        }
    }
}