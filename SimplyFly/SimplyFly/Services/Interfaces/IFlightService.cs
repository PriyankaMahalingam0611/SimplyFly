using SimplyFly.DTOs;
using SimplyFly.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace SimplyFly.Services.Interfaces
{
    public interface IFlightService
    {
        Task<Flight> CreateFlightAsync(int ownerId, CreateFlightDto flightDto);
        Task<Schedule> CreateScheduleAsync(CreateScheduleDto scheduleDto);
        Task DeleteScheduleConditionalAsync(int scheduleId);
        Task<IEnumerable<FlightSearchResultDto>> SearchFlightsAsync(FlightSearchRequestDto searchDto);

    }
}
