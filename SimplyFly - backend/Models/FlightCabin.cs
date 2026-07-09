using System.Collections.Generic;

namespace SimplyFly.Models
{
    public class FlightCabin
    {
        public int CabinId { get; set; }
        public int ScheduleId { get; set; }
        public string CabinType { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int AvailableSeats { get; set; }
        public int CheckInBaggage { get; set; }
        public int CabinBaggage { get; set; }

        public Schedule Schedule { get; set; }
        public ICollection<BookedSeat> BookedSeats { get; set; }
    }
}