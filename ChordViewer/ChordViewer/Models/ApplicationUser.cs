using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ChordViewer.Models
{
    [Index(nameof(UserName), IsUnique = true)]
    public class ApplicationUser: IdentityUser 
    {
        public bool IsAdmin { get; set; }

    }
}