using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimplyFly.DTOs;
using SimplyFly.Services.Interfaces;
using System.Threading.Tasks;

namespace SimplyFly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("get all users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetPlatformUsersAsync();
            return Ok(users);
        }

        [HttpPut("update user/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
        {
            await _adminService.UpdateUserProfileAsync(id, updateDto);
            return Ok(new { Message = "User profile updated successfully." });
        }

        [HttpDelete("delete user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            await _adminService.DeleteUserAccountAsync(id);
            return Ok(new { Message = "Account successfully deleted." });
        }

        [HttpGet("get all bookings")]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _adminService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpGet("get all flight/routes")]
        public async Task<IActionResult> GetAllRoutes()
        {
            var routes = await _adminService.GetAllRoutesAsync();
            return Ok(routes);
        }
    }
}