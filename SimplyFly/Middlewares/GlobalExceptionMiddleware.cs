using System.Net;
using System.Text.Json;
using SimplyFly.Exceptions;

namespace SimplyFly.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred during the request.");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            context.Response.StatusCode = exception switch
            {
                FlightScheduleNotFoundException => (int)HttpStatusCode.NotFound,
                UserProfileNotFoundException => (int)HttpStatusCode.NotFound,
                UserAccountNotFoundException => (int)HttpStatusCode.NotFound,
                CabinNotFoundException => (int)HttpStatusCode.NotFound,
                PendingRefundNotFoundException => (int)HttpStatusCode.NotFound,
                PaymentNotFoundException => (int)HttpStatusCode.NotFound,

                InvalidCredentialsException => (int)HttpStatusCode.Unauthorized,

                UnauthorizedBookingAccessException => (int)HttpStatusCode.Forbidden,

                PastJourneyDateException => (int)HttpStatusCode.BadRequest,
                EmailRequiredException => (int)HttpStatusCode.BadRequest,
                PasswordRequiredException => (int)HttpStatusCode.BadRequest,
                BookingCancellationException => (int)HttpStatusCode.BadRequest,
                PaymentAmountMismatchException => (int)HttpStatusCode.BadRequest,

                InsufficientSeatsException => (int)HttpStatusCode.Conflict,
                SeatAlreadyBookedException => (int)HttpStatusCode.Conflict,
                EmailAlreadyInUseException => (int)HttpStatusCode.Conflict,
                PaymentAlreadyProcessedException => (int)HttpStatusCode.Conflict,


                _ => (int)HttpStatusCode.InternalServerError
            };

            var response = new
            {
                Message = context.Response.StatusCode == (int)HttpStatusCode.InternalServerError
                    ? "An unexpected server error occurred."
                    : exception.Message
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}