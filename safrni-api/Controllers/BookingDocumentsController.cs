using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Models;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingDocumentsController : ControllerBase
{
    private readonly SafrniDbContext _context;

    public BookingDocumentsController(SafrniDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDocument>>> GetAll()
    {
        return await _context.BookingDocuments
            .Include(d => d.Booking)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDocument>> GetById(int id)
    {
        var document = await _context.BookingDocuments
            .Include(d => d.Booking)
            .FirstOrDefaultAsync(d => d.DocumentId == id);
        
        if (document == null) return NotFound();
        return document;
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<IEnumerable<BookingDocument>>> GetByBookingId(int bookingId)
    {
        return await _context.BookingDocuments
            .Where(d => d.BookingId == bookingId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<BookingDocument>> Create(BookingDocument document)
    {
        document.UploadedAt = DateTime.Now;
        _context.BookingDocuments.Add(document);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = document.DocumentId }, document);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, BookingDocument document)
    {
        if (id != document.DocumentId) return BadRequest();
        _context.Entry(document).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var document = await _context.BookingDocuments.FindAsync(id);
        if (document == null) return NotFound();
        _context.BookingDocuments.Remove(document);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}



