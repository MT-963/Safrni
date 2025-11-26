using Microsoft.AspNetCore.Mvc;
using safrni.DTOs;
using safrni.Interfaces;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
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

        var booking = await _bookingService.CreateBookingAsync(bookingDto);
        return CreatedAtAction(nameof(GetBookingById), new { id = booking.BookingId }, booking);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(int id, [FromBody] UpdateBookingDto bookingDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

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

