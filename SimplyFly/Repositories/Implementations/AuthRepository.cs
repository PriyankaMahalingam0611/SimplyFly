using Microsoft.EntityFrameworkCore;
using SimplyFly.Data;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;

namespace SimplyFly.Repositories.Implementations
{
    public class AuthRepository : IAuthRepository
    {
        private readonly SimplyFlyDbContext _context;

        public AuthRepository(SimplyFlyDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<Role?> GetRoleByNameAsync(string roleName)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName.ToLower() == roleName.ToLower());
        }

        public async Task<User> CreateUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}