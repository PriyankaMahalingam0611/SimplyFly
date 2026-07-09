using System;
using System.Collections.Generic;

namespace SimplyFly.DTOs
{
    public class BookingResponseDto
    {
        public int BookingId { get; set; }
        public string FlightNumber { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public DateTime DepartureTime { get; set; }
        public string CabinType { get; set; }
        public List<string> BookedSeats { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; }
        public string TransactionStatus { get; set; }
        public string PassengerName { get; set; }
        public string PassengerEmail { get; set; }
        public string RefundStatus { get; set; }
    }
}