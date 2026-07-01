using Microsoft.EntityFrameworkCore;
using SimplyFly.Models;

namespace SimplyFly.Data
{
    public class SimplyFlyDbContext : DbContext
    {
        public SimplyFlyDbContext(DbContextOptions<SimplyFlyDbContext> options) : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<FlightCabin> FlightCabins { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookedSeat> BookedSeats { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Passenger" },
                new Role { RoleId = 2, RoleName = "FlightOwner" },
                new Role { RoleId = 3, RoleName = "Admin" }
    );
            modelBuilder.Entity<Role>()
                .HasKey(r => r.RoleId);

            modelBuilder.Entity<User>()
                .HasKey(u => u.UserId);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Flight>()
                .HasKey(f => f.FlightId);

            modelBuilder.Entity<Flight>()
                .HasOne(f => f.Owner)
                .WithMany(u => u.OwnedFlights)
                .HasForeignKey(f => f.OwnerId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Schedule>()
                .HasKey(s => s.ScheduleId);

            modelBuilder.Entity<Schedule>()
                .HasOne(s => s.Flight)
                .WithMany(f => f.Schedules)
                .HasForeignKey(s => s.FlightId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<FlightCabin>()
                .HasKey(fc => fc.CabinId);

            modelBuilder.Entity<FlightCabin>()
                .Property(fc => fc.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<FlightCabin>()
                .HasOne(fc => fc.Schedule)
                .WithMany(s => s.FlightCabins)
                .HasForeignKey(fc => fc.ScheduleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasKey(b => b.BookingId);

            modelBuilder.Entity<Booking>()
                .Property(b => b.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Schedule)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.ScheduleId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BookedSeat>()
                .HasKey(bs => bs.SeatId);

            modelBuilder.Entity<BookedSeat>()
                .HasOne(bs => bs.Booking)
                .WithMany(b => b.BookedSeats)
                .HasForeignKey(bs => bs.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BookedSeat>()
                .HasOne(bs => bs.FlightCabin)
                .WithMany(fc => fc.BookedSeats)
                .HasForeignKey(bs => bs.CabinId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasKey(p => p.PaymentId);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Booking)
                .WithOne(b => b.Payment)
                .HasForeignKey<Payment>(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}