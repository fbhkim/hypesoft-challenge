namespace Hypesoft.API;

using Hypesoft.Infrastructure.Data;
using Hypesoft.Infrastructure.Repositories;
using Hypesoft.Domain.Repositories;
using Hypesoft.Application;
using Serilog;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Hypesoft.Application.Commands;
using Hypesoft.Application.Validators;
using FluentValidation;
using AutoMapper;
using Microsoft.EntityFrameworkCore.InMemory;
using Hypesoft.Infrastructure.Configurations;

public partial class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // === SERILOG ===
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .CreateBootstrapLogger();

        builder.Host.UseSerilog((ctx, lc) => lc
            .WriteTo.Console()
            .Enrich.FromLogContext()
            .ReadFrom.Configuration(ctx.Configuration));

        // === SERVICES ===
        builder.Services.AddControllers();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend",
                builder =>
                {
                    builder.WithOrigins("http://localhost:3000") // URL do frontend
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
        });

        builder.Services.AddEndpointsApiExplorer();

        // === MEDIATOR (CQRS) ===
        builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateProductCommand).Assembly));

        // === ENTITY FRAMEWORK + IN-MEMORY DATABASE (for development) ===
        builder.Services.AddDbContext<ProductContext>(options =>
            options.UseInMemoryDatabase("HypesoftDb"));

        // === REPOSITÓRIOS ===
        builder.Services.AddScoped<IProductRepository, ProductRepository>();
        builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

        // === AUTOMAPPER ===
        builder.Services.AddAutoMapper(typeof(CreateProductCommand).Assembly);

        // === FLUENT VALIDATION ===
        // Note: FluentValidation will be configured separately if needed

        // === SWAGGER ===
        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hypesoft Product API", Version = "v1" });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Use 'Bearer YOUR_TOKEN'",
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    Array.Empty<string>()
                }
            });
        });

        // === AUTHENTICATION (KEYCLOAK / JWT) ===
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.Authority = builder.Configuration["Keycloak:Authority"];
            if (builder.Environment.IsDevelopment())
            {
                options.RequireHttpsMetadata = false;
            }
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5)
            };
        });

        // === HEALTH CHECKS ===
        builder.Services.AddHealthChecks();

        var app = builder.Build();

        // === MIDDLEWARES ===
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hypesoft Product API v1");
                c.RoutePrefix = string.Empty;
            });
        }

        app.UseCors("AllowFrontend"); // Habilita a política de CORS

        app.UseSerilogRequestLogging(); // Logs de requisição
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapControllers();

        // Executar seed
        using (var scope = app.Services.CreateScope())
        {
            try
            {
                await SeedService.SeedData(scope.ServiceProvider);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Erro ao executar seed de dados");
            }
        }

        app.Run();
    }
}