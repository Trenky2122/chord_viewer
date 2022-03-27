namespace ChordViewer.Identity
{
    public class Role
    {
        public string GetRoleName(bool isAdmin)
        {
            if (isAdmin)
                return "Admin";
            return "Regular";
        }
    }
}
