using System.ComponentModel.DataAnnotations.Schema;

namespace ChordViewer.Models
{
    public class TabString: BaseModel
    {
        public int StringOrder { get; set; }
        public string Tune { get; set; } = "";
        public int Fret { get; set; }
        public int SuggestedFinger { get; set; }
        public int TabId { get; set; }
        [ForeignKey(nameof(TabId))]
        public Tab? Tab { get; set; }
    }
}
