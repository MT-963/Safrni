using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.DTOs;
using AutoMapper;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LookupController : ControllerBase
{
    private readonly SafrniDbContext _context;
    private readonly IMapper _mapper;

    public LookupController(SafrniDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // Booking Status
    [HttpGet("booking-statuses")]
    public async Task<ActionResult<IEnumerable<BookingStatusDto>>> GetBookingStatuses()
    {
        var statuses = await _context.Bookingstatuses.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<BookingStatusDto>>(statuses));
    }

    // Currencies
    [HttpGet("currencies")]
    public async Task<ActionResult<IEnumerable<CurrencyDto>>> GetCurrencies()
    {
        var currencies = await _context.Currencies.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<CurrencyDto>>(currencies));
    }

    // Room Types
    [HttpGet("room-types")]
    public async Task<ActionResult<IEnumerable<RoomTypeDto>>> GetRoomTypes()
    {
        var roomTypes = await _context.Roomtypes.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<RoomTypeDto>>(roomTypes));
    }

    // View Types
    [HttpGet("view-types")]
    public async Task<ActionResult<IEnumerable<ViewTypeDto>>> GetViewTypes()
    {
        var viewTypes = await _context.Viewtypes.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<ViewTypeDto>>(viewTypes));
    }

    // Meal Plans
    [HttpGet("meal-plans")]
    public async Task<ActionResult<IEnumerable<MealPlanDto>>> GetMealPlans()
    {
        var mealPlans = await _context.Mealplans.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<MealPlanDto>>(mealPlans));
    }

    // Payment Methods
    [HttpGet("payment-methods")]
    public async Task<ActionResult<IEnumerable<PaymentMethodDto>>> GetPaymentMethods()
    {
        var paymentMethods = await _context.Paymentmethods.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<PaymentMethodDto>>(paymentMethods));
    }

    // Sellers
    [HttpGet("sellers")]
    public async Task<ActionResult<IEnumerable<SellerDto>>> GetSellers()
    {
        var sellers = await _context.Sellers.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<SellerDto>>(sellers));
    }

    // Brokers
    [HttpGet("brokers")]
    public async Task<ActionResult<IEnumerable<BrokerDto>>> GetBrokers()
    {
        var brokers = await _context.Brokers.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<BrokerDto>>(brokers));
    }

    // Suppliers
    [HttpGet("suppliers")]
    public async Task<ActionResult<IEnumerable<SupplierDto>>> GetSuppliers()
    {
        var suppliers = await _context.Suppliers.ToListAsync();
        return Ok(_mapper.Map<IEnumerable<SupplierDto>>(suppliers));
    }
}

