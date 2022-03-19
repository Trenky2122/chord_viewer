using System.ComponentModel.DataAnnotations.Schema;

namespace ChordViewer.Models
{
    public class TabBarre: BaseModel
    {
        public int TabId { get; set; }
        [ForeignKey(nameof(TabId))]
        public Tab? Tab { get; set; }
        public int Fret { get; set; }
        public int StringBegin { get; set; }
        public int StringEnd { get; set; }
        public int SuggestedFinger { get; set; }
    }
}
