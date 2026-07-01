using SimplyFly.DTOs;
using SimplyFly.Exceptions;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Interfaces;

namespace SimplyFly.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IBookingRepository _bookingRepository;

        public PaymentService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<BookingResponseDto> ProcessPaymentAsync(int passengerId, ProcessPaymentDto paymentDto)
        {
            var payment = await _bookingRepository.GetPaymentForProcessingAsync(paymentDto.BookingId);
            if (payment == null) 
                throw new PaymentNotFoundException();

            var booking = payment.Booking;
            if (booking.UserId != passengerId) 
                throw new UnauthorizedBookingAccessException();

            if (payment.TransactionStatus == "Success") 
                throw new PaymentAlreadyProcessedException();

            if (paymentDto.Amount != payment.Amount)
                throw new PaymentAmountMismatchException(payment.Amount, paymentDto.Amount);

            payment.TransactionStatus = "Success";
            booking.BookingStatus = "Confirmed";

            await _bookingRepository.ConfirmPaymentTransactionAsync(payment, booking);

            var firstSeat = booking.BookedSeats.FirstOrDefault();

            return new BookingResponseDto
            {
                BookingId = booking.BookingId,
                FlightNumber = booking.Schedule.Flight.FlightNumber,
                Origin = booking.Schedule.Flight.Origin,
                Destination = booking.Schedule.Flight.Destination,
                DepartureTime = booking.Schedule.DepartureTime,
                CabinType = firstSeat?.FlightCabin.CabinType,
                BookedSeats = booking.BookedSeats.Select(s => s.SeatNumber).ToList(),
                TotalAmount = booking.TotalAmount,
                BookingStatus = booking.BookingStatus,
                TransactionStatus = payment.TransactionStatus
            };
        }
    }
}
