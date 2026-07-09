using Microsoft.EntityFrameworkCore;
using SimplyFly.Data;
using SimplyFly.Models;
using SimplyFly.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace SimplyFly.Repositories.Implementations
{
    public class FlightRepository : IFlightRepository
    {
        private readonly SimplyFlyDbContext _context;
        public FlightRepository(SimplyFlyDbContext context)
        {
            _context = context;
        }

        public async Task<Flight> AddFlightAsync(Flight flight)
        {
            await _context.Flights.AddAsync(flight);
            await _context.SaveChangesAsync();
            return flight;
        }

        public async Task<Schedule> AddScheduleAsync(Schedule schedule)
        {
            await _context.Schedules.AddAsync(schedule);
            await _context.SaveChangesAsync();
            return  schedule;
        }

        public async Task DeleteScheduleAsync(Schedule schedule)
        {
            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();
        }

        public async Task<Schedule> GetScheduleByIdAsync(int scheduleId)
        {
            return await _context.Schedules
                .Include(s => s.FlightCabins)
                .Include(s => s.Bookings)   
                .FirstOrDefaultAsync(s => s.ScheduleId == scheduleId);
        }

        public async Task<IEnumerable<Schedule>> SearchSchedulesAsync(string origin, string destination, DateTime date)
        {
            return await _context.Schedules
                .Include(s => s.Flight)
                .Include(s => s.FlightCabins)
                    .ThenInclude(fc => fc.BookedSeats)
                        .ThenInclude(bs => bs.Booking)
                .Where(s => s.Flight.Origin.ToLower() == origin.ToLower()
                         && s.Flight.Destination.ToLower() == destination.ToLower()
                         && s.DepartureTime.Date == date.Date
                         && s.DepartureTime > DateTime.UtcNow)
                .ToListAsync();
        }
        public async Task<IEnumerable<Flight>> GetFlightsByOwnerIdAsync(int ownerId)
        {
            return await _context.Flights
                .Where(f => f.OwnerId == ownerId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Schedule>> GetSchedulesByFlightIdAsync(int flightId)
        {
            return await _context.Schedules
                .Include(s => s.Bookings)
                .Where(s => s.FlightId == flightId)
                .ToListAsync();
        }
    }
}
