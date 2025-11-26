using Microsoft.AspNetCore.Mvc;
using safrni.DTOs;
using safrni.Interfaces;

namespace safrni.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetAllPayments()
    {
        var payments = await _paymentService.GetAllPaymentsAsync();
        return Ok(payments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PaymentDto>> GetPaymentById(int id)
    {
        var payment = await _paymentService.GetPaymentByIdAsync(id);
        if (payment == null)
            return NotFound(new { message = "Payment not found" });

        return Ok(payment);
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPaymentsByBookingId(int bookingId)
    {
        var payments = await _paymentService.GetPaymentsByBookingIdAsync(bookingId);
        return Ok(payments);
    }

    [HttpGet("booking/{bookingId}/total")]
    public async Task<ActionResult<decimal>> GetTotalPaymentsByBookingId(int bookingId)
    {
        var total = await _paymentService.GetTotalPaymentsByBookingIdAsync(bookingId);
        return Ok(new { bookingId, total });
    }

    [HttpGet("date-range")]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPaymentsByDateRange(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var payments = await _paymentService.GetPaymentsByDateRangeAsync(startDate, endDate);
        return Ok(payments);
    }

    [HttpPost]
    public async Task<ActionResult<PaymentDto>> CreatePayment([FromBody] CreatePaymentDto paymentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var payment = await _paymentService.CreatePaymentAsync(paymentDto);
        return CreatedAtAction(nameof(GetPaymentById), new { id = payment.PaymentId }, payment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePayment(int id, [FromBody] UpdatePaymentDto paymentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _paymentService.UpdatePaymentAsync(id, paymentDto);
        if (!success)
            return NotFound(new { message = "Payment not found" });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePayment(int id)
    {
        var success = await _paymentService.DeletePaymentAsync(id);
        if (!success)
            return NotFound(new { message = "Payment not found" });

        return NoContent();
    }
}

