using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using safrni.DTOs;
using safrni.Interfaces;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class SellersController : ControllerBase
{
    private readonly ISellerService _sellerService;

    public SellersController(ISellerService sellerService)
    {
        _sellerService = sellerService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SellerDto>>> GetAllSellers()
    {
        var sellers = await _sellerService.GetAllSellersAsync();
        return Ok(sellers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SellerDto>> GetSellerById(int id)
    {
        var seller = await _sellerService.GetSellerByIdAsync(id);
        if (seller == null)
            return NotFound();
        return Ok(seller);
    }

    [HttpPost]
    public async Task<ActionResult<SellerDto>> CreateSeller([FromBody] CreateSellerDto sellerDto)
    {
        var seller = await _sellerService.CreateSellerAsync(sellerDto);
        return CreatedAtAction(nameof(GetSellerById), new { id = seller.SellerId }, seller);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSeller(int id, [FromBody] UpdateSellerDto sellerDto)
    {
        try
        {
            await _sellerService.UpdateSellerAsync(id, sellerDto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSeller(int id)
    {
        await _sellerService.DeleteSellerAsync(id);
        return NoContent();
    }
}




