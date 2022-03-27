using System.ComponentModel.DataAnnotations.Schema;

namespace ChordViewer.Models
{
    public class Collection: BaseModel
    {
        public string Name { get; set; } = "";
        public int AuthorId { get; set; } 
        [ForeignKey(nameof(AuthorId))]
        public User? Author { get; set; }
        public bool IsPublic { get; set; }
        public virtual List<CollectionTabRelation> TabRelations { get; set; }
        public virtual List<CollectionUserRelation> UserRelations { get; set; }

    }
}
