using safrni.Models;

namespace safrni.Interfaces;

public interface IBookingRepository : IGenericRepository<Booking>
{
    Task<IEnumerable<Booking>> GetBookingsWithDetailsAsync();
    Task<Booking?> GetBookingByIdWithDetailsAsync(int id);
    Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(int customerId);
    Task<IEnumerable<Booking>> GetBookingsByHotelIdAsync(int hotelId);
    Task<IEnumerable<Booking>> GetBookingsByStatusIdAsync(int statusId);
    Task<IEnumerable<Booking>> GetBookingsByDateRangeAsync(DateOnly startDate, DateOnly endDate);
}

