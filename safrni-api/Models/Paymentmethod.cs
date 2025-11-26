using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Paymentmethod
{
    public int PaymentMethodId { get; set; }

    public string Name { get; set; } = null!;

    public int? CategoryId { get; set; }

    public string? AccountDetails { get; set; }

    public virtual PaymentCategory? Category { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
