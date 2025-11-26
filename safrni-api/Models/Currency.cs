using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Currency
{
    public int CurrencyId { get; set; }

    public string Code { get; set; } = null!;

    public string? Symbol { get; set; }

    public decimal? RateToEur { get; set; }

    public virtual ICollection<Bookingroom> Bookingrooms { get; set; } = new List<Bookingroom>();

    public virtual ICollection<Commission> Commissions { get; set; } = new List<Commission>();

    public virtual ICollection<Extra> Extras { get; set; } = new List<Extra>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
