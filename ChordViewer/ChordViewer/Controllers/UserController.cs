using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChordViewer.Controllers
{
    [Route("api/[controller]")]
    public class UserController: Controller
    {
        private ApplicationDbContext _dbContext;
        public UserController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var result = await _dbContext.Users.FindAsync(id);
            if(result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            if(user.Id != 0)
                return BadRequest();
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPut]
        public async Task<ActionResult<User>> UpdateUser(User user)
        {
            var userDb = await _dbContext.Users.FindAsync(user.Id);
            if (userDb == null)
                return NotFound();
            userDb.Salt = user.Salt;
            userDb.UserName = user.UserName;
            userDb.IsAdmin = user.IsAdmin;
            userDb.PasswordHash = user.PasswordHash;
            await _dbContext.SaveChangesAsync();
            return Ok(userDb);
        }

        [HttpDelete]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var userDb = await _dbContext.Users.FindAsync(id);
            if (userDb == null)
                return NotFound();
            _dbContext.Remove(userDb);
            await _dbContext.SaveChangesAsync();
            return Ok(userDb);
        }
    }
}
