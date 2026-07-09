using SimplyFly.Models;

namespace SimplyFly.Repositories.Interfaces
{
    public interface IAdminRepository
    {
        Task<IEnumerable<User>> GetPassengersAsync();
        Task<IEnumerable<User>> GetFlightOwnersAsync();
        Task<User> GetUserByIdAsync(int userId);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
        Task<IEnumerable<Booking>> GetAllBookingsAsync();
        Task<IEnumerable<Flight>> GetAllRoutesAsync();
    }
}
