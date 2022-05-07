using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChordViewer.Controllers
{
    public class CollectionTabRelationController: BaseModelController<CollectionTabRelation>
    {
        public CollectionTabRelationController(ApplicationDbContext dbContext) : base(dbContext)
        {
        }

        [Authorize]
        [HttpPost("multiple")]
        public async Task<ActionResult<IList<CollectionTabRelation>>> CreateCollectionTabRelations([FromBody] List<CollectionTabRelation> relations)
        {
            foreach (var rel in relations)
            {
                if (rel.Id != 0)
                    return BadRequest();
                rel.Collection = null;
                rel.Tab = null;
            }
            var tasks = new List<Task>();
            tasks.Add(DbContext.AddRangeAsync(relations));
            tasks.Add(DbContext.SaveChangesAsync());
            await Task.WhenAll(tasks);
            return Ok(tasks);
        }
    }
}
