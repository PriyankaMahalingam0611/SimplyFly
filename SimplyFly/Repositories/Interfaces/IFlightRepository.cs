
using SimplyFly.Models;

namespace SimplyFly.Repositories.Interfaces
{
    public interface IFlightRepository
    {
        Task<Flight> AddFlightAsync(Flight flight);
        Task<Schedule> AddScheduleAsync(Schedule schedule);
        Task<Schedule> GetScheduleByIdAsync(int scheduleId);
        Task DeleteScheduleAsync(Schedule schedule);
        Task<IEnumerable<Schedule>> SearchSchedulesAsync(string origin, string destination, DateTime date);
        Task<IEnumerable<Flight>> GetFlightsByOwnerIdAsync(int ownerId);
        Task<IEnumerable<Schedule>> GetSchedulesByFlightIdAsync(int flightId);

    }
}
