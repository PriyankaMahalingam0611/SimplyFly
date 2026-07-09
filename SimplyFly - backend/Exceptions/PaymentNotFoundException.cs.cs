namespace SimplyFly.Exceptions
{
    public class PaymentNotFoundException : Exception
    {
        public PaymentNotFoundException() : base("No payment record found for this booking.") { }
    }
}
