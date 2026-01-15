using System;

namespace safrni.Models;

public partial class BookingInternalNote
{
    public int NoteId { get; set; }

    public int BookingId { get; set; }

    public int SellerId { get; set; }

    public string NoteText { get; set; } = null!;

    public sbyte IsAdminOnly { get; set; } = 1;

    public DateTime? CreatedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Seller Seller { get; set; } = null!;
}

