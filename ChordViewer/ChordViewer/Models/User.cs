using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ChordViewer.Models
{
    [Index(nameof(UserName), IsUnique = true)]
    public class User: BaseModel
    {
        public bool IsAdmin { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Salt { get; set; } = string.Empty;
        public virtual List<CollectionUserRelation> TabRelations { get; set; } = new List<CollectionUserRelation>();

    }
}