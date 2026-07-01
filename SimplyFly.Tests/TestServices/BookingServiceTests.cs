using Moq;
using SimplyFly.DTOs;
using SimplyFly.Exceptions;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Implementations;

namespace SimplyFly.Tests.TestServices
{
    [TestFixture]
    public class BookingServiceTests
    {
        private Mock<IBookingRepository> _mockRepo;
        private BookingService _bookingService;

        [SetUp]
        public void Setup()
        {
            _mockRepo = new Mock<IBookingRepository>();
            _bookingService = new BookingService(_mockRepo.Object);
        }

        [Test]
        public async Task CreateNewBookingAsync_WhenCabinNotFound_ThrowsCabinNotFoundException()
        {
            var dto = new CreateBookingDto { CabinId = 1, SeatNumbers = new List<string> { "1A" } };
            _mockRepo.Setup(r => r.GetCabinDetailsAsync(1)).ReturnsAsync((FlightCabin)null);

            Assert.ThrowsAsync<CabinNotFoundException>(async () => await _bookingService.CreateNewBookingAsync(1, dto));
        }

        [Test]
        public async Task CreateNewBookingAsync_WhenSeatsInsufficient_ThrowsInsufficientSeatsException()
        {
            var dto = new CreateBookingDto { CabinId = 1, ScheduleId = 1, SeatNumbers = new List<string> { "1A", "1B" } };
            var cabin = new FlightCabin { CabinId = 1, AvailableSeats = 1 };

            _mockRepo.Setup(r => r.GetCabinDetailsAsync(1)).ReturnsAsync(cabin);

            Assert.ThrowsAsync<InsufficientSeatsException>(async () => await _bookingService.CreateNewBookingAsync(1, dto));
        }

        [Test]
        public async Task CreateNewBookingAsync_WhenSeatAlreadyBooked_ThrowsSeatAlreadyBookedException()
        {
            var dto = new CreateBookingDto { CabinId = 1, ScheduleId = 1, SeatNumbers = new List<string> { "1A" } };
            var cabin = new FlightCabin { CabinId = 1, AvailableSeats = 5 };

            _mockRepo.Setup(r => r.GetCabinDetailsAsync(1)).ReturnsAsync(cabin);
            _mockRepo.Setup(r => r.AreSeatsAlreadyBookedAsync(1, 1, dto.SeatNumbers)).ReturnsAsync(true);

            Assert.ThrowsAsync<SeatAlreadyBookedException>(async () => await _bookingService.CreateNewBookingAsync(1, dto));
        }

        [Test]
        public async Task CancelBookingAsync_WhenBookingNotFound_ThrowsBookingCancellationException()
        {
            _mockRepo.Setup(r => r.GetBookingForCancellationAsync(1)).ReturnsAsync((Booking)null);

            Assert.ThrowsAsync<BookingCancellationException>(async () => await _bookingService.CancelBookingAsync(1));
        }

        [Test]
        public async Task ProcessRefundAsync_WhenRefundNotPending_ThrowsPendingRefundNotFoundException()
        {
            var payment = new Payment { PaymentId = 1, RefundStatus = "Refunded" };
            _mockRepo.Setup(r => r.GetPaymentByBookingIdAsync(1)).ReturnsAsync(payment);

            Assert.ThrowsAsync<PendingRefundNotFoundException>(async () => await _bookingService.ProcessRefundAsync(1));
        }

        [Test]
        public async Task ProcessRefundAsync_WhenRefundIsPending_UpdatesStatusSuccessfully()
        {
            var payment = new Payment { PaymentId = 1, RefundStatus = "Pending" };
            _mockRepo.Setup(r => r.GetPaymentByBookingIdAsync(1)).ReturnsAsync(payment);
            _mockRepo.Setup(r => r.UpdatePaymentStatusAsync(It.IsAny<Payment>())).Returns(Task.CompletedTask);

            await _bookingService.ProcessRefundAsync(1);

            Assert.That(payment.RefundStatus, Is.EqualTo("Refunded"));
            _mockRepo.Verify(r => r.UpdatePaymentStatusAsync(payment), Times.Once);
        }
    }
}