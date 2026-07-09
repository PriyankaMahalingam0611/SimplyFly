using System;

namespace SimplyFly.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string TransactionStatus { get; set; } = "Pending";
        public string RefundStatus { get; set; } = "None";
        public Booking Booking { get; set; }
    }
}