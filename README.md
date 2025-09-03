# 🛍️ ShopSense - Sistema de Gestão de Produtos

> **Desafio Técnico Hypesoft**  
> Um sistema completo de gestão de produtos com dashboard, autenticação, controle de estoque e insights em tempo real.

![ShopSense Dashboard Preview](https://cdn.dribbble.com/users/10109163/screenshots/24508262/media/8d5d3f4d6a8d5c6f5e5f5e5f5e5f5e5f.png)
*Design inspirado no [ShopSense Dashboard - Product Page](https://dribbble.com/shots/24508262-ShopSense-Dashboard-Product-Page) por Faris, Pickolab Studio*

---

## 🎯 Visão Geral

ShopSense é uma aplicação full-stack para gestão de produtos, desenvolvida com foco em:

- **Arquitetura moderna**: Clean Architecture + DDD + CQRS
- **Tecnologias de ponta**: .NET 9, Next.js 14, MongoDB, Keycloak
- **Boas práticas**: SOLID, Clean Code, testes, observabilidade
- **UX moderna**: Interface responsiva inspirada em design de alta qualidade

---

## ✨ Funcionalidades

- **Gestão de Produtos** (CRUD completo)
- **Sistema de Categorias** (criar, listar, filtrar)
- **Controle de Estoque** (estoque baixo destacado)
- **Dashboard Simples**
  - Total de produtos
  - Valor total do estoque
  - Produtos com estoque baixo
  - Gráfico: produtos por categoria
- **Autenticação Segura**
  - Keycloak (OAuth2/OpenID Connect)
  - Proteção por roles (`product:write`, `category:manage`)
  - Logout integrado

---

## 🧰 Stack Tecnológica

| Camada | Tecnologia |
|-------|-----------|
| **Frontend** | React 18 + Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn/ui |
| **Backend** | .NET 9, C#, Clean Architecture, DDD, CQRS, MediatR |
| **Banco de Dados** | MongoDB (via EF Core) |
| **Autenticação** | Keycloak |
| **Infraestrutura** | Docker, Docker Compose, Nginx |
| **Testes** | xUnit, React Testing Library, Vitest |
| **Observabilidade** | Serilog, Health Checks, Correlation ID |
| **UI/UX** | Design inspirado no [ShopSense](https://dribbble.com/shots/24508262-ShopSense-Dashboard-Product-Page) |

---

## 🚀 Como Executar

### Pré-requisitos
- Docker Desktop 4.0+
- Node.js 18+
- .NET 9 SDK
- Git

### Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/hypesoft-challenge.git
cd hypesoft-challenge

# Copie o .env
cp .env.example .env

# Suba todos os serviços
docker-compose up -d

# Verifique se os containers estão rodando
docker-compose ps