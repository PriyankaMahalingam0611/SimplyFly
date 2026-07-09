using System;

namespace SimplyFly.Exceptions
{
    public class SeatAlreadyBookedException : Exception
    {
        public SeatAlreadyBookedException() : base("One or more of the selected seats are already booked. Please choose different seats.")
        {
        }
    }
}