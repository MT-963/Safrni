using safrni.DTOs;

namespace safrni.Interfaces;

public interface IBookingService
{
    Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
    Task<BookingDetailDto?> GetBookingByIdAsync(int id);
    Task<IEnumerable<BookingDto>> GetBookingsByCustomerIdAsync(int customerId);
    Task<IEnumerable<BookingDto>> GetBookingsByHotelIdAsync(int hotelId);
    Task<IEnumerable<BookingDto>> GetBookingsByStatusIdAsync(int statusId);
    Task<IEnumerable<BookingDto>> GetBookingsByDateRangeAsync(DateOnly startDate, DateOnly endDate);
    Task<BookingDto> CreateBookingAsync(CreateBookingDto bookingDto);
    Task<bool> UpdateBookingAsync(int id, UpdateBookingDto bookingDto);
    Task<bool> DeleteBookingAsync(int id);
}

