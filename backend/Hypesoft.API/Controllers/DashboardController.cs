
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Hypesoft.Application.Queries;

namespace Hypesoft.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class DashboardController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DashboardController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var query = new GetDashboardDataQuery();
            var data = await _mediator.Send(query);
            return Ok(data);
        }
    }
}