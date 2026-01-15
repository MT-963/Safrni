using System;
using System.Collections.Generic;

namespace safrni.Models;

public partial class Extra
{
    public int ExtraId { get; set; }

    public int BookingId { get; set; }

    public string? Description { get; set; }

    public decimal? Price { get; set; }

    public int? CurrencyId { get; set; }

    public sbyte? IsGift { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Currency? Currency { get; set; }

    public virtual Seller? CreatedBySeller { get; set; }

    public virtual Seller? UpdatedBySeller { get; set; }
}
