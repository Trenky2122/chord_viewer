using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChordViewer.Migrations
{
    public partial class new_identity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_User_AuthorId",
                table: "Collections");

            migrationBuilder.DropForeignKey(
                name: "FK_CollectionUserRelations_User_UserId",
                table: "CollectionUserRelations");

            migrationBuilder.DropForeignKey(
                name: "FK_Tabs_User_AuthorId",
                table: "Tabs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_User",
                table: "User");

            migrationBuilder.RenameTable(
                name: "User",
                newName: "Users");

            migrationBuilder.RenameIndex(
                name: "IX_User_UserName",
                table: "Users",
                newName: "IX_Users_UserName");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_Users_AuthorId",
                table: "Collections",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CollectionUserRelations_Users_UserId",
                table: "CollectionUserRelations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tabs_Users_AuthorId",
                table: "Tabs",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Collections_Users_AuthorId",
                table: "Collections");

            migrationBuilder.DropForeignKey(
                name: "FK_CollectionUserRelations_Users_UserId",
                table: "CollectionUserRelations");

            migrationBuilder.DropForeignKey(
                name: "FK_Tabs_Users_AuthorId",
                table: "Tabs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "User");

            migrationBuilder.RenameIndex(
                name: "IX_Users_UserName",
                table: "User",
                newName: "IX_User_UserName");

            migrationBuilder.AddPrimaryKey(
                name: "PK_User",
                table: "User",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Collections_User_AuthorId",
                table: "Collections",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CollectionUserRelations_User_UserId",
                table: "CollectionUserRelations",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tabs_User_AuthorId",
                table: "Tabs",
                column: "AuthorId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
