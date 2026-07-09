namespace SimplyFly.DTOs
{
    public class FlightResponseDto
    {
        public int FlightId { get; set; }
        public int OwnerId { get; set; }
        public string FlightName { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
    }
}
