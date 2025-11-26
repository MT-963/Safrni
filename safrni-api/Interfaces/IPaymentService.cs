using safrni.DTOs;

namespace safrni.Interfaces;

public interface IPaymentService
{
    Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync();
    Task<PaymentDto?> GetPaymentByIdAsync(int id);
    Task<IEnumerable<PaymentDto>> GetPaymentsByBookingIdAsync(int bookingId);
    Task<decimal> GetTotalPaymentsByBookingIdAsync(int bookingId);
    Task<IEnumerable<PaymentDto>> GetPaymentsByDateRangeAsync(DateTime startDate, DateTime endDate);
    Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto paymentDto);
    Task<bool> UpdatePaymentAsync(int id, UpdatePaymentDto paymentDto);
    Task<bool> DeletePaymentAsync(int id);
}

