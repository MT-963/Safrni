using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Repositories;

public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(SafrniDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByBookingIdAsync(int bookingId)
    {
        return await _dbSet
            .Where(p => p.BookingId == bookingId)
            .Include(p => p.Currency)
            .Include(p => p.PaymentMethod)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalPaymentsByBookingIdAsync(int bookingId)
    {
        var total = await _dbSet
            .Where(p => p.BookingId == bookingId)
            .SumAsync(p => (decimal?)((p.Amount) * (p.RateUsed ?? (p.Currency != null ? p.Currency.RateToEur ?? 1m : 1m))));

        return total ?? 0m;
    }

    public async Task<IEnumerable<Payment>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(p => p.PaymentDate >= startDate && p.PaymentDate <= endDate)
            .Include(p => p.Booking)
            .Include(p => p.Currency)
            .Include(p => p.PaymentMethod)
            .ToListAsync();
    }
}

