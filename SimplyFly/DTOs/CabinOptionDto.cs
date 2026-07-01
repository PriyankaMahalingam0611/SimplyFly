namespace SimplyFly.DTOs
{
    public class CabinOptionDto
    {
        public int CabinId { get; set; }
        public string CabinType { get; set; }
        public decimal Price { get; set; }
        public int AvailableSeats { get; set; }
    }
}