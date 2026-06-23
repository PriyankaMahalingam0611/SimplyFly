using Moq;
using SimplyFly.DTOs;
using SimplyFly.Exceptions;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Implementations;

namespace SimplyFly.Tests.TestServices
{
    [TestFixture]
    public class FlightServiceTests
    {
        private Mock<IFlightRepository> _mockRepo;
        private FlightService _flightService;

        [SetUp]
        public void Setup()
        {
            _mockRepo = new Mock<IFlightRepository>();
            _flightService = new FlightService(_mockRepo.Object);
        }

        [Test]
        public async Task CreateFlightAsync_ReturnsCreatedFlight()
        {
            var dto = new CreateFlightDto { FlightName = "Test Airlines", FlightNumber = "TA101" };
            var flight = new Flight { FlightId = 1, FlightName = "Test Airlines", FlightNumber = "TA101" };

            _mockRepo.Setup(r => r.AddFlightAsync(It.IsAny<Flight>())).ReturnsAsync(flight);

            var result = await _flightService.CreateFlightAsync(1, dto);

            Assert.That(result.FlightId, Is.EqualTo(1));
            Assert.That(result.FlightNumber, Is.EqualTo("TA101"));
        }

        [Test]
        public async Task DeleteScheduleConditionalAsync_WhenScheduleNotFound_ThrowsFlightScheduleNotFoundException()
        {
            _mockRepo.Setup(r => r.GetScheduleByIdAsync(1)).ReturnsAsync((Schedule)null);

            Assert.ThrowsAsync<FlightScheduleNotFoundException>(async () => await _flightService.DeleteScheduleConditionalAsync(1));
        }

        [Test]
        public async Task DeleteScheduleConditionalAsync_WhenScheduleFound_DeletesSuccessfully()
        {
            var schedule = new Schedule { ScheduleId = 1, FlightCabins = new List<FlightCabin>() };
            _mockRepo.Setup(r => r.GetScheduleByIdAsync(1)).ReturnsAsync(schedule);
            _mockRepo.Setup(r => r.DeleteScheduleAsync(It.IsAny<Schedule>())).Returns(Task.CompletedTask);

            await _flightService.DeleteScheduleConditionalAsync(1);

            _mockRepo.Verify(r => r.DeleteScheduleAsync(schedule), Times.Once);
        }

        [Test]
        public async Task SearchFlightsAsync_WhenDateInPast_ThrowsPastJourneyDateException()
        {
            var dto = new FlightSearchRequestDto { DateOfJourney = DateTime.UtcNow.AddDays(-1) };

            Assert.ThrowsAsync<PastJourneyDateException>(async () => await _flightService.SearchFlightsAsync(dto));
        }

        [Test]
        public async Task SearchFlightsAsync_WhenDateValid_ReturnsMappedResults()
        {
            var dto = new FlightSearchRequestDto { Origin = "JFK", Destination = "LAX", DateOfJourney = DateTime.UtcNow.AddDays(5) };

            var schedule = new Schedule
            {
                ScheduleId = 1,
                Flight = new Flight { FlightName = "Test Air", FlightNumber = "TA100", Origin = "JFK", Destination = "LAX" },
                FlightCabins = new List<FlightCabin> {
                    new FlightCabin { CabinId = 1, CabinType = "Economy", Price = 100, AvailableSeats = 50
                    }
                }
            };

            _mockRepo.Setup(r => r.SearchSchedulesAsync("JFK", "LAX", dto.DateOfJourney)).ReturnsAsync(new List<Schedule> { schedule });

            var results = await _flightService.SearchFlightsAsync(dto);

            Assert.That(results.Count(), Is.EqualTo(1));
            Assert.That(results.First().FlightNumber, Is.EqualTo("TA100"));
        }
    }
}