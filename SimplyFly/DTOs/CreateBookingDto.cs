using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimplyFly.DTOs
{
    public class CreateBookingDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "Valid Schedule ID is required.")]
        public int ScheduleId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Valid Cabin ID is required.")]
        public int CabinId { get; set; }

        [Required(ErrorMessage = "Seat selection is required.")]
        [MinLength(1, ErrorMessage = "At least one seat must be selected.")]
        public List<string> SeatNumbers { get; set; }
    }
}