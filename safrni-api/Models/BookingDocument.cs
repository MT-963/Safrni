using System;

namespace safrni.Models;

public partial class BookingDocument
{
    public int DocumentId { get; set; }

    public int BookingId { get; set; }

    public string FileUrl { get; set; } = null!;

    public string? FileType { get; set; }

    public int UploadedBy { get; set; }

    public DateTime? UploadedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual Seller UploadedBySeller { get; set; } = null!;
}

