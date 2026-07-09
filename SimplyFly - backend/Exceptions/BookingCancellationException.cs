using System;

namespace SimplyFly.Exceptions
{
    public class BookingCancellationException : Exception
    {
        public BookingCancellationException() : base("Booking cannot be cancelled or was already processed.")
        {
        }
    }
}