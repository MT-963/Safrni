using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Commission
{
    public int CommissionId { get; set; }

    public int BookingId { get; set; }

    public string Source { get; set; } = null!;

    public decimal? Amount { get; set; }

    public decimal? Percent { get; set; }

    public int? CurrencyId { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Currency? Currency { get; set; }
}
