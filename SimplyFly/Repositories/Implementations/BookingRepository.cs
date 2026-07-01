using Microsoft.EntityFrameworkCore;
using SimplyFly.Data;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimplyFly.Repositories.Implementations
{
    public class BookingRepository : IBookingRepository
    {
        private readonly SimplyFlyDbContext _context;
        public BookingRepository(SimplyFlyDbContext context)
        {
            _context = context;
        }

        public async Task<FlightCabin> GetCabinDetailsAsync(int cabinId)
        {
            return await _context.FlightCabins
                .Include(fc => fc.Schedule)
                    .ThenInclude(s => s.Flight)
                .FirstOrDefaultAsync(fc => fc.CabinId == cabinId);
        }

        public async Task<Booking> CreateBookingTransactionAsync(Booking booking, List<BookedSeat> seats, FlightCabin cabin, Payment payment)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await _context.Bookings.AddAsync(booking);
                await _context.SaveChangesAsync();

                foreach (var seat in seats) 
                    seat.BookingId = booking.BookingId;
                await _context.BookedSeats.AddRangeAsync(seats);

                payment.BookingId = booking.BookingId; 
                await _context.Payments.AddAsync(payment);

                cabin.AvailableSeats -= seats.Count;
                _context.FlightCabins.Update(cabin);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return booking;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<Booking>> GetPassengerBookingHistoryAsync(int userId)
        {
            return await _context.Bookings
                .Include(b => b.BookedSeats)
                    .ThenInclude(bs => bs.FlightCabin)
                .Include(b => b.Schedule)
                    .ThenInclude(s => s.Flight)
                .Include(b => b.Payment)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();
        }

        public async Task<Booking> GetBookingForCancellationAsync(int bookingId)
        {
            return await _context.Bookings
                .Include(b => b.BookedSeats)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
        }

        public async Task CancelBookingTransactionAsync(Booking booking, List<BookedSeat> seats, FlightCabin cabin, Payment payment)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Bookings.Update(booking);
                cabin.AvailableSeats += seats.Count;
                _context.FlightCabins.Update(cabin);
                _context.Payments.Update(payment);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<Booking>> GetPassengersByOwnerIdAsync(int ownerId)
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.BookedSeats)
                .Include(b => b.Schedule)
                    .ThenInclude(s => s.Flight)
                .Where(b => b.Schedule.Flight.OwnerId == ownerId)
                .ToListAsync();
        }

        public async Task<Payment> GetPaymentByBookingIdAsync(int bookingId)
        {
            return await _context.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId);
        }

        public async Task UpdatePaymentStatusAsync(Payment payment)
        {
            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> AreSeatsAlreadyBookedAsync(int scheduleId, int cabinId, List<string> seatNumbers)
        {
            return await _context.BookedSeats
                .AnyAsync(bs => bs.FlightCabin.ScheduleId == scheduleId
                             && bs.CabinId == cabinId
                             && seatNumbers.Contains(bs.SeatNumber)
                             && bs.Booking.BookingStatus != "Cancelled"); 
        }

        public async Task<Payment> GetPaymentForProcessingAsync(int bookingId)
        {
            return await _context.Payments
                .Include(p => p.Booking)
                    .ThenInclude(b => b.Schedule)
                        .ThenInclude(s => s.Flight)
                .Include(p => p.Booking)
                    .ThenInclude(b => b.BookedSeats)
                        .ThenInclude(bs => bs.FlightCabin)
                .FirstOrDefaultAsync(p => p.BookingId == bookingId);
        }

        public async Task ConfirmPaymentTransactionAsync(Payment payment, Booking booking)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Payments.Update(payment);
                _context.Bookings.Update(booking);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }



    }
}
