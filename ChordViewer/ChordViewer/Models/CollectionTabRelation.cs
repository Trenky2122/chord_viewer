using System.ComponentModel.DataAnnotations.Schema;

namespace ChordViewer.Models
{
    public class CollectionTabRelation: BaseModel
    {
        public int CollectionId { get; set; }
        [ForeignKey(nameof(CollectionId))]
        public Collection? Collection { get; set; }
        public int TabId { get; set; }
        [ForeignKey(nameof(TabId))]
        public Tab? Tab { get; set; }
    }
}
