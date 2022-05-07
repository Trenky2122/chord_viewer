using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChordViewer.Controllers
{
    [Route("api/[controller]")]
    public abstract class BaseModelController<T> : Controller where T : BaseModel
    {
        private ApplicationDbContext _dbContext;
        protected ApplicationDbContext DbContext
        {
            get
            {
                return _dbContext;
            }
        }

        protected const string IdClaimName = "SongbookUserId";
        public BaseModelController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async virtual Task<ActionResult<List<T>>> Get()
        {
            var result = await DbContext.Set<T>().ToArrayAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async virtual Task<ActionResult<T>> GetEntity(int id)
        {
            IQueryable<T> query = DbContext.Set<T>();
            foreach (var property in typeof(T).GetProperties())
            {
                if (property.PropertyType.BaseType == typeof(BaseModel) || property.PropertyType.IsGenericType)
                    query = query.Include(property.Name);
            }
            var entityDb = await query.FirstOrDefaultAsync(x => x.Id == id);
            if (entityDb == null)
                return NotFound();
            return Ok(entityDb);
        }

        [Authorize]
        [HttpPost]
        public async virtual Task<ActionResult<T>> Post([FromBody] T entity)
        {
            if (entity.Id != 0)
                return BadRequest();
            try
            {
                DbContext.Add(entity);
                await DbContext.SaveChangesAsync();
                return Ok(entity);
            }
            catch (Exception)
            {
                throw;
            }
        }

        [Authorize]
        [HttpPut]
        public async virtual Task<ActionResult<T>> Put([FromBody] T entity)
        {
            var entityDb = DbContext.Find<T>(entity.Id);
            if (entityDb == null)
                return NotFound();
            foreach (var property in entity.GetType().GetProperties())
            {
                var value = property.GetValue(entity);
                if ((value != null && value.GetType().IsGenericType) || value is BaseModel || property.Name == nameof(entity.Id))
                    continue;
                property.SetValue(entityDb, value);
            }
            await DbContext.SaveChangesAsync();
            return Ok(entityDb);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async virtual Task<ActionResult<T>> Delete(int id)
        {
            var entity = DbContext.Find<T>(id);
            if (entity == null)
                return NotFound();
            DbContext.Remove(entity);
            await DbContext.SaveChangesAsync();
            return Ok(entity);
        }

        protected int GetCurrentUserId()
        {
            return Convert.ToInt32(User.FindFirstValue(IdClaimName));
        }
    }
}
