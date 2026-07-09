using SimplyFly.DTOs;

namespace SimplyFly.Services.Interfaces
{
    public interface IUserService
    {
        Task UpdateMyProfileAsync(int userId, UpdateUserDto updateDto);
        Task DeleteMyAccountAsync(int userId);
    }
}
