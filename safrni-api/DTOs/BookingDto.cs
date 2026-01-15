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
    public decimal? TotalPriceBase { get; set; }
    public decimal? TotalPaidBase { get; set; }
    public decimal? RemainingBase { get; set; }
    public string BaseCurrencyCode { get; set; } = "EUR";
    
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
    public int? CreatedBy { get; set; }
    
    // Rooms
    public List<CreateBookingRoomDto>? Rooms { get; set; }

    // Commission overrides (percent value e.g. 10 = 10%)
    public decimal? SupplierCommissionPercent { get; set; }
    public decimal? BrokerCommissionPercent { get; set; }
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
    public int? UpdatedBy { get; set; }

    // Rooms
    public List<UpdateBookingRoomDto>? Rooms { get; set; }

    // Commission overrides (percent value e.g. 10 = 10%)
    public decimal? SupplierCommissionPercent { get; set; }
    public decimal? BrokerCommissionPercent { get; set; }
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
    public int? CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }
    
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

    public decimal? TotalPriceBase { get; set; }
    public decimal? TotalPaidBase { get; set; }
    public decimal? RemainingBase { get; set; }
    public string BaseCurrencyCode { get; set; } = "EUR";
}

public class CreateBookingRoomDto
{
    public int? RoomTypeId { get; set; }
    public int? ViewTypeId { get; set; }
    public int? MealPlanId { get; set; }
    public int? RoomCount { get; set; }
    public decimal? PricePerNight { get; set; }
    public int? CurrencyId { get; set; }
}

public class UpdateBookingRoomDto : CreateBookingRoomDto
{
}

