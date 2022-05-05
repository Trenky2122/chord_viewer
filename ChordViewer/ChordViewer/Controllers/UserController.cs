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
    public class UserController: BaseModelController<User>
    {
        public UserController(ApplicationDbContext dbContext): base(dbContext)
        {
        }

        [HttpPost("createUser")]
        public async Task<ActionResult<User>> CreateUser(string username, string password)
        {
            if(DbContext.Users.Where(user => user.UserName == username).Any())
            {
                return BadRequest("Username already exists.");
            }
            if(password.Length < 8)
            {
                return BadRequest("Password too short.");
            }
            var salt = BCrypt.Net.BCrypt.GenerateSalt();
            var hashedPwd = BCrypt.Net.BCrypt.HashPassword(password+salt);
            var user = new User()
            {
                UserName = username,
                PasswordHash = hashedPwd,
                IsAdmin = false,
                Salt = salt
            };
            DbContext.Users.Add(user);
            await DbContext.SaveChangesAsync();
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

        [HttpPost("login")]
        public async Task<ActionResult<User>> LogIn(string username, string password)
        {
            var user = DbContext.Users.SingleOrDefault(x => x.UserName == username);

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
            var user = await DbContext.Users.FirstAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.NameIdentifier));
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(user);
        }

        [HttpGet("me")]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            try
            {
                var user = await DbContext.Users.FirstAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.NameIdentifier));
                return Ok(user);
            }
            catch (Exception ex)
            {
                return Unauthorized();
            }
        }
    }
}
