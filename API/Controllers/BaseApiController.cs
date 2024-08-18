using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : ControllerBase
    {
        public async Task<ActionResult> CreatePagedResult<T>(IGenericRepository<T> repo,
            ISpecification<T> spec, int pageSize, int pageIndex) where T : BaseEntity
        {

            var items = await repo.ListAsync(spec);
            var count = await repo.CountAsync(spec);

            var pagination = new Pagination<T>(pageSize, pageIndex, count, items);

            return Ok(pagination);
        }
    }
}
