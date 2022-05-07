using ChordViewer.Models;
using Duende.IdentityServer.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ChordViewer.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options)
            : base(options)
        {

        }

        public DbSet<Tab> Tabs { get; set; }
        public DbSet<TabString> TabStrings { get; set; }
        public DbSet<TabBarre> TabBarre { get; set; }
        public DbSet<Collection> Collections { get; set; }
        public DbSet<CollectionTabRelation> CollectionTabRelations { get; set; }
        public DbSet<CollectionUserRelation> CollectionUserRelations { get; set; }
        public DbSet<User> Users { get; set; }
    }
}