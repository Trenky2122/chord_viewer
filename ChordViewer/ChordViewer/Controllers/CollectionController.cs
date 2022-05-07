using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChordViewer.Controllers
{
    [Route("api/[controller]")]
    public class CollectionController: BaseModelController<Collection>
    {
        public CollectionController(ApplicationDbContext dbContext): base(dbContext)
        {
        }

        [Authorize]
        public async override Task<ActionResult<Collection>> GetEntity(int id)
        {
            var collection = await DbContext.Collections.Include(x => x.TabRelations).ThenInclude(x => x.Tab)
                .ThenInclude(x => x.TabBarre).Include(x => x.TabRelations).ThenInclude(x => x.Tab).
                ThenInclude(x => x.TabStrings).FirstOrDefaultAsync(x => x.Id == id);
            if(collection == null)
                return NotFound();
            return Ok(collection);
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
            return Ok(await DbContext.CollectionUserRelations.Where(r => r.UserId == userId)
                .Include(x => x.Collection).ThenInclude(y => y.Author).Select(x => x.Collection).ToListAsync());
        }
        
        public async override Task<ActionResult<Collection>> Post([FromBody] Collection entity)
        {
            entity.AuthorId = GetCurrentUserId();
            return await base.Post(entity);
        }

        [Authorize]
        [HttpPut("changePublicStatus/{id}/{publicStatus}")]
        public async Task<ActionResult<Collection>> ChangePublicStatus(int id, string publicStatus)
        {
            var collection = await DbContext.Collections.FindAsync(id);
            if (collection == null)
                return NotFound();
            if(collection.AuthorId != (await DbContext.Users.FirstAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.NameIdentifier))).Id)
                return Forbid();
            collection.IsPublic = publicStatus == "true";
            await DbContext.SaveChangesAsync();
            return Ok(collection);
        }

        [HttpGet("collectionsNotContainingTab/{tabId}")]
        public async Task<ActionResult<IList<Collection>>> GetCollectionsNotContainingTab(int tabId)
        {
            return Ok(await DbContext.Collections.Where(x => !DbContext.CollectionTabRelations.Any(y => y.TabId == tabId && y.CollectionId == x.Id)).ToListAsync());
        }
    }
}
