using System.ComponentModel.DataAnnotations;

namespace SimplyFly.DTOs
{
    public class CreateFlightCabinDto
    {
        [Required(ErrorMessage = "Cabin type is required.")]
        [StringLength(50, ErrorMessage = "Cabin type cannot exceed 50 characters.")]
        public string CabinType { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Total seats cannot be negative.")]
        public int TotalSeats { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Check-in baggage cannot be negative.")]
        public int CheckInBaggage { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Cabin baggage cannot be negative.")]
        public int CabinBaggage { get; set; }
    }
}