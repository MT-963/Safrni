using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Models;
using System.Security.Claims;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExtrasController : ControllerBase
{
    private readonly SafrniDbContext _context;

    public ExtrasController(SafrniDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Extra>>> GetAll()
    {
        return await _context.Extras
            .Include(e => e.Booking)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Extra>> GetById(int id)
    {
        var extra = await _context.Extras
            .Include(e => e.Booking)
            .FirstOrDefaultAsync(e => e.ExtraId == id);
        
        if (extra == null) return NotFound();
        return extra;
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<IEnumerable<Extra>>> GetByBookingId(int bookingId)
    {
        return await _context.Extras
            .Where(e => e.BookingId == bookingId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Extra>> Create(Extra extra)
    {
        extra.CreatedBy = GetCurrentUserId();
        extra.CreatedAt = DateTime.Now;
        
        _context.Extras.Add(extra);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = extra.ExtraId }, extra);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Extra extra)
    {
        if (id != extra.ExtraId) return BadRequest();
        
        extra.UpdatedBy = GetCurrentUserId();
        extra.UpdatedAt = DateTime.Now;
        
        _context.Entry(extra).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var extra = await _context.Extras.FindAsync(id);
        if (extra == null) return NotFound();
        _context.Extras.Remove(extra);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

