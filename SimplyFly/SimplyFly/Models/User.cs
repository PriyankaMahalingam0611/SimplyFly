using SimplyFly.Models;
using System.Collections.Generic;

namespace SimplyFly.Models
{
    public class User
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? ContactNumber { get; set; }
        public string? Address { get; set; }

        public Role Role { get; set; }
        public ICollection<Flight> OwnedFlights { get; set; }
        public ICollection<Booking> Bookings { get; set; }
    }
}