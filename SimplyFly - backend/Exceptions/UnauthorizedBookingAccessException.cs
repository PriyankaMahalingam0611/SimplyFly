namespace SimplyFly.Exceptions
{
    public class UnauthorizedBookingAccessException : Exception
    {
        public UnauthorizedBookingAccessException() : base("This booking does not belong to the current user.") { }
    }
}
