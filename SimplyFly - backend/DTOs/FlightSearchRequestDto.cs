using System;
using System.ComponentModel.DataAnnotations;

namespace SimplyFly.DTOs
{
    public class FlightSearchRequestDto
    {
        [Required(ErrorMessage = "Origin city/airport is required.")]
        public string Origin { get; set; }

        [Required(ErrorMessage = "Destination city/airport is required.")]
        public string Destination { get; set; }

        [Required(ErrorMessage = "Date of journey is required.")]
        public DateTime DateOfJourney { get; set; }
    }
}