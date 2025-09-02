
using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries
{
    public class GetDashboardDataQuery : IRequest<DashboardDto>
    {
    }
}