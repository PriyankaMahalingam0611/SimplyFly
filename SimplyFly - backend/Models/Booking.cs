using System;
using System.Collections.Generic;

namespace SimplyFly.Models
{
    public class Booking
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public int ScheduleId { get; set; }
        public decimal TotalAmount { get; set; }
        public string BookingStatus { get; set; } 
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        public User User { get; set; }
        public Schedule Schedule { get; set; }
        public ICollection<BookedSeat> BookedSeats { get; set; }
        public Payment Payment { get; set; }
    }
}