using SimplyFly.Models;

namespace SimplyFly.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<Role?> GetRoleByNameAsync(string roleName);
        Task<User> CreateUserAsync(User user);
    }
}
