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

        [Authorize]
        [HttpDelete("collection/{collectionId}/tab/{tabId}")]
        public async Task<ActionResult<CollectionTabRelation>> DeleteCollectionTabRelation(int collectionId, int tabId)
        {
            var collection = await DbContext.Collections.FindAsync(collectionId);
            if(collection == null)
                return NotFound();
            if (collection.AuthorId != GetCurrentUserId() && !CurrentUserIsAdmin())
                return StatusCode(403);
            var relations = DbContext.CollectionTabRelations.Where(x => x.CollectionId == collectionId && x.TabId == tabId);
            DbContext.CollectionTabRelations.RemoveRange(relations);
            await DbContext.SaveChangesAsync();
            return Ok(relations.FirstOrDefault());
        }
    }
}
