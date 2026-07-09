using SimplyFly.DTOs;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Interfaces;
using SimplyFly.Exceptions;

namespace SimplyFly.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<IEnumerable<UserSummaryDto>> GetPassengersAsync()
        {
            var users = await _adminRepository.GetPassengersAsync();
            return users.Select(u => new UserSummaryDto
            {
                UserId = u.UserId,
                Name = u.Name,
                Email = u.Email,
                ContactNumber = u.ContactNumber,
                Address = u.Address,
            });
        }

        public async Task<IEnumerable<UserSummaryDto>> GetFlightOwnersAsync()
        {
            var users = await _adminRepository.GetFlightOwnersAsync();
            return users.Select(u => new UserSummaryDto
            {
                UserId = u.UserId,
                Name = u.Name,
                Email = u.Email,
                ContactNumber = u.ContactNumber,
                Address = u.Address,
            });
        }

        public async Task UpdateUserProfileAsync(int userId, UpdateUserDto updateDto)
        {
            var user = await _adminRepository.GetUserByIdAsync(userId);
            if (user == null)
                throw new UserProfileNotFoundException();

            user.Name = updateDto.Name;
            user.Email = updateDto.Email;
            user.ContactNumber = updateDto.ContactNumber;
            user.Address = updateDto.Address;

            await _adminRepository.UpdateUserAsync(user);
        }

        public async Task DeleteUserAccountAsync(int userId)
        {
            var user = await _adminRepository.GetUserByIdAsync(userId);
            if (user == null)
                throw new UserAccountNotFoundException();

            await _adminRepository.DeleteUserAsync(user);
        }

        public async Task<IEnumerable<BookingResponseDto>> GetAllBookingsAsync()
        {
            var bookings = await _adminRepository.GetAllBookingsAsync();
            return bookings.Select(b => new BookingResponseDto
            {
                BookingId = b.BookingId,
                FlightNumber = b.Schedule.Flight.FlightNumber,
                Origin = b.Schedule.Flight.Origin,
                Destination = b.Schedule.Flight.Destination,
                DepartureTime = b.Schedule.DepartureTime,
                CabinType = b.BookedSeats.FirstOrDefault()?.FlightCabin?.CabinType,
                BookedSeats = b.BookedSeats.Select(s => s.SeatNumber).ToList(),
                TotalAmount = b.TotalAmount,
                BookingStatus = b.BookingStatus,
                TransactionStatus = b.Payment?.TransactionStatus
            });
        }

        public async Task<IEnumerable<FlightResponseDto>> GetAllRoutesAsync()
        {
            var flights = await _adminRepository.GetAllRoutesAsync();
            return flights.Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
                OwnerId = f.OwnerId,
                FlightName = f.FlightName,
                FlightNumber = f.FlightNumber,
                Origin = f.Origin,
                Destination = f.Destination
            });
        }
    }
}