using ChordViewer.Data;
using ChordViewer.Models;

namespace ChordViewer.Controllers
{
    public class CollectionTabRelationController: BaseModelController<CollectionTabRelation>
    {
        public CollectionTabRelationController(ApplicationDbContext dbContext) : base(dbContext)
        {
        }
    }
}
