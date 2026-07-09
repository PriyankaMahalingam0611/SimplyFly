namespace SimplyFly.DTOs
{
    public class CabinOptionDto
    {
        public int CabinId { get; set; }
        public string CabinType { get; set; }
        public decimal Price { get; set; }
        public int AvailableSeats { get; set; }
        public int TotalSeats { get; set; }              
        public List<string> BookedSeatNumbers { get; set; }
        public int CheckInBaggage { get; set; }   
        public int CabinBaggage { get; set; }
    }
}