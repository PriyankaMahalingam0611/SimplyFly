using Moq;
using SimplyFly.DTOs;
using SimplyFly.Exceptions;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Implementations;
using System;
using System.Collections.Generic;
using System.Text;

namespace SimplyFly.Tests.TestServices
{
    [TestFixture]
    public class PaymentServiceTests
    {
        private Mock<IBookingRepository> _mockRepo;
        private PaymentService _paymentService;

        [SetUp]
        public void Setup()
        {
            _mockRepo = new Mock<IBookingRepository>();
            _paymentService = new PaymentService(_mockRepo.Object);
        }

        [Test]
        public void ProcessPaymentAsync_WhenPaymentNotFound_ThrowsPaymentNotFoundException()
        {
            var dto = new ProcessPaymentDto { BookingId = 1, Amount = 500, CardNumber = "4111111111111111" };
            _mockRepo.Setup(r => r.GetPaymentForProcessingAsync(1)).ReturnsAsync((Payment)null);

            Assert.ThrowsAsync<PaymentNotFoundException>(async () => await _paymentService.ProcessPaymentAsync(1, dto));
        }

        [Test]
        public void ProcessPaymentAsync_WhenBookingBelongsToAnotherUser_ThrowsUnauthorizedBookingAccessException()
        {
            var dto = new ProcessPaymentDto { BookingId = 1, Amount = 500, CardNumber = "4111111111111111" };
            var booking = new Booking { BookingId = 1, UserId = 99, TotalAmount = 500, BookingStatus = "PendingPayment" };
            var payment = new Payment { PaymentId = 1, BookingId = 1, Amount = 500, TransactionStatus = "Pending", Booking = booking };

            _mockRepo.Setup(r => r.GetPaymentForProcessingAsync(1)).ReturnsAsync(payment);

            // passengerId = 1, but booking.UserId = 99
            Assert.ThrowsAsync<UnauthorizedBookingAccessException>(async () => await _paymentService.ProcessPaymentAsync(1, dto));
        }

        [Test]
        public void ProcessPaymentAsync_WhenAlreadyPaid_ThrowsPaymentAlreadyProcessedException()
        {
            var dto = new ProcessPaymentDto { BookingId = 1, Amount = 500, CardNumber = "4111111111111111" };
            var booking = new Booking { BookingId = 1, UserId = 1, TotalAmount = 500, BookingStatus = "Confirmed" };
            var payment = new Payment { PaymentId = 1, BookingId = 1, Amount = 500, TransactionStatus = "Success", Booking = booking };

            _mockRepo.Setup(r => r.GetPaymentForProcessingAsync(1)).ReturnsAsync(payment);

            Assert.ThrowsAsync<PaymentAlreadyProcessedException>(async () => await _paymentService.ProcessPaymentAsync(1, dto));
        }

        [Test]
        public void ProcessPaymentAsync_WhenAmountMismatch_ThrowsPaymentAmountMismatchException()
        {
            var dto = new ProcessPaymentDto { BookingId = 1, Amount = 400, CardNumber = "4111111111111111" };
            var booking = new Booking { BookingId = 1, UserId = 1, TotalAmount = 500, BookingStatus = "PendingPayment" };
            var payment = new Payment { PaymentId = 1, BookingId = 1, Amount = 500, TransactionStatus = "Pending", Booking = booking };

            _mockRepo.Setup(r => r.GetPaymentForProcessingAsync(1)).ReturnsAsync(payment);

            Assert.ThrowsAsync<PaymentAmountMismatchException>(async () => await _paymentService.ProcessPaymentAsync(1, dto));
        }

        [Test]
        public async Task ProcessPaymentAsync_WhenValid_ConfirmsPaymentAndBooking()
        {
            var dto = new ProcessPaymentDto { BookingId = 1, Amount = 500, CardNumber = "4111111111111111" };
            var booking = new Booking { BookingId = 1, UserId = 1, TotalAmount = 500, BookingStatus = "PendingPayment" };
            var payment = new Payment { PaymentId = 1, BookingId = 1, Amount = 500, TransactionStatus = "Pending", Booking = booking };

            _mockRepo.Setup(r => r.GetPaymentForProcessingAsync(1)).ReturnsAsync(payment);
            _mockRepo.Setup(r => r.ConfirmPaymentTransactionAsync(It.IsAny<Payment>(), It.IsAny<Booking>())).Returns(Task.CompletedTask);

            var result = await _paymentService.ProcessPaymentAsync(1, dto);

            Assert.That(payment.TransactionStatus, Is.EqualTo("Success"));
            Assert.That(booking.BookingStatus, Is.EqualTo("Confirmed"));
            Assert.That(result.BookingStatus, Is.EqualTo("Confirmed"));
            Assert.That(result.TransactionStatus, Is.EqualTo("Success"));
            _mockRepo.Verify(r => r.ConfirmPaymentTransactionAsync(payment, booking), Times.Once);
        }
    }
}
