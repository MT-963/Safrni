namespace safrni.DTOs;

public class HotelDto
{
    public int HotelId { get; set; }
    public string Name { get; set; } = null!;
    public string? Country { get; set; }
    public string? City { get; set; }
    public int? StarRating { get; set; }
}

public class CreateHotelDto
{
    public string Name { get; set; } = null!;
    public string? Country { get; set; }
    public string? City { get; set; }
    public int? StarRating { get; set; }
}

public class UpdateHotelDto
{
    public string Name { get; set; } = null!;
    public string? Country { get; set; }
    public string? City { get; set; }
    public int? StarRating { get; set; }
}

