using System;

namespace SimplyFly.Exceptions
{
    public class InsufficientSeatsException : Exception
    {
        public InsufficientSeatsException() : base("Requested seating total unavailable.")
        {
        }
    }
}