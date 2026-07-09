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
            if (schedule == null) throw new FlightScheduleNotFoundException();

            bool hasActiveBookings = schedule.Bookings.Any(b => b.BookingStatus != "Cancelled");
            if (hasActiveBookings) throw new BookingCancellationException();

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
                CabinOptions = s.FlightCabins.Select(c =>
                {
                    var bookedSeatNumbers = c.BookedSeats
                        .Where(bs => bs.Booking.BookingStatus != "Cancelled")
                        .Select(bs => bs.SeatNumber)
                        .ToList();

                    return new CabinOptionDto
                    {
                        CabinId = c.CabinId,
                        CabinType = c.CabinType,
                        Price = c.Price,
                        AvailableSeats = c.AvailableSeats,
                        TotalSeats = c.AvailableSeats + bookedSeatNumbers.Count,
                        BookedSeatNumbers = bookedSeatNumbers,
                        CheckInBaggage = c.CheckInBaggage,  
                        CabinBaggage = c.CabinBaggage
                    };
                }).ToList()
            });
        }

        public async Task<IEnumerable<FlightResponseDto>> GetFlightsByOwnerAsync(int ownerId)
        {
            var flights = await _flightRepository.GetFlightsByOwnerIdAsync(ownerId); 
            return flights.Select(f => new FlightResponseDto
            {
                FlightId = f.FlightId,
                OwnerId = f.OwnerId,
                FlightName = f.FlightName,
                FlightNumber = f.FlightNumber,
                Origin = f.Origin,
                Destination = f.Destination
            });
        }

        public async Task<IEnumerable<ScheduleSummaryDto>> GetSchedulesByFlightAsync(int flightId)
        {
            var schedules = await _flightRepository.GetSchedulesByFlightIdAsync(flightId);
            return schedules.Select(s => new ScheduleSummaryDto
            {
                ScheduleId = s.ScheduleId,
                DepartureTime = s.DepartureTime,
                ArrivalTime = s.ArrivalTime,
                HasBookings = s.Bookings.Any(b => b.BookingStatus != "Cancelled")
            });
        }

    }
}