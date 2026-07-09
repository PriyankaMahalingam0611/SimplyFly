using System;

namespace SimplyFly.Exceptions
{
    public class FlightScheduleNotFoundException : Exception
    {
        public FlightScheduleNotFoundException() : base("Target flight schedule timeline was not found.")
        {
        }
    }
}