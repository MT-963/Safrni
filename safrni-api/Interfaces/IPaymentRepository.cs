using safrni.Models;

namespace safrni.Interfaces;

public interface IPaymentRepository : IGenericRepository<Payment>
{
    Task<IEnumerable<Payment>> GetPaymentsByBookingIdAsync(int bookingId);
    Task<decimal> GetTotalPaymentsByBookingIdAsync(int bookingId);
    Task<IEnumerable<Payment>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate);
}

