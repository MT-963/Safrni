using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class PaymentCategory
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Paymentmethod> Paymentmethods { get; set; } = new List<Paymentmethod>();
}
