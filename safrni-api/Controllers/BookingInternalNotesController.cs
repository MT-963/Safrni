using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Models;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingInternalNotesController : ControllerBase
{
    private readonly SafrniDbContext _context;

    public BookingInternalNotesController(SafrniDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingInternalNote>>> GetAll()
    {
        return await _context.BookingInternalNotes
            .Include(n => n.Booking)
            .Include(n => n.Seller)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingInternalNote>> GetById(int id)
    {
        var note = await _context.BookingInternalNotes
            .Include(n => n.Booking)
            .Include(n => n.Seller)
            .FirstOrDefaultAsync(n => n.NoteId == id);
        
        if (note == null) return NotFound();
        return note;
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<IEnumerable<BookingInternalNote>>> GetByBookingId(int bookingId)
    {
        return await _context.BookingInternalNotes
            .Where(n => n.BookingId == bookingId)
            .Include(n => n.Seller)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<BookingInternalNote>> Create(BookingInternalNote note)
    {
        note.CreatedAt = DateTime.Now;
        _context.BookingInternalNotes.Add(note);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = note.NoteId }, note);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, BookingInternalNote note)
    {
        if (id != note.NoteId) return BadRequest();
        _context.Entry(note).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var note = await _context.BookingInternalNotes.FindAsync(id);
        if (note == null) return NotFound();
        _context.BookingInternalNotes.Remove(note);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}



