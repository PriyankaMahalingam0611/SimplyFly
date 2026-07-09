using SimplyFly.Models;
using System.Collections.Generic;

namespace SimplyFly.Models
{
    public class Flight
    {
        public int FlightId { get; set; }
        public int OwnerId { get; set; }
        public string FlightName { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }

        public User Owner { get; set; }
        public ICollection<Schedule> Schedules { get; set; }
    }
}