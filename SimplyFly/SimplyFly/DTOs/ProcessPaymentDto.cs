using System.ComponentModel.DataAnnotations;

namespace SimplyFly.DTOs
{
    public class ProcessPaymentDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Valid Booking ID is required.")]
        public int BookingId { get; set; }

        [Required(ErrorMessage = "Card number is required.")]
        [CreditCard(ErrorMessage = "Invalid credit card number format.")]
        public string CardNumber { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Payment amount must be greater than zero.")]
        public decimal Amount { get; set; }
    }
}