using ChordViewer.Data;
using ChordViewer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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

        [HttpGet("{id}")]
        public async Task<ActionResult<Tab>> Get(int id)
        {
            return Ok(await _dbContext.Tabs.Include(x => x.TabBarre).Include(x => x.TabStrings).FirstOrDefaultAsync(x => x.Id == id));
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
                        if (str.Fret == 0)
                            str.SuggestedFinger = 0;
                    }
                    //check if any order of string is contained twice
                    if (tab.TabStrings.DistinctBy(x => x.StringOrder).Count() != tab.TabStrings.Count)
                        return BadRequest();
                }
                if (TabLikeThisExists(tab))
                    return Ok(tab);

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
                tab.AuthorId = (await _dbContext.Users.FirstAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.NameIdentifier))).Id;
                _dbContext.Tabs.Add(tab);
                await _dbContext.SaveChangesAsync();
                return Ok(tab);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private bool TabLikeThisExists(Tab tab)
        {
            var sameChordTabs = _dbContext.Tabs.Include(x => x.TabBarre).Include(x => x.TabStrings).Where(x => x.ToneKey == tab.ToneKey).ToList();
            var tabsWithEqualBarre = sameChordTabs.Where(x =>
            {
                foreach (var barre in x.TabBarre)
                {
                    if (!tab.TabBarre.Any(b => b.Fret == barre.Fret && b.StringBegin == barre.StringBegin && b.StringEnd == barre.StringEnd && b.SuggestedFinger == barre.SuggestedFinger))
                    {
                        return false;
                    }
                }
                foreach (var barre in tab.TabBarre)
                {
                    if (!x.TabBarre.Any(b => b.Fret == barre.Fret && b.StringBegin == barre.StringBegin && b.StringEnd == barre.StringEnd && b.SuggestedFinger == barre.SuggestedFinger))
                    {
                        return false;
                    }
                }
                return true;
            });
            var tabsWithEqualStrings = tabsWithEqualBarre.Where(x =>
            {
                foreach (var barre in x.TabStrings)
                {
                    if (!tab.TabStrings.Any(b => b.Fret == barre.Fret && b.Tune == barre.Tune && b.StringOrder == barre.StringOrder && b.SuggestedFinger == barre.SuggestedFinger))
                    {
                        return false;
                    }
                }
                foreach (var barre in tab.TabStrings)
                {
                    if (!x.TabStrings.Any(b => b.Fret == barre.Fret && b.Tune == barre.Tune && b.StringOrder == barre.StringOrder && b.SuggestedFinger == barre.SuggestedFinger))
                    {
                        return false;
                    }
                }
                return true;
            });
            return tabsWithEqualStrings.Any();
        }

    }
}
