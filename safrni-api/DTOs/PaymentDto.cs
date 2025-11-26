namespace safrni.DTOs;

public class PaymentDto
{
    public int PaymentId { get; set; }
    public int? BookingId { get; set; }
    public decimal? Amount { get; set; }
    public int? CurrencyId { get; set; }
    public string? PaymentType { get; set; }
    public int? PaymentMethodId { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? Notes { get; set; }
    
    public string? CurrencyCode { get; set; }
    public string? PaymentMethodName { get; set; }
}

public class CreatePaymentDto
{
    public int? BookingId { get; set; }
    public decimal? Amount { get; set; }
    public int? CurrencyId { get; set; }
    public string? PaymentType { get; set; }
    public int? PaymentMethodId { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? Notes { get; set; }
}

public class UpdatePaymentDto
{
    public decimal? Amount { get; set; }
    public int? CurrencyId { get; set; }
    public string? PaymentType { get; set; }
    public int? PaymentMethodId { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? Notes { get; set; }
}

