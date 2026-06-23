using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimplyFly.DTOs
{
    public class CreateScheduleDto : IValidatableObject
    {
        [Range(1, int.MaxValue, ErrorMessage = "Valid Flight ID is required.")]
        public int FlightId { get; set; }

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one cabin must be specified.")]
        public List<CreateFlightCabinDto> Cabins { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (ArrivalTime <= DepartureTime)
            {
                yield return new ValidationResult(
                    "Arrival time must be after departure time.",
                    new[] { nameof(ArrivalTime) }
                );
            }
        }
    }
}