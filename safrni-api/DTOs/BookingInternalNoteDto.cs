namespace safrni.DTOs;

public class BookingInternalNoteDto
{
    public int NoteId { get; set; }
    public int BookingId { get; set; }
    public int SellerId { get; set; }
    public string NoteText { get; set; } = null!;
    public sbyte IsAdminOnly { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    public string? SellerName { get; set; }
}

public class CreateBookingInternalNoteDto
{
    public int BookingId { get; set; }
    public int SellerId { get; set; }
    public string NoteText { get; set; } = null!;
    public sbyte IsAdminOnly { get; set; } = 1;
}

public class UpdateBookingInternalNoteDto
{
    public string NoteText { get; set; } = null!;
    public sbyte? IsAdminOnly { get; set; }
}

