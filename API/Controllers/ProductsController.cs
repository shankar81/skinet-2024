using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController(IGenericRepository<Product> repo) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(ProductSpecParams specParams)
        {
            var spec = new ProductSpecification(specParams);

            return await CreatePagedResult(repo, spec, specParams.PageSize, specParams.PageIndex);
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IEnumerable<string>>> GetBrands()
        {
            var spec = new BrandListSpecification();
            return Ok(await repo.ListAsync(spec));
        }

        [HttpGet("types")]
        public async Task<ActionResult<IEnumerable<string>>> GetTypes()
        {
            var spec = new TypeListSpecification();
            return Ok(await repo.ListAsync(spec));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await repo.GetByIdAsync(id);

            if (product == null) return NotFound();

            return product;
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(Product product)
        {
            repo.Add(product);

            if (await repo.SaveAllAsync())
            {
                return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            }
            return BadRequest("Problem while creating product");
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Product>> UpdateProduct(int id, Product product)
        {
            if (id != product.Id || !repo.Exists(id)) return BadRequest("Cannot update this product");

            repo.Update(product);

            if (await repo.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Problem while updating product");
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var found = await repo.GetByIdAsync(id);

            if (found == null) return BadRequest("Cannot delete this product");

            repo.Remove(found);

            if (await repo.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Problem while deleting product");
        }

    }
}
