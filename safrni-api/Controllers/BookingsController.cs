using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using safrni.DTOs;
using safrni.Interfaces;
using System.Security.Claims;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings()
    {
        var bookings = await _bookingService.GetAllBookingsAsync();
        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDetailDto>> GetBookingById(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        if (booking == null)
            return NotFound(new { message = "Booking not found" });

        return Ok(booking);
    }

    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByCustomerId(int customerId)
    {
        var bookings = await _bookingService.GetBookingsByCustomerIdAsync(customerId);
        return Ok(bookings);
    }

    [HttpGet("hotel/{hotelId}")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByHotelId(int hotelId)
    {
        var bookings = await _bookingService.GetBookingsByHotelIdAsync(hotelId);
        return Ok(bookings);
    }

    [HttpGet("status/{statusId}")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByStatusId(int statusId)
    {
        var bookings = await _bookingService.GetBookingsByStatusIdAsync(statusId);
        return Ok(bookings);
    }

    [HttpGet("date-range")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookingsByDateRange(
        [FromQuery] DateOnly startDate, 
        [FromQuery] DateOnly endDate)
    {
        var bookings = await _bookingService.GetBookingsByDateRangeAsync(startDate, endDate);
        return Ok(bookings);
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking([FromBody] CreateBookingDto bookingDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Set the current user as the creator
        bookingDto.CreatedBy = GetCurrentUserId();

        var booking = await _bookingService.CreateBookingAsync(bookingDto);
        return CreatedAtAction(nameof(GetBookingById), new { id = booking.BookingId }, booking);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(int id, [FromBody] UpdateBookingDto bookingDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Set the current user as the updater
        bookingDto.UpdatedBy = GetCurrentUserId();

        var success = await _bookingService.UpdateBookingAsync(id, bookingDto);
        if (!success)
            return NotFound(new { message = "Booking not found" });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var success = await _bookingService.DeleteBookingAsync(id);
        if (!success)
            return NotFound(new { message = "Booking not found" });

        return NoContent();
    }
}

