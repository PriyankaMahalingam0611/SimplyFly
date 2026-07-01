namespace SimplyFly.Exceptions
{
    public class PaymentAmountMismatchException : Exception
    {
        public PaymentAmountMismatchException(decimal expected, decimal received)
            : base($"Payment amount mismatch. Expected {expected:C}, but received {received:C}.") { }
    }
}
