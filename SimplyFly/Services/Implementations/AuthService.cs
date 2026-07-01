using SimplyFly.DTOs;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Interfaces;
using SimplyFly.Exceptions;

namespace SimplyFly.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthService(IAuthRepository authRepository, IJwtTokenService jwtTokenService)
        {
            _authRepository = authRepository;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            if (string.IsNullOrWhiteSpace(loginDto.Email))
            {
                throw new EmailRequiredException();
            }
            if (string.IsNullOrWhiteSpace(loginDto.Password))
            {
                throw new PasswordRequiredException();
            }

            var user = await _authRepository.GetUserByEmailAsync(loginDto.Email);
            if (user == null)
            {
                throw new InvalidCredentialsException();
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                throw new InvalidCredentialsException();
            }

            var roles = new List<string> { user.Role.RoleName };

            string token = _jwtTokenService.GenerateToken(user, roles, out DateTime expiresAt);

            return new AuthResponseDto
            {
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Roles = roles,
                Token = token,
                TokenExpiresAt = expiresAt
            };
        }

        public async Task RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _authRepository.GetUserByEmailAsync(registerDto.Email!);

            if (existingUser != null)
            {
                throw new EmailAlreadyInUseException();
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            var newUser = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = hashedPassword,
                ContactNumber = registerDto.ContactNumber,
                Address = registerDto.Address,
                RoleId = 1
            };

            await _authRepository.CreateUserAsync(newUser);
        }

        public async Task RegisterStaffAsync(RegisterStaffDto staffDto)
        {
            var existingUser = await _authRepository.GetUserByEmailAsync(staffDto.Email!);

            if (existingUser != null)
            {
                throw new EmailAlreadyInUseException();
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(staffDto.Password);

            var newUser = new User
            {
                Name = staffDto.Name,
                Email = staffDto.Email,
                PasswordHash = hashedPassword,
                ContactNumber = staffDto.ContactNumber,
                Address = staffDto.Address,
                RoleId = staffDto.RoleId
            };

            await _authRepository.CreateUserAsync(newUser);
        }
    }
}