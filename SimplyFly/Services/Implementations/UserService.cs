using SimplyFly.DTOs;
using SimplyFly.Exceptions;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Interfaces;

namespace SimplyFly.Services.Implementations
{
        public class UserService : IUserService
        {
            private readonly IAdminRepository _adminRepository;

            public UserService(IAdminRepository adminRepository)
            {
                _adminRepository = adminRepository;
            }

            public async Task UpdateMyProfileAsync(int userId, UpdateUserDto updateDto)
            {
                var user = await _adminRepository.GetUserByIdAsync(userId);
                if (user == null) throw new UserProfileNotFoundException();

                user.Name = updateDto.Name;
                user.Email = updateDto.Email;
                user.ContactNumber = updateDto.ContactNumber;
                user.Address = updateDto.Address;

                await _adminRepository.UpdateUserAsync(user);
            }

            public async Task DeleteMyAccountAsync(int userId)
            {
                var user = await _adminRepository.GetUserByIdAsync(userId);
                if (user == null) throw new UserAccountNotFoundException();

                await _adminRepository.DeleteUserAsync(user);
            }
        }
}
