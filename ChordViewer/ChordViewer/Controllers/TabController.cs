using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChordViewer.Controllers
{
    [Route("api/[controller]")]
    public class TabController: Controller
    {
        private ApplicationDbContext _dbContext;
        public TabController(ApplicationDbContext context)
        {
            _dbContext = context;
        }

        [HttpGet("tabsForToneKey/{toneKey}")]
        public async Task<ActionResult<List<Tab>>> GetTabsForToneKey(string toneKey)
        {
            return Ok(await _dbContext.Tabs.Where(x => x.ToneKey == toneKey).Include(x => x.TabBarre).Include(x => x.TabStrings).ToArrayAsync());
        }

        [Authorize]
        [HttpPost("createTab")]
        public async Task<ActionResult<Tab>> CreateTab([FromBody] Tab tab)
        {
            try 
            { 
                if (tab.Id != 0)
                    return BadRequest();
                if (tab.TabStrings != null)
                {
                    foreach (var str in tab.TabStrings)
                    {
                        if (str.Id != 0)
                            return BadRequest();
                    }
                    //check if any order of string is contained twice
                    if (tab.TabStrings.DistinctBy(x => x.StringOrder).Count() != tab.TabStrings.Count)
                        return BadRequest();
                }

                if (tab.TabBarre != null)
                {
                    foreach (var barre in tab.TabBarre)
                    {
                        if (barre.Id != 0)
                        {
                            return BadRequest();
                        }
                    }
                }
                _dbContext.Tabs.Add(tab);
                await _dbContext.SaveChangesAsync();
                return Ok(tab);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
