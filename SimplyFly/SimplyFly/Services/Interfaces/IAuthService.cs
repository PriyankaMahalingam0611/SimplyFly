using SimplyFly.DTOs;

namespace SimplyFly.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task RegisterAsync(RegisterDto registerDto);
        Task RegisterStaffAsync(RegisterStaffDto staffDto);
    }
}