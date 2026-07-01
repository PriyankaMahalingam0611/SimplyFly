using SimplyFly.DTOs;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using SimplyFly.Services.Interfaces;
using SimplyFly.Exceptions;

namespace SimplyFly.Services.Implementations
{
    public class FlightService : IFlightService
    {
        private readonly IFlightRepository _flightRepository;

        public FlightService(IFlightRepository flightRepository)
        {
            _flightRepository = flightRepository;
        }

        public async Task<Flight> CreateFlightAsync(int ownerId, CreateFlightDto flightDto)
        {
            var flight = new Flight
            {
                OwnerId = ownerId,
                FlightName = flightDto.FlightName,
                FlightNumber = flightDto.FlightNumber,
                Origin = flightDto.Origin,
                Destination = flightDto.Destination
            };
            return await _flightRepository.AddFlightAsync(flight);
        }

        public async Task<Schedule> CreateScheduleAsync(CreateScheduleDto scheduleDto)
        {
            var schedule = new Schedule
            {
                FlightId = scheduleDto.FlightId,
                DepartureTime = scheduleDto.DepartureTime,
                ArrivalTime = scheduleDto.ArrivalTime,
                FlightCabins = scheduleDto.Cabins.Select(c => new FlightCabin
                {
                    CabinType = c.CabinType,
                    Price = c.Price,
                    AvailableSeats = c.TotalSeats,
                    CheckInBaggage = c.CheckInBaggage,
                    CabinBaggage = c.CabinBaggage
                }).ToList()
            };
            return await _flightRepository.AddScheduleAsync(schedule);
        }

        public async Task DeleteScheduleConditionalAsync(int scheduleId)
        {
            var schedule = await _flightRepository.GetScheduleByIdAsync(scheduleId);

            if (schedule == null)
                throw new FlightScheduleNotFoundException();

            foreach (var Cabin in schedule.FlightCabins) { }

            await _flightRepository.DeleteScheduleAsync(schedule);
        }

        public async Task<IEnumerable<FlightSearchResultDto>> SearchFlightsAsync(FlightSearchRequestDto searchDto)
        {
            if (searchDto.DateOfJourney.Date < DateTime.UtcNow.Date)
            {
                throw new PastJourneyDateException();
            }

            var schedules = await _flightRepository.SearchSchedulesAsync(searchDto.Origin, searchDto.Destination, searchDto.DateOfJourney);

            return schedules.Select(s => new FlightSearchResultDto
            {
                ScheduleId = s.ScheduleId,
                FlightName = s.Flight.FlightName,
                FlightNumber = s.Flight.FlightNumber,
                Origin = s.Flight.Origin,
                Destination = s.Flight.Destination,
                DepartureTime = s.DepartureTime,
                ArrivalTime = s.ArrivalTime,
                CabinOptions = s.FlightCabins.Select(c => new CabinOptionDto
                {
                    CabinId = c.CabinId,
                    CabinType = c.CabinType,
                    Price = c.Price,
                    AvailableSeats = c.AvailableSeats
                }).ToList()
            });
        }
    }
}