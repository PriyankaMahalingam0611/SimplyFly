using SimplyFly.Models;
using System;
using System.Collections.Generic;

namespace SimplyFly.Models
{
    public class Schedule
    {
        public int ScheduleId { get; set; }
        public int FlightId { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public Flight Flight { get; set; }
        public ICollection<FlightCabin> FlightCabins { get; set; }
        public ICollection<Booking> Bookings { get; set; }
    }
}