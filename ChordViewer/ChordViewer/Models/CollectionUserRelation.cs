using System.ComponentModel.DataAnnotations.Schema;

namespace ChordViewer.Models
{
    public class CollectionUserRelation: BaseModel
    {
        public int CollectionId { get; set; }
        [ForeignKey(nameof(CollectionId))]
        public Collection? Collection { get; set; }
        public int UserId { get; set; }
        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }
    }
}
