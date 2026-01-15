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
    public decimal? RateUsed { get; set; }
    public int? CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public string? CurrencyCode { get; set; }
    public string? PaymentMethodName { get; set; }
    public decimal? AmountBase { get; set; }
    public string BaseCurrencyCode { get; set; } = "EUR";
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
    public decimal? RateUsed { get; set; }
    public int? CreatedBy { get; set; }
}

public class UpdatePaymentDto
{
    public decimal? Amount { get; set; }
    public int? CurrencyId { get; set; }
    public string? PaymentType { get; set; }
    public int? PaymentMethodId { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? Notes { get; set; }
    public decimal? RateUsed { get; set; }
    public int? UpdatedBy { get; set; }
}

