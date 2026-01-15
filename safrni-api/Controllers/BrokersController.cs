using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using safrni.DTOs;
using safrni.Interfaces;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BrokersController : ControllerBase
{
    private readonly IBrokerService _brokerService;

    public BrokersController(IBrokerService brokerService)
    {
        _brokerService = brokerService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BrokerDto>>> GetAllBrokers()
    {
        var brokers = await _brokerService.GetAllBrokersAsync();
        return Ok(brokers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BrokerDto>> GetBrokerById(int id)
    {
        var broker = await _brokerService.GetBrokerByIdAsync(id);
        if (broker == null)
            return NotFound();
        return Ok(broker);
    }

    [HttpPost]
    public async Task<ActionResult<BrokerDto>> CreateBroker([FromBody] CreateBrokerDto brokerDto)
    {
        var broker = await _brokerService.CreateBrokerAsync(brokerDto);
        return CreatedAtAction(nameof(GetBrokerById), new { id = broker.BrokerId }, broker);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBroker(int id, [FromBody] UpdateBrokerDto brokerDto)
    {
        try
        {
            await _brokerService.UpdateBrokerAsync(id, brokerDto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBroker(int id)
    {
        await _brokerService.DeleteBrokerAsync(id);
        return NoContent();
    }
}




