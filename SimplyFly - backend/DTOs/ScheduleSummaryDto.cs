using System;

namespace SimplyFly.DTOs
{
    public class ScheduleSummaryDto
    {
        public int ScheduleId { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public bool HasBookings { get; set; }
    }
}