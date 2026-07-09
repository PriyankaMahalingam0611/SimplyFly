namespace SimplyFly.Exceptions
{
    public class PaymentAlreadyProcessedException : Exception
    {
        public PaymentAlreadyProcessedException() : base("This booking has already been paid for.") { }
    }
}
