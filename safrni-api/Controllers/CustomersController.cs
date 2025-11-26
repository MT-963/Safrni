using Microsoft.AspNetCore.Mvc;
using safrni.DTOs;
using safrni.Interfaces;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAllCustomers()
    {
        var customers = await _customerService.GetAllCustomersAsync();
        return Ok(customers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> GetCustomerById(int id)
    {
        var customer = await _customerService.GetCustomerByIdAsync(id);
        if (customer == null)
            return NotFound(new { message = "Customer not found" });

        return Ok(customer);
    }

    [HttpGet("{id}/with-bookings")]
    public async Task<ActionResult<CustomerDto>> GetCustomerWithBookings(int id)
    {
        var customer = await _customerService.GetCustomerWithBookingsAsync(id);
        if (customer == null)
            return NotFound(new { message = "Customer not found" });

        return Ok(customer);
    }

    [HttpGet("search/{name}")]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> SearchCustomersByName(string name)
    {
        var customers = await _customerService.SearchCustomersByNameAsync(name);
        return Ok(customers);
    }

    [HttpGet("by-email/{email}")]
    public async Task<ActionResult<CustomerDto>> GetCustomerByEmail(string email)
    {
        var customer = await _customerService.GetCustomerByEmailAsync(email);
        if (customer == null)
            return NotFound(new { message = "Customer not found" });

        return Ok(customer);
    }

    [HttpPost]
    public async Task<ActionResult<CustomerDto>> CreateCustomer([FromBody] CreateCustomerDto customerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var customer = await _customerService.CreateCustomerAsync(customerDto);
        return CreatedAtAction(nameof(GetCustomerById), new { id = customer.CustomerId }, customer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(int id, [FromBody] UpdateCustomerDto customerDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _customerService.UpdateCustomerAsync(id, customerDto);
        if (!success)
            return NotFound(new { message = "Customer not found" });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var success = await _customerService.DeleteCustomerAsync(id);
        if (!success)
            return NotFound(new { message = "Customer not found" });

        return NoContent();
    }
}

