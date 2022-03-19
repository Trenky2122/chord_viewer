using System.ComponentModel.DataAnnotations.Schema;

namespace ChordViewer.Models
{
    public class Collection: BaseModel
    {
        public string Name { get; set; } = "";
        public int AuthorId { get; set; }
        [ForeignKey(nameof(AuthorId))]
        public ApplicationUser? Author { get; set; }
        public bool IsPublic { get; set; }
    }
}
