using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimplyFly.DTOs;
using SimplyFly.Models;
using SimplyFly.Services.Interfaces;
using System.Security.Claims;

namespace SimplyFly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPut("update-profile")]
        [Authorize(Roles = "Passenger,FlightOwner")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto updateDto)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _userService.UpdateMyProfileAsync(userId, updateDto);
            return Ok(new { Message = "Profile updated successfully." });
        }

        [HttpDelete("delete-account")]
        [Authorize(Roles = "Passenger,FlightOwner")]
        public async Task<IActionResult> DeleteAccount()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _userService.DeleteMyAccountAsync(userId);
            return Ok(new { Message = "Your account has been deleted." });
        }
    }
}