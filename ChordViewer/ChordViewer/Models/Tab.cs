using System.ComponentModel.DataAnnotations.Schema;

namespace ChordViewer.Models
{
    public class Tab: BaseModel
    {
        public string ToneKey { get; set; } = "";
        public int AuthorId { get; set; }
        [ForeignKey(nameof(AuthorId))]
        public User? Author { get; set; }
        public int StringCount { get; set; }
        public virtual List<TabString>? TabStrings { get; set; }
        public virtual List<TabBarre>? TabBarre { get; set; }

    }
}
