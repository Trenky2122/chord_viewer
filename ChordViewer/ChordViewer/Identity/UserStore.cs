using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ChordViewer.Identity
{
    public class UserStore : IUserStore<User>, IUserEmailStore<User>, IUserPhoneNumberStore<User>,
IUserTwoFactorStore<User>, IUserPasswordStore<User>
    {
        private readonly ApplicationDbContext _dbContext;

        public UserStore(IConfiguration configuration, ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                _dbContext.Add(user);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return IdentityResult.Failed(new IdentityError() { Description = ex.Message });
            }

            return IdentityResult.Success;
        }

        public async Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                var userDb = _dbContext.Users.Find(user.Id);
                if (userDb == null)
                    return IdentityResult.Failed(new IdentityError() { Description = "User not found." });
                _dbContext.Users.Remove(userDb);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return IdentityResult.Failed(new IdentityError() { Description = ex.Message });
            }

            return IdentityResult.Success;
        }

        public async Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            int id = Convert.ToInt32(userId);
            return await _dbContext.Users.FindAsync(id);
        }

        public async Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.UserName == normalizedUserName);
            return user;
        }

        public Task<string> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.Id.ToString());
        }

        public Task<string> GetUserNameAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken)
        {
            user.UserName = normalizedName;
            return Task.FromResult(0);
        }

        public Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            return Task.FromResult(0);
        }

        public async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                var userDb = _dbContext.Users.Find(user.Id);
                if (userDb == null)
                    return IdentityResult.Failed(new IdentityError() { Description = "User not found." });
                userDb.IsAdmin = user.IsAdmin;
                userDb.UserName = user.UserName;
                userDb.PasswordHash = user.PasswordHash;
                userDb.Salt = user.Salt;
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return IdentityResult.Failed(new IdentityError() { Description = ex.Message });
            }

            return IdentityResult.Success;
        }

        public Task SetEmailAsync(User user, string email, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }

        public Task<string> GetEmailAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(true);
        }

        public Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }

        public async Task<User> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.UserName == normalizedEmail);
            return user;
        }

        public Task<string> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetNormalizedEmailAsync(User user, string normalizedEmail, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }

        public Task SetPhoneNumberAsync(User user, string phoneNumber, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }

        public Task<string> GetPhoneNumberAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task<bool> GetPhoneNumberConfirmedAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(true);
        }

        public Task SetPhoneNumberConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }

        public Task SetTwoFactorEnabledAsync(User user, bool enabled, CancellationToken cancellationToken)
        {
            return Task.FromResult(0);
        }

        public Task<bool> GetTwoFactorEnabledAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(false);
        }

        public Task SetPasswordHashAsync(User user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.FromResult(0);
        }

        public Task<string> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        public void Dispose()
        {
            // Nothing to dispose.
        }
    }

}
