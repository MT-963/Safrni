using AutoMapper;
using Microsoft.EntityFrameworkCore;
using safrni.DTOs;
using safrni.Interfaces;
using safrni.Models;
using System.Linq;
using System;

namespace safrni.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IMapper _mapper;
    private readonly Data.SafrniDbContext _context;
    private const decimal DefaultCommissionPercent = 10m; // 10%

    public BookingService(IBookingRepository bookingRepository, IMapper mapper, Data.SafrniDbContext context)
    {
        _bookingRepository = bookingRepository;
        _mapper = mapper;
        _context = context;
    }

    public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
    {
        var bookings = await _bookingRepository.GetBookingsWithDetailsAsync();
        return bookings.Select(MapBookingWithTotals);
    }

    public async Task<BookingDetailDto?> GetBookingByIdAsync(int id)
    {
        var booking = await _bookingRepository.GetBookingByIdWithDetailsAsync(id);
        if (booking == null) return null;

        var detail = _mapper.Map<BookingDetailDto>(booking);
        ApplyTotals(detail, booking);
        return detail;
    }

    public async Task<IEnumerable<BookingDto>> GetBookingsByCustomerIdAsync(int customerId)
    {
        var bookings = await _bookingRepository.GetBookingsByCustomerIdAsync(customerId);
        return bookings.Select(MapBookingWithTotals);
    }

    public async Task<IEnumerable<BookingDto>> GetBookingsByHotelIdAsync(int hotelId)
    {
        var bookings = await _bookingRepository.GetBookingsByHotelIdAsync(hotelId);
        return bookings.Select(MapBookingWithTotals);
    }

    public async Task<IEnumerable<BookingDto>> GetBookingsByStatusIdAsync(int statusId)
    {
        var bookings = await _bookingRepository.GetBookingsByStatusIdAsync(statusId);
        return bookings.Select(MapBookingWithTotals);
    }

    public async Task<IEnumerable<BookingDto>> GetBookingsByDateRangeAsync(DateOnly startDate, DateOnly endDate)
    {
        var bookings = await _bookingRepository.GetBookingsByDateRangeAsync(startDate, endDate);
        return bookings.Select(MapBookingWithTotals);
    }

    public async Task<BookingDto> CreateBookingAsync(CreateBookingDto bookingDto)
    {
        var booking = _mapper.Map<Booking>(bookingDto);

        // Attach rooms if provided
        if (bookingDto.Rooms != null && bookingDto.Rooms.Count > 0)
        {
            booking.Bookingrooms = _mapper.Map<List<Bookingroom>>(bookingDto.Rooms);
        }

        // Calculate total price based on rooms and stay length
        booking.TotalPrice = await CalculateTotalPriceAsync(booking, bookingDto.CheckIn, bookingDto.CheckOut);

        // Auto-add commissions for supplier/broker
        await AddAutomaticCommissionsAsync(booking, bookingDto.SupplierCommissionPercent, bookingDto.BrokerCommissionPercent);

        var createdBooking = await _bookingRepository.AddAsync(booking);
        return MapBookingWithTotals(createdBooking);
    }

    public async Task<bool> UpdateBookingAsync(int id, UpdateBookingDto bookingDto)
    {
        var existingBooking = await _bookingRepository.GetBookingByIdWithDetailsAsync(id);
        if (existingBooking == null)
            return false;

        _mapper.Map(bookingDto, existingBooking);

        // Replace rooms if provided
        if (bookingDto.Rooms != null)
        {
            existingBooking.Bookingrooms.Clear();
            foreach (var roomDto in bookingDto.Rooms)
            {
                existingBooking.Bookingrooms.Add(_mapper.Map<Bookingroom>(roomDto));
            }
        }

        // Recalculate total and commissions
        existingBooking.TotalPrice = await CalculateTotalPriceAsync(existingBooking, bookingDto.CheckIn, bookingDto.CheckOut);
        await RefreshAutomaticCommissionsAsync(existingBooking, bookingDto.SupplierCommissionPercent, bookingDto.BrokerCommissionPercent);

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

    private async Task<decimal> CalculateTotalPriceAsync(Booking booking, DateOnly? checkIn, DateOnly? checkOut)
    {
        if (booking.Bookingrooms == null || booking.Bookingrooms.Count == 0)
            return booking.TotalPrice ?? 0m;

        var nights = 1;
        if (checkIn.HasValue && checkOut.HasValue)
        {
            var diff = (checkOut.Value.ToDateTime(TimeOnly.MinValue) - checkIn.Value.ToDateTime(TimeOnly.MinValue)).TotalDays;
            nights = diff > 0 ? (int)Math.Ceiling(diff) : 1;
        }

        decimal total = 0m;
        foreach (var room in booking.Bookingrooms)
        {
            var roomCount = room.RoomCount > 0 ? room.RoomCount.Value : 1;
            var pricePerNight = room.PricePerNight ?? 0m;
            var rate = await GetRateToEurAsync(room.CurrencyId);
            total += pricePerNight * roomCount * nights * rate;
        }

        return total;
    }

    private async Task AddAutomaticCommissionsAsync(Booking booking, decimal? supplierPercentOverride, decimal? brokerPercentOverride)
    {
        booking.Commissions ??= new List<Commission>();
        var currencyId = booking.Bookingrooms.FirstOrDefault()?.CurrencyId;
        var baseTotal = booking.TotalPrice ?? 0m;

        if (booking.SupplierId.HasValue)
        {
            var percent = supplierPercentOverride ?? DefaultCommissionPercent;
            booking.Commissions.Add(new Commission
            {
                BookingId = booking.BookingId,
                Source = "Supplier",
                Percent = percent,
                Amount = baseTotal * (percent / 100m),
                CurrencyId = currencyId
            });
        }

        if (booking.BrokerId.HasValue)
        {
            var percent = brokerPercentOverride ?? DefaultCommissionPercent;
            booking.Commissions.Add(new Commission
            {
                BookingId = booking.BookingId,
                Source = "Broker",
                Percent = percent,
                Amount = baseTotal * (percent / 100m),
                CurrencyId = currencyId
            });
        }
    }

    private async Task RefreshAutomaticCommissionsAsync(Booking booking, decimal? supplierPercentOverride, decimal? brokerPercentOverride)
    {
        booking.Commissions ??= new List<Commission>();

        // Keep non-auto commissions
        booking.Commissions = booking.Commissions
            .Where(c => c.Source != "Supplier" && c.Source != "Broker")
            .ToList();

        await AddAutomaticCommissionsAsync(booking, supplierPercentOverride, brokerPercentOverride);
    }

    private BookingDto MapBookingWithTotals(Booking booking)
    {
        var dto = _mapper.Map<BookingDto>(booking);
        ApplyTotals(dto, booking);
        return dto;
    }

    private void ApplyTotals(dynamic dto, Booking booking)
    {
        var baseCurrencyCode = "EUR";
        dto.BaseCurrencyCode = baseCurrencyCode;

        // Determine booking currency (fallback to first room currency)
        var bookingCurrency = booking.Bookingrooms.FirstOrDefault()?.Currency;
        var totalPrice = booking.TotalPrice ?? 0m;
        dto.TotalPriceBase = totalPrice; // already in EUR/base

        var totalPaidBase = booking.Payments?.Sum(p =>
        {
            var rate = p.RateUsed ?? (p.Currency?.RateToEur ?? 1m);
            return (p.Amount) * rate;
        }) ?? 0m;

        dto.TotalPaidBase = totalPaidBase;
        dto.RemainingBase = (dto.TotalPriceBase ?? 0m) - totalPaidBase;
    }

    private async Task<decimal> GetRateToEurAsync(int? currencyId)
    {
        if (!currencyId.HasValue) return 1m;
        var currency = await _context.Currencies.FirstOrDefaultAsync(c => c.CurrencyId == currencyId.Value);
        return currency?.RateToEur ?? 1m;
    }
}

