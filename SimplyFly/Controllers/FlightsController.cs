using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SimplyFly.DTOs;
using SimplyFly.Services.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SimplyFly.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FlightsController : ControllerBase
    {
        private readonly IFlightService _flightService;

        public FlightsController(IFlightService flightService)
        {
            _flightService = flightService;
        }

        [HttpPost("create flight")]
        [Authorize(Roles = "FlightOwner")]
        public async Task<IActionResult> CreateFlight([FromBody] CreateFlightDto flightDto)
        {
            int ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _flightService.CreateFlightAsync(ownerId, flightDto);
            return Ok(result);
        }

        [HttpPost("create schedules")]
        [Authorize(Roles = "FlightOwner")]
        public async Task<IActionResult> CreateSchedule([FromBody] CreateScheduleDto scheduleDto)
        {
            var result = await _flightService.CreateScheduleAsync(scheduleDto);
            return Ok(result);
        }

        [HttpGet("search for a flight")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchFlights([FromQuery] FlightSearchRequestDto searchDto)
        {
            var results = await _flightService.SearchFlightsAsync(searchDto);
            return Ok(results);
        }

        [HttpDelete("delete schedules/{id}")]
        [Authorize(Roles = "FlightOwner")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            await _flightService.DeleteScheduleConditionalAsync(id);
            return Ok(new { Message = "Flight schedule cancelled and dropped." });
        }
    }
}