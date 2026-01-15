using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Repositories;

public class BookingRepository : GenericRepository<Booking>, IBookingRepository
{
    public BookingRepository(SafrniDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Booking>> GetBookingsWithDetailsAsync()
    {
        return await _dbSet
            .AsNoTracking()
            .Include(b => b.Customer)
            .Include(b => b.Hotel)
            .Include(b => b.Seller)
            .Include(b => b.Supplier)
            .Include(b => b.Broker)
            .Include(b => b.Status)
            .ToListAsync();
    }

    public async Task<Booking?> GetBookingByIdWithDetailsAsync(int id)
    {
        return await _dbSet
            .Include(b => b.Customer)
            .Include(b => b.Hotel)
            .Include(b => b.Seller)
            .Include(b => b.Supplier)
            .Include(b => b.Broker)
            .Include(b => b.Status)
            .Include(b => b.Bookingrooms)
                .ThenInclude(br => br.RoomType)
            .Include(b => b.Bookingrooms)
                .ThenInclude(br => br.ViewType)
            .Include(b => b.Bookingrooms)
                .ThenInclude(br => br.MealPlan)
            .Include(b => b.Bookingrooms)
                .ThenInclude(br => br.Currency)
            .Include(b => b.Payments)
                .ThenInclude(p => p.PaymentMethod)
            .Include(b => b.Payments)
                .ThenInclude(p => p.Currency)
            .Include(b => b.Commissions)
            .Include(b => b.Extras)
            .FirstOrDefaultAsync(b => b.BookingId == id);
    }

    public async Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(int customerId)
    {
        return await _dbSet
            .Where(b => b.CustomerId == customerId)
            .Include(b => b.Hotel)
            .Include(b => b.Status)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByHotelIdAsync(int hotelId)
    {
        return await _dbSet
            .Where(b => b.HotelId == hotelId)
            .Include(b => b.Customer)
            .Include(b => b.Status)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByStatusIdAsync(int statusId)
    {
        return await _dbSet
            .Where(b => b.StatusId == statusId)
            .Include(b => b.Customer)
            .Include(b => b.Hotel)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetBookingsByDateRangeAsync(DateOnly startDate, DateOnly endDate)
    {
        return await _dbSet
            .Where(b => b.CheckIn >= startDate && b.CheckOut <= endDate)
            .Include(b => b.Customer)
            .Include(b => b.Hotel)
            .Include(b => b.Status)
            .ToListAsync();
    }
}

