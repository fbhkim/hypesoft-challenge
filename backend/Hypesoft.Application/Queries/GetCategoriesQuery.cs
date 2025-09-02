
using MediatR;
using System.Collections.Generic;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries
{
    public class GetCategoriesQuery : IRequest<IEnumerable<CategoryDto>>
    {
    }
}