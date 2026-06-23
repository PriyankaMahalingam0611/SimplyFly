using System.ComponentModel.DataAnnotations;

namespace SimplyFly.DTOs
{
    public class CreateFlightDto
    {
        [Required(ErrorMessage = "Flight name is required.")]
        [StringLength(50, ErrorMessage = "Flight name cannot exceed 50 characters.")]
        public string FlightName { get; set; }

        [Required(ErrorMessage = "Flight number is required.")]
        [StringLength(20, ErrorMessage = "Flight number cannot exceed 20 characters.")]
        public string FlightNumber { get; set; }

        [Required(ErrorMessage = "Origin is required.")]
        [StringLength(100, ErrorMessage = "Origin cannot exceed 100 characters.")]
        public string Origin { get; set; }

        [Required(ErrorMessage = "Destination is required.")]
        [StringLength(100, ErrorMessage = "Destination cannot exceed 100 characters.")]
        public string Destination { get; set; }
    }
}