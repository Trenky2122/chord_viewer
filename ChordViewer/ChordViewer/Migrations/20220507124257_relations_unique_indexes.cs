using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChordViewer.Migrations
{
    public partial class relations_unique_indexes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CollectionUserRelations_UserId",
                table: "CollectionUserRelations");

            migrationBuilder.DropIndex(
                name: "IX_CollectionTabRelations_TabId",
                table: "CollectionTabRelations");

            migrationBuilder.CreateIndex(
                name: "IX_CollectionUserRelations_UserId_CollectionId",
                table: "CollectionUserRelations",
                columns: new[] { "UserId", "CollectionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CollectionTabRelations_TabId_CollectionId",
                table: "CollectionTabRelations",
                columns: new[] { "TabId", "CollectionId" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CollectionUserRelations_UserId_CollectionId",
                table: "CollectionUserRelations");

            migrationBuilder.DropIndex(
                name: "IX_CollectionTabRelations_TabId_CollectionId",
                table: "CollectionTabRelations");

            migrationBuilder.CreateIndex(
                name: "IX_CollectionUserRelations_UserId",
                table: "CollectionUserRelations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CollectionTabRelations_TabId",
                table: "CollectionTabRelations",
                column: "TabId");
        }
    }
}
