using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        [HttpPost("login")]
        public async Task<ActionResult<User>> LogIn(string username, string password)
        {
            var user = _dbContext.Users.SingleOrDefault(x => x.UserName == username);

            // verify password
            if (user == null || !BCrypt.Net.BCrypt.Verify(password + user.Salt, user.PasswordHash))
                return Unauthorized();
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Administrator" : "BasicUser"),
                new Claim("ChordViewerUserId", user.Id.ToString())
            };

            var claimsIdentity = new ClaimsIdentity(
            claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                // Refreshing the authentication session should be allowed.

                IsPersistent = true, //to do - later change to variable according user checking keep me signed in
                // Whether the authentication session is persisted across 
                // multiple requests. When used with cookies, controls
                // whether the cookie's lifetime is absolute (matching the
                // lifetime of the authentication ticket) or session-based.

                IssuedUtc = DateTime.Now,
                // The time at which the authentication ticket was issued.
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);
            return Ok(user);
        }

        [Authorize]
        [HttpDelete("logout")]
        public async Task<ActionResult<User>> LogOut()
        {
            var user = await _dbContext.Users.FirstAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.NameIdentifier));
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(user);
        }

        [HttpGet("me")]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            try
            {
                var user = await _dbContext.Users.FirstAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.NameIdentifier));
                return Ok(user);
            }
            catch (Exception ex)
            {
                return Unauthorized();
            }
        }
    }
}
