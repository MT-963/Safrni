using AutoMapper;
using safrni.DTOs;
using safrni.Interfaces;
using safrni.Models;

namespace safrni.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IMapper _mapper;

    public BookingService(IBookingRepository bookingRepository, IMapper mapper)
    {
        _bookingRepository = bookingRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
    {
        var bookings = await _bookingRepository.GetBookingsWithDetailsAsync();
        return _mapper.Map<IEnumerable<BookingDto>>(bookings);
    }

    public async Task<BookingDetailDto?> GetBookingByIdAsync(int id)
    {
        var booking = await _bookingRepository.GetBookingByIdWithDetailsAsync(id);
        return booking == null ? null : _mapper.Map<BookingDetailDto>(booking);
    }

    public async Task<IEnumerable<BookingDto>> GetBookingsByCustomerIdAsync(int customerId)
    {
        var bookings = await _bookingRepository.GetBookingsByCustomerIdAsync(customerId);
        return _mapper.Map<IEnumerable<BookingDto>>(bookings);
    }

    public async Task<IEnumerable<BookingDto>> GetBookingsByHotelIdAsync(int hotelId)
    {
        var bookings = await _bookingRepository.GetBookingsByHotelIdAsync(hotelId);
        return _mapper.Map<IEnumerable<BookingDto>>(bookings);
    }

    public async Task<IEnumerable<BookingDto>> GetBookingsByStatusIdAsync(int statusId)
    {
        var bookings = await _bookingRepository.GetBookingsByStatusIdAsync(statusId);
        return _mapper.Map<IEnumerable<BookingDto>>(bookings);
    }

    public async Task<IEnumerable<BookingDto>> GetBookingsByDateRangeAsync(DateOnly startDate, DateOnly endDate)
    {
        var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(startDate, endDate);
        return _mapper.Map<IEnumerable<BookingDto>>(bookings);
    }

    public async Task<BookingDto> CreateBookingAsync(CreateBookingDto bookingDto)
    {
        var booking = _mapper.Map<Booking>(bookingDto);
        var createdBooking = await _bookingRepository.AddAsync(booking);
        return _mapper.Map<BookingDto>(createdBooking);
    }

    public async Task<bool> UpdateBookingAsync(int id, UpdateBookingDto bookingDto)
    {
        var existingBooking = await _bookingRepository.GetByIdAsync(id);
        if (existingBooking == null)
            return false;

        _mapper.Map(bookingDto, existingBooking);
        await _bookingRepository.UpdateAsync(existingBooking);
        return true;
    }

    public async Task<bool> DeleteBookingAsync(int id)
    {
        var exists = await _bookingRepository.ExistsAsync(id);
        if (!exists)
            return false;

        await _bookingRepository.DeleteAsync(id);
        return true;
    }
}

