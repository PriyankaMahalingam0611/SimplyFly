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
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost("create booking")]
        [Authorize(Roles = "Passenger")]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto bookingDto)
        {
            int passengerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var response = await _bookingService.CreateNewBookingAsync(passengerId, bookingDto);
            return Ok(response);
        }

        [HttpGet("Passenger : my-history")]
        [Authorize(Roles = "Passenger")]
        public async Task<IActionResult> GetUserBookingHistory()
        {
            int passengerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var history = await _bookingService.GetUserHistoryAsync(passengerId);
            return Ok(history);
        }

        [HttpPost("{id}/cancel booking")]
        [Authorize(Roles = "Passenger")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            await _bookingService.CancelBookingAsync(id);
            return Ok(new { Message = "Your ticket booking was cancelled. Refund request logged as Pending." });
        }

        [HttpGet("flightOwner : my-passengers")]
        [Authorize(Roles = "FlightOwner")]
        public async Task<IActionResult> GetBookedPassengersForOwnerAsync()
        {
            int ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var lists = await _bookingService.GetBookedPassengersForOwnerAsync(ownerId);
            return Ok(lists);
        }

        [HttpPost("{id}/approve refund")]
        [Authorize(Roles = "FlightOwner")]
        public async Task<IActionResult> ApproveRefund(int id)
        {
            await _bookingService.ProcessRefundAsync(id);
            return Ok(new { Message = "Refund payout systematically calculated and closed." });
        }
    }
}