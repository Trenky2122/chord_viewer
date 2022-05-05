using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChordViewer.Controllers
{
    [Route("api/[controller]")]
    public class CollectionController: BaseModelController<Collection>
    {
        public CollectionController(ApplicationDbContext dbContext): base(dbContext)
        {
        }

        [Authorize]
        [HttpGet("collectionsForUser/{userId}")]
        public async Task<ActionResult<IList<Collection>>> CollectionsForUser(int userId)
        {
            return Ok(await DbContext.Collections.Where(c => c.AuthorId == userId).ToArrayAsync());
        }

        [Authorize]
        [HttpGet("collectionsSharedWithUser/{userId}")]
        public async Task<ActionResult<IList<Collection>>> CollectionsSharedWithUser(int userId)
        {
            return Ok(await DbContext.CollectionUserRelations.Where(r => r.UserId == userId).Include(x => x.Collection).Select(x => x.Collection).ToListAsync());
        }
    }
}
