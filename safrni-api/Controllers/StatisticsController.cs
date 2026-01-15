using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Models;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class StatisticsController : ControllerBase
{
    private readonly SafrniDbContext _context;
    private const decimal BaseRate = 1m; // EUR as base

    public StatisticsController(SafrniDbContext context)
    {
        _context = context;
    }

    [HttpGet("sellers-performance")]
    public async Task<ActionResult> GetSellersPerformance()
    {
        var sellers = await _context.Sellers.ToListAsync();
        var bookings = await _context.Bookings.ToListAsync();

        var sellersStats = sellers.Select(s => new
        {
            sellerId = s.SellerId,
            sellerName = s.Name,
            role = s.Role,
            totalBookings = bookings.Count(b => b.SellerId == s.SellerId),
            totalRevenue = bookings
                .Where(b => b.SellerId == s.SellerId)
                .Sum(b => (b.TotalPrice ?? 0m) * BaseRate),
            createdBookings = bookings.Count(b => b.CreatedBy == s.SellerId),
            updatedBookings = bookings.Count(b => b.UpdatedBy == s.SellerId)
        })
        .OrderByDescending(s => s.totalRevenue)
        .ToList();

        return Ok(sellersStats);
    }

    [HttpGet("brokers-performance")]
    public async Task<ActionResult> GetBrokersPerformance()
    {
        var brokers = await _context.Brokers.ToListAsync();
        var bookings = await _context.Bookings.ToListAsync();
        var commissions = await _context.Commissions
            .Include(c => c.Currency)
            .Include(c => c.Booking)
            .ToListAsync();

        var brokersStats = brokers.Select(b => new
        {
            brokerId = b.BrokerId,
            brokerName = b.Name,
            contactEmail = b.ContactEmail,
            totalBookings = bookings.Count(bk => bk.BrokerId == b.BrokerId),
            totalRevenue = bookings
                .Where(bk => bk.BrokerId == b.BrokerId)
                .Sum(bk => (bk.TotalPrice ?? 0m) * BaseRate),
            totalCommissions = commissions
                .Where(c => c.Source == "Broker" && c.Booking?.BrokerId == b.BrokerId)
                .Sum(c => (c.Amount ?? 0m) * (c.Currency?.RateToEur ?? 1m)),
            customersReferred = bookings
                .Where(bk => bk.BrokerId == b.BrokerId)
                .Select(bk => bk.CustomerId)
                .Distinct()
                .Count()
        })
        .OrderByDescending(b => b.totalRevenue)
        .ToList();

        return Ok(brokersStats);
    }

    [HttpGet("suppliers-performance")]
    public async Task<ActionResult> GetSuppliersPerformance()
    {
        var suppliers = await _context.Suppliers.ToListAsync();
        var bookings = await _context.Bookings.ToListAsync();

        var suppliersStats = suppliers.Select(s => new
        {
            supplierId = s.SupplierId,
            supplierName = s.Name,
            country = s.Country,
            city = s.City,
            totalBookings = bookings.Count(b => b.SupplierId == s.SupplierId),
            totalRevenue = bookings
                .Where(b => b.SupplierId == s.SupplierId)
                .Sum(b => (b.TotalPrice ?? 0m) * BaseRate),
            hotelsProvided = bookings
                .Where(b => b.SupplierId == s.SupplierId)
                .Select(b => b.HotelId)
                .Distinct()
                .Count()
        })
        .OrderByDescending(s => s.totalRevenue)
        .ToList();

        return Ok(suppliersStats);
    }

    [HttpGet("customers-statistics")]
    public async Task<ActionResult> GetCustomersStatistics()
    {
        var customers = await _context.Customers.ToListAsync();
        var bookings = await _context.Bookings.ToListAsync();
        var payments = await _context.Payments
            .Include(p => p.Currency)
            .ToListAsync();

        var customersStats = customers.Select(c => new
        {
            customerId = c.CustomerId,
            customerName = c.FullName,
            nationality = c.Nationality,
            totalBookings = bookings.Count(b => b.CustomerId == c.CustomerId),
            totalSpent = bookings
                .Where(b => b.CustomerId == c.CustomerId)
                .Sum(b => (b.TotalPrice ?? 0m) * BaseRate),
            totalPaid = payments
                .Where(p => bookings.Any(b => b.BookingId == p.BookingId && b.CustomerId == c.CustomerId))
                .Sum(p => p.Amount * (p.RateUsed ?? p.Currency?.RateToEur ?? 1m)),
            lastBookingDate = bookings
                .Where(b => b.CustomerId == c.CustomerId)
                .Select(b => b.CreatedAt)
                .DefaultIfEmpty(null)
                .Max()
        })
        .OrderByDescending(c => c.totalSpent)
        .ToList();

        return Ok(customersStats);
    }

    [HttpGet("hotels-statistics")]
    public async Task<ActionResult> GetHotelsStatistics()
    {
        var hotels = await _context.Hotels.ToListAsync();
        var bookings = await _context.Bookings.ToListAsync();
        var bookingRooms = await _context.Bookingrooms.ToListAsync();

        var hotelsStats = hotels.Select(h => new
        {
            hotelId = h.HotelId,
            hotelName = h.Name,
            country = h.Country,
            city = h.City,
            starRating = h.StarRating,
            totalBookings = bookings.Count(b => b.HotelId == h.HotelId),
            totalRevenue = bookings
                .Where(b => b.HotelId == h.HotelId)
                .Sum(b => (b.TotalPrice ?? 0m) * BaseRate),
            totalRooms = bookingRooms
                .Where(br => bookings.Any(b => b.BookingId == br.BookingId && b.HotelId == h.HotelId))
                .Sum(br => br.RoomCount ?? 0)
        })
        .OrderByDescending(h => h.totalRevenue)
        .ToList();

        return Ok(hotelsStats);
    }

    [HttpGet("monthly-revenue")]
    public async Task<ActionResult> GetMonthlyRevenue([FromQuery] int year = 0)
    {
        if (year == 0) year = DateTime.Now.Year;

        var bookings = await _context.Bookings
            .Where(b => b.CreatedAt.HasValue && b.CreatedAt.Value.Year == year)
            .ToListAsync();
        
        var payments = await _context.Payments
            .Include(p => p.Currency)
            .ToListAsync();

        var monthlyStats = bookings
            .GroupBy(b => b.CreatedAt!.Value.Month)
            .Select(g => new
            {
                month = g.Key,
                totalBookings = g.Count(),
                totalRevenue = g.Sum(b => (b.TotalPrice ?? 0m) * BaseRate),
                totalPaid = payments
                    .Where(p => g.Any(b => b.BookingId == p.BookingId))
                    .Sum(p => p.Amount * (p.RateUsed ?? p.Currency?.RateToEur ?? 1m))
            })
            .OrderBy(m => m.month)
            .ToList();

        return Ok(monthlyStats);
    }

    [HttpGet("payment-methods-breakdown")]
    public async Task<ActionResult> GetPaymentMethodsBreakdown()
    {
        var paymentMethods = await _context.Paymentmethods.ToListAsync();
        var payments = await _context.Payments
            .Include(p => p.Currency)
            .ToListAsync();

        var methodsStats = paymentMethods.Select(pm => new
        {
            methodId = pm.PaymentMethodId,
            methodName = pm.Name,
            totalPayments = payments.Count(p => p.PaymentMethodId == pm.PaymentMethodId),
            totalAmount = payments
                .Where(p => p.PaymentMethodId == pm.PaymentMethodId)
                .Sum(p => p.Amount * (p.RateUsed ?? p.Currency?.RateToEur ?? 1m))
        })
        .OrderByDescending(m => m.totalAmount)
        .ToList();

        return Ok(methodsStats);
    }

    [HttpGet("overview")]
    public async Task<ActionResult> GetOverview()
    {
        var bookings = await _context.Bookings.ToListAsync();
        var payments = await _context.Payments
            .Include(p => p.Currency)
            .ToListAsync();

        var totalRevenue = bookings.Sum(b => (b.TotalPrice ?? 0m) * BaseRate);
        var totalPaid = payments.Sum(p => p.Amount * (p.RateUsed ?? p.Currency?.RateToEur ?? 1m));

        var overview = new
        {
            totalCustomers = await _context.Customers.CountAsync(),
            totalHotels = await _context.Hotels.CountAsync(),
            totalBookings = bookings.Count,
            totalRevenue = totalRevenue,
            totalPaid = totalPaid,
            totalPending = totalRevenue - totalPaid,
            activeSellers = await _context.Sellers.CountAsync(s => s.IsActive == 1),
            totalBrokers = await _context.Brokers.CountAsync(),
            totalSuppliers = await _context.Suppliers.CountAsync(),
            bookingsByStatus = bookings
                .GroupBy(b => b.StatusId)
                .Select(g => new
                {
                    statusId = g.Key,
                    count = g.Count()
                })
                .ToList()
        };

        return Ok(overview);
    }
}
