using Microsoft.AspNetCore.Mvc;
using safrni.DTOs;
using safrni.Interfaces;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HotelsController : ControllerBase
{
    private readonly IHotelService _hotelService;

    public HotelsController(IHotelService hotelService)
    {
        _hotelService = hotelService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<HotelDto>>> GetAllHotels()
    {
        var hotels = await _hotelService.GetAllHotelsAsync();
        return Ok(hotels);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<HotelDto>> GetHotelById(int id)
    {
        var hotel = await _hotelService.GetHotelByIdAsync(id);
        if (hotel == null)
            return NotFound(new { message = "Hotel not found" });

        return Ok(hotel);
    }

    [HttpGet("search/{name}")]
    public async Task<ActionResult<IEnumerable<HotelDto>>> SearchHotelsByName(string name)
    {
        var hotels = await _hotelService.SearchHotelsByNameAsync(name);
        return Ok(hotels);
    }

    [HttpGet("country/{country}")]
    public async Task<ActionResult<IEnumerable<HotelDto>>> GetHotelsByCountry(string country)
    {
        var hotels = await _hotelService.GetHotelsByCountryAsync(country);
        return Ok(hotels);
    }

    [HttpGet("city/{city}")]
    public async Task<ActionResult<IEnumerable<HotelDto>>> GetHotelsByCity(string city)
    {
        var hotels = await _hotelService.GetHotelsByCityAsync(city);
        return Ok(hotels);
    }

    [HttpGet("star-rating/{starRating}")]
    public async Task<ActionResult<IEnumerable<HotelDto>>> GetHotelsByStarRating(int starRating)
    {
        var hotels = await _hotelService.GetHotelsByStarRatingAsync(starRating);
        return Ok(hotels);
    }

    [HttpPost]
    public async Task<ActionResult<HotelDto>> CreateHotel([FromBody] CreateHotelDto hotelDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var hotel = await _hotelService.CreateHotelAsync(hotelDto);
        return CreatedAtAction(nameof(GetHotelById), new { id = hotel.HotelId }, hotel);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHotel(int id, [FromBody] UpdateHotelDto hotelDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _hotelService.UpdateHotelAsync(id, hotelDto);
        if (!success)
            return NotFound(new { message = "Hotel not found" });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHotel(int id)
    {
        var success = await _hotelService.DeleteHotelAsync(id);
        if (!success)
            return NotFound(new { message = "Hotel not found" });

        return NoContent();
    }
}

