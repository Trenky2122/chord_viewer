using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChordViewer.Controllers
{
    [Route("api/[controller]")]
    public class CollectionController: BaseModelController<Collection>
    {
        public CollectionController(ApplicationDbContext dbContext): base(dbContext)
        {
        }
    }
}
