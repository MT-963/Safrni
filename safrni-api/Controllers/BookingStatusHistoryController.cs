using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Models;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingStatusHistoryController : ControllerBase
{
    private readonly SafrniDbContext _context;

    public BookingStatusHistoryController(SafrniDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingstatusHistory>>> GetAll()
    {
        return await _context.BookingstatusHistories
            .Include(h => h.Booking)
            .Include(h => h.ChangedBySeller)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingstatusHistory>> GetById(int id)
    {
        var history = await _context.BookingstatusHistories
            .Include(h => h.Booking)
            .Include(h => h.ChangedBySeller)
            .FirstOrDefaultAsync(h => h.HistoryId == id);
        
        if (history == null) return NotFound();
        return history;
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<IEnumerable<BookingstatusHistory>>> GetByBookingId(int bookingId)
    {
        return await _context.BookingstatusHistories
            .Where(h => h.BookingId == bookingId)
            .Include(h => h.ChangedBySeller)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<BookingstatusHistory>> Create(BookingstatusHistory history)
    {
        history.ChangedAt = DateTime.Now;
        _context.BookingstatusHistories.Add(history);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = history.HistoryId }, history);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var history = await _context.BookingstatusHistories.FindAsync(id);
        if (history == null) return NotFound();
        _context.BookingstatusHistories.Remove(history);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

