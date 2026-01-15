using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Models;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingRoomsController : ControllerBase
{
    private readonly SafrniDbContext _context;

    public BookingRoomsController(SafrniDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Bookingroom>>> GetAll()
    {
        return await _context.Bookingrooms
            .Include(br => br.Booking)
            .Include(br => br.RoomType)
            .Include(br => br.ViewType)
            .Include(br => br.MealPlan)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Bookingroom>> GetById(int id)
    {
        var room = await _context.Bookingrooms
            .Include(br => br.Booking)
            .Include(br => br.RoomType)
            .Include(br => br.ViewType)
            .Include(br => br.MealPlan)
            .FirstOrDefaultAsync(br => br.RoomId == id);
        
        if (room == null) return NotFound();
        return room;
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<IEnumerable<Bookingroom>>> GetByBookingId(int bookingId)
    {
        return await _context.Bookingrooms
            .Where(br => br.BookingId == bookingId)
            .Include(br => br.RoomType)
            .Include(br => br.ViewType)
            .Include(br => br.MealPlan)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Bookingroom>> Create(Bookingroom room)
    {
        _context.Bookingrooms.Add(room);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = room.RoomId }, room);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Bookingroom room)
    {
        if (id != room.RoomId) return BadRequest();
        _context.Entry(room).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var room = await _context.Bookingrooms.FindAsync(id);
        if (room == null) return NotFound();
        _context.Bookingrooms.Remove(room);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}



