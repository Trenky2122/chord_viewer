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
        [HttpGet("collectionsForUser")]
        public async Task<ActionResult<IList<Collection>>> CollectionsForUser()
        {
            return Ok(await DbContext.Collections.Where(c => c.AuthorId == GetCurrentUserId()).ToArrayAsync());
        }

        [Authorize]
        [HttpGet("collectionsSharedWithUser/")]
        public async Task<ActionResult<IList<Collection>>> CollectionsSharedWithUser()
        {
            return Ok(await DbContext.CollectionUserRelations.Where(r => r.UserId == GetCurrentUserId())
                .Include(x => x.Collection).ThenInclude(y => y.Author).Select(x => x.Collection).ToListAsync());
        }
        
        public async override Task<ActionResult<Collection>> Post([FromBody] Collection entity)
        {
            entity.AuthorId = GetCurrentUserId();
            if (entity.Name.Length == 0)
                return BadRequest();
            if (DbContext.Collections.FirstOrDefault(c => c.AuthorId == GetCurrentUserId() && entity.Name == c.Name) == null)
                return BadRequest();
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
        public async Task<ActionResult<IList<Collection>>> GetUserCollectionsNotContainingTab(int tabId)
        {
            return Ok(await DbContext.Collections.Where(x => !DbContext.CollectionTabRelations.Any(y => y.TabId == tabId && y.CollectionId == x.Id)
            && x.AuthorId == GetCurrentUserId()).ToListAsync());
        }

        public override async Task<ActionResult<Collection>> Delete(int id)
        {
            var collection = DbContext.Collections.Find(id);
            if (collection == null)
                return NotFound();
            if (collection.AuthorId != GetCurrentUserId())
                return Forbid();
            return await base.Delete(id);
        }
    }
}
