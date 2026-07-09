using SimplyFly.DTOs;

namespace SimplyFly.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<BookingResponseDto> ProcessPaymentAsync(int passengerId, ProcessPaymentDto paymentDto);
    }
}
