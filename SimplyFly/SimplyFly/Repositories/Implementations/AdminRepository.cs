using Microsoft.EntityFrameworkCore;
using SimplyFly.Data;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;


namespace SimplyFly.Repositories.Implementations
{
    public class AdminRepository : IAdminRepository
    {
        private readonly SimplyFlyDbContext _context;

        public AdminRepository(SimplyFlyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.Include(u => u.Role).ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserAsync(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Booking>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.BookedSeats)
                .Include(b => b.Schedule)
                    .ThenInclude(s => s.Flight)
                .ToListAsync();
        }

        public async Task<IEnumerable<Flight>> GetAllRoutesAsync()
        {
            return await _context.Flights.Include(f => f.Owner).ToListAsync();
        }
    }
}