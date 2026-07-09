namespace SimplyFly.DTOs
{
    public class AuthResponseDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public string Address { get; set; }
        public List<string> Roles { get; set; }
        public string Token { get; set; }
        public DateTime TokenExpiresAt { get; set; }
    }
}