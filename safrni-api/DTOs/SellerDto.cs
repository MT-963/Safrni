namespace safrni.DTOs;

public class SellerDto
{
    public int SellerId { get; set; }
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public DateTime? CreatedAt { get; set; }
    public sbyte? IsActive { get; set; }
}

public class CreateSellerDto
{
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public sbyte? IsActive { get; set; }
}

public class UpdateSellerDto
{
    public string Name { get; set; } = null!;
    public string? Email { get; set; }
    public sbyte? IsActive { get; set; }
}




