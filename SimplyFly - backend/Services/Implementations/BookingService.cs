using Microsoft.EntityFrameworkCore;
using SimplyFly.DTOs;
using SimplyFly.Exceptions;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Interfaces;

namespace SimplyFly.Services.Implementations
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;

        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<BookingResponseDto> CreateNewBookingAsync(int passengerId, CreateBookingDto bookingDto)
        {
            var cabin = await _bookingRepository.GetCabinDetailsAsync(bookingDto.CabinId);
            if (cabin == null) throw new CabinNotFoundException();

            if (cabin.AvailableSeats < bookingDto.SeatNumbers.Count) throw new InsufficientSeatsException();

            bool isAnySeatTaken = await _bookingRepository.AreSeatsAlreadyBookedAsync(bookingDto.ScheduleId, bookingDto.CabinId, bookingDto.SeatNumbers);
            if (isAnySeatTaken) throw new SeatAlreadyBookedException();

            decimal totalAmount = cabin.Price * bookingDto.SeatNumbers.Count;

            var booking = new Booking
            {
                UserId = passengerId,
                ScheduleId = bookingDto.ScheduleId,
                TotalAmount = totalAmount,
                BookingStatus = "PendingPayment"   
            };

            var bookedSeats = bookingDto.SeatNumbers.Select(sn => new BookedSeat { CabinId = bookingDto.CabinId, SeatNumber = sn }).ToList();

            var payment = new Payment
            {
                Amount = totalAmount,
                TransactionStatus = "Pending"  
            };

            var completed = await _bookingRepository.CreateBookingTransactionAsync(booking, bookedSeats, cabin, payment);

            return new BookingResponseDto
            {
                BookingId = completed.BookingId,
                FlightNumber = cabin.Schedule.Flight.FlightNumber,
                Origin = cabin.Schedule.Flight.Origin,
                Destination = cabin.Schedule.Flight.Destination,
                DepartureTime = cabin.Schedule.DepartureTime,
                CabinType = cabin.CabinType,
                BookedSeats = bookingDto.SeatNumbers,
                TotalAmount = completed.TotalAmount,
                BookingStatus = completed.BookingStatus,
                TransactionStatus = "Pending"
            };
        }

        public async Task<IEnumerable<BookingResponseDto>> GetUserHistoryAsync(int userId)
        {
            var histories = await _bookingRepository.GetPassengerBookingHistoryAsync(userId);
            return histories.Select(b => new BookingResponseDto
            {
                BookingId = b.BookingId,
                FlightNumber = b.Schedule.Flight.FlightNumber,
                Origin = b.Schedule.Flight.Origin,
                Destination = b.Schedule.Flight.Destination,
                DepartureTime = b.Schedule.DepartureTime,
                CabinType = b.BookedSeats.FirstOrDefault()?.FlightCabin.CabinType,
                BookedSeats = b.BookedSeats.Select(s => s.SeatNumber).ToList(),
                TotalAmount = b.TotalAmount,
                BookingStatus = b.BookingStatus,
                TransactionStatus = b.Payment?.TransactionStatus
            });
        }

        public async Task CancelBookingAsync(int bookingId)
        {
            var booking = await _bookingRepository.GetBookingForCancellationAsync(bookingId);
            if (booking == null || booking.BookingStatus == "Cancelled")
                throw new BookingCancellationException();

            booking.BookingStatus = "Cancelled";
            var originalSeat = booking.BookedSeats.FirstOrDefault();

            if (originalSeat == null)
                throw new BookingCancellationException();

            var cabin = await _bookingRepository.GetCabinDetailsAsync(originalSeat.CabinId);

            if (booking.Payment == null)
            {
                booking.Payment = new Payment { BookingId = booking.BookingId, Amount = booking.TotalAmount, TransactionStatus = "Success" };
            }
            booking.Payment.RefundStatus = "Pending";

            await _bookingRepository.CancelBookingTransactionAsync(booking, booking.BookedSeats.ToList(), cabin, booking.Payment);
        }

        public async Task<IEnumerable<BookingResponseDto>> GetBookedPassengersForOwnerAsync(int ownerId)
        {
            var bookings = await _bookingRepository.GetPassengersByOwnerIdAsync(ownerId);
            return bookings.Select(b => new BookingResponseDto
            {
                BookingId = b.BookingId,
                FlightNumber = b.Schedule.Flight.FlightNumber,
                Origin = b.Schedule.Flight.Origin,
                Destination = b.Schedule.Flight.Destination,
                DepartureTime = b.Schedule.DepartureTime,
                TotalAmount = b.TotalAmount,
                BookingStatus = b.BookingStatus,
                BookedSeats = b.BookedSeats.Select(s => s.SeatNumber).ToList(),
                PassengerName = b.User.Name,
                PassengerEmail = b.User.Email,
                RefundStatus = b.Payment?.RefundStatus
            });
        }

        public async Task ProcessRefundAsync(int bookingId)
        {
            var payment = await _bookingRepository.GetPaymentByBookingIdAsync(bookingId);
            if (payment == null || payment.RefundStatus != "Pending")
                throw new PendingRefundNotFoundException();

            payment.RefundStatus = "Refunded";
            await _bookingRepository.UpdatePaymentStatusAsync(payment);
        }

    }
}