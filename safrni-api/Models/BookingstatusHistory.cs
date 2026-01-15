using System;

namespace safrni.Models;

public partial class BookingstatusHistory
{
    public int HistoryId { get; set; }

    public int BookingId { get; set; }

    public int? OldStatusId { get; set; }

    public int NewStatusId { get; set; }

    public DateTime? ChangedAt { get; set; }

    public int? ChangedBy { get; set; }

    public string? Reason { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Bookingstatus? OldStatus { get; set; }

    public virtual Bookingstatus NewStatus { get; set; } = null!;

    public virtual Seller? ChangedBySeller { get; set; }
}

