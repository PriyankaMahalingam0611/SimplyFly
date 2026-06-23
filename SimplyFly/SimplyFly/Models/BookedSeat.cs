namespace SimplyFly.Models
{
    public class BookedSeat
    {
        public int SeatId { get; set; }
        public int BookingId { get; set; }
        public int CabinId { get; set; }
        public string SeatNumber { get; set; }

        public Booking Booking { get; set; }
        public FlightCabin FlightCabin { get; set; }
    }
}