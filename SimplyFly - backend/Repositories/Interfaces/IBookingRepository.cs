using SimplyFly.Models;

namespace SimplyFly.Repositories.Interfaces
{
    public interface IBookingRepository
    {
        Task<FlightCabin> GetCabinDetailsAsync(int cabinId);
        Task<Booking> CreateBookingTransactionAsync(Booking booking, List<BookedSeat> seats, FlightCabin cabin, Payment payment);
        Task<IEnumerable<Booking>> GetPassengerBookingHistoryAsync(int userId);
        Task<Booking> GetBookingForCancellationAsync(int bookingId);
        Task CancelBookingTransactionAsync(Booking booking, List<BookedSeat> seats, FlightCabin cabin, Payment payment);
        Task<IEnumerable<Booking>> GetPassengersByOwnerIdAsync(int ownerId);
        Task<Payment> GetPaymentByBookingIdAsync(int bookingId);
        Task UpdatePaymentStatusAsync(Payment payment);
        Task<bool> AreSeatsAlreadyBookedAsync(int scheduleId, int cabinId, List<string> seatNumbers);
        Task<Payment> GetPaymentForProcessingAsync(int bookingId);
        Task ConfirmPaymentTransactionAsync(Payment payment, Booking booking);

    }
}