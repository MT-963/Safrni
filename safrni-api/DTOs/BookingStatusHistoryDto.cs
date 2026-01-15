namespace safrni.DTOs;

public class BookingStatusHistoryDto
{
    public int HistoryId { get; set; }
    public int BookingId { get; set; }
    public int? OldStatusId { get; set; }
    public int NewStatusId { get; set; }
    public DateTime? ChangedAt { get; set; }
    public int? ChangedBy { get; set; }
    public string? Reason { get; set; }
    
    public string? OldStatusName { get; set; }
    public string? NewStatusName { get; set; }
    public string? ChangedByName { get; set; }
}

public class CreateBookingStatusHistoryDto
{
    public int BookingId { get; set; }
    public int? OldStatusId { get; set; }
    public int NewStatusId { get; set; }
    public int? ChangedBy { get; set; }
    public string? Reason { get; set; }
}

