namespace safrni.DTOs;

public class BookingDocumentDto
{
    public int DocumentId { get; set; }
    public int BookingId { get; set; }
    public string FileUrl { get; set; } = null!;
    public string? FileType { get; set; }
    public int UploadedBy { get; set; }
    public DateTime? UploadedAt { get; set; }
    
    public string? UploadedByName { get; set; }
}

public class CreateBookingDocumentDto
{
    public int BookingId { get; set; }
    public string FileUrl { get; set; } = null!;
    public string? FileType { get; set; }
    public int UploadedBy { get; set; }
}

