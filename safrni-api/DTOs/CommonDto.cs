namespace safrni.DTOs;

// Booking Status
public class BookingStatusDto
{
    public int StatusId { get; set; }
    public string? NameEn { get; set; }
    public string? NameAr { get; set; }
}

// Currency
public class CurrencyDto
{
    public int CurrencyId { get; set; }
    public string? Code { get; set; }
    public string? Symbol { get; set; }
    public decimal? RateToEur { get; set; }
}

// Room Type
public class RoomTypeDto
{
    public int RoomTypeId { get; set; }
    public string? Name { get; set; }
}

// View Type
public class ViewTypeDto
{
    public int ViewTypeId { get; set; }
    public string? Name { get; set; }
}

// Meal Plan
public class MealPlanDto
{
    public int MealPlanId { get; set; }
    public string? Code { get; set; }
    public string? Description { get; set; }
}

// Payment Method
public class PaymentMethodDto
{
    public int PaymentMethodId { get; set; }
    public string? Name { get; set; }
}

// Booking Room
public class BookingRoomDto
{
    public int RoomId { get; set; }
    public int? BookingId { get; set; }
    public int? RoomTypeId { get; set; }
    public int? ViewTypeId { get; set; }
    public int? MealPlanId { get; set; }
    public int? RoomCount { get; set; }
    public decimal? PricePerNight { get; set; }
    public int? CurrencyId { get; set; }
    
    public string? RoomTypeName { get; set; }
    public string? ViewTypeName { get; set; }
    public string? MealPlanCode { get; set; }
    public string? CurrencyCode { get; set; }
}

// Commission
public class CommissionDto
{
    public int CommissionId { get; set; }
    public int? BookingId { get; set; }
    public string? Source { get; set; }
    public decimal? Percent { get; set; }
    public decimal? Amount { get; set; }
    public int? CurrencyId { get; set; }
    
    public string? CurrencyCode { get; set; }
}

// Extra
public class ExtraDto
{
    public int ExtraId { get; set; }
    public int? BookingId { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public int? CurrencyId { get; set; }
    public bool? IsGift { get; set; }
    
    public string? CurrencyCode { get; set; }
}

