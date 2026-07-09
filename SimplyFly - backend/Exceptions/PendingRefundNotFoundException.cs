using System;

namespace SimplyFly.Exceptions
{
    public class PendingRefundNotFoundException : Exception
    {
        public PendingRefundNotFoundException() : base("No pending refund logs found matching this identifier index.")
        {
        }
    }
}