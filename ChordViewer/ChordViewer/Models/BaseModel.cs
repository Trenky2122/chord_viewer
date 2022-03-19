using System.ComponentModel.DataAnnotations;

namespace ChordViewer.Models
{
    public class BaseModel
    {
        [Key]
        public int Id { get; set; }
    }
}
