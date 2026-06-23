using SimplyFly.DTOs;
using SimplyFly.Models;

namespace SimplyFly.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<User>> GetPlatformUsersAsync();
        Task UpdateUserProfileAsync(int id, UpdateUserDto updateDto);
        Task DeleteUserAccountAsync(int userId);
        Task<IEnumerable<BookingResponseDto>> GetAllBookingsAsync();
        Task<IEnumerable<FlightResponseDto>> GetAllRoutesAsync();
    }
}