using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChordViewer.Controllers
{
    [Route("api/[controller]")]
    public class CollectionController: Controller
    {
        private ApplicationDbContext _dbContext;
        public CollectionController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Collection>> GetCollection(int id)
        {
            var result = await _dbContext.Collections.Include(x => x.TabRelations).Include(x => x.UserRelations).FirstOrDefaultAsync(x => x.Id == id);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Collection>> CreateCollection(Collection collection)
        {
            if (collection.Id != 0)
                return BadRequest();
            _dbContext.Collections.Add(collection);
            await _dbContext.SaveChangesAsync();
            return Ok(collection);
        }

        [HttpPut]
        public async Task<ActionResult<Collection>> UpdateCollection(Collection collection)
        {
            var collectionDb = await _dbContext.Collections.FindAsync(collection.Id);
            if (collectionDb == null)
                return NotFound();
            collectionDb.IsPublic = collection.IsPublic;
            collectionDb.AuthorId = collection.AuthorId;
            collectionDb.Name = collection.Name;
            await _dbContext.SaveChangesAsync();
            return Ok(collectionDb);
        }

        [HttpDelete]
        public async Task<ActionResult<Collection>> DeleteCollection(int id)
        {
            var collectionDb = await _dbContext.Collections.FindAsync(id);
            if (collectionDb == null)
                return NotFound();
            _dbContext.Remove(collectionDb);
            await _dbContext.SaveChangesAsync();
            return Ok(collectionDb);
        }
    }
}
