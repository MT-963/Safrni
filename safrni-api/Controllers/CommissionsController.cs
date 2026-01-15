using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using safrni.Data;
using safrni.Models;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CommissionsController : ControllerBase
{
    private readonly SafrniDbContext _context;

    public CommissionsController(SafrniDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Commission>>> GetAll()
    {
        return await _context.Commissions
            .Include(c => c.Booking)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Commission>> GetById(int id)
    {
        var commission = await _context.Commissions
            .Include(c => c.Booking)
            .FirstOrDefaultAsync(c => c.CommissionId == id);
        
        if (commission == null) return NotFound();
        return commission;
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<IEnumerable<Commission>>> GetByBookingId(int bookingId)
    {
        return await _context.Commissions
            .Where(c => c.BookingId == bookingId)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Commission>> Create(Commission commission)
    {
        _context.Commissions.Add(commission);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = commission.CommissionId }, commission);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Commission commission)
    {
        if (id != commission.CommissionId) return BadRequest();
        _context.Entry(commission).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var commission = await _context.Commissions.FindAsync(id);
        if (commission == null) return NotFound();
        _context.Commissions.Remove(commission);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

