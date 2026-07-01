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
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("process")]
        [Authorize(Roles = "Passenger")]
        public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentDto paymentDto)
        {
            int passengerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _paymentService.ProcessPaymentAsync(passengerId, paymentDto);
            return Ok(result);
        }
    }
}
