using System;
using System.Collections.Generic;

namespace SimplyFly.DTOs
{
    public class FlightSearchResultDto
    {
        public int ScheduleId { get; set; }
        public string FlightName { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public List<CabinOptionDto> CabinOptions { get; set; }
    }
}