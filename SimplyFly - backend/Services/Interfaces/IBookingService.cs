using SimplyFly.DTOs;

namespace SimplyFly.Services.Interfaces
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateNewBookingAsync(int passengerId, CreateBookingDto bookingDto);
        Task<IEnumerable<BookingResponseDto>> GetUserHistoryAsync(int userId);
        Task CancelBookingAsync(int bookingId);
        Task<IEnumerable<BookingResponseDto>> GetBookedPassengersForOwnerAsync(int ownerId);
        Task ProcessRefundAsync(int bookingId);
    }
}