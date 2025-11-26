namespace safrni.DTOs;

public class BookingDto
{
    public int BookingId { get; set; }
    public int? SellerId { get; set; }
    public int? SupplierId { get; set; }
    public int? BrokerId { get; set; }
    public int? CustomerId { get; set; }
    public int? HotelId { get; set; }
    public string? BookingCode { get; set; }
    public string? HotelConfirmationCode { get; set; }
    public int? PeopleCount { get; set; }
    public DateOnly? CheckIn { get; set; }
    public DateOnly? CheckOut { get; set; }
    public int? StatusId { get; set; }
    public decimal? TotalPrice { get; set; }
    public string? Notes { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    
    // Navigation Properties
    public string? CustomerName { get; set; }
    public string? HotelName { get; set; }
    public string? SellerName { get; set; }
    public string? SupplierName { get; set; }
    public string? BrokerName { get; set; }
    public string? StatusName { get; set; }
}

public class CreateBookingDto
{
    public int? SellerId { get; set; }
    public int? SupplierId { get; set; }
    public int? BrokerId { get; set; }
    public int? CustomerId { get; set; }
    public int? HotelId { get; set; }
    public string? BookingCode { get; set; }
    public string? HotelConfirmationCode { get; set; }
    public int? PeopleCount { get; set; }
    public DateOnly? CheckIn { get; set; }
    public DateOnly? CheckOut { get; set; }
    public int? StatusId { get; set; }
    public decimal? TotalPrice { get; set; }
    public string? Notes { get; set; }
    public string? CreatedBy { get; set; }
}

public class UpdateBookingDto
{
    public int? SellerId { get; set; }
    public int? SupplierId { get; set; }
    public int? BrokerId { get; set; }
    public int? CustomerId { get; set; }
    public int? HotelId { get; set; }
    public string? BookingCode { get; set; }
    public string? HotelConfirmationCode { get; set; }
    public int? PeopleCount { get; set; }
    public DateOnly? CheckIn { get; set; }
    public DateOnly? CheckOut { get; set; }
    public int? StatusId { get; set; }
    public decimal? TotalPrice { get; set; }
    public string? Notes { get; set; }
    public string? UpdatedBy { get; set; }
}

public class BookingDetailDto
{
    public int BookingId { get; set; }
    public string? BookingCode { get; set; }
    public string? HotelConfirmationCode { get; set; }
    public int? PeopleCount { get; set; }
    public DateOnly? CheckIn { get; set; }
    public DateOnly? CheckOut { get; set; }
    public decimal? TotalPrice { get; set; }
    public string? Notes { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    
    public CustomerDto? Customer { get; set; }
    public HotelDto? Hotel { get; set; }
    public SellerDto? Seller { get; set; }
    public SupplierDto? Supplier { get; set; }
    public BrokerDto? Broker { get; set; }
    public BookingStatusDto? Status { get; set; }
    public List<BookingRoomDto>? Rooms { get; set; }
    public List<PaymentDto>? Payments { get; set; }
    public List<CommissionDto>? Commissions { get; set; }
    public List<ExtraDto>? Extras { get; set; }
}

