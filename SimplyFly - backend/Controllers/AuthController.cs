using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimplyFly.DTOs;
using SimplyFly.Services.Interfaces;
using System.Threading.Tasks;

namespace SimplyFly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var data = await _authService.LoginAsync(loginDto);

            return Ok(new
            {
                StatusCode = StatusCodes.Status200OK,
                Message = "Login Successful",
                Data = data
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            await _authService.RegisterAsync(registerDto);

            return Ok(new 
            { Message = "User registered successfully!" 
            });
        }

        [HttpPost("register-staff")]
        public async Task<IActionResult> RegisterStaff(RegisterStaffDto staffDto)
        {
            await _authService.RegisterStaffAsync(staffDto);

            return Ok(new { Message = "Staff member registered successfully!" });
        }
    }
}