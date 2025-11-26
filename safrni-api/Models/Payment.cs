using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int BookingId { get; set; }

    public string PaymentType { get; set; } = null!;

    public decimal Amount { get; set; }

    public int? CurrencyId { get; set; }

    public int? PaymentMethodId { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? Notes { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Currency? Currency { get; set; }

    public virtual Paymentmethod? PaymentMethod { get; set; }
}
